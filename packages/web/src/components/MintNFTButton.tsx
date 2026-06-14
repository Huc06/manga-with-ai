"use client";
import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { celoSepolia } from "@/lib/wagmi";
import { CONTRACTS, MANGA_NFT_ABI } from "@manga-with-ai/shared";

const contracts = CONTRACTS.celoSepolia;

interface MintNFTButtonProps {
  /** The metadata URI (IPFS or API URL) */
  metadataURI: string;
  /** Callback after successful mint */
  onMinted?: (tokenId: bigint, txHash: string) => void;
  /** Optional class override */
  className?: string;
}

export function MintNFTButton({
  metadataURI,
  onMinted,
  className,
}: MintNFTButtonProps) {
  const { address } = useAccount();
  const [minting, setMinting] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [error, setError] = useState("");
  const [minted, setMinted] = useState(false);

  const { writeContractAsync } = useWriteContract();

  const { data: mintFee } = useReadContract({
    address: contracts.mangaNFT,
    abi: MANGA_NFT_ABI,
    functionName: "mintFee",
    chainId: celoSepolia.id,
  });

  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  if (isSuccess && !minted) {
    setMinted(true);
    setMinting(false);
  }

  async function handleMint() {
    if (!address || !contracts.mangaNFT) return;
    setMinting(true);
    setError("");

    try {
      const hash = await writeContractAsync({
        address: contracts.mangaNFT,
        abi: MANGA_NFT_ABI,
        functionName: "mint",
        args: [address, metadataURI],
        value: mintFee || BigInt(0),
        chainId: celoSepolia.id,
      });
      setTxHash(hash);
      onMinted?.(BigInt(0), hash); // tokenId will come from event
    } catch (err: any) {
      setError(err.shortMessage || err.message || "Mint failed");
      setMinting(false);
    }
  }

  if (!contracts.mangaNFT) {
    return null; // Contract not deployed yet
  }

  if (minted) {
    return (
      <div className={`flex items-center gap-2 ${className || ""}`}>
        <span className="material-symbols-outlined text-primary text-lg">
          verified
        </span>
        <span className="font-label text-xs text-primary font-bold uppercase">
          MINTED AS NFT
        </span>
      </div>
    );
  }

  return (
    <div className={className}>
      <button
        onClick={handleMint}
        disabled={minting || !address}
        className="flex items-center gap-1.5 bg-on-surface text-white font-label text-xs font-bold uppercase px-3 py-2 border-2 border-on-surface comic-shadow-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-base">token</span>
        {minting ? "MINTING..." : "MINT AS NFT"}
      </button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
