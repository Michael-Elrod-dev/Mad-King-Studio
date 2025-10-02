// app/api/docs/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchDocByPath, fetchDocsTree } from '@/lib/github';
import { rateLimit, getClientIP } from '@/lib/rateLimit';
import { findFilePathInTree } from '@/lib/utils/docsParser';

// 20 requests per minute
const docContentLimiter = rateLimit(20, 60 * 1000);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const ip = getClientIP(request);
  
  if (!docContentLimiter(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const { path } = await params;
    
    if (!path || path.length === 0) {
      return NextResponse.json(
        { error: 'Invalid document path' },
        { status: 400 }
      );
    }

    const slugStr = path.join('/');
    
    // Fetch the tree to find the exact file path
    const tree = await fetchDocsTree();
    const actualFilePath = findFilePathInTree(tree, slugStr);
    
    if (!actualFilePath) {
      console.error('Document not found in tree. Slug:', slugStr);
      return NextResponse.json(
        { error: 'Document not found', slug: slugStr },
        { status: 404 }
      );
    }
    
    const docData = await fetchDocByPath(actualFilePath);
    
    if (!docData) {
      console.error('Document not found on GitHub. Path:', actualFilePath);
      return NextResponse.json(
        { error: 'Document not found', path: actualFilePath },
        { status: 404 }
      );
    }

    return NextResponse.json({
      content: docData.content,
      path: actualFilePath,
      sha: docData.sha,
    });
  } catch (error) {
    console.error('Doc content API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document content' },
      { status: 500 }
    );
  }
}
