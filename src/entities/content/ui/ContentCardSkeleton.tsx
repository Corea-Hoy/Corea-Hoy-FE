export default function ContentCardSkeleton() {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden bg-white animate-pulse">
      {/* Thumbnail */}
      <div className="h-36 sm:h-44 md:h-48 w-full bg-gray-200" />

      {/* Body */}
      <div className="p-3 sm:p-4 md:p-5 flex flex-col gap-2">
        <div className="h-3.5 sm:h-4 bg-gray-200 rounded w-4/5" />
        <div className="h-3.5 sm:h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}
