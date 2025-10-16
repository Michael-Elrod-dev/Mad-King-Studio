// app/about/page.tsx
import FloatingNav from "@/components/layout/FloatingNav";
import { Code2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen pb-12">
      <FloatingNav />
      <div className="pt-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white via-white to-neutral-400 bg-clip-text">
              About the Studio
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              A solo developer&apos;s journey into indie game development
            </p>
          </div>

          {/* Developer Section */}
          <div className="mb-16">
            <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 border border-neutral-800/50 rounded-2xl p-8 md:p-12">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/30">
                  <Code2 className="w-8 h-8 text-red-400" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  The Developer
                </h2>
                <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/30">
                  <Code2 className="w-8 h-8 text-red-400" />
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-white/90 text-lg leading-[1.8] text-center">
                  Hey, I&apos;m Michael! I studied computer science in
                  university and I&apos;m a full-time software developer, but in
                  my free time I&apos;ve been diving into game development. To
                  be honest, I&apos;m pretty much a beginner at this. Sure, I
                  tinkered with a few small projects back in college, but
                  nothing serious. Now that life has settled down a bit,
                  I&apos;ve decided to start actually developing games under the
                  name Mad King Studio.
                </p>

                <div className="h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent"></div>

                <p className="text-white/90 text-lg leading-[1.8] text-center">
                  If you&apos;re at all interested, you can follow my stuff on
                  Twitch, X, Youtube, Discord, and maybe even Reddit. I might be
                  looking to do some live development on Twitch every once in a
                  while so feel free to join in and ask me about anything
                  I&apos;ve created or my process. I don&apos;t really know what
                  I&apos;m doing, but I dont mind sharing. You can also share
                  your own projects and ideas in the Discord.
                </p>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="relative bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 border border-neutral-800/50 rounded-2xl p-8 md:p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-2xl blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <h3 className="text-3xl font-bold text-white mb-4">
                Want to Reach Out?
              </h3>
              <p className="text-white/80 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
                I&apos;m always interested in connecting with fellow developers,
                artists, and gaming enthusiasts.
              </p>
              <a
                href="/community"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500/10 to-red-600/10 hover:from-red-500/20 hover:to-red-600/20 text-red-400 border-2 border-red-500/50 hover:border-red-500/70 font-bold px-10 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 hover:scale-105"
              >
                <span className="text-lg">Get In Touch</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
