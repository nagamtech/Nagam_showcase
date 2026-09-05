import { createFileRoute, redirect } from "@tanstack/react-router";

// ✅ E-mail autorizado — substitua pelo SEU e-mail
const ADMIN_EMAIL = "seu-email@aqui.com";

export const Route = createFileRoute("/backoffice")({
  // ✅ Verificação ANTES de carregar a página
  beforeLoad: async ({ context }) => {
    // Pega o usuário logado do Supabase
    const user = context.user;
    
    // Se não logado OU e-mail diferente → REDIRECIONA
    if (!user || user.email !== ADMIN_EMAIL) {
      throw redirect({ to: "/" });
    }
  },

  head: () => ({
    meta: [
      { title: "Painel Administrativo — Nagam Showcase" },
    ],
  }),
});

export default function Backoffice() {
  return (
    <div style={{ padding: "3rem", textAlign: "center" }}>
      <h1>Painel Administrativo</h1>
      <p>Área restrita — apenas para administradores.</p>
    </div>
  );
}
