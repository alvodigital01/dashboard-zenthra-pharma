import { CheckCircle2, Copy, Database, KeyRound, PlayCircle, ShieldCheck } from "lucide-react";

import { BrandLogo } from "@/components/brand/brand-logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const envExample = `NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...`;

const setupSteps = [
  {
    icon: KeyRound,
    title: "1. Criar o arquivo .env.local",
    description:
      "Na pasta raiz do projeto, crie um arquivo chamado .env.local. Dentro dele, cole as duas linhas mostradas abaixo."
  },
  {
    icon: Database,
    title: "2. Pegar os dados no Supabase",
    description:
      "No painel do Supabase, abra Project Settings > API. Copie o Project URL e a anon public key."
  },
  {
    icon: PlayCircle,
    title: "3. Criar a tabela sales",
    description:
      "Abra o SQL Editor do Supabase e execute o arquivo supabase/schema.sql para criar a tabela e as regras de acesso."
  },
  {
    icon: ShieldCheck,
    title: "4. Ativar login por email",
    description:
      "No Supabase, vá em Authentication > Providers e confirme que Email está habilitado. Depois crie um usuário em Authentication > Users."
  }
];

export function SupabaseSetupGuide() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden rounded-[40px] bg-brand-veil px-8 py-10 text-white shadow-float lg:px-10 lg:py-12">
          <div className="absolute inset-0">
            <div className="absolute right-[-44px] top-[-48px] h-60 w-60 rounded-[42%] border border-white/10" />
            <div className="absolute bottom-[-72px] left-[-40px] h-72 w-72 rounded-[45%] bg-[radial-gradient(circle_at_center,rgba(47,107,188,0.28),transparent_64%)]" />
          </div>
          <div className="relative z-10">
            <BrandLogo theme="dark" subtitle="Setup orientation" />
            <span className="inline-flex rounded-full bg-amber-400/[0.15] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">
              Configuração necessária
            </span>
            <div className="mt-8 max-w-2xl">
              <h1 className="font-display text-5xl leading-tight text-white">
                Falta conectar o projeto ao Supabase.
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                O sistema já está pronto, mas precisa das chaves do seu projeto Supabase para
                autenticação e banco de dados funcionarem. Abaixo está o caminho completo, passo a
                passo, sem precisar interpretar erro técnico.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              {setupSteps.map((step) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.title}
                    className="rounded-[28px] border border-white/10 bg-white/5 p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl bg-white/10 p-3 text-cyan-200">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-white">{step.title}</p>
                        <p className="mt-2 text-sm leading-7 text-slate-300">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="brand-shell glass-panel flex flex-col justify-center rounded-[40px] border border-white/80 p-6 shadow-panel lg:p-10">
          <div className="space-y-6">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-primary/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
                O que preencher
              </span>
              <h2 className="font-display text-4xl text-slate-950">Arquivo .env.local</h2>
              <p className="text-sm leading-7 text-muted-foreground">
                Crie um arquivo com esse nome na raiz do projeto e cole exatamente este modelo,
                trocando pelos valores do seu Supabase.
              </p>
            </div>

            <Card className="overflow-hidden border-slate-200 bg-slate-950 text-white">
              <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-white/10">
                <div>
                  <CardDescription className="text-slate-400">Exemplo</CardDescription>
                  <CardTitle className="mt-1 text-white">Conteúdo do .env.local</CardTitle>
                </div>
                <div className="rounded-2xl bg-white/10 p-3 text-slate-300">
                  <Copy className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <pre className="overflow-x-auto rounded-2xl bg-black/20 p-4 text-sm leading-7 text-emerald-200">
                  <code>{envExample}</code>
                </pre>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white/90">
              <CardHeader>
                <CardDescription>Checklist final</CardDescription>
                <CardTitle>Depois de preencher</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                  <p>Salve o arquivo `.env.local` na raiz do projeto.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                  <p>
                    Rode o SQL de [supabase/schema.sql](/d:/ESTUDOS/dashboard-zenthra-pharma/supabase/schema.sql:1)
                    no SQL Editor do Supabase.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                  <p>Crie um usuário com email e senha dentro do painel do Supabase.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                  <p>Pare o servidor e rode novamente `npm run dev`.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
