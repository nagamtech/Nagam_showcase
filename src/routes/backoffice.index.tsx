import { createFileRoute, redirect } from "@tanstack/react-router";

// ✅ COLOQUE SEU E-MAIL ABAIXO
const ADMIN_EMAIL = "contato.nagam@gmail.com";

export const Route = createFileRoute("/backoffice")({
  // ✅ VERIFICA ANTES DE CARREGAR A PÁGINA
  beforeLoad: async ({ context }) => {
    const user = context.user;

    // Se não estiver logado OU e-mail diferente → REDIRECIONA
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
