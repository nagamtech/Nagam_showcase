import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/backoffice/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Entrar no Back-Office — Nagam" },
      { name: "description", content: "Acesso restrito ao painel administrativo da Nagam." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Entrar no Back-Office — Nagam" },
      { property: "og:description", content: "Acesso restrito ao painel administrativo da Nagam." },
    ],
  }),
  beforeLoad: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      throw redirect({ to: "/backoffice" });
    }
  },
  component: BackOfficeLogin;
});

function BackOfficeLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setLoading(false);
      setError("E-mail ou senha inválidos.");
      return;
    }

    await navigate({ to: "/backoffice", replace: true });
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm surface-card p-8">
        <div className="text-primary mb-4">
          <Lock className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Acesso ao Back-Office</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Área restrita. Entre com suas credenciais de administrador.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@empresa.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </main>
  );
}
