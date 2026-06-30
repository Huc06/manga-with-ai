'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getApiUrl, api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function PublicReaderPage() {
  const { slug } = useParams();
  const [story, setStory] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [posting, setPosting] = useState(false);
  const { isAuthed } = useAuth();
  const API = getApiUrl();

  async function handleLike() {
    await fetch(`${API}/v1/public/stories/${slug}/like`, { method: 'POST' });
    setLiked(true);
  }

  async function handleShare() {
    await fetch(`${API}/v1/public/stories/${slug}/share`, { method: 'POST' });
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function postComment() {
    if (!commentText.trim() || posting) return;
    setPosting(true);
    try {
      const c = await api<any>(`/v1/public/stories/${slug}/comments`, {
        method: 'POST',
        body: JSON.stringify({ text: commentText.trim() }),
      });
      setComments((prev) => [c, ...prev]);
      setCommentText('');
    } catch { /* ignore */ }
    setPosting(false);
  }

  useEffect(() => {
    fetch(`${API}/v1/public/stories/${slug}`)
      .then(r => r.json())
      .then((data) => {
        setStory(data);
        if (data.chapters?.length) {
          Promise.all(data.chapters.map((ch: any) => fetch(`${API}/v1/public/stories/${slug}/chapters/${ch.id}`).then(r => r.json()))).then(setChapters);
        }
      }).catch(console.error);

    // Load comments
    fetch(`${API}/v1/public/stories/${slug}/comments`)
      .then(r => r.json())
      .then(d => setComments(d.items || []))
      .catch(() => {});
  }, [slug]);

  if (!story) return <div className="p-8 text-center font-label text-secondary">Loading...</div>;

  return (
    <main className="pt-6 px-4 max-w-lg mx-auto pb-8">
      {/* Title */}
      <div className="border-4 border-on-surface bg-white comic-shadow p-4 mb-4">
        <h1 className="font-display text-2xl text-primary uppercase tracking-tighter">{story.title}</h1>
      </div>

      {/* Like / Share */}
      <div className="flex gap-3 mb-6">
        <button onClick={handleLike} className={`flex items-center gap-1 px-3 py-2 border-2 border-on-surface font-label text-xs uppercase font-bold comic-shadow-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${liked ? 'bg-red-100 text-red-600' : 'bg-white text-on-surface'}`}>
          <span className="material-symbols-outlined text-base">favorite</span>{liked ? 'Liked' : 'Like'}
        </button>
        <button onClick={handleShare} className="flex items-center gap-1 px-3 py-2 border-2 border-on-surface bg-white font-label text-xs uppercase font-bold comic-shadow-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
          <span className="material-symbols-outlined text-base">share</span>{copied ? 'Copied!' : 'Share'}
        </button>
      </div>

      {/* Chapters */}
      {chapters.length > 0 && (
        <>
          <p className="font-label text-xs text-secondary uppercase mb-2 tracking-wider">← Swipe chapters →</p>
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4">
            {chapters.map((ch) => (
              <div key={ch.id} className="snap-center shrink-0 w-full">
                <div className="border-4 border-on-surface bg-white comic-shadow overflow-hidden">
                  <div className="bg-on-surface text-white px-3 py-1 font-label text-xs font-bold uppercase">
                    Chapter {ch.chapterNumber}{ch.title ? ` — ${ch.title}` : ''}
                  </div>
                  {ch.pageImageUrl && <img src={ch.pageImageUrl} alt={`Chapter ${ch.chapterNumber}`} className="w-full" />}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {chapters.length === 0 && (
        <div className="border-4 border-dashed border-secondary/50 p-8 text-center bg-surface-container-low speed-lines">
          <p className="font-label text-sm text-secondary uppercase font-bold">No chapters available</p>
        </div>
      )}

      {/* Comments */}
      <div className="mt-6 border-4 border-on-surface bg-white comic-shadow p-4">
        <h2 className="font-display text-lg uppercase mb-3">Comments</h2>

        {/* Comment input */}
        {isAuthed ? (
          <div className="flex gap-2 mb-4">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && postComment()}
              placeholder="Add a comment..."
              maxLength={500}
              className="flex-1 border-2 border-on-surface bg-surface-container px-3 py-2 text-xs font-label focus:outline-none focus:border-primary"
            />
            <button
              onClick={postComment}
              disabled={posting || !commentText.trim()}
              className="bg-primary text-white font-label text-xs font-bold px-3 py-2 border-2 border-on-surface disabled:opacity-50"
            >
              POST
            </button>
          </div>
        ) : (
          <p className="text-xs text-secondary mb-4 font-label">Connect to comment</p>
        )}

        {/* Comments list */}
        {comments.length === 0 ? (
          <p className="text-xs text-secondary font-label">No comments yet. Be the first!</p>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-2">
                <div className="w-7 h-7 border border-on-surface bg-surface-container rounded-full flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xs text-secondary">person</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-label text-[10px] font-bold text-on-surface">
                    {c.user?.displayName || `${c.user?.walletAddress?.slice(0, 6)}...${c.user?.walletAddress?.slice(-4)}`}
                  </span>
                  <p className="text-xs text-on-surface/80 break-words">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
