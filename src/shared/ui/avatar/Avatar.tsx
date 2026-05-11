import Image from 'next/image';

interface AvatarProps {
  emoji?: string;
  color?: string;
  src?: string;
  size?: number;
  className?: string;
}

export function Avatar({ emoji, color, src, size = 72, className = '' }: AvatarProps) {
  return (
    <div
      className={`rounded-full flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color || '#f3f4f6',
        fontSize: size * 0.44,
      }}
    >
      {src && (src.startsWith('http') || src.startsWith('/')) ? (
        <Image
          src={src}
          alt="avatar"
          width={size}
          height={size}
          className="object-cover"
          unoptimized
        />
      ) : (
        <span className="leading-none">{emoji}</span>
      )}
    </div>
  );
}
