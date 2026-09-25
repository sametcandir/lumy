const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

interface RateLimitData {
  attempts: number;
  lockUntil?: number;
  firstAttemptAt: number;
}

// In-memory fallback if Upstash KV is unavailable or slow
const memoryRateLimits = new Map<string, RateLimitData>();

export function getClientIp(request: Request): string {
  // Cloudflare header
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp && cfIp.trim()) return cfIp.trim();

  // Nginx / Vercel / proxy headers
  const realIp = request.headers.get('x-real-ip');
  if (realIp && realIp.trim()) return realIp.trim();

  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }

  return '127.0.0.1';
}

export async function getRateLimitStatus(
  identifier: string,
  maxAttempts: number = 5
): Promise<{
  isLocked: boolean;
  attempts: number;
  remainingAttempts: number;
  remainingSeconds: number;
}> {
  const sanitizedKey = `lumy_rl_${identifier.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
  const now = Date.now();

  let data: RateLimitData | null = null;

  // 1. Check Upstash Redis
  if (KV_URL && KV_TOKEN) {
    try {
      const res = await fetch(`${KV_URL}/get/${sanitizedKey}`, {
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
        cache: 'no-store',
      });
      const json = await res.json();
      if (json && json.result) {
        data = typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
      }
    } catch {
      // fallback to memory
    }
  }

  // 2. Check Memory Fallback
  if (!data && memoryRateLimits.has(sanitizedKey)) {
    data = memoryRateLimits.get(sanitizedKey)!;
  }

  if (!data) {
    return {
      isLocked: false,
      attempts: 0,
      remainingAttempts: maxAttempts,
      remainingSeconds: 0,
    };
  }

  // Check if locked out
  if (data.lockUntil && data.lockUntil > now) {
    const remainingSeconds = Math.ceil((data.lockUntil - now) / 1000);
    return {
      isLocked: true,
      attempts: data.attempts,
      remainingAttempts: 0,
      remainingSeconds,
    };
  }

  return {
    isLocked: false,
    attempts: data.attempts,
    remainingAttempts: Math.max(0, maxAttempts - data.attempts),
    remainingSeconds: 0,
  };
}

export async function recordFailedAttempt(
  identifier: string,
  maxAttempts: number = 5,
  lockoutSeconds: number = 900 // 15 minutes
): Promise<{
  isLocked: boolean;
  attempts: number;
  remainingAttempts: number;
  remainingSeconds: number;
}> {
  const sanitizedKey = `lumy_rl_${identifier.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
  const now = Date.now();

  const current = await getRateLimitStatus(identifier, maxAttempts);
  const newAttempts = current.attempts + 1;
  const isLocked = newAttempts >= maxAttempts;
  const lockUntil = isLocked ? now + lockoutSeconds * 1000 : undefined;

  const data: RateLimitData = {
    attempts: newAttempts,
    lockUntil,
    firstAttemptAt: now,
  };

  // 1. Memory store
  memoryRateLimits.set(sanitizedKey, data);

  // 2. Upstash store with automatic TTL expiry
  if (KV_URL && KV_TOKEN) {
    try {
      const ttl = lockoutSeconds;
      await fetch(
        `${KV_URL}/set/${sanitizedKey}/${encodeURIComponent(JSON.stringify(data))}?ex=${ttl}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${KV_TOKEN}` },
        }
      );
    } catch (e) {
      console.warn('Failed saving rate limit to Upstash:', e);
    }
  }

  const remainingSeconds = isLocked ? lockoutSeconds : 0;
  return {
    isLocked,
    attempts: newAttempts,
    remainingAttempts: Math.max(0, maxAttempts - newAttempts),
    remainingSeconds,
  };
}

export async function resetRateLimit(identifier: string): Promise<void> {
  const sanitizedKey = `lumy_rl_${identifier.replace(/[^a-zA-Z0-9_-]/g, '_')}`;

  // 1. Memory clear
  memoryRateLimits.delete(sanitizedKey);

  // 2. Upstash clear
  if (KV_URL && KV_TOKEN) {
    try {
      await fetch(`${KV_URL}/del/${sanitizedKey}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
      });
    } catch (e) {
      console.warn('Failed resetting rate limit on Upstash:', e);
    }
  }
}
