interface AvatarProps {
  emoji: string;
  color: string;
  size?: number;
  className?: string;
}

export function Avatar({ emoji, color, size = 72, className = '' }: AvatarProps) {
  return (
    <div
      className={`rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${className}`}
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.44 }}
    >
      {emoji}
    </div>
  );
}
