// app/community/page.tsx
import FloatingNav from "@/components/layout/FloatingNav";
import LiveStatus from "@/components/community/LiveStatus";
import { FaTwitch, FaGithub, FaDiscord } from "react-icons/fa";

export default function CommunityPage() {
  return (
    <div className="min-h-screen pb-12">
      <FloatingNav />
      <div className="pt-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Community
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Join the community on Twitch. Watch live coding, contribute to the
              project, and be part of the development journey.
            </p>
          </div>

          <LiveStatus />

          {/* Community Links */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-purple-600 rounded-lg p-6 text-center transition-colors">
              <div className="flex justify-center mb-4">
                <FaTwitch size={48} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Twitch Stream
              </h3>
              <p className="text-white/90 mb-4">
                Watch live game development and brainstorming
              </p>
              <a
                href="https://twitch.tv/aimosthadme"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-purple-600 font-semibold py-2 px-6 rounded-full hover:bg-purple-100 transition-colors"
              >
                Follow on Twitch
              </a>
            </div>

            <div className="bg-neutral-800 rounded-lg p-6 text-center transition-colors">
              <div className="flex justify-center mb-4">
                <FaGithub size={48} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                GitHub Repository
              </h3>
              <p className="text-white/90 mb-4">
                Explore the source code, report bugs, and contribute to the
                project
              </p>
              <a
                href="#"
                className="inline-block bg-white text-neutral-800 font-semibold py-2 px-6 rounded-full hover:bg-neutral-100 transition-colors"
              >
                View on GitHub
              </a>
            </div>

            <div className="bg-indigo-600 rounded-lg p-6 text-center transition-colors">
              <div className="flex justify-center mb-4">
                <FaDiscord size={48} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Discord Server
              </h3>
              <p className="text-white/90 mb-4">
                Chat with other community members and post memes
              </p>
              <a
                href="#"
                className="inline-block bg-white text-indigo-600 font-semibold py-2 px-6 rounded-full hover:bg-indigo-100 transition-colors"
              >
                Join Discord
              </a>
            </div>
          </div>

          {/* Contribution Guidelines */}
          <div className="bg-neutral-800 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              How to Contribute
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">👀</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Watch & Learn
                </h4>
                <p className="text-white/90">
                  Follow the streams to hangout and either learn something new
                  or help out
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">💡</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Share Ideas
                </h4>
                <p className="text-white/90">
                  Suggest features, report bugs, or discuss design decisions in
                  Discord
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🔧</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Contribute Code
                </h4>
                <p className="text-white/90">
                  Fork the repository and submit pull requests for improvements
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
