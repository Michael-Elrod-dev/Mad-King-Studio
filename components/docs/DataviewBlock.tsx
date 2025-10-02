// components/docs/DataviewBlock.tsx
"use client";

import { useMemo } from "react";
import {
  executeDataviewQuery,
  executeTableQuery,
  evaluateTableField,
  type DataviewQuery,
  type ParsedTask,
} from "@/lib/utils/dataviewParser";

interface DataviewBlockProps {
  query: DataviewQuery;
  allTasks: ParsedTask[];
  isLoading: boolean;
  error: string | null;
}

const DataviewBlock = ({
  query,
  allTasks,
  isLoading,
  error,
}: DataviewBlockProps) => {
  // Execute TASK query using memoization
  const tasks = useMemo(() => {
    if (isLoading || error || query.type !== "TASK") return [];
    return executeDataviewQuery(query, allTasks);
  }, [query, allTasks, isLoading, error]);

  // Execute TABLE query using memoization
  const documents = useMemo(() => {
    if (isLoading || error || query.type !== "TABLE") return [];
    return executeTableQuery(query, allTasks);
  }, [query, allTasks, isLoading, error]);

  if (isLoading) {
    return (
      <div className="bg-neutral-900 rounded-lg p-6 my-4">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-neutral-700 rounded w-3/4"></div>
          <div className="h-4 bg-neutral-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 my-4">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  // TABLE type
  if (query.type === "TABLE") {
    if (documents.length === 0) {
      return (
        <div className="bg-neutral-900 rounded-lg p-6 my-4">
          <p className="text-white/60 text-sm">No documents found</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border-collapse border border-neutral-700 bg-neutral-900 rounded-lg">
          <thead className="bg-neutral-800">
            <tr>
              <th className="border border-neutral-700 px-4 py-2 text-left text-white font-semibold">
                File
              </th>
              {query.fields &&
                query.fields.map((field, idx) => (
                  <th
                    key={idx}
                    className="border border-neutral-700 px-4 py-2 text-left text-white font-semibold"
                  >
                    {field.alias || field.expression}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, idx) => (
              <tr key={idx} className="hover:bg-neutral-800/50">
                <td className="border border-neutral-700 px-4 py-2 text-white/90">
                  {doc.name.replace(".md", "")}
                </td>
                {query.fields &&
                  query.fields.map((field, fieldIdx) => (
                    <td
                      key={fieldIdx}
                      className="border border-neutral-700 px-4 py-2 text-white/90"
                    >
                      {evaluateTableField(field, doc)}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // TASK or LIST type
  if (tasks.length === 0) {
    return (
      <div className="bg-neutral-900 rounded-lg p-6 my-4">
        <p className="text-white/60 text-sm">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-lg p-6 my-4 space-y-3">
      {tasks.map((task, idx) => (
        <div key={idx} className="flex items-start space-x-3 group">
          <input
            type="checkbox"
            checked={task.completed}
            readOnly
            className="mt-1 rounded border-neutral-600 bg-neutral-800 text-red-500 focus:ring-red-500 cursor-default"
          />
          <div className="flex-1">
            <p
              className={`text-white/90 ${
                task.completed ? "line-through text-white/50" : ""
              }`}
            >
              {task.text}
            </p>
            <div className="flex items-center space-x-3 mt-1">
              <span className="text-xs text-white/40">{task.file}</span>
              {task.priority && (
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    task.priority === "high"
                      ? "bg-red-900/30 text-red-400"
                      : task.priority === "medium"
                        ? "bg-yellow-900/30 text-yellow-400"
                        : "bg-blue-900/30 text-blue-400"
                  }`}
                >
                  {task.priority}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataviewBlock;
