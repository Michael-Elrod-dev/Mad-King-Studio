import FloatingNav from "@/components/layout/FloatingNav";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <FloatingNav />
      <div className="pt-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              About the Studio
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              The story behind the games, the philosophy of open development,
              and the journey of creating something fun.
            </p>
          </div>

          {/* Changed from grid to single column */}
          <div className="mb-16">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">The Developer</h2>
              <p className="text-white/90 text-lg leading-relaxed">
                Hey, I&apos;m Michael! I&apos;m a full-time software developer, but
                in my free time I&apos;ve been diving into game development. To be
                honest, I&apos;m pretty much a beginner at this. 
                Sure, I tinkered with a few small projects back in
                college, but nothing serious. Now that life has settled down a
                bit, I&apos;ve decided to start actually creating completed games under 
                the name Mad King Studio.
              </p>

              <p className="text-white/90 text-lg leading-relaxed">
                I&apos;ve also decided to make all my
                games going forward completely open source (except for the art and music I buy
                from talented artists). Honestly, it started as a random
                idea, but the more I thought about it, the cooler it got. As a beginner myself, 
                the idea of being able to peek behind the curtain of a game&apos;s development,
                learn from the code, suggest improvements, or even contribute
                features myself is wild to me.
              </p>

              <p className="text-white/90 text-lg leading-relaxed">
                I don&apos;t have any strong opinions 
                about software freedom. I just think it would be genuinely
                awesome to build something alongside a community of other
                developers, gamers, or just curious minds. Plus, sitting at my desk all day
                making a game alone can get boring. Come
                hang out, watch me struggle with physics, or maybe
                we&apos;ll create something amazing together.
              </p>
            </div>
          </div>

          {/* Philosophy Section */}
          <div className="bg-neutral-800 rounded-lg p-8 mb-16">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Development Philosophy
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="bg-white/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🌍</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Open Source
                </h4>
                <p className="text-white/90">
                  Making game development accessible by sharing code and
                  knowledge freely
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🤝</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Community-Driven
                </h4>
                <p className="text-white/90">
                  Building games with input from players and fellow developers
                </p>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Want to Collaborate?
            </h3>
            <p className="text-white/90 mb-6 text-lg">
              I&apos;m always interested in connecting with fellow developers,
              artists, and gaming enthusiasts.
            </p>
            <a
              href="/contact"
              className="inline-block bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-8 rounded-full transition-colors text-lg"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}