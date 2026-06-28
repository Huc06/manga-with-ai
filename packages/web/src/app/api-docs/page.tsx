import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="font-display text-2xl uppercase text-primary">
            MangaWithAI
          </h1>
          <p className="text-sm text-secondary">
            AI-powered manga creation for MiniPay
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full border-4 border-on-surface bg-primary text-on-primary font-label text-sm font-bold uppercase py-3 px-4 comic-shadow hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            Open App
          </Link>

          <a
            href="https://mangawithai.duckdns.org/health"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full border-4 border-on-surface bg-white text-on-surface font-label text-sm font-bold uppercase py-3 px-4 comic-shadow hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            API Documentation
          </a>

          <a
            href="https://github.com/lamdanghoang"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full border-4 border-on-surface bg-surface-container text-on-surface font-label text-sm font-bold uppercase py-3 px-4 comic-shadow hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            GitHub
          </a>
        </div>

        <p className="text-xs text-secondary">
          Built on Celo • ERC-8004 Agent #9365
        </p>
      </div>
    </main>
  );
}
