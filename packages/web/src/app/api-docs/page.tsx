export default function ApiPage() {
  const endpoint = process.env.NEXT_PUBLIC_API_URL || 'https://mangawithai.duckdns.org';

  return (
    <main className="pt-6 px-4 max-w-lg mx-auto pb-8">
      <div className="border-4 border-on-surface bg-surface-container-low p-3 comic-shadow flex items-center gap-3 mb-6">
        <span className="font-label text-xs bg-on-surface text-white px-3 py-1 font-bold skew-x-[-4deg]">API</span>
        <span className="font-display text-base uppercase text-primary">FOR AI AGENTS</span>
      </div>

      <div className="border-4 border-on-surface bg-white p-5 comic-shadow-lg space-y-5">
        <p className="text-sm text-secondary">AI agents can create manga stories by calling this API. Payment is handled automatically via x402 on Celo Sepolia (USDC).</p>

        {/* Endpoint */}
        <div className="relative pt-2">
          <label className="absolute -top-1 left-4 bg-white px-2 font-label text-xs border-2 border-on-surface z-10 font-bold uppercase">Endpoint</label>
          <code className="block border-2 border-on-surface bg-surface-container p-3 text-xs font-mono break-all">POST {endpoint}/v1/stories</code>
        </div>

        {/* Pricing */}
        <div className="relative pt-2">
          <label className="absolute -top-1 left-4 bg-white px-2 font-label text-xs border-2 border-on-surface z-10 font-bold uppercase">Pricing</label>
          <div className="border-2 border-on-surface bg-surface-container p-3 text-xs space-y-1">
            <p>• Create story: <strong>$0.01 USDC</strong></p>
            <p>• Continue chapter: <strong>$0.01 USDC</strong></p>
            <p>• Payment: x402 on Celo Sepolia</p>
          </div>
        </div>

        {/* Request body */}
        <div className="relative pt-2">
          <label className="absolute -top-1 left-4 bg-white px-2 font-label text-xs border-2 border-on-surface z-10 font-bold uppercase">Request Body</label>
          <pre className="border-2 border-on-surface bg-surface-container p-3 text-xs font-mono overflow-x-auto">{`{
  "prompt": "A ninja cat in a cyberpunk city",
  "stylePreset": "manga-bw",
  "panelCount": 4
}`}</pre>
        </div>

        {/* Agent code */}
        <div className="relative pt-2">
          <label className="absolute -top-1 left-4 bg-white px-2 font-label text-xs border-2 border-on-surface z-10 font-bold uppercase">Agent Code</label>
          <pre className="border-2 border-on-surface bg-surface-container p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap">{`import { createPaymentClient } from 'n-payment';

const client = createPaymentClient({
  chains: ['celo-sepolia'],
  ows: {
    wallet: 'manga-agent',
    privateKey: process.env.CELO_KEY
  },
  celo: { payAsset: 'USDC' },
});

const res = await client.fetchWithPayment(
  '${endpoint}/v1/stories',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'A ninja cat in a cyberpunk city',
      stylePreset: 'manga-bw',
      panelCount: 4,
    }),
  }
);

const { jobId, storyId } = await res.json();`}</pre>
        </div>

        {/* SDK link */}
        <a href="https://www.npmjs.com/package/n-payment" target="_blank" className="block w-full bg-on-surface text-white font-label text-xs font-bold text-center py-3 border-2 border-on-surface comic-shadow-sm uppercase hover:bg-primary transition-colors">
          VIEW n-payment SDK →
        </a>
      </div>
    </main>
  );
}
