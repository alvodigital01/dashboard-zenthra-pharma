import { ArrowRight, ShieldCheck, TrendingUp } from "lucide-react";

import { BrandLogo } from "@/components/brand/brand-logo";
import { LoginForm } from "@/components/auth/login-form";
import { SupabaseSetupGuide } from "@/components/setup/supabase-setup-guide";
import { hasSupabaseCredentials } from "@/lib/supabase/shared";

const highlights = [
  {
    title: "Controle comercial",
    description: "Leitura rápida para a rotina comercial.",
    icon: TrendingUp
  },
  {
    title: "Relatórios claros",
    description: "Vendas e faturamento em leitura simples.",
    icon: ArrowRight
  },
  {
    title: "Acesso protegido",
    description: "Login seguro e base pronta para crescer.",
    icon: ShieldCheck
  }
];

export default function LoginPage() {
  if (!hasSupabaseCredentials()) {
    return <SupabaseSetupGuide />;
  }

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 sm:py-8 lg:px-6 lg:py-10">
      <div className="mx-auto grid max-w-7xl gap-4 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <section className="relative overflow-hidden rounded-[28px] bg-brand-veil px-5 py-5 text-white shadow-float sm:px-6 sm:py-6 lg:rounded-[40px] lg:px-10 lg:py-12">
          <div className="absolute inset-0 hidden lg:block">
            <div className="absolute right-[-44px] top-[-48px] h-60 w-60 rounded-[42%] border border-white/10" />
            <div className="absolute bottom-[-72px] left-[-40px] h-72 w-72 rounded-[45%] bg-[radial-gradient(circle_at_center,rgba(47,107,188,0.28),transparent_64%)]" />
            <div className="absolute left-[32%] top-[18%] h-48 w-48 rounded-[38%] border border-white/[0.08]" />
          </div>

          <div className="relative z-10 lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <BrandLogo compact theme="dark" subtitle="Dashboard comercial" />
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-cyan-100">
                Acesso seguro
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <h1 className="text-xl font-semibold tracking-[-0.04em] text-white">
                Painel comercial da Zenthra
              </h1>
              <p className="text-sm leading-6 text-slate-300">
                Vendas e faturamento em um só lugar.
              </p>
            </div>
          </div>

          <div className="relative z-10 hidden lg:block">
            <BrandLogo theme="dark" subtitle="Dashboard comercial premium" />

            <div className="mt-10 max-w-2xl">
              <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-cyan-100">
                Pharma revenue intelligence
              </span>
              <h1 className="mt-6 font-display text-6xl leading-[0.92] text-white">
                Clareza para a operação comercial.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
                Acompanhe vendas, faturamento e desempenho com mais foco.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {highlights.map((highlight) => {
                const Icon = highlight.icon;

                return (
                  <div
                    key={highlight.title}
                    className="rounded-[28px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-white/10 text-cyan-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-5 text-lg font-semibold text-white">{highlight.title}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-300">
                      {highlight.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="brand-shell glass-panel flex items-center rounded-[28px] border border-white/80 p-5 shadow-panel sm:p-6 lg:rounded-[40px] lg:p-10">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-6 space-y-3 lg:mb-8 lg:space-y-4">
              <span className="inline-flex rounded-full bg-primary/[0.08] px-3.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-primary/80 lg:px-4 lg:py-2 lg:text-[0.72rem] lg:tracking-[0.22em]">
                Área segura
              </span>
              <div className="space-y-2">
                <h2 className="font-display text-[2.35rem] leading-none text-slate-950 sm:text-[2.8rem] lg:text-5xl">
                  Entrar no painel
                </h2>
                <p className="text-sm leading-6 text-muted-foreground lg:leading-7">
                  Use seu email e senha para acessar o sistema.
                </p>
              </div>
            </div>
            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}
