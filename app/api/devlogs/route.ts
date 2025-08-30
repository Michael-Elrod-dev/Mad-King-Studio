// app/api/devlogs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchDevLogs, processDevLogs } from '@/lib/github';
import { rateLimit, getClientIP } from '@/lib/rateLimit';

// 10 requests per minute
const devLogsLimiter = rateLimit(10, 60 * 1000);

export async function GET(request: NextRequest) {
  const ip = getClientIP(request);
  
  if (!devLogsLimiter(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const rawLogs = await fetchDevLogs();
    const processedLogs = await processDevLogs(rawLogs);
    
    return NextResponse.json(processedLogs);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dev logs' },
      { status: 500 }
    );
  }
}
