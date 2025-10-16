// components/games/GameContent.tsx
"use client";

import { GameData } from "@/lib/data/game";
import ActionButtons from "./ActionButtons";
import GameInfo from "./GameInfo";
import SectionHeader from "./SectionHeader";
import MediaCarousel from "@/components/shared/MediaCarousel";
import { Map, User, Swords, Skull, Crosshair, Sparkles } from "lucide-react";

interface GameContentProps {
  games: GameData[];
  selectedIndex: number;
}

const GameContent = ({ games, selectedIndex }: GameContentProps) => {
  const getMediaSection = (game: GameData, sectionId: string) => {
    return game.media?.find((section) => section.id === sectionId);
  };

  const sectionIcons = {
    environments: Map,
    player: User,
    enemies: Swords,
    weapons: Crosshair,
    bosses: Skull,
    abilities: Sparkles,
  };

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
      >
        {games.map((game) => (
          <div key={game.id} className="w-full flex-shrink-0 px-6 py-12">
            <div className="max-w-6xl mx-auto">
              {/* Header Section */}
              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white via-white to-neutral-400 bg-clip-text text-transparent">
                  Current Project
                </h1>
                <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed">
                  Follow the development of my upcoming indie game through
                  Twitch streams and social media updates.
                </p>

                <ActionButtons game={game} />

                {/* Game Info Cards */}
                <div className="mt-12">
                  <GameInfo
                    genre={game.genre}
                    platform={game.platform}
                    status={game.status}
                  />
                </div>
              </div>

              {/* Gradient Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent mb-16"></div>

              {/* Main Title Section */}
              <div className="space-y-12 mb-24">
                <div className="text-center">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                    {game.title}
                  </h2>
                  <p className="text-white/90 text-lg leading-[1.8] max-w-4xl mx-auto">
                    {game.description}
                  </p>
                </div>

                {/* Title Media */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <MediaCarousel
                      assets={getMediaSection(game, "title")?.assets || []}
                      showPlaceholder={true}
                      placeholderText="Game Trailer Placeholder"
                    />
                  </div>
                </div>
              </div>

              {/* Environments Section */}
              {getMediaSection(game, "environments") && (
                <div className="mb-24">
                  <SectionHeader
                    title={getMediaSection(game, "environments")?.title || ""}
                    description={
                      getMediaSection(game, "environments")?.description
                    }
                    icon={sectionIcons.environments}
                    centered
                  />
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative">
                      <MediaCarousel
                        assets={
                          getMediaSection(game, "environments")?.assets || []
                        }
                        showPlaceholder={true}
                        placeholderText="Environments Placeholder"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Player Section */}
              {getMediaSection(game, "player") && (
                <div className="mb-24">
                  <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 border border-neutral-800/50 rounded-2xl p-8 md:p-12">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                      {/* Text Content */}
                      <div className="space-y-6 md:col-start-2">
                        <SectionHeader
                          title={getMediaSection(game, "player")?.title || ""}
                          description={
                            getMediaSection(game, "player")?.description
                          }
                          icon={sectionIcons.player}
                        />
                      </div>

                      {/* Media Content */}
                      <div className="md:col-start-1 md:row-start-1">
                        <MediaCarousel
                          assets={getMediaSection(game, "player")?.assets || []}
                          showPlaceholder={true}
                          placeholderText="Player Placeholder"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Enemies Section */}
              {getMediaSection(game, "enemies") && (
                <div className="mb-24">
                  <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 border border-neutral-800/50 rounded-2xl p-8 md:p-12">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                      {/* Text Content */}
                      <div className="space-y-6">
                        <SectionHeader
                          title={getMediaSection(game, "enemies")?.title || ""}
                          description={
                            getMediaSection(game, "enemies")?.description
                          }
                          icon={sectionIcons.enemies}
                        />
                      </div>

                      {/* Media Content */}
                      <div>
                        <MediaCarousel
                          assets={
                            getMediaSection(game, "enemies")?.assets || []
                          }
                          showPlaceholder={true}
                          placeholderText="Enemies Placeholder"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Weapons Section */}
              {getMediaSection(game, "weapons") && (
                <div className="mb-24">
                  <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 border border-neutral-800/50 rounded-2xl p-8 md:p-12">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                      {/* Text Content */}
                      <div className="space-y-6 md:col-start-2">
                        <SectionHeader
                          title={getMediaSection(game, "weapons")?.title || ""}
                          description={
                            getMediaSection(game, "weapons")?.description
                          }
                          icon={sectionIcons.weapons}
                        />
                      </div>

                      {/* Media Content */}
                      <div className="md:col-start-1 md:row-start-1">
                        <MediaCarousel
                          assets={
                            getMediaSection(game, "weapons")?.assets || []
                          }
                          showPlaceholder={true}
                          placeholderText="Weapons Placeholder"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bosses Section */}
              {getMediaSection(game, "bosses") && (
                <div className="mb-24">
                  <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 border border-neutral-800/50 rounded-2xl p-8 md:p-12">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                      {/* Text Content */}
                      <div className="space-y-6">
                        <SectionHeader
                          title={getMediaSection(game, "bosses")?.title || ""}
                          description={
                            getMediaSection(game, "bosses")?.description
                          }
                          icon={sectionIcons.bosses}
                        />
                      </div>

                      {/* Media Content */}
                      <div>
                        <MediaCarousel
                          assets={getMediaSection(game, "bosses")?.assets || []}
                          showPlaceholder={true}
                          placeholderText="Bosses Placeholder"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Abilities Section */}
              {getMediaSection(game, "abilities") && (
                <div className="mb-24">
                  <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 border border-neutral-800/50 rounded-2xl p-8 md:p-12">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                      {/* Text Content */}
                      <div className="space-y-6 md:col-start-2">
                        <SectionHeader
                          title={
                            getMediaSection(game, "abilities")?.title || ""
                          }
                          description={
                            getMediaSection(game, "abilities")?.description
                          }
                          icon={sectionIcons.abilities}
                        />
                      </div>

                      {/* Media Content */}
                      <div className="md:col-start-1 md:row-start-1">
                        <MediaCarousel
                          assets={
                            getMediaSection(game, "abilities")?.assets || []
                          }
                          showPlaceholder={true}
                          placeholderText="Abilities Placeholder"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameContent;
