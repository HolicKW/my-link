import Image from "next/image";
import { DUMMY_LINKS } from "@/data/link";
import { LinkCard } from "@/components/link-card";

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* 배경 그라디언트 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-violet-600/10 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-cyan-600/10 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 py-16">
        {/* 프로필 섹션 */}
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <Image
            src="https://github.com/HolicKW.png"
            alt="HolicKW"
            width={80}
            height={80}
            className="rounded-full shadow-lg shadow-indigo-500/30 ring-2 ring-white/10"
            unoptimized
          />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              함대영
            </h1>
            <p className="mt-1 text-sm text-white/50">
              Developer &amp; Creator
            </p>
          </div>
          <div className="mt-1 flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs text-white/60">Available for work</span>
          </div>
        </div>

        {/* 링크 목록 */}
        <div className="w-full max-w-sm flex flex-col gap-3">
          {DUMMY_LINKS.map((link) => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>

        {/* 푸터 */}
        <p className="mt-12 text-xs text-white/20">Powered by My Link</p>
      </div>
    </main>
  );
}
