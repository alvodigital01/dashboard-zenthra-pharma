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
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden rounded-[40px] bg-brand-veil px-8 py-10 text-white shadow-float lg:px-10 lg:py-12">
          <div className="absolute inset-0">
            <div className="absolute right-[-44px] top-[-48px] h-60 w-60 rounded-[42%] border border-white/10" />
            <div className="absolute bottom-[-72px] left-[-40px] h-72 w-72 rounded-[45%] bg-[radial-gradient(circle_at_center,rgba(47,107,188,0.28),transparent_64%)]" />
            <div className="absolute left-[32%] top-[18%] h-48 w-48 rounded-[38%] border border-white/[0.08]" />
          </div>

          <div className="relative z-10">
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

        <section className="brand-shell glass-panel flex items-center rounded-[40px] border border-white/80 p-6 shadow-panel lg:p-10">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 space-y-4">
              <span className="inline-flex rounded-full bg-primary/[0.08] px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary/80">
                Área segura
              </span>
              <div className="space-y-2">
                <h2 className="font-display text-5xl leading-none text-slate-950">
                  Entrar no painel
                </h2>
                <p className="text-sm leading-7 text-muted-foreground">
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
