// lib/rateLimit.ts
import { RATE_LIMITS } from "./constants";

const requests = new Map<string, number[]>();

export function rateLimit(limit: number, windowMs: number) {
  return (identifier: string): boolean => {
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!requests.has(identifier)) {
      requests.set(identifier, []);
    }

    const requestTimes = requests.get(identifier)!;
    const validRequests = requestTimes.filter((time) => time > windowStart);

    if (validRequests.length >= limit) {
      return false;
    }

    validRequests.push(now);
    requests.set(identifier, validRequests);

    return true;
  };
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  return "unknown";
}

// Export pre-configured rate limiters
export const contactLimiter = rateLimit(
  RATE_LIMITS.CONTACT_FORM.MAX_REQUESTS,
  RATE_LIMITS.CONTACT_FORM.WINDOW_MS,
);

export const twitchLimiter = rateLimit(
  RATE_LIMITS.TWITCH_API.MAX_REQUESTS,
  RATE_LIMITS.TWITCH_API.WINDOW_MS,
);

export const docsLimiter = rateLimit(
  RATE_LIMITS.DOCS_API.MAX_REQUESTS,
  RATE_LIMITS.DOCS_API.WINDOW_MS,
);

export const docContentLimiter = rateLimit(
  RATE_LIMITS.DOC_CONTENT.MAX_REQUESTS,
  RATE_LIMITS.DOC_CONTENT.WINDOW_MS,
);

export const blogsLimiter = rateLimit(
  RATE_LIMITS.BLOG_API.MAX_REQUESTS,
  RATE_LIMITS.BLOG_API.WINDOW_MS,
);

export const tasksLimiter = rateLimit(
  RATE_LIMITS.TASKS_API.MAX_REQUESTS,
  RATE_LIMITS.TASKS_API.WINDOW_MS,
);
