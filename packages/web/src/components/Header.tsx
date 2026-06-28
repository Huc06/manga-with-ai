'use client';
import Link from 'next/link';
import { ConnectWalletButton } from '@/components/ConnectWalletButton';
import { Logo } from '@/components/Logo';
import { AnimalAvatar } from '@/components/AnimalAvatar';
import { useAuth } from '@/context/AuthContext';

export function Header() {
  const { isAuthed, address } = useAuth();

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center w-full px-4 py-2 bg-surface border-b-4 border-on-surface shadow-[4px_4px_0px_0px_#1a1c1c]">
      <Link href="/" className="flex items-center gap-2 font-display text-xl text-primary uppercase tracking-tighter">
        <Logo />
        MANGA WITH AI
      </Link>
      <div className="flex items-center gap-2">
        <ConnectWalletButton />
        {isAuthed && (
          <Link href="/profile">
            <AnimalAvatar address={address} size="sm" />
          </Link>
        )}
      </div>
    </header>
  );
}
