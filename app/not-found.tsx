import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-panel">
        <p className="font-display text-3xl text-primary">Página não encontrada</p>
        <p className="mt-3 text-sm text-muted-foreground">
          O conteúdo solicitado não existe ou foi movido para outro fluxo.
        </p>
        <Link href="/" className={buttonVariants({ className: "mt-6" })}>
          Voltar ao dashboard
        </Link>
      </div>
    </div>
  );
}
