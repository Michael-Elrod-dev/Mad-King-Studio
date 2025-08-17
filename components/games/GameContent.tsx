"use client";

import { GameData } from "@/lib/gameData";

interface GameContentProps {
  games: GameData[];
  selectedIndex: number;
}

const GameContent = ({ games, selectedIndex }: GameContentProps) => {
  const currentGame = games[selectedIndex];

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
      >
        {games.map((game, index) => (
          <div key={game.id} className="w-full flex-shrink-0 px-6 py-12">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  Current Project
                </h1>
                <p className="text-xl text-white/90 max-w-3xl mx-auto">
                  Follow the development of my upcoming indie game, built live
                  on Twitch and available as open source.
                </p>
              </div>

              {/* Game Showcase */}
              <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
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
                    {game.openSource && (
                      <div className="flex items-center space-x-3 text-white/90">
                        <span className="w-2 h-2 bg-white/90 rounded-full"></span>
                        <span>Open Source: Code available on GitHub</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-neutral-900 rounded-lg aspect-video flex items-center justify-center">
                  <span className="text-white/70 text-lg">
                    Game Screenshot Placeholder
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="text-center space-y-6">
                <div className="flex flex-wrap justify-center gap-4">
                  {game.steamUrl && (
                    <a
                      href={game.steamUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
                    >
                      Wishlist on Steam
                    </a>
                  )}
                  {game.githubUrl && (
                    <a
                      href={game.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
                    >
                      View on GitHub
                    </a>
                  )}
                  {game.twitchUrl && (
                    <a
                      href={game.twitchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-white/30 hover:border-purple-600 hover:text-purple-500 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200 text-lg backdrop-blur-sm inline-block"
                    >
                      Watch Development Live
                    </a>
                  )}
                </div>
              </div>

              {/* Development Progress */}
              <div className="mt-16 bg-neutral-900 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Development Progress
                </h3>
                <div className="space-y-4">
                  {game.progress.map((item) => (
                    <div key={item.feature} className="space-y-2">
                      <div className="flex justify-between text-white/90">
                        <span>{item.feature}</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="w-full bg-neutral-950 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameContent;
