// components/docs/EpicDetailContent.tsx
"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TaskCard from "./TaskCard";
import { CheckCircle2, Clock, TrendingUp } from "lucide-react";

interface EpicDetailContentProps {
  content: string;
  title: string;
}

interface Task {
  key: string;
  summary: string;
  status: string;
  priority?: string;
  assignee?: string;
}

const EpicDetailContent = ({ content, title }: EpicDetailContentProps) => {
  // Parse progress section
  const parseProgress = (markdown: string) => {
    const progressMatch = markdown.match(
      /## Progress\s+([\s\S]*?)(?=\n---|\n##)/i,
    );

    if (!progressMatch) return null;

    const section = progressMatch[1];
    const statusMatch = section.match(/\*\*Status\*\*:\s*(.+)/i);
    const completedMatch = section.match(/\*\*Completed\*\*:\s*(\d+)\/(\d+)/i);
    const progressMatch2 = section.match(/\*\*Progress\*\*:\s*(\d+)%/i);

    if (statusMatch && completedMatch && progressMatch2) {
      return {
        status: statusMatch[1].trim(),
        completed: parseInt(completedMatch[1]),
        total: parseInt(completedMatch[2]),
        percentage: parseInt(progressMatch2[1]),
      };
    }

    return null;
  };

  // Parse active tasks
  const parseActiveTasks = (markdown: string): Task[] => {
    const tasks: Task[] = [];
    const activeMatch = markdown.match(
      /## Active Tasks.*?\n\n([\s\S]*?)(?=\n---|\n## Completed|$)/i,
    );

    if (!activeMatch) return tasks;

    const tasksSection = activeMatch[1];
    const taskBlocks = tasksSection.split(/###\s+/).filter(Boolean);

    taskBlocks.forEach((block) => {
      const lines = block.trim().split("\n");
      const firstLine = lines[0].trim();

      const keyMatch = firstLine.match(/\[([A-Z]+-\d+)\]\s+(.+)/);
      const statusMatch = block.match(/\*\*Status\*\*:\s*(.+)/i);
      const priorityMatch = block.match(/\*\*Priority\*\*:\s*(.+)/i);
      const assigneeMatch = block.match(/\*\*Assignee\*\*:\s*(.+)/i);

      if (keyMatch && statusMatch) {
        tasks.push({
          key: keyMatch[1],
          summary: keyMatch[2].trim(),
          status: statusMatch[1].trim(),
          priority: priorityMatch ? priorityMatch[1].trim() : undefined,
          assignee: assigneeMatch ? assigneeMatch[1].trim() : undefined,
        });
      }
    });

    return tasks;
  };

  // Parse completed tasks
  const parseCompletedTasks = (markdown: string): Task[] => {
    const tasks: Task[] = [];
    const completedMatch = markdown.match(
      /## Completed Tasks.*?\n\n([\s\S]*?)(?=\n---|\n##|$)/i,
    );

    if (!completedMatch) return tasks;

    const tasksSection = completedMatch[1];
    const taskLines = tasksSection.split("\n").filter((line) => line.trim());

    taskLines.forEach((line) => {
      const match = line.match(/~~\[([A-Z]+-\d+)\]\s+(.+)~~/);
      if (match) {
        tasks.push({
          key: match[1],
          summary: match[2].trim(),
          status: "Done",
        });
      }
    });

    return tasks;
  };

  const progress = parseProgress(content);
  const activeTasks = parseActiveTasks(content);
  const completedTasks = parseCompletedTasks(content);

  return (
    <article className="prose prose-invert max-w-none">
      <h1 className="text-4xl font-bold text-white mb-8">{title}</h1>

      {/* Progress Section */}
      {progress && (
        <div className="not-prose mb-12">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-red-400" />
                <span className="text-neutral-400 text-sm">Status</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {progress.status}
              </div>
            </div>

            <div className="bg-neutral-900 border border-green-500/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="text-neutral-400 text-sm">Completed</span>
              </div>
              <div className="text-2xl font-bold text-green-400">
                {progress.completed} / {progress.total}
              </div>
            </div>

            <div className="bg-neutral-900 border border-blue-500/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-neutral-400 text-sm">Remaining</span>
              </div>
              <div className="text-2xl font-bold text-blue-400">
                {progress.total - progress.completed}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-white">
                Epic Progress
              </span>
              <span className="text-sm font-bold text-red-400">
                {progress.percentage}%
              </span>
            </div>
            <div className="w-full bg-neutral-800 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-1000 rounded-full"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <div className="not-prose mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Active Tasks ({activeTasks.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTasks.map((task) => (
              <TaskCard
                key={task.key}
                taskKey={task.key}
                summary={task.summary}
                status={task.status}
                priority={task.priority}
                assignee={task.assignee}
                completed={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="not-prose mb-12">
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer bg-neutral-900 border border-neutral-800 rounded-lg p-4 hover:border-green-500/50 transition-colors">
              <h2 className="text-xl font-bold text-white">
                Completed Tasks ({completedTasks.length})
              </h2>
              <span className="text-neutral-500 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedTasks.map((task) => (
                <TaskCard
                  key={task.key}
                  taskKey={task.key}
                  summary={task.summary}
                  status={task.status}
                  completed={true}
                />
              ))}
            </div>
          </details>
        </div>
      )}

      {/* Last Updated */}
      <div className="not-prose mt-8 pt-8 border-t border-neutral-800">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => (
              <p className="text-sm text-neutral-500 italic">{children}</p>
            ),
          }}
        >
          {content.match(/\*Last updated:.*\*/)?.[0] || ""}
        </ReactMarkdown>
      </div>
    </article>
  );
};

export default EpicDetailContent;
