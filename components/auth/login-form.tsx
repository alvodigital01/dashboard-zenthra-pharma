"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { hasSupabaseCredentials } from "@/lib/supabase/shared";

const loginSchema = z.object({
  email: z.string().email("Informe um email válido."),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres.")
});

type LoginFormValues = z.infer<typeof loginSchema>;

function mapAuthError(message: string) {
  if (message.toLowerCase().includes("invalid login credentials")) {
    return "Email ou senha inválidos.";
  }

  return "Não foi possível autenticar agora. Tente novamente.";
}

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (values: LoginFormValues) => {
    if (!hasSupabaseCredentials()) {
      toast.error("Falta configurar o arquivo .env.local com as chaves do Supabase.");
      return;
    }

    const supabase = createBrowserSupabaseClient();
    setIsPending(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password
    });

    setIsPending(false);

    if (error) {
      toast.error(mapAuthError(error.message));
      return;
    }

    toast.success("Login realizado com sucesso.");

    startTransition(() => {
      router.replace("/");
      router.refresh();
    });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-slate-500"
        >
          Email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-400" />
          <Input
            id="email"
            type="email"
            placeholder="voce@empresa.com"
            className="pl-11"
            {...register("email")}
          />
        </div>
        {errors.email ? <p className="text-sm text-danger">{errors.email.message}</p> : null}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-slate-500"
        >
          Senha
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua senha"
            className="pl-11 pr-11"
            {...register("password")}
          />
          <button
            type="button"
            className="absolute right-3 top-2.5 rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password ? <p className="text-sm text-danger">{errors.password.message}</p> : null}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Entrando..." : "Entrar no painel"}
      </Button>

      <p className="text-center text-sm leading-6 text-slate-500">Acesse vendas, indicadores e relatórios.</p>
    </form>
  );
}
