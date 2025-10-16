// lib/middleware/rate-limit.ts
import { RATE_LIMITS } from "../data/constants";

// Separate tracking per route
const requests = new Map<string, Map<string, number[]>>();

export function rateLimit(limit: number, windowMs: number, routeKey: string) {
  return (identifier: string): boolean => {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get or create route-specific map
    if (!requests.has(routeKey)) {
      requests.set(routeKey, new Map());
    }
    const routeMap = requests.get(routeKey)!;

    if (!routeMap.has(identifier)) {
      routeMap.set(identifier, []);
    }

    const requestTimes = routeMap.get(identifier)!;
    const validRequests = requestTimes.filter((time) => time > windowStart);

    if (validRequests.length >= limit) {
      return false;
    }

    validRequests.push(now);
    routeMap.set(identifier, validRequests);

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

// Export pre-configured rate limiters with separate tracking
export const contactLimiter = rateLimit(
  RATE_LIMITS.CONTACT_FORM.MAX_REQUESTS,
  RATE_LIMITS.CONTACT_FORM.WINDOW_MS,
  "contact",
);

export const twitchLimiter = rateLimit(
  RATE_LIMITS.TWITCH_API.MAX_REQUESTS,
  RATE_LIMITS.TWITCH_API.WINDOW_MS,
  "twitch",
);

export const docsLimiter = rateLimit(
  RATE_LIMITS.DOCS_API.MAX_REQUESTS,
  RATE_LIMITS.DOCS_API.WINDOW_MS,
  "docs",
);

export const docContentLimiter = rateLimit(
  RATE_LIMITS.DOC_CONTENT.MAX_REQUESTS,
  RATE_LIMITS.DOC_CONTENT.WINDOW_MS,
  "doc-content",
);

export const blogsLimiter = rateLimit(
  RATE_LIMITS.BLOG_API.MAX_REQUESTS,
  RATE_LIMITS.BLOG_API.WINDOW_MS,
  "blogs",
);
