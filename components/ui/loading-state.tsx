export function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="rounded-[34px] border border-white/80 bg-white/[0.84] p-7 shadow-panel">
        <div className="h-4 w-40 animate-pulse rounded-full bg-slate-200" />
        <div className="mt-5 h-12 w-80 animate-pulse rounded-full bg-slate-100" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-[28px] bg-slate-100/80" />
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[30px] border border-white/80 bg-white/90 p-6 shadow-panel"
          >
            <div className="h-3 w-20 animate-pulse rounded-full bg-slate-200" />
            <div className="mt-4 h-9 w-36 animate-pulse rounded-full bg-slate-100" />
            <div className="mt-8 h-24 animate-pulse rounded-[26px] bg-slate-50" />
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div
          className="h-[380px] animate-pulse rounded-[32px] border border-white/80 bg-white/90 shadow-panel"
        >
          <div className="h-full rounded-[32px] bg-slate-50/70" />
        </div>
        <div className="h-[380px] animate-pulse rounded-[32px] border border-white/80 bg-slate-950 shadow-panel" />
      </div>
    </div>
  );
}
