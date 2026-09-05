import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/backoffice/")({});

export default function Backoffice() {
  return (
    <div style={{ padding: "3rem", textAlign: "center" }}>
      <h1>✅ FUNCIONOU!</h1>
      <p>A rota /backoffice foi criada com sucesso!</p>
    </div>
  );
}
