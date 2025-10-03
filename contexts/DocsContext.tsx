// contexts/DocsContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { DocFile } from "@/lib/data/docs";

interface DocsContextType {
  tree: DocFile[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const DocsContext = createContext<DocsContextType | undefined>(undefined);

interface DocsProviderProps {
  children: ReactNode;
}

export function DocsProvider({ children }: DocsProviderProps) {
  const [tree, setTree] = useState<DocFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTree = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/docs");

      if (!response.ok) {
        throw new Error("Failed to fetch documentation structure");
      }

      const data = await response.json();
      setTree(data.tree);
      setError(null);
    } catch (err) {
      console.error("Error loading docs tree:", err);
      setError("Failed to load documentation");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTree();
  }, []);

  const value: DocsContextType = {
    tree,
    isLoading,
    error,
    refetch: fetchTree,
  };

  return <DocsContext.Provider value={value}>{children}</DocsContext.Provider>;
}

export function useDocs(): DocsContextType {
  const context = useContext(DocsContext);
  if (context === undefined) {
    throw new Error("useDocs must be used within a DocsProvider");
  }
  return context;
}
