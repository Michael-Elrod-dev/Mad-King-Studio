import FloatingNav from '@/components/layout/FloatingNav';
import DevlogList from '@/components/devlog/DevlogList';

export default function DevlogPage() {
  return (
    <div className="min-h-screen ">
      <FloatingNav />
      <div className="pt-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Development Log
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Follow along with the development journey. Regular updates on progress,
              challenges, and insights from building our game live on stream.
            </p>
          </div>
          <DevlogList />
        </div>
      </div>
    </div>
  );
}