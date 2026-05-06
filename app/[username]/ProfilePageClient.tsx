"use client";

import Image from "next/image";
import { Globe, Plus } from "lucide-react";
import { LinkCard } from "@/components/link-card";
import { type Link } from "@/data/link";

interface Profile {
  displayName: string;
  bio: string | null;
  photoURL: string | null;
}

interface ProfilePageClientProps {
  displayName: string;
  profile: Profile | null;
  links: Link[];
  uid: string;
}

export default function ProfilePageClient({
  displayName,
  profile,
  links,
  uid,
}: ProfilePageClientProps) {
  const name = profile?.displayName || displayName;
  const initial = name.charAt(0).toUpperCase();

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* 배경 그라디언트 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[140px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-violet-600/10 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-cyan-600/10 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 py-16">
        {/* 프로필 카드 */}
        <section
          aria-label="프로필"
          className="mb-10 w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
          <div className="flex flex-col items-center gap-5 rounded-3xl border border-white/10 bg-white/5 px-8 py-10 backdrop-blur-sm shadow-xl shadow-black/30 text-center">
            {/* 아바타 */}
            {profile?.photoURL ? (
              <Image
                src={profile.photoURL}
                alt={name}
                width={96}
                height={96}
                className="rounded-full shadow-2xl shadow-indigo-500/40 ring-4 ring-white/10"
                unoptimized
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/40 to-purple-600/40 ring-4 ring-white/10 shadow-2xl shadow-indigo-500/30">
                <span className="text-3xl font-bold text-white">{initial}</span>
              </div>
            )}

            {/* 이름 + 소개글 */}
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white">
                {name}
              </h1>
              <p className="text-sm font-medium text-white/50">
                @{displayName}
              </p>
              {profile?.bio && (
                <p className="mt-1 max-w-[260px] text-sm leading-relaxed text-white/70">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Available 배지 */}
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-white/70">
                Available for work
              </span>
            </div>
          </div>
        </section>

        {/* 링크 목록 */}
        <section
          aria-label="링크 목록"
          className="w-full max-w-sm flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200"
        >
          {links.length > 0 ? (
            links.map((link) => (
              <LinkCard key={link.id} link={link} uid={uid} isReadOnly />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 py-14 text-center">
              <Globe className="h-8 w-8 text-white/20" />
              <p className="text-sm text-white/30">등록된 링크가 없습니다.</p>
            </div>
          )}
        </section>

        {/* 푸터 */}
        <footer className="mt-20 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 select-none opacity-40">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-[#5B5FC7] to-purple-600">
              <Plus className="h-3.5 w-3.5 text-white" strokeWidth={3} />
            </div>
            <span className="text-xs font-bold tracking-tighter text-white">
              MY LINK
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-white/20">
            Create your own profile page at mylink.me
          </p>
        </footer>
      </div>
    </main>
  );
}
