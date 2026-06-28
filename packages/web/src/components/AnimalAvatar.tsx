'use client';

/**
 * Generates a unique anime-style animal avatar using DiceBear API.
 * Deterministic based on wallet address — same address = same avatar.
 * Uses "adventurer" style which produces cute anime-like characters.
 */
export function AnimalAvatar({ address, size = 'md' }: { address?: string; size?: 'sm' | 'md' | 'lg' }) {
  const seed = address || '0x0000';
  const url = `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

  const sizeClass = size === 'sm' ? 'w-9 h-9' : size === 'lg' ? 'w-36 h-36' : 'w-10 h-10';

  return (
    <img
      src={url}
      alt="Avatar"
      className={`${sizeClass} border-2 border-on-surface rounded-full object-cover`}
    />
  );
}
