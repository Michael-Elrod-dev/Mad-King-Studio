// lib/utils/dataviewParser.ts

export interface TableField {
  expression: string;
  alias?: string;
}

export interface DataviewQuery {
  type: 'TASK' | 'TABLE' | 'LIST';
  from: string[];
  where?: string;
  sort?: string;
  limit?: number;
  fields?: TableField[];
  raw: string;
}

export interface ParsedTask {
  text: string;
  completed: boolean;
  priority?: string;
  file: string;
  filePath: string;
  tags: string[];
  line: number;
}

export interface DocumentWithTasks {
  path: string;
  name: string;
  tasks: ParsedTask[];
  tags: string[];
  priority?: string;
}

/**
 * Extract dataview code blocks from markdown content
 */
export function extractDataviewBlocks(content: string): Array<{
  query: DataviewQuery;
  startIndex: number;
  endIndex: number;
}> {
  const dataviewRegex = /```dataview\n([\s\S]*?)```/g;
  const blocks: Array<{ query: DataviewQuery; startIndex: number; endIndex: number }> = [];
  
  let match;
  while ((match = dataviewRegex.exec(content)) !== null) {
    const queryText = match[1].trim();
    const query = parseDataviewQuery(queryText);
    
    if (query) {
      blocks.push({
        query,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }
  }
  
  return blocks;
}

/**
 * Parse a dataview query string into structured format
 */
export function parseDataviewQuery(queryText: string): DataviewQuery | null {
  const lines = queryText.split('\n').map(l => l.trim()).filter(l => l);
  
  if (lines.length === 0) return null;
  
  const typeMatch = lines[0].match(/^(TASK|TABLE|LIST)$/i);
  if (!typeMatch) return null;
  
  const query: DataviewQuery = {
    type: typeMatch[1].toUpperCase() as 'TASK' | 'TABLE' | 'LIST',
    from: [],
    raw: queryText,
  };
  
  let i = 1;
  
  // Parse TABLE fields (everything between TABLE and FROM)
  if (query.type === 'TABLE') {
    query.fields = [];
    while (i < lines.length && !lines[i].startsWith('FROM')) {
      const line = lines[i];
      
      // Check if field has an alias: "expression as 'alias'"
      const aliasMatch = line.match(/(.+?)\s+as\s+"([^"]+)"/i);
      if (aliasMatch) {
        query.fields.push({
          expression: aliasMatch[1].trim().replace(/,$/, ''),
          alias: aliasMatch[2],
        });
      } else {
        // No alias, just the field name
        query.fields.push({
          expression: line.replace(/,$/, ''),
        });
      }
      i++;
    }
  }
  
  // Continue parsing FROM, WHERE, SORT, LIMIT
  for (; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('FROM')) {
      const fromContent = line.replace(/^FROM\s+/i, '');
      query.from = fromContent.split(/\s+OR\s+/i).map(tag => tag.trim());
    }
    else if (line.startsWith('WHERE')) {
      query.where = line.replace(/^WHERE\s+/i, '');
    }
    else if (line.startsWith('SORT')) {
      query.sort = line.replace(/^SORT\s+/i, '');
    }
    else if (line.startsWith('LIMIT')) {
      const limitMatch = line.match(/LIMIT\s+(\d+)/i);
      if (limitMatch) {
        query.limit = parseInt(limitMatch[1], 10);
      }
    }
  }
  
  return query;
}

/**
 * Parse markdown tasks from file content
 */
export function parseTasksFromMarkdown(content: string, filePath: string): ParsedTask[] {
  const tasks: ParsedTask[] = [];
  const lines = content.split('\n');
  
  // Extract tags from frontmatter or content
  const tagRegex = /#[\w-]+/g;
  const allTags = (content.match(tagRegex) || []).map(tag => tag.toLowerCase());
  
  lines.forEach((line, index) => {
    // Match markdown tasks: - [ ] or - [x] or - [X]
    const taskMatch = line.match(/^[\s-]*\[([xX\s])\]\s*(.+)$/);
    
    if (taskMatch) {
      const completed = taskMatch[1].toLowerCase() === 'x';
      const text = taskMatch[2].trim();
      
      // Check for priority
      const priorityMatch = text.match(/\b(high|medium|low)\b/i);
      
      tasks.push({
        text,
        completed,
        priority: priorityMatch ? priorityMatch[1].toLowerCase() : undefined,
        file: filePath.split('/').pop() || filePath,
        filePath,
        tags: allTags,
        line: index + 1,
      });
    }
  });
  
  return tasks;
}

/**
 * Filter tasks based on WHERE clause
 */
export function filterTasks(tasks: ParsedTask[], whereClause?: string): ParsedTask[] {
  if (!whereClause) return tasks;
  
  return tasks.filter(task => {
    // Handle !completed
    if (whereClause.includes('!completed')) {
      if (task.completed) return false;
    }
    
    // Handle completed
    if (whereClause.includes('completed') && !whereClause.includes('!completed')) {
      if (!task.completed) return false;
    }
    
    // Handle contains(text, "high")
    const containsMatch = whereClause.match(/contains\(text,\s*"([^"]+)"\)/i);
    if (containsMatch) {
      const searchTerm = containsMatch[1].toLowerCase();
      if (!task.text.toLowerCase().includes(searchTerm)) return false;
    }
    
    // Handle text != "" AND text != " "
    if (whereClause.includes('text != ""') || whereClause.includes('text != " "')) {
      if (!task.text.trim()) return false;
    }
    
    return true;
  });
}

