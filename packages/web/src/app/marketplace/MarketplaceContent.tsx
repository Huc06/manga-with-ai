"use client";

export default function MarketplaceContent() {
  return (
    <main className="pt-6 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-3xl uppercase tracking-tighter">
          MARKETPLACE
        </h1>
        <span className="font-label text-xs bg-primary text-white px-3 py-1 font-bold border-2 border-on-surface">
          NFT GALLERY
        </span>
      </div>

      <div className="border-4 border-on-surface bg-white comic-shadow-lg p-8 text-center">
        <span className="material-symbols-outlined text-5xl text-secondary/30 mb-4">
          collections
        </span>
        <h2 className="font-display text-xl uppercase mb-2">NO LISTINGS YET</h2>
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

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <div className="border-3 border-on-surface bg-white shadow-[3px_3px_0px_0px_#1a1c1c] p-3 text-center">
          <span className="material-symbols-outlined text-2xl text-primary mb-1">
            token
          </span>
          <p className="font-label text-[10px] font-bold uppercase">MINT NFT</p>
          <p className="font-label text-[9px] text-secondary mt-0.5">
            Turn your manga into collectible NFTs
          </p>
        </div>
        <div className="border-3 border-on-surface bg-white shadow-[3px_3px_0px_0px_#1a1c1c] p-3 text-center">
          <span className="material-symbols-outlined text-2xl text-primary mb-1">
            sell
          </span>
          <p className="font-label text-[10px] font-bold uppercase">
            BUY & SELL
          </p>
          <p className="font-label text-[9px] text-secondary mt-0.5">
            Trade with USDC, USDT, or USDm
          </p>
        </div>
        <div className="border-3 border-on-surface bg-white shadow-[3px_3px_0px_0px_#1a1c1c] p-3 text-center">
          <span className="material-symbols-outlined text-2xl text-primary mb-1">
            favorite
          </span>
          <p className="font-label text-[10px] font-bold uppercase">LIKE</p>
          <p className="font-label text-[9px] text-secondary mt-0.5">
            Show love for your favorite creations
          </p>
        </div>
        <div className="border-3 border-on-surface bg-white shadow-[3px_3px_0px_0px_#1a1c1c] p-3 text-center">
          <span className="material-symbols-outlined text-2xl text-primary mb-1">
            payments
          </span>
          <p className="font-label text-[10px] font-bold uppercase">
            5% ROYALTY
          </p>
          <p className="font-label text-[9px] text-secondary mt-0.5">
            Creators earn on every resale
          </p>
        </div>
      </div>
    </main>
  );
}
