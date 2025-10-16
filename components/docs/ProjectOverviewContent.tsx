// components/docs/ProjectOverviewContent.tsx
"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import EpicsList from "./EpicsList";

interface ProjectOverviewContentProps {
  content: string;
  title: string;
}

interface Epic {
  name: string;
  status: string;
  progress: number;
  completedTasks: number;
  totalTasks: number;
}

const ProjectOverviewContent = ({
  content,
  title,
}: ProjectOverviewContentProps) => {
  // Parse the epics from markdown content
  const parseEpics = (markdown: string): Epic[] => {
    const epics: Epic[] = [];
    const epicsSectionMatch = markdown.match(
      /## Epics Summary\s+([\s\S]*?)(?=\n---|\n##|$)/i,
    );

    if (!epicsSectionMatch) return epics;

    const epicsSection = epicsSectionMatch[1];
    const epicBlocks = epicsSection.split(/###\s+/).filter(Boolean);

    epicBlocks.forEach((block) => {
      const lines = block.trim().split("\n");
      const name = lines[0].trim();

      const statusMatch = block.match(/\*\*Status\*\*:\s*(.+)/i);
      const progressMatch = block.match(
        /\*\*Progress\*\*:\s*(\d+)%\s*\((\d+)\/(\d+)/i,
      );

      if (statusMatch && progressMatch) {
        epics.push({
          name,
          status: statusMatch[1].trim(),
          progress: parseInt(progressMatch[1]),
          completedTasks: parseInt(progressMatch[2]),
          totalTasks: parseInt(progressMatch[3]),
        });
      }
    });

    return epics;
  };

  // Parse overall progress from markdown
  const parseOverallProgress = (markdown: string) => {
    const progressMatch = markdown.match(
      /## Overall Progress\s+([\s\S]*?)(?=\n---|\n##)/i,
    );

    if (!progressMatch) return null;

    const section = progressMatch[1];
    const totalMatch = section.match(/\*\*Total Tasks\*\*:\s*(\d+)/i);
    const completedMatch = section.match(/\*\*Completed\*\*:\s*(\d+)/i);
    const remainingMatch = section.match(/\*\*Remaining\*\*:\s*(\d+)/i);
    const progressPercentMatch = section.match(/\*\*Progress\*\*:\s*(\d+)%/i);

    if (
      totalMatch &&
      completedMatch &&
      remainingMatch &&
      progressPercentMatch
    ) {
      return {
        total: parseInt(totalMatch[1]),
        completed: parseInt(completedMatch[1]),
        remaining: parseInt(remainingMatch[1]),
        percentage: parseInt(progressPercentMatch[1]),
      };
    }

    return null;
  };

  const epics = parseEpics(content);
  const overallProgress = parseOverallProgress(content);

  return (
    <article className="prose prose-invert max-w-none">
      <h1 className="text-4xl font-bold text-white mb-8">{title}</h1>

      {/* Overall Progress Stats */}
      {overallProgress && (
        <div className="not-prose mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            Overall Progress
          </h2>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
              <div className="text-neutral-400 text-sm mb-2">Total Tasks</div>
              <div className="text-3xl font-bold text-white">
                {overallProgress.total}
              </div>
            </div>
            <div className="bg-neutral-900 border border-green-500/30 rounded-lg p-6">
              <div className="text-neutral-400 text-sm mb-2">Completed</div>
              <div className="text-3xl font-bold text-green-400">
                {overallProgress.completed}
              </div>
            </div>
            <div className="bg-neutral-900 border border-blue-500/30 rounded-lg p-6">
              <div className="text-neutral-400 text-sm mb-2">Remaining</div>
              <div className="text-3xl font-bold text-blue-400">
                {overallProgress.remaining}
              </div>
            </div>
            <div className="bg-neutral-900 border border-red-500/30 rounded-lg p-6">
              <div className="text-neutral-400 text-sm mb-2">Progress</div>
              <div className="text-3xl font-bold text-red-400">
                {overallProgress.percentage}%
              </div>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-white">
                Project Completion
              </span>
              <span className="text-sm font-bold text-red-400">
                {overallProgress.percentage}%
              </span>
            </div>
            <div className="w-full bg-neutral-800 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-1000 rounded-full"
                style={{ width: `${overallProgress.percentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-neutral-500">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      )}

      {/* Epics Grid */}
      {epics.length > 0 && (
        <div className="not-prose mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Active Epics</h2>
          <EpicsList epics={epics} />
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

export default ProjectOverviewContent;
