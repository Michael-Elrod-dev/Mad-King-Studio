// app/api/blog/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIP } from '@/lib/rateLimit';
import { API_LINKS } from '@/lib/constants';

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

    // Fetch from S3 cache instead of GitHub
    const response = await fetch(
      `${API_LINKS.S3_CACHE_URL}/blogs.json`,
      { next: { revalidate: 1800 } } // 30 minute cache
    );
    
    if (!response.ok) {
      throw new Error(`S3 fetch failed: ${response.status}`);
    }
    
    const processedBlogs = await response.json();
    
    // Filter by gameId if provided
    const filteredBlogs = gameId 
      ? processedBlogs.filter((blog: any) => blog.gameId === gameId)
      : processedBlogs;
    
    return NextResponse.json({
      blogs: filteredBlogs,
      count: filteredBlogs.length,
      cached: true,
      source: 's3',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Blog API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts from cache' },
      { status: 500 }
    );
  }
}