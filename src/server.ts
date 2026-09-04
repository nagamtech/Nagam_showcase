import "./lib/error-capture";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

// ➕ INÍCIO — Proteção de Limite + ALERTA DE ATAQUE
const contadorPorIP = new Map<string, { contagem: number; expiraEm: number }>();

// Limpa contagens antigas a cada 5 minutos
setInterval(() => {
  const agora = Date.now();
  for (const [ip, dados] of contadorPorIP.entries()) {
    if (dados.expiraEm < agora) contadorPorIP.delete(ip);
  }
}, 300_000);

function aplicarLimite(request: Request): Response | null {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "desconhecido";
  const agora = Date.now();
  const dataHora = new Date(agora).toLocaleString("pt-BR");
  const rota = new URL(request.url).pathname;
  const JANELA_TEMPO = 60 * 1000; // 1 minuto
  const MAXIMO_REQUISICOES = 100;

  let registro = contadorPorIP.get(ip);
  if (!registro || registro.expiraEm < agora) {
    registro = { contagem: 0, expiraEm: agora + JANELA_TEMPO };
  }

  registro.contagem += 1;
  contadorPorIP.set(ip, registro);

  // ⚠️ ALERTA — Quando estiver no limite (avisa antes de bloquear)
  if (registro.contagem === 90) {
    console.warn(`⚠️ [ALERTA] IP: ${ip} | Rota: ${rota} | Aproximando do limite! (${registro.contagem}/min) | ${dataHora}`);
  }

  // 🚫 BLOQUEIO — Quando passar do limite
  if (registro.contagem > MAXIMO_REQUISICOES) {
    console.error(`🚫 [ATAQUE BLOQUEADO] IP: ${ip} | Rota: ${rota} | ${registro.contagem} requisições em 1min | ${dataHora}`);
    return new Response(
      JSON.stringify({
        erro: "Muitas requisições",
        mensagem: "Por favor, aguarde 1 minuto antes de tentar novamente.",
      }),
      {
        status: 429,
        headers: { "Content-Type": "application/json", "Retry-After": "60" },
      }
    );
  }
  return null;
}
// ➕ FIM — Proteção e Alerta

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};
let serverEntryPromise: Promise<ServerEntry> | undefined;
async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;
  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;
  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      // ➕ Verifica limite E REGISTRA TUDO
      const bloqueio = aplicarLimite(request);
      if (bloqueio) return bloqueio;

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
