// app/api/docs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchDocsTree, buildDocsNavigation } from '@/lib/github';
import { rateLimit, getClientIP } from '@/lib/rateLimit';

// 10 requests per minute
const docsLimiter = rateLimit(10, 60 * 1000);

export async function GET(request: NextRequest) {
  const ip = getClientIP(request);
  
  if (!docsLimiter(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const tree = await fetchDocsTree();
    const navigation = buildDocsNavigation(tree);
    
    return NextResponse.json({
      tree: navigation,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Docs API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documentation structure' },
      { status: 500 }
    );
  }
}
