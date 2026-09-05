import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/backoffice")({
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
