'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { RequireAuth } from '@/components/RequireAuth';
import { MintNFTButton } from '@/components/MintNFTButton';

export default function ChapterPage() {
  const { id, chapterId } = useParams();
  const [chapter, setChapter] = useState<any>(null);
  const [metadataURI, setMetadataURI] = useState<string | null>(null);
  const [loadingMeta, setLoadingMeta] = useState(false);

  useEffect(() => {
    api(`/v1/stories/${id}/chapters/${chapterId}`).then(setChapter).catch(console.error);
  }, [id, chapterId]);

  async function handlePrepareNFT() {
    setLoadingMeta(true);
    try {
      const res = await api<{ metadataURI: string }>(`/v1/chapters/${chapterId}/metadata`, { method: 'POST' });
      setMetadataURI(res.metadataURI);
    } catch (err: any) {
      console.error('Failed to prepare metadata:', err.message);
    }
    setLoadingMeta(false);
  }

  return (
    <RequireAuth>
    {!chapter ? (
      <div className="p-4 text-center text-gray-400">Loading chapter...</div>
    ) : (
    <main className="p-4 pt-8 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Chapter {chapter.chapterNumber}{chapter.title ? `: ${chapter.title}` : ''}</h1>

      {chapter.pageImageUrl && (
        <img src={chapter.pageImageUrl} alt={`Chapter ${chapter.chapterNumber}`} className="w-full rounded-lg border border-gray-700" />
      )}

      {chapter.panels?.length > 0 && (
        <div className="mt-4 space-y-2">
          {chapter.panels.map((panel: any) => (
            <div key={panel.id} className="text-sm">
              {panel.narrationText && <p className="italic text-gray-300">📖 {panel.narrationText}</p>}
              {panel.dialogueText?.map((d: string, i: number) => (
                <p key={i} className="text-gray-400 ml-4">💬 {d}</p>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {/* Save as Collectible */}
        {!metadataURI ? (
          <button onClick={handlePrepareNFT} disabled={loadingMeta} className="w-full bg-on-surface text-white font-display text-lg border-4 border-on-surface py-3 comic-shadow active:translate-x-1 active:translate-y-1 active:shadow-none transition-all uppercase disabled:opacity-50">
            {loadingMeta ? 'PREPARING...' : '🎨 SAVE AS COLLECTIBLE'}
          </button>
        ) : (
          <MintNFTButton metadataURI={metadataURI} />
        )}

        <div className="flex gap-3">
          <Link href={`/story/${id}`} className="flex-1 text-center bg-gray-700 py-3 rounded-xl">← Story</Link>
          <Link href={`/story/${id}/continue`} className="flex-1 text-center bg-purple-600 py-3 rounded-xl font-semibold">Continue →</Link>
        </div>
      </div>
    </main>
    )}
    </RequireAuth>
  );
}
