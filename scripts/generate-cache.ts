// scripts/generate-cache.ts
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fetchDocsTree, fetchDocByPath } from '../lib/github';
import { parseTasksFromMarkdown, type ParsedTask } from '../lib/utils/dataviewParser';
import type { DocFile } from '../lib/docsData';

const OUTPUT_DIR = join(process.cwd(), 'cache-output');

async function getAllTasksFromTree(tree: DocFile[]): Promise<ParsedTask[]> {
  const allTasks: ParsedTask[] = [];
  
  async function processNode(node: DocFile): Promise<void> {
    if (node.type === 'file' && node.path.endsWith('.md')) {
      try {
        const docData = await fetchDocByPath(node.path);
        if (docData) {
          const tasks = parseTasksFromMarkdown(docData.content, node.path);
          allTasks.push(...tasks);
          console.log(`✓ Processed ${node.path}: ${tasks.length} tasks`);
        }
      } catch (error) {
        console.error(`✗ Failed to process ${node.path}:`, error);
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

async function generateCache() {
  console.log('🚀 Starting cache generation...\n');
  
  try {
    // Create output directory (no nested cache folder)
    mkdirSync(OUTPUT_DIR, { recursive: true });
    
    // Fetch docs tree
    console.log('📁 Fetching docs tree...');
    const tree = await fetchDocsTree();
    console.log(`✓ Found ${tree.length} root items\n`);
    
    // Save docs tree
    const treeOutputPath = join(OUTPUT_DIR, 'docs-tree.json');
    writeFileSync(treeOutputPath, JSON.stringify(tree, null, 2));
    console.log(`✓ Saved docs tree to ${treeOutputPath}\n`);
    
    // Fetch and parse all tasks
    console.log('📝 Extracting tasks from all documents...');
    const allTasks = await getAllTasksFromTree(tree);
    console.log(`\n✓ Extracted ${allTasks.length} total tasks\n`);
    
    // Save tasks
    const tasksOutputPath = join(OUTPUT_DIR, 'tasks.json');
    writeFileSync(tasksOutputPath, JSON.stringify(allTasks, null, 2));
    console.log(`✓ Saved tasks to ${tasksOutputPath}\n`);
    
    // Generate metadata
    const metadata = {
      generatedAt: new Date().toISOString(),
      totalDocs: countFiles(tree),
      totalTasks: allTasks.length,
      completedTasks: allTasks.filter(t => t.completed).length,
      incompleteTasks: allTasks.filter(t => !t.completed).length,
    };
    
    const metadataPath = join(OUTPUT_DIR, 'metadata.json');
    writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`✓ Saved metadata to ${metadataPath}`);
    
    console.log('\n✅ Cache generation complete!');
    console.log(`📊 Stats:
  - Total documents: ${metadata.totalDocs}
  - Total tasks: ${metadata.totalTasks}
  - Completed: ${metadata.completedTasks}
  - Incomplete: ${metadata.incompleteTasks}
    `);
    
  } catch (error) {
    console.error('❌ Cache generation failed:', error);
    process.exit(1);
  }
}

function countFiles(tree: DocFile[]): number {
  let count = 0;
  for (const node of tree) {
    if (node.type === 'file') {
      count++;
    } else if (node.children) {
      count += countFiles(node.children);
    }
  }
  return count;
}

// Run the script
generateCache();
