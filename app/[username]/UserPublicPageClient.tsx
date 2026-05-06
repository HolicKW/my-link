"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { LinkCard } from "@/components/link-card";
import { type Link } from "@/data/link";

interface Profile {
  displayName: string;
  bio: string | null;
  photoURL: string | null;
}

interface UserPublicPageClientProps {
  username: string;
  profile: Profile | null;
  links: Link[];
}

export default function UserPublicPageClient({
  username,
  profile,
  links,
}: UserPublicPageClientProps) {
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
        <div className="mb-10 flex flex-col items-center gap-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          {profile?.photoURL ? (
            <Image
              src={profile.photoURL}
              alt={profile.displayName}
              width={96}
              height={96}
              className="rounded-full shadow-2xl shadow-indigo-500/40 ring-4 ring-white/10"
              unoptimized
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-indigo-500/30 ring-4 ring-white/10 flex items-center justify-center shadow-2xl">
              <span className="text-3xl text-white font-bold">
                {profile?.displayName?.charAt(0) ||
                  username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <div className="flex flex-col items-center gap-1.5">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {profile?.displayName || username}
            </h1>
            <p className="text-sm font-medium text-white/50">@{username}</p>
          </div>

          {profile?.bio && (
            <p className="max-w-xs text-sm leading-relaxed text-white/70">
              {profile.bio}
            </p>
          )}

          <div className="mt-2 flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-white/70">
              Available for work
            </span>
          </div>
        </div>

        {/* 링크 목록 */}
        <div className="w-full max-w-sm flex flex-col gap-3.5 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          {links.length > 0 ? (
            links.map((link) => (
              <LinkCard key={link.id} link={link} isReadOnly={true} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-white/30 italic">
              등록된 링크가 없습니다.
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="mt-20 flex flex-col items-center gap-4 text-center">
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
        </div>
      </div>
    </main>
  );
}
