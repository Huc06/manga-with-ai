'use client';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useAccount, useConnect, useConnectors, useSignMessage } from 'wagmi';
import { api } from '@/lib/api';

type AuthContextValue = {
  isAuthed: boolean;
  isConnected: boolean;
  address?: string;
  signingIn: boolean;
  error: string | null;
  connectWallet: () => void;
  signOut: () => void;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { connect } = useConnect();
  const connectors = useConnectors();
  const [isAuthed, setIsAuthed] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wantsSignIn = useRef(false);
  const signing = useRef(false);

  useEffect(() => {
    setIsAuthed(!!localStorage.getItem('token'));
  }, []);

  // MiniPay: auto-connect wallet on load (UI stays visible; sign-in is still explicit)
  useEffect(() => {
    if (localStorage.getItem('logged_out')) return;
    if (isConnected || connectors.length === 0) return;
    connect({ connector: connectors[0] });
  }, [isConnected, connectors, connect]);

  const signIn = useCallback(async () => {
    if (!address || signing.current) return;
    signing.current = true;
    setSigningIn(true);
    setError(null);
    try {
      const isMiniPay = typeof window !== 'undefined' && (window as any).ethereum?.isMiniPay;
      let nonce: string;
      let signature: string;

      if (isMiniPay) {
        // MiniPay does not support personal_sign — use address-based auth
        nonce = `Sign in to MangaWithAI: ${Date.now()}`;
        signature = '0x' + 'minipay_trusted';
      } else {
        nonce = `Sign in to MangaWithAI: ${Date.now()}`;
        signature = await signMessageAsync({ message: nonce });
      }

      const data = await api<{ token: string }>('/v1/session/minipay', {
        method: 'POST',
        body: JSON.stringify({ walletAddress: address, nonce, signature }),
      });
      localStorage.setItem('token', data.token);
      localStorage.removeItem('logged_out');
      setIsAuthed(true);
      wantsSignIn.current = false;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign in failed');
    } finally {
      signing.current = false;
      setSigningIn(false);
    }
  }, [address, signMessageAsync]);

  // MiniPay: auto-sign-in after connect (zero-click experience)
  // On desktop: auto-sign-in if wallet already connected and no token yet
  useEffect(() => {
    if (!isConnected || !address || isAuthed || signing.current) return;
    if (localStorage.getItem('logged_out')) return;
    signIn();
  }, [isConnected, address, isAuthed, signIn]);

  useEffect(() => {
    if (wantsSignIn.current && isConnected && address) signIn();
  }, [isConnected, address, signIn]);

  const connectWallet = useCallback(() => {
    wantsSignIn.current = true;
    setError(null);
    if (isConnected && address) {
      signIn();
      return;
    }
    if (connectors.length === 0) {
      setError('Wallet not available. Open this app in MiniPay.');
      wantsSignIn.current = false;
      return;
    }
    connect(
      { connector: connectors[0] },
      {
        onError: (e) => {
          setError(e.message);
          wantsSignIn.current = false;
        },
      }
    );
  }, [isConnected, address, connectors, connect, signIn]);

  const signOut = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.setItem('logged_out', '1');
    setIsAuthed(false);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{ isAuthed, isConnected, address, signingIn, error, connectWallet, signOut, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
