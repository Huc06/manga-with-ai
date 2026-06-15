# MangaWithAI Agent Skill

AI-powered manga creation on Celo. Generate manga stories from text prompts with character consistency.

## Setup

```bash
# Add MCP server to Claude Code
claude mcp add manga-with-ai -- npx tsx packages/api/src/mcp-server.ts

# Or for Cursor/other MCP clients
# Server: npx tsx packages/api/src/mcp-server.ts
```

## Environment Variables

```bash
MANGA_API_URL=https://mangawithai.duckdns.org
CELO_PRIVATE_KEY=0x...  # Agent wallet private key (for payment)
```

## Quick Start (No MCP)

If your agent doesn't support MCP, use n-payment SDK directly:

```typescript
import { createPaymentClient } from 'n-payment';

// 1. Create payment client
const client = createPaymentClient({
  chains: ['celo-sepolia'],
  ows: { wallet: 'manga-agent', privateKey: process.env.CELO_PRIVATE_KEY },
  celo: { payAsset: 'USDC' },
});

// 2. Generate manga (auto-handles payment)
const res = await client.fetchWithPayment('https://mangawithai.duckdns.org/v1/stories', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer <JWT>' },
  body: JSON.stringify({
    prompt: 'A ninja cat delivers pizza across rooftops in a cyberpunk city',
    stylePreset: 'manga-bw',
    panelCount: 4,
  }),
});

const { jobId, storyId } = await res.json();
// Poll GET /v1/jobs/{jobId} until status = "completed"
```

## Available Tools (MCP)

| Tool | Description | Cost |
|------|-------------|------|
| `generate_manga` | Create new manga story from prompt | $0.01 USDC |
| `continue_manga` | Add chapter to existing story | $0.01 USDC |
| `list_manga` | List user's stories | Free |

## Authentication

Get JWT token by signing a nonce with your wallet:

```bash
POST https://mangawithai.duckdns.org/v1/session/minipay
{
  "walletAddress": "0xYourWallet",
  "nonce": "Sign in to MangaWithAI: <timestamp>",
  "signature": "<signed_nonce>"
}
# Returns: { "token": "eyJ..." }
```

## Payment

- First story: FREE
- After that: $0.01 USDC per generation on Celo Sepolia
- Chain ID: 44787 (Celo Sepolia)
- USDC: 0x01C5C0122039549AD1493B8220cABEdD739BC44E
- Merchant: 0x792cA42F2C2f9D9fB56dDBbfE9a0916AE6e98DD8

## Example Agent Prompt

> Use n-payment on chain celo-sepolia to call https://mangawithai.duckdns.org/v1/stories,
> pay $0.01 USDC, and create a manga about "a samurai cat in a cyberpunk city".
> Show me the manga image URL when done.

## ERC-8004 Agent Identity

- Registry: 0x8004A169FB4a3325136EB29fA0ceB6D2e539a432
- Agent ID: 9365
- Chain: Celo Mainnet (42220)
- Metadata: https://mangawithai.duckdns.org/.well-known/agent.json
