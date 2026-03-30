"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { DUMMY_LINKS, type Link } from "@/data/link";
import { LinkCard } from "@/components/link-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Page() {
  const [links, setLinks] = useState<Link[]>(DUMMY_LINKS);
  const [open, setOpen] = useState(false);
  
  // 폼 상태
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // 에러 초기화

    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();

    if (!trimmedTitle) {
      setError("제목을 입력해주세요.");
      return;
    }

    if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
      setError("올바른 주소 형식을 입력해주세요 (http:// 또는 https:// 포함).");
      return;
    }

    const newLink: Link = {
      id: Date.now().toString(),
      title: trimmedTitle,
      url: trimmedUrl,
      createdAt: new Date().toISOString(),
    };

    setLinks([newLink, ...links]); // 새 항목을 맨 앞에 추가
    setTitle("");
    setUrl("");
    setOpen(false);
  };

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
          {/* 링크 추가 버튼 */}
          <Button 
            className="mb-4 bg-[#5B5FC7] hover:bg-[#4a4ea0] text-white flex items-center justify-center gap-2 py-6 rounded-2xl w-full"
            onClick={() => setOpen(true)}
          >
            <Plus className="w-5 h-5" />
            새 링크 추가
          </Button>

          <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) setError("");
          }}>
            <DialogContent className="sm:max-w-md bg-white border-slate-200">
              <DialogHeader>
                <DialogTitle className="text-slate-900">새 링크 추가</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddSubmit} className="flex flex-col space-y-4 py-4">
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-slate-700">제목</label>
                  <Input 
                    id="title"
                    type="text" 
                    placeholder="예: 내 포트폴리오" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="text-slate-900 border-slate-300 placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="url" className="text-sm font-medium text-slate-700">주소 (URL)</label>
                  <Input 
                    id="url"
                    type="url" 
                    placeholder="https://example.com" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    className="text-slate-900 border-slate-300 placeholder:text-slate-400"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-[#5B5FC7] hover:bg-[#4a4ea0] text-white mt-4"
                >
                  추가 완료
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {links.map((link) => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>

        {/* 푸터 */}
        <p className="mt-12 text-xs text-white/20">Powered by My Link</p>
      </div>
    </main>
  );
}
