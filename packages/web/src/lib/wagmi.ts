"use client";
import { http, createConfig } from "wagmi";
import { celo } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { defineChain } from "viem";

// Celo Sepolia Testnet (new, chain ID 11142220)
export const celoSepolia = defineChain({
  id: 11142220,
  name: "Celo Sepolia",
  nativeCurrency: { name: "CELO", symbol: "CELO", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://forno.celo-sepolia.celo-testnet.org"] },
  },
  blockExplorers: {
    default: { name: "Celoscan", url: "https://sepolia.celoscan.io" },
  },
  testnet: true,
});

export const config = createConfig({
  chains: [celoSepolia, celo],
  connectors: [injected()],
  transports: {
    [celoSepolia.id]: http(),
    [celo.id]: http(),
  },
});
