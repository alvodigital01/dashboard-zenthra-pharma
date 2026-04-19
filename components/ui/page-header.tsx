import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="brand-shell overflow-hidden rounded-[28px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(244,247,251,0.9))] px-5 py-6 shadow-panel md:rounded-[34px] md:px-8 md:py-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        {eyebrow ? (
          <div className="space-y-3">
            <span className="inline-flex rounded-full bg-primary/[0.06] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary/75">
              {eyebrow}
            </span>
            <div className="space-y-2">
              <h1 className="font-display text-[2.1rem] leading-none text-slate-950 sm:text-[2.5rem] md:text-[3.4rem]">
                {title}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-[0.96rem] md:leading-7">
                {description}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <h1 className="font-display text-[2.1rem] leading-none text-slate-950 sm:text-[2.5rem] md:text-[3.4rem]">
              {title}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-[0.96rem] md:leading-7">
              {description}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="hidden rounded-[28px] border border-[rgba(15,44,88,0.08)] bg-[linear-gradient(135deg,rgba(15,42,86,0.04),rgba(10,107,144,0.08))] px-5 py-4 xl:block">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
              Leitura rápida
            </p>
            <p className="mt-2 max-w-[220px] text-sm leading-6 text-slate-600">
              Painel com foco em clareza e operação.
            </p>
          </div>
          {action ? <div className="flex w-full items-center gap-3 sm:w-auto">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}
