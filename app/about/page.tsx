// app/about/page.tsx
import FloatingNav from "@/components/layout/FloatingNav";

export default function AboutPage() {
  return (
    <div className="min-h-screen pb-12">
      <FloatingNav />
      <div className="pt-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              About the Studio
            </h1>
          </div>

          <div className="mb-16">
            <div className="space-y-6 text-center">
              <h2 className="text-3xl font-bold text-white">The Developer</h2>
              <p className="text-white/90 text-lg leading-relaxed">
                Hey, I&apos;m Michael! I studied computer science in university
                and I&apos;m a full-time software developer, but in my free time
                I&apos;ve been diving into game development. To be honest,
                I&apos;m pretty much a beginner at this. Sure, I tinkered with a
                few small projects back in college, but nothing serious. Now
                that life has settled down a bit, I&apos;ve decided to start
                actually developing games under the name Mad King Studio.
              </p>

              <p className="text-white/90 text-lg leading-relaxed">
                If you&apos;re at all interested, you can follow my stuff on
                Twitch, X, Youtube, Discord, and maybe even Reddit. I might be
                looking to do some live development on Twitch every once in a
                while so feel free to join in and ask me about anything
                I&apos;ve created or my process. I don&apos;t really know what
                I&apos;m doing, but I dont mind sharing. You can also share your
                own projects and ideas in the Discord.
              </p>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Want to Reach Out?
            </h3>
            <p className="text-white/90 mb-6 text-lg">
              I&apos;m always interested in connecting with fellow developers,
              artists, and gaming enthusiasts.
            </p>
            <a
              href="/contact"
              className="border border-red-500 hover:border-red-600 hover:bg-red-500 text-red-500 hover:text-white/90 font-semibold py-3 px-8 rounded-full transition-colors duration-200 text-lg inline-block"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
