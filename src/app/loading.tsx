// app/loading.tsx
import Image from 'next/image';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <Image
        width={32}
        height={32}
        src="/logo.svg"
        alt="SubZero Logo"
        className="w-24 h-24 object-contain neon-text animate-pulse"
      />
    </div>
  );
}