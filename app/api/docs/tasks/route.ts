// app/api/docs/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchDocsTree, fetchDocByPath } from '@/lib/github';
import { parseTasksFromMarkdown, type ParsedTask } from '@/lib/utils/dataviewParser';
import { rateLimit, getClientIP } from '@/lib/rateLimit';
import type { DocFile } from '@/lib/docsData';
import { API_LINKS } from '@/lib/constants';

// 5 requests per minute for task fetching
const tasksLimiter = rateLimit(5, 60 * 1000);

async function getAllTasksFromTree(tree: DocFile[]): Promise<ParsedTask[]> {
  const allTasks: ParsedTask[] = [];
  
  async function processNode(node: DocFile): Promise<void> {
    if (node.type === 'file' && node.path.endsWith('.md')) {
      const docData = await fetchDocByPath(node.path);
      if (docData) {
        const tasks = parseTasksFromMarkdown(docData.content, node.path);
        allTasks.push(...tasks);
      }
    } else if (node.type === 'dir' && node.children) {
      for (const child of node.children) {
        await processNode(child);
      }
    }
  }
  
  for (const node of tree) {
    await processNode(node);
  }
  
  return allTasks;
}

export async function GET(request: NextRequest) {
  const ip = getClientIP(request);
  
  if (!tasksLimiter(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const response = await fetch(`${API_LINKS.S3_CACHE_URL}/tasks.json`, {
      next: { revalidate: 1800 }
    });
    
    if (!response.ok) {
      throw new Error(`S3 fetch failed: ${response.status}`);
    }
    
    const tasks = await response.json();
    
    return NextResponse.json({
      tasks,
      count: tasks.length,
      cached: true,
      source: 's3',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Tasks API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks from cache' },
      { status: 500 }
    );
  }
}
