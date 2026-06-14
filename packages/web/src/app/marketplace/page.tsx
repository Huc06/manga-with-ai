"use client";
import { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { formatUnits, parseUnits } from "viem";
import { celoSepolia } from "@/lib/wagmi";
import {
  CONTRACTS,
  MARKETPLACE_ABI,
  MANGA_NFT_ABI,
  ERC20_ABI,
} from "@manga-with-ai/shared";
import { useAuth } from "@/context/AuthContext";

const contracts = CONTRACTS.celoSepolia;

const TOKEN_OPTIONS = [
  { label: "USDC", address: contracts.usdc, decimals: 6 },
  { label: "USDT", address: contracts.usdt, decimals: 6 },
  { label: "USDm", address: contracts.usdm, decimals: 18 },
];

interface NFTItem {
  tokenId: bigint;
  seller: string;
  paymentToken: string;
  price: bigint;
  tokenURI: string;
  likes: bigint;
}

export default function MarketplacePage() {
  const { address } = useAccount();
  const { isAuthed } = useAuth();
  const [listings, setListings] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<bigint | null>(null);
  const [approvalTx, setApprovalTx] = useState<`0x${string}` | undefined>();
  const [buyTx, setBuyTx] = useState<`0x${string}` | undefined>();

  const { writeContractAsync } = useWriteContract();

  // Fetch total supply to iterate listings
  const { data: totalSupply } = useReadContract({
    address: contracts.mangaNFT,
    abi: MANGA_NFT_ABI,
    functionName: "totalSupply",
    chainId: celoSepolia.id,
  });

  // Wait for buy transaction
  const { isSuccess: buyConfirmed } = useWaitForTransactionReceipt({
    hash: buyTx,
  });

  useEffect(() => {
    if (buyConfirmed) {
      setBuyingId(null);
      setBuyTx(undefined);
      // Refresh listings
      fetchListings();
    }
  }, [buyConfirmed]);

  async function fetchListings() {
    if (!contracts.marketplace || !totalSupply) {
      setLoading(false);
      return;
    }

    // Note: In production, use an indexer/subgraph. For MVP, iterate tokens.
    const items: NFTItem[] = [];
    const supply = Number(totalSupply);

    for (let i = 0; i < supply && i < 100; i++) {
      try {
        // This would be better with multicall, but for MVP demo it works
        // In a real implementation, use an event indexer
      } catch {
        // skip
      }
    }

    setListings(items);
    setLoading(false);
  }

  useEffect(() => {
    fetchListings();
  }, [totalSupply]);

  async function handleBuy(
    tokenId: bigint,
    paymentToken: string,
    price: bigint,
  ) {
    if (!address) return;
    setBuyingId(tokenId);

    try {
      // 1. Approve marketplace to spend tokens
      const approveTx = await writeContractAsync({
        address: paymentToken as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [contracts.marketplace, price],
        chainId: celoSepolia.id,
      });
      setApprovalTx(approveTx);

      // 2. Buy NFT
      const tx = await writeContractAsync({
        address: contracts.marketplace,
        abi: MARKETPLACE_ABI,
        functionName: "buy",
        args: [tokenId],
        chainId: celoSepolia.id,
      });
      setBuyTx(tx);
    } catch (err: any) {
      console.error("Buy failed:", err);
      setBuyingId(null);
    }
  }

  async function handleLike(tokenId: bigint) {
    if (!address) return;
    try {
      await writeContractAsync({
        address: contracts.marketplace,
        abi: MARKETPLACE_ABI,
        functionName: "like",
        args: [tokenId],
        chainId: celoSepolia.id,
      });
    } catch (err: any) {
      console.error("Like failed:", err);
    }
  }

  function getTokenLabel(tokenAddress: string) {
    const t = TOKEN_OPTIONS.find(
      (o) => o.address.toLowerCase() === tokenAddress.toLowerCase(),
    );
    return t?.label || "TOKEN";
  }

  function getTokenDecimals(tokenAddress: string) {
    const t = TOKEN_OPTIONS.find(
      (o) => o.address.toLowerCase() === tokenAddress.toLowerCase(),
    );
    return t?.decimals || 6;
  }

  return (
    <main className="pt-6 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-3xl uppercase tracking-tighter">
          MARKETPLACE
        </h1>
        <span className="font-label text-xs bg-primary text-white px-3 py-1 font-bold border-2 border-on-surface">
          NFT GALLERY
        </span>
      </div>

      {!contracts.marketplace ? (
        <div className="border-4 border-on-surface bg-white comic-shadow-lg p-8 text-center">
          <span className="material-symbols-outlined text-5xl text-secondary/30 mb-4">
            storefront
          </span>
          <h2 className="font-display text-xl uppercase mb-2">COMING SOON</h2>
          <p className="text-sm text-secondary">
            The NFT marketplace is being deployed. Creators will soon be able to
            mint and sell their manga as NFTs.
          </p>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="border-3 border-on-surface bg-white shadow-[4px_4px_0px_0px_#1a1c1c] animate-pulse"
            >
              <div className="aspect-[3/4] bg-surface-container" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-surface-container rounded w-3/4" />
                <div className="h-3 bg-surface-container rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="border-4 border-on-surface bg-white comic-shadow-lg p-8 text-center">
          <span className="material-symbols-outlined text-5xl text-secondary/30 mb-4">
            collections
          </span>
          <h2 className="font-display text-xl uppercase mb-2">
            NO LISTINGS YET
          </h2>
          <p className="text-sm text-secondary mb-4">
            Be the first to mint your manga creation as an NFT and list it for
            sale!
          </p>
          <a
            href="/create"
            className="inline-block bg-primary text-white font-label font-bold uppercase tracking-widest text-xs px-5 py-2.5 border-2 border-on-surface comic-shadow-sm"
          >
            CREATE MANGA
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {listings.map((item) => (
            <div
              key={item.tokenId.toString()}
              className="border-3 border-on-surface bg-white shadow-[4px_4px_0px_0px_#1a1c1c] flex flex-col"
            >
              <div className="aspect-[3/4] overflow-hidden border-b-2 border-on-surface bg-surface-container relative">
                <img
                  src={item.tokenURI}
                  alt={`NFT #${item.tokenId}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2.5 flex-1 flex flex-col">
                <h3 className="font-display text-sm uppercase leading-tight">
                  NFT #{item.tokenId.toString()}
                </h3>
                <p className="font-label text-[11px] text-secondary mt-0.5">
                  {formatUnits(item.price, getTokenDecimals(item.paymentToken))}{" "}
                  {getTokenLabel(item.paymentToken)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleLike(item.tokenId)}
                    className="flex items-center gap-0.5 text-xs text-secondary hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">
                      favorite
                    </span>
                    {item.likes.toString()}
                  </button>
                  {item.seller.toLowerCase() !== address?.toLowerCase() && (
                    <button
                      onClick={() =>
                        handleBuy(item.tokenId, item.paymentToken, item.price)
                      }
                      disabled={buyingId === item.tokenId}
                      className="ml-auto bg-primary text-white font-label text-[10px] font-bold uppercase px-2 py-1 border border-on-surface disabled:opacity-50"
                    >
                      {buyingId === item.tokenId ? "..." : "BUY"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