/**
 * Sort tasks based on SORT clause
 */
export function sortTasks(tasks: ParsedTask[], sortClause?: string): ParsedTask[] {
  if (!sortClause) return tasks;
  
  const sortedTasks = [...tasks];
  
  // SORT status ASC
  if (sortClause.includes('status')) {
    const isDesc = sortClause.includes('DESC');
    sortedTasks.sort((a, b) => {
      const aVal = a.completed ? 1 : 0;
      const bVal = b.completed ? 1 : 0;
      return isDesc ? bVal - aVal : aVal - bVal;
    });
  }
  
  // SORT completion DESC
  else if (sortClause.includes('completion')) {
    sortedTasks.sort((a, b) => {
      if (a.completed && !b.completed) return -1;
      if (!a.completed && b.completed) return 1;
      return 0;
    });
  }
  
  // SORT priority ASC
  else if (sortClause.includes('priority')) {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const isDesc = sortClause.includes('DESC');
    
    sortedTasks.sort((a, b) => {
      const aVal = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 999;
      const bVal = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 999;
      return isDesc ? bVal - aVal : aVal - bVal;
    });
  }
  
  return sortedTasks;
}

/**
 * Execute a dataview query against a set of tasks
 */
export function executeDataviewQuery(
  query: DataviewQuery,
  allTasks: ParsedTask[]
): ParsedTask[] {
  // Filter by tags (FROM clause)
  let filteredTasks = allTasks.filter(task => {
    if (query.from.length === 0) return true;
    
    return query.from.some(tag => 
      task.tags.includes(tag.toLowerCase())
    );
  });
  
  // Apply WHERE filters
  filteredTasks = filterTasks(filteredTasks, query.where);
  
  // Apply SORT
  filteredTasks = sortTasks(filteredTasks, query.sort);
  
  // Apply LIMIT
  if (query.limit) {
    filteredTasks = filteredTasks.slice(0, query.limit);
  }
  
  return filteredTasks;
}

/**
 * Group tasks by document
 */
export function groupTasksByDocument(tasks: ParsedTask[]): DocumentWithTasks[] {
  const docMap = new Map<string, DocumentWithTasks>();
  
  for (const task of tasks) {
    if (!docMap.has(task.filePath)) {
      docMap.set(task.filePath, {
        path: task.filePath,
        name: task.file,
        tasks: [],
        tags: task.tags,
        priority: task.priority,
      });
    }
    docMap.get(task.filePath)!.tasks.push(task);
  }
  
  return Array.from(docMap.values());
}

/**
 * Execute TABLE queries that return documents with task stats
 */
export function executeTableQuery(
  query: DataviewQuery,
  allTasks: ParsedTask[]
): DocumentWithTasks[] {
  // Group tasks by document
  const documents = groupTasksByDocument(allTasks);
  
  // Filter by tags (FROM clause)
  let filteredDocs = documents.filter(doc => {
    if (query.from.length === 0) return true;
    return query.from.some(tag => doc.tags.includes(tag.toLowerCase()));
  });
  
  // Apply WHERE filters
  if (query.where) {
    filteredDocs = filteredDocs.filter(doc => {
      // Handle !contains(file.name, "Template")
      if (query.where?.includes('!contains(file.name')) {
        const match = query.where.match(/!contains\(file\.name,\s*"([^"]+)"\)/i);
        if (match) {
          const searchTerm = match[1];
          if (doc.name.includes(searchTerm)) return false;
        }
      }
      
      // Handle contains(file.name, "something")
      if (query.where?.includes('contains(file.name') && !query.where?.includes('!contains')) {
        const match = query.where.match(/contains\(file\.name,\s*"([^"]+)"\)/i);
        if (match) {
          const searchTerm = match[1];
          if (!doc.name.includes(searchTerm)) return false;
        }
      }
      
      return true;
    });
  }
  
  // Apply SORT
  if (query.sort) {
    if (query.sort.includes('priority')) {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const isDesc = query.sort.includes('DESC');
      
      filteredDocs.sort((a, b) => {
        const aVal = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 999;
        const bVal = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 999;
        return isDesc ? bVal - aVal : aVal - bVal;
      });
    }
  }
  
  // Apply LIMIT
  if (query.limit) {
    filteredDocs = filteredDocs.slice(0, query.limit);
  }
  
  return filteredDocs;
}

/**
 * Helper function to evaluate TABLE field expressions
 */
export function evaluateTableField(field: TableField, doc: DocumentWithTasks): string {
  const expr = field.expression;
  
  // Handle priority
  if (expr === 'priority') {
    return doc.priority || 'none';
  }
  
  // Handle task count: length(filter(file.tasks, (t) => t.completed)) + " / " + length(file.tasks)
  if (expr.includes('length(filter(file.tasks')) {
    const completed = doc.tasks.filter(t => t.completed).length;
    const total = doc.tasks.length;
    return `${completed} / ${total}`;
  }
  
  // Handle progress percentage: round((length(filter(file.tasks, (t) => t.completed)) / length(file.tasks)) * 100) + "%"
  if (expr.includes('round') && expr.includes('100')) {
    const completed = doc.tasks.filter(t => t.completed).length;
    const total = doc.tasks.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return `${percent}%`;
  }
  
  // Default: return the expression as-is
  return expr;
}
