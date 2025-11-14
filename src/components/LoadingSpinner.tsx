export default function LoadingSpinner() {
  return (
    <div className="text-center py-40 px-5">
      <div className="relative w-16 h-16 mx-auto mb-12">
        {/* Outer ring */}
        <div className="absolute inset-0 border border-[rgba(212,197,169,0.15)] rounded-full animate-spin" style={{ animationDuration: '3s' }} />
        {/* Inner ring */}
        <div className="absolute inset-2 border-t border-[rgba(212,197,169,0.4)] rounded-full animate-spin" style={{ animationDuration: '2s' }} />
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-[rgba(212,197,169,0.3)] rounded-full animate-pulse" />
        </div>
      </div>
      <p className="text-[rgba(248,246,243,0.3)] text-[9px] font-extralight tracking-[0.3em] uppercase animate-pulse">
        loading experience
      </p>
    </div>
  );
}
