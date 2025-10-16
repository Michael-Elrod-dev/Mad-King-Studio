// components/docs/EpicsList.tsx
"use client";

import EpicCard from "./EpicCard";

interface Epic {
  name: string;
  status: string;
  progress: number;
  completedTasks: number;
  totalTasks: number;
}

interface EpicsListProps {
  epics: Epic[];
}

const EpicsList = ({ epics }: EpicsListProps) => {
  if (!epics || epics.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-400">No epics found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {epics.map((epic) => {
        // Convert epic name to slug for URL
        const slug = epic.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");

        return (
          <EpicCard
            key={slug}
            name={epic.name}
            status={epic.status}
            progress={epic.progress}
            completedTasks={epic.completedTasks}
            totalTasks={epic.totalTasks}
            slug={slug}
          />
        );
      })}
    </div>
  );
};

export default EpicsList;
