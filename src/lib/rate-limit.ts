import { createMiddleware } from '@tanstack/react-start'

// Armazena as contagens por IP (na memória, reinicia quando o servidor reinicia)
const contadorPorIP = new Map<string, { contagem: number; expiraEm: number }>()

// Limpa registros antigos de tempos em tempos
setInterval(() => {
  const agora = Date.now()
  for (const [ip, dados] of contadorPorIP.entries()) {
    if (dados.expiraEm < agora) contadorPorIP.delete(ip)
  }
}, 60_000) // limpa a cada 1 minuto

export const limiteRequisicoes = createMiddleware().server(async ({ request, next }) => {
  // Pega o IP de quem está acessando
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'desconhecido'
  const agora = Date.now()

  // CONFIGURAÇÕES — pode ajustar abaixo
  const JANELA_TEMPO = 60 * 1000 // 1 minuto (em milissegundos)
  const MAXIMO_REQUISICOES = 100 // 100 requisições por minuto

  // Busca ou cria registro para este IP
  let registro = contadorPorIP.get(ip)

  // Se não existe ou expirou, começa do zero
  if (!registro || registro.expiraEm < agora) {
    registro = { contagem: 0, expiraEm: agora + JANELA_TEMPO }
  }

  // Conta mais uma requisição
  registro.contagem += 1
  contadorPorIP.set(ip, registro)

  // Se passou do limite → BLOQUEIA!
  if (registro.contagem > MAXIMO_REQUISICOES) {
    throw new Response(
      JSON.stringify({
        erro: 'Muitas requisições',
        mensagem: `Por favor, aguarde antes de tentar novamente. Limite de ${MAXIMO_REQUISICOES} requisições por minuto.`,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60',
        },
      }
    )
  }

  // Tudo certo → continua normalmente
  return next()
})
