// ✅ RATE LIMITING — Proteção contra ataques
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_MAX = 100; // 100 requisições
const RATE_LIMIT_WINDOW = 60 * 1000; // por minuto

function checkRateLimit(request: Request): boolean {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();
  
  const record = rateLimitMap.get(ip) || { count: 0, timestamp: now };
  
  // Limpa contador após janela
  if (now - record.timestamp > RATE_LIMIT_WINDOW) {
    record.count = 1;
    record.timestamp = now;
  } else {
    record.count += 1;
  }
  
  rateLimitMap.set(ip, record);
  return record.count <= RATE_LIMIT_MAX;
}
