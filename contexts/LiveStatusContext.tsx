// contexts/LiveStatusContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";

interface LiveStatus {
  isLive: boolean;
  streamTitle: string;
  gameName: string;
  startedAt: string | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number;
}

interface LiveStatusContextType {
  liveStatus: LiveStatus;
  refetch: () => void;
}

const LiveStatusContext = createContext<LiveStatusContextType | undefined>(
  undefined
);

interface LiveStatusProviderProps {
  children: ReactNode;
}

export function LiveStatusProvider({ children }: LiveStatusProviderProps) {
  const [liveStatus, setLiveStatus] = useState<LiveStatus>({
    isLive: false,
    streamTitle: "",
    gameName: "",
    startedAt: null,
    isLoading: true,
    error: null,
    lastUpdated: 0,
  });

  const isInitialLoad = useRef<boolean>(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchStreamStatus = useCallback(async (): Promise<void> => {
    try {
      // Only show loading on initial load
      if (isInitialLoad.current) {
        setLiveStatus((prev) => ({ ...prev, isLoading: true, error: null }));
      }

      const response = await fetch(`/api/twitch/stream?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (response.ok) {
        const streamInfo = await response.json();

        setLiveStatus((prev) => {
          // Check if anything actually changed
          const hasChanged =
            prev.isLive !== streamInfo.isLive ||
            prev.streamTitle !== streamInfo.streamTitle ||
            prev.gameName !== streamInfo.gameName ||
            prev.startedAt !== streamInfo.startedAt;

          if (hasChanged || isInitialLoad.current) {
            return {
              isLive: streamInfo.isLive,
              streamTitle: streamInfo.streamTitle,
              gameName: streamInfo.gameName,
              startedAt: streamInfo.startedAt,
              isLoading: false,
              error: null,
              lastUpdated: Date.now(),
            };
          }

          // No changes, just update timestamps
          return {
            ...prev,
            isLoading: false,
            error: null,
            lastUpdated: Date.now(),
          };
        });
      } else {
        throw new Error(`API request failed: ${response.status}`);
      }

      isInitialLoad.current = false;
    } catch (error) {
      console.error("❌ Error fetching stream status:", error);
      setLiveStatus((prev) => ({
        ...prev,
        isLoading: isInitialLoad.current,
        error: error instanceof Error ? error.message : "Unknown error",
        lastUpdated: Date.now(),
      }));

      isInitialLoad.current = false;
    }
  }, []);

  const refetch = useCallback((): void => {
    fetchStreamStatus();
  }, [fetchStreamStatus]);

  useEffect(() => {
    fetchStreamStatus();

    // Set up interval to fetch every 1 minute (60,000ms)
    intervalRef.current = setInterval(() => {
      fetchStreamStatus();
    }, 60000);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchStreamStatus]);

  const value: LiveStatusContextType = {
    liveStatus,
    refetch,
  };

  return (
    <LiveStatusContext.Provider value={value}>
      {children}
    </LiveStatusContext.Provider>
  );
}

export function useLiveStatus(): LiveStatusContextType {
  const context = useContext(LiveStatusContext);
  if (context === undefined) {
    throw new Error("useLiveStatus must be used within a LiveStatusProvider");
  }
  return context;
}
