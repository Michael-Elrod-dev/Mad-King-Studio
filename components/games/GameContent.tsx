// components/games/GameContent.tsx
"use client";

import { GameData } from "@/lib/gameData";
import ActionButtons from "./ActionButtons";
import MediaCarousel from "@/components/shared/MediaCarousel";

interface GameContentProps {
  games: GameData[];
  selectedIndex: number;
}

const GameContent = ({ games, selectedIndex }: GameContentProps) => {
  const getMediaSection = (game: GameData, sectionId: string) => {
    return game.media?.find((section) => section.id === sectionId);
  };

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
      >
        {games.map((game, index) => (
          <div key={game.id} className="w-full flex-shrink-0 px-6 py-12">
            <div className="max-w-6xl mx-auto">
              {/* Header Section */}
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  Current Project
                </h1>
                <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
                  Follow the development of my upcoming indie game, through
                  Twitch or other social media.
                </p>

                <ActionButtons game={game} />
              </div>

              {/* Main Title Section */}
              <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-white">
                    {game.title}
                  </h2>
                  <p className="text-white/90 text-lg leading-relaxed">
                    {game.description}
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-white/90">
                      <span className="w-2 h-2 bg-white/90 rounded-full"></span>
                      <span>Genre: {game.genre}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-white/90">
                      <span className="w-2 h-2 bg-white/90 rounded-full"></span>
                      <span>Platform: {game.platform}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-white/90">
                      <span className="w-2 h-2 bg-white/90 rounded-full"></span>
                      <span>Status: {game.status}</span>
                    </div>
                  </div>
                </div>

                {/* Title Media */}
                <MediaCarousel
                  assets={getMediaSection(game, "title")?.assets || []}
                  showPlaceholder={true}
                  placeholderText="Game Trailer Placeholder"
                />
              </div>

              {/* Environments Section */}
              {getMediaSection(game, "environments") && (
                <div className="mb-20">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-white mb-4">
                      {getMediaSection(game, "environments")?.title}
                    </h3>
                    <p className="text-white/90 text-lg max-w-4xl mx-auto">
                      {getMediaSection(game, "environments")?.description}
                    </p>
                  </div>
                  <MediaCarousel
                    assets={getMediaSection(game, "environments")?.assets || []}
                    showPlaceholder={true}
                    placeholderText="Environments Placeholder"
                  />
                </div>
              )}

              {/* Player Section */}
              {getMediaSection(game, "player") && (
                <div className="mb-20">
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div className="space-y-6 md:col-start-2">
                      <h3 className="text-3xl font-bold text-white">
                        {getMediaSection(game, "player")?.title}
                      </h3>
                      <p className="text-white/90 text-lg leading-relaxed">
                        {getMediaSection(game, "player")?.description}
                      </p>
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
              )}

              {/* Enemies Section */}
              {getMediaSection(game, "enemies") && (
                <div className="mb-20">
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div className="space-y-6">
                      <h3 className="text-3xl font-bold text-white">
                        {getMediaSection(game, "enemies")?.title}
                      </h3>
                      <p className="text-white/90 text-lg leading-relaxed">
                        {getMediaSection(game, "enemies")?.description}
                      </p>
                    </div>

                    {/* Media Content */}
                    <div>
                      <MediaCarousel
                        assets={getMediaSection(game, "enemies")?.assets || []}
                        showPlaceholder={true}
                        placeholderText="Enemies Placeholder"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Weapons Section */}
              {getMediaSection(game, "weapons") && (
                <div className="mb-20">
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div className="space-y-6 md:col-start-2">
                      <h3 className="text-3xl font-bold text-white">
                        {getMediaSection(game, "weapons")?.title}
                      </h3>
                      <p className="text-white/90 text-lg leading-relaxed">
                        {getMediaSection(game, "weapons")?.description}
                      </p>
                    </div>

                    {/* Media Content */}
                    <div className="md:col-start-1 md:row-start-1">
                      <MediaCarousel
                        assets={getMediaSection(game, "weapons")?.assets || []}
                        showPlaceholder={true}
                        placeholderText="Weapons Placeholder"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bosses Section */}
              {getMediaSection(game, "bosses") && (
                <div className="mb-20">
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div className="space-y-6">
                      <h3 className="text-3xl font-bold text-white">
                        {getMediaSection(game, "bosses")?.title}
                      </h3>
                      <p className="text-white/90 text-lg leading-relaxed">
                        {getMediaSection(game, "bosses")?.description}
                      </p>
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
              )}

              {/* Abilities Section */}
              {getMediaSection(game, "abilities") && (
                <div className="mb-20">
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div className="space-y-6 md:col-start-2">
                      <h3 className="text-3xl font-bold text-white">
                        {getMediaSection(game, "abilities")?.title}
                      </h3>
                      <p className="text-white/90 text-lg leading-relaxed">
                        {getMediaSection(game, "abilities")?.description}
                      </p>
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
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameContent;
