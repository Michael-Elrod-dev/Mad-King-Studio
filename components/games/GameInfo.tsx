// components/games/GameInfo.tsx
"use client";

import { Gamepad, Monitor, Zap } from "lucide-react";

interface GameInfoProps {
  genre: string;
  platform: string;
  status: string;
}

const GameInfo = ({ genre, platform, status }: GameInfoProps) => {
  const getStatusColor = (status: string) => {
    if (status.toLowerCase().includes("development")) {
      return {
        bg: "from-yellow-500/10 to-yellow-600/10",
        border: "border-yellow-500/30",
        text: "text-yellow-400",
        icon: "bg-yellow-500/20",
      };
    }
    if (status.toLowerCase().includes("early")) {
      return {
        bg: "from-blue-500/10 to-blue-600/10",
        border: "border-blue-500/30",
        text: "text-blue-400",
        icon: "bg-blue-500/20",
      };
    }
    return {
      bg: "from-green-500/10 to-green-600/10",
      border: "border-green-500/30",
      text: "text-green-400",
      icon: "bg-green-500/20",
    };
  };

  const statusColors = getStatusColor(status);

  const infoCards = [
    {
      icon: Gamepad,
      label: "Genre",
      value: genre,
      gradient: "from-red-500/10 to-red-600/10",
      border: "border-red-500/30",
      text: "text-red-400",
      iconBg: "bg-red-500/20",
    },
    {
      icon: Monitor,
      label: "Platform",
      value: platform,
      gradient: "from-purple-500/10 to-purple-600/10",
      border: "border-purple-500/30",
      text: "text-purple-400",
      iconBg: "bg-purple-500/20",
    },
    {
      icon: Zap,
      label: "Status",
      value: status,
      gradient: statusColors.bg,
      border: statusColors.border,
      text: statusColors.text,
      iconBg: statusColors.icon,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {infoCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`group relative bg-gradient-to-br ${card.gradient} border ${card.border} rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105`}
          >
            <div className="flex items-center gap-4">
              <div className={`${card.iconBg} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${card.text}`} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-1">
                  {card.label}
                </p>
                <p className={`text-lg font-bold ${card.text}`}>{card.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GameInfo;
