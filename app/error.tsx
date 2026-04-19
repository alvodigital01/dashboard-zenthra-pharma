"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-panel">
          <p className="font-display text-3xl text-primary">Algo saiu do fluxo.</p>
          <p className="mt-3 text-sm text-muted-foreground">
            A aplicação encontrou um erro inesperado. Tente recarregar para continuar.
          </p>
          <Button className="mt-6" onClick={reset}>
            Tentar novamente
          </Button>
        </div>
      </body>
    </html>
  );
}
