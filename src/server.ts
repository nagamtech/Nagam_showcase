// ✅ RATE LIMITING — Proteção contra ataques e excesso de requisições
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_MAX = 100;        // Máximo 100 requisições
const RATE_LIMIT_WINDOW = 60000;   // Por minuto (60.000ms)

function checkRateLimit(request: Request): Response | null {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
  const now = Date.now();

  let record = rateLimitMap.get(ip);
  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    record = { count: 1, timestamp: now };
  } else {
    record.count += 1;
  }
  rateLimitMap.set(ip, record);

  if (record.count > RATE_LIMIT_MAX) {
    return new Response("Muitas requisições — tente novamente mais tarde.", {
      status: 429,
      headers: { "Retry-After": "60" },
    });
  }
  return null;
}
