// app/api/blog/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchBlogs, processBlogs } from '@/lib/github';
import { rateLimit, getClientIP } from '@/lib/rateLimit';

// 10 requests per minute
const blogsLimiter = rateLimit(10, 60 * 1000);

export async function GET(request: NextRequest) {
  const ip = getClientIP(request);
  
  if (!blogsLimiter(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId');

    const rawBlogs = await fetchBlogs();
    const processedBlogs = await processBlogs(rawBlogs);
    
    // Filter by gameId if provided
    const filteredBlogs = gameId 
      ? processedBlogs.filter(blog => blog.gameId === gameId)
      : processedBlogs;
    
    return NextResponse.json(filteredBlogs);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
