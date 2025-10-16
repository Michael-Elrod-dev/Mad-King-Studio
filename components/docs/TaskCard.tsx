// components/docs/TaskCard.tsx
"use client";

import { CheckCircle2, Circle } from "lucide-react";

interface TaskCardProps {
  taskKey: string;
  summary: string;
  status: string;
  priority?: string;
  assignee?: string;
  completed?: boolean;
}

const TaskCard = ({
  taskKey,
  summary,
  status,
  priority,
  assignee,
  completed = false,
}: TaskCardProps) => {
  // Priority colors
  const getPriorityColor = (priority?: string) => {
    if (!priority) return "text-neutral-500";
    const lower = priority.toLowerCase();
    if (lower.includes("high") || lower.includes("critical"))
      return "text-red-400";
    if (lower.includes("medium")) return "text-yellow-400";
    return "text-blue-400";
  };

  const getPriorityBg = (priority?: string) => {
    if (!priority) return "bg-neutral-800";
    const lower = priority.toLowerCase();
    if (lower.includes("high") || lower.includes("critical"))
      return "bg-red-500/10 border-red-500/30";
    if (lower.includes("medium"))
      return "bg-yellow-500/10 border-yellow-500/30";
    return "bg-blue-500/10 border-blue-500/30";
  };

  return (
    <div
      className={`bg-neutral-900 border rounded-lg p-4 transition-all duration-200 hover:border-red-500/50 ${
        completed
          ? "border-neutral-800 opacity-75"
          : "border-neutral-700 hover:shadow-md hover:shadow-red-500/5"
      }`}
    >
      {/* Header with task key and status icon */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {completed ? (
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
          ) : (
            <Circle className="w-5 h-5 text-neutral-600 flex-shrink-0" />
          )}
          <span className="text-xs font-mono text-neutral-400">{taskKey}</span>
        </div>

        {priority && (
          <div
            className={`px-2 py-1 rounded text-xs font-semibold border ${getPriorityBg(
              priority,
            )}`}
          >
            <span className={getPriorityColor(priority)}>
              {priority.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Task summary */}
      <h4
        className={`text-sm font-medium mb-3 ${
          completed ? "text-neutral-500 line-through" : "text-white"
        }`}
      >
        {summary}
      </h4>

      {/* Footer with status and assignee */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-neutral-500">Status:</span>
          <span
            className={`px-2 py-1 rounded ${
              completed
                ? "bg-green-500/10 text-green-400"
                : "bg-blue-500/10 text-blue-400"
            }`}
          >
            {status}
          </span>
        </div>

        {assignee && (
          <div className="flex items-center gap-1 text-neutral-400">
            <span>@{assignee.split(" ")[0]}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
