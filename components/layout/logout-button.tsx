"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    const supabase = createBrowserSupabaseClient();
    setIsPending(true);

    const { error } = await supabase.auth.signOut();

    setIsPending(false);

    if (error) {
      toast.error("Não foi possível encerrar a sessão.");
      return;
    }

    startTransition(() => {
      router.replace("/login");
      router.refresh();
    });
  };

  return (
    <Button variant="outline" size="sm" onClick={handleLogout} disabled={isPending}>
      <LogOut className="h-4 w-4" />
      {isPending ? "Saindo..." : "Sair"}
    </Button>
  );
}
