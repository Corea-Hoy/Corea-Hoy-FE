export default function HotNewsCarouselSkeleton() {
  return (
    <div className="relative w-full">
      {/* Navigation Arrows - Top Right */}
      <div className="flex items-center justify-end gap-2 mb-3 sm:mb-4">
        <div className="w-10 h-10 rounded-full border border-gray-200 animate-pulse" />
        <div className="w-10 h-10 rounded-full border border-gray-200 animate-pulse" />
      </div>

      <div className="flex gap-5 overflow-hidden">
        <div className="flex-1 min-w-0 h-[360px] sm:h-[400px] lg:h-[460px] bg-gray-200 rounded-2xl animate-pulse" />
        <div className="hidden sm:block flex-1 min-w-0 h-[360px] sm:h-[400px] lg:h-[460px] bg-gray-200 rounded-2xl animate-pulse" />
        <div className="hidden lg:block flex-1 min-w-0 h-[360px] sm:h-[400px] lg:h-[460px] bg-gray-200 rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}
