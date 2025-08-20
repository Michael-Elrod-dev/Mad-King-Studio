// app/api/devlogs/route.ts
import { NextResponse } from 'next/server';
import { fetchDevLogs, processDevLogs } from '@/lib/github';

export async function GET() {
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
