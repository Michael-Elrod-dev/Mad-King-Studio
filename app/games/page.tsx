import FloatingNav from '@/components/layout/FloatingNav';

export default function GamePage() {
  return (
    <div className="min-h-screen ">
      <FloatingNav />
      <div className="pt-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Current Project
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Follow the development of my upcoming indie game, built live on Twitch
              and available as open source.
            </p>
          </div>

          {/* Game Showcase */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">Path to Valhalla</h2>
              <p className="text-dark-300 text-lg leading-relaxed">
                A 2D, top down, segmented rougelite game built around Norse Mythology.
                You play as a fallen Viking who must fight his way through the 9 
                Realms to prove himself to Odin and be granted everlasting life as one 
                of Odin&apos;s warriors in Valhalla.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-dark-300">
                  <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                  <span>Genre: Action / Rougelite</span>
                </div>
                <div className="flex items-center space-x-3 text-dark-300">
                  <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                  <span>Platform: PC (Steam)</span>
                </div>
                <div className="flex items-center space-x-3 text-dark-300">
                  <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                  <span>Status: In Development</span>
                </div>
                <div className="flex items-center space-x-3 text-dark-300">
                  <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                  <span>Open Source: Code available on GitHub</span>
                </div>
              </div>
            </div>
            <div className="bg-neutral-900 rounded-lg aspect-video flex items-center justify-center">
              <span className="text-dark-400 text-lg">Game Screenshot Placeholder</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-6">
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
              >
                Wishlist on Steam
              </a>
              <a
                href="https://github.com/Michael-Elrod-dev/Path-to-Valhalla"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-dark-800 hover:bg-dark-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
              >
                View on GitHub
              </a>
              <a
                href="https://www.twitch.tv/aimosthadme"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white font-semibold py-3 px-8 rounded-full transition-colors"
              >
                Watch Development Live
              </a>
            </div>
          </div>

          {/* Development Progress */}
          <div className="mt-16 bg-neutral-900 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Development Progress</h3>
            <div className="space-y-4">
              {[
                { feature: 'Core Game Mechanics', progress: 30 },
                { feature: 'Level Design', progress: 10 },
                { feature: 'Art Assets', progress: 0 },
                { feature: 'Audio Integration', progress: 0 },
                { feature: 'UI/UX Polish', progress: 0 },
              ].map((item) => (
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
    </div>
  );
}