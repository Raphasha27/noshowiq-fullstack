type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

type RateEntry = {
  count: number;
  resetAt: number;
};

const rateMap = new Map<string, RateEntry>();

const getClientKey = (request: Request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  request.headers.get("x-real-ip") ||
  "local";

export const checkRateLimit = (scope: string, request: Request, options: RateLimitOptions) => {
  const key = `${scope}:${getClientKey(request)}`;
  const now = Date.now();
  const current = rateMap.get(key);

  if (!current || current.resetAt <= now) {
    const nextEntry = {
      count: 1,
      resetAt: now + options.windowMs,
    };
    rateMap.set(key, nextEntry);
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= options.limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  rateMap.set(key, current);
  return { allowed: true, retryAfterSeconds: 0 };
};
