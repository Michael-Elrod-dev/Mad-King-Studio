// lib/rateLimit.ts
const requests = new Map<string, number[]>();

export function rateLimit(limit: number, windowMs: number) {
  return (identifier: string): boolean => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!requests.has(identifier)) {
      requests.set(identifier, []);
    }
    
    const requestTimes = requests.get(identifier)!;
    const validRequests = requestTimes.filter(time => time > windowStart);
    
    if (validRequests.length >= limit) {
      return false;
    }
    
    validRequests.push(now);
    requests.set(identifier, validRequests);
    
    return true;
  };
}

// Helper function to get client IP
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return 'unknown';
}
