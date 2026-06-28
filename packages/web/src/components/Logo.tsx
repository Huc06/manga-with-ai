import Image from 'next/image';

export function Logo({ size = 32 }: { size?: number }) {
  return <Image src="/logo.png" alt="MangaWithAI" width={size} height={size} className="rounded-sm" />;
}
