"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Loader2, Pencil, Check, ExternalLink, BarChart2, Lock, Palette, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { LinkCard } from "@/components/link-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider, User } from "firebase/auth";
import { useLinksQuery, useAddLinkMutation, useUpdateNameMutation, useUpdateBioMutation } from "@/hooks/useQueries";
import { useQueryClient } from "@tanstack/react-query";

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const queryClient = useQueryClient();
  const { data: links = [], isLoading } = useLinksQuery(user?.uid);
  const addLinkMutation = useAddLinkMutation(user?.uid);
  const updateNameMutation = useUpdateNameMutation(user?.uid);
  const updateBioMutation = useUpdateBioMutation(user?.uid);

  // Name 상태
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState("");

  // Bio 상태
  const [bio, setBio] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editBioValue, setEditBioValue] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
      if (currentUser) {
        // Firestore users/{uid}에 구글 프로필 기본 정보 업데이트 (초기 1회 자동 생성 및 향후 변경 대비)
        try {
          const userRef = doc(db, "users", currentUser.uid);
          // 구글 계정의 이메일 앞부분(아이디)을 slug로 사용
          const emailPrefix = currentUser.email ? currentUser.email.split("@")[0] : null;
          await setDoc(userRef, {
            uid: currentUser.uid,
            displayName: currentUser.displayName || null,
            slug: emailPrefix,
            photoURL: currentUser.photoURL || null,
            email: currentUser.email || null,
            lastLoginAt: new Date().toISOString(),
          }, { merge: true });

          // bio 받아오기
          const docSnap = await getDoc(userRef);
          if (docSnap.exists() && docSnap.data().bio) {
            setBio(docSnap.data().bio);
          } else {
            setBio("한 줄 소개를 입력해주세요.");
          }
        } catch (err) {
          console.error("Error saving user profile to Firestore:", err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login Error: ", err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout Error: ", err);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError("");

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

    addLinkMutation.mutate(
      { title: trimmedTitle, url: trimmedUrl, createdAt: new Date().toISOString() },
      {
        onSuccess: () => {
          setTitle("");
          setUrl("");
          setOpen(false);
        },
        onError: () => {
          setError("링크 저장 중 오류가 발생했습니다.");
        }
      }
    );
  };

  const handleSaveName = async () => {
    if (!user) return;
    const trimmedName = editNameValue.trim();
    if (!trimmedName) {
      toast.error("이름을 입력해주세요.");
      return;
    }

    const currentName = user.displayName || (user.email ? user.email.split("@")[0] : "이름 없음");
    if (trimmedName === currentName) {
      setIsEditingName(false);
      return;
    }

    updateNameMutation.mutate(trimmedName, {
      onSuccess: () => {
        setUser({ ...user, displayName: trimmedName } as User);
        setIsEditingName(false);
        toast.success("이름이 변경되었습니다.");
      },
      onError: (err: { message: string }) => {
        if (err.message === "ALREADY_EXISTS") {
          toast.error("이미 사용 중인 이름입니다.");
        } else {
          toast.error("저장 중 오류가 발생했습니다.");
        }
      }
    });
  };

  const handleSaveBio = async () => {
    if (!user) return;
    const trimmedBio = editBioValue.trim();
    if (trimmedBio.length > 50) {
      toast.error("한 줄 소개는 50자 이내로 입력해주세요.");
      return;
    }

    updateBioMutation.mutate(trimmedBio, {
      onSuccess: () => {
        setBio(trimmedBio || "한 줄 소개를 입력해주세요.");
        setIsEditingBio(false);
        toast.success("한 줄 소개가 저장되었습니다.");
      },
      onError: () => {
        toast.error("저장 중 오류가 발생했습니다.");
      }
    });
  };

  if (isAuthLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-white/50" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#13072E] selection:bg-fuchsia-500/30">
        {/* 스크롤 시 따라오는 상단 헤더 */}
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#13072E]/50 backdrop-blur-md border-b border-white/5 transition-all">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#d946ef] to-[#8b5cf6] shadow-[0_0_15px_rgba(217,70,239,0.5)] ring-1 ring-white/20">
              <Plus className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
              MY LINK
            </span>
          </div>
          <Button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="rounded-full bg-white text-slate-900 hover:bg-slate-200 font-bold transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
          >
            {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            로그인
          </Button>
        </header>

        {/* 역동적인 배경 효과 (깊은 퍼플 테마) */}
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center z-0 overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] h-[800px] w-[800px] rounded-full bg-[#3b0764]/40 blur-[150px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-[#1e1b4b]/60 blur-[120px]" />
          <div className="absolute top-[40%] left-[20%] h-[400px] w-[400px] rounded-full bg-fuchsia-600/10 blur-[120px]" />
        </div>

        {/* Hero Section (Split Layout & 3D Mockup) */}
        <section className="relative z-10 flex min-h-screen w-full flex-col lg:flex-row items-center justify-center pt-24 pb-12 px-6 lg:px-12 max-w-7xl mx-auto gap-12 lg:gap-8">
          
          {/* Left Content (Typo & CTA) */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-5/12 animate-in fade-in slide-in-from-bottom-8 duration-1000 z-20">
            {/* 3D App Icon Logo */}
            <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-[2rem] bg-white shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_-10px_20px_rgba(0,0,0,0.1)] relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-[#d946ef] to-[#8b5cf6] shadow-[0_10px_20px_rgba(139,92,246,0.4),inset_0_2px_5px_rgba(255,255,255,0.4)]">
                <Plus className="h-10 w-10 text-white" strokeWidth={3} />
              </div>
            </div>

            <h1 className="mb-4 text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white drop-shadow-2xl">
              MY LINK
            </h1>

            <p className="mb-10 text-lg sm:text-xl font-medium leading-relaxed text-[#d8b4fe] max-w-lg">
              단 하나의 프로필 링크로 나를 브랜딩하세요.<br className="hidden sm:block"/>
              포트폴리오와 소셜 미디어를 통합하고 공유하세요.
            </p>

            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="group relative h-14 px-8 w-full sm:w-auto overflow-hidden rounded-2xl bg-white text-[15px] font-bold text-[#13072E] transition-all hover:scale-[1.02] hover:bg-slate-50 focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#13072E] disabled:pointer-events-none disabled:opacity-70 shadow-[0_10px_30px_rgba(255,255,255,0.2)]"
            >
              {isLoggingIn ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <svg className="mr-3 w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              {isLoggingIn ? "로그인 중..." : "Google 계정으로 시작하기"}
            </Button>
          </div>
          
          {/* Right Content (3D Dashboard Mockup) */}
          <div className="relative w-full lg:w-7/12 h-[500px] lg:h-[600px] flex items-center justify-center animate-in fade-in slide-in-from-right-12 duration-1000 delay-300 z-10" style={{ perspective: "1200px" }}>
            
            {/* Background Dashboard Mockup */}
            <div 
              className="absolute w-[80%] max-w-[500px] h-[350px] bg-[#1e1b4b] rounded-2xl border border-white/10 shadow-[-20px_20px_60px_rgba(0,0,0,0.6)] p-6 flex flex-col transition-transform duration-700 hover:rotate-y-[-10deg]"
              style={{ transform: "rotateY(-15deg) rotateX(10deg) translateZ(-100px) translateX(10%)" }}
            >
              {/* Fake Window Header */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="ml-4 w-32 h-2 rounded bg-white/10"></div>
              </div>
              
              {/* Fake List Rows */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5"></div>
                  <div className="flex-1 h-4 rounded bg-white/10"></div>
                </div>
              ))}
              
              {/* Fake Stats */}
              <div className="mt-auto flex gap-4 h-24">
                <div className="flex-1 rounded-xl bg-purple-500/20 border border-purple-500/40"></div>
                <div className="flex-1 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/40"></div>
              </div>
            </div>

            {/* Foreground Mobile Mockup */}
            <div 
              className="absolute w-[280px] h-[520px] bg-slate-900 rounded-[2.5rem] border-4 border-slate-800 shadow-[-30px_30px_60px_rgba(0,0,0,0.8),inset_0_0_0_2px_rgba(255,255,255,0.1)] p-6 flex flex-col items-center overflow-hidden transition-transform duration-700 hover:rotate-y-[-20deg]"
              style={{ transform: "rotateY(-25deg) rotateX(15deg) translateZ(50px) translateX(-20%)" }}
            >
              {/* Fake Notch */}
              <div className="absolute top-0 w-32 h-6 bg-slate-800 rounded-b-xl"></div>
              
              {/* Avatar */}
              <div className="w-20 h-20 mt-8 rounded-full bg-gradient-to-br from-[#d946ef] to-[#8b5cf6] shadow-[0_10px_20px_rgba(0,0,0,0.5)] mb-4"></div>
              
              {/* Name & Bio */}
              <div className="w-32 h-4 rounded bg-white/80 mb-2"></div>
              <div className="w-48 h-2 rounded bg-white/30 mb-8"></div>
              
              {/* Fake Links */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-full h-12 rounded-full bg-white/10 mb-3 flex items-center px-4 gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20"></div>
                  <div className="w-24 h-2 rounded bg-white/30"></div>
                </div>
              ))}

              <div className="mt-auto flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#d946ef] to-[#8b5cf6]"></div>
                <div className="text-[10px] font-bold text-white tracking-widest opacity-50">MY LINK</div>
              </div>
            </div>

          </div>
          
          {/* Scroll Down Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/30 hidden md:flex flex-col items-center gap-2">
            <span className="text-xs font-medium tracking-wider">스크롤해서 더 알아보기</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative z-10 w-full max-w-5xl mx-auto px-4 py-24 flex flex-col items-center gap-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">
              필요한 모든 기능을 한 곳에
            </h2>
            <p className="text-[#d8b4fe] max-w-lg mx-auto text-base md:text-lg">
              마이링크는 복잡한 설정 없이도 나만의 아름다운 포트폴리오를 만들 수 있도록 돕습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {/* Feature Card 1 */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/5 bg-[#1e1b4b]/40 p-8 backdrop-blur-md transition-all duration-300 hover:bg-[#2e1065]/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#d946ef]/20">
              <div className="absolute -top-10 -right-10 p-3 opacity-20 transition-opacity group-hover:opacity-40">
                <div className="h-32 w-32 rounded-full bg-[#d946ef] blur-[50px]"></div>
              </div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d946ef]/20 to-[#d946ef]/0 ring-1 ring-white/10 group-hover:ring-[#d946ef]/50 transition-all">
                <Pencil className="h-7 w-7 text-[#d946ef]" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white/90">쉽고 빠른 커스텀</h3>
              <p className="text-sm leading-relaxed text-white/60">
                직관적인 UI로 프로필 이미지, 한 줄 소개, 링크를 쉽게 추가하고 즉시 반영되는 결과를 확인하세요.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/5 bg-[#1e1b4b]/40 p-8 backdrop-blur-md transition-all duration-300 hover:bg-[#2e1065]/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#8b5cf6]/20">
              <div className="absolute -top-10 -right-10 p-3 opacity-20 transition-opacity group-hover:opacity-40">
                <div className="h-32 w-32 rounded-full bg-[#8b5cf6] blur-[50px]"></div>
              </div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8b5cf6]/20 to-[#8b5cf6]/0 ring-1 ring-white/10 group-hover:ring-[#8b5cf6]/50 transition-all">
                <Plus className="h-7 w-7 text-[#a78bfa]" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white/90">무제한 링크 보드</h3>
              <p className="text-sm leading-relaxed text-white/60">
                포트폴리오, 소셜 미디어, 최신 프로젝트 등 당신을 알릴 수 있는 모든 것을 제한 없이 담아보세요.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/5 bg-[#1e1b4b]/40 p-8 backdrop-blur-md transition-all duration-300 hover:bg-[#2e1065]/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="absolute -top-10 -right-10 p-3 opacity-20 transition-opacity group-hover:opacity-40">
                <div className="h-32 w-32 rounded-full bg-blue-500 blur-[50px]"></div>
              </div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/0 ring-1 ring-white/10 group-hover:ring-blue-500/50 transition-all">
                <BarChart2 className="h-7 w-7 text-blue-400" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white/90">방문자 통계</h3>
              <p className="text-sm leading-relaxed text-white/60">
                어떤 링크가 가장 인기가 많은지, 통계 대시보드를 통해 방문자들의 반응을 직관적으로 분석하세요.
              </p>
            </div>
          </div>
        </section>

        {/* Timeline Section (30초면 충분합니다) */}
        <section className="relative z-10 w-full py-32 flex flex-col items-center px-4 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
            <div className="h-[200px] w-[600px] rounded-[100%] bg-gradient-to-r from-[#d946ef]/10 to-[#8b5cf6]/10 blur-[80px]"></div>
          </div>

          <div className="text-center space-y-4 mb-20 relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
              30초면 충분합니다
            </h2>
          </div>

          <div className="relative w-full max-w-4xl mx-auto z-10">
            {/* Vertical Line */}
            <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-[2px] md:-translate-x-1/2 bg-gradient-to-b from-[#d946ef]/0 via-[#d946ef]/50 to-[#8b5cf6]/0" />

            {/* Step 1 */}
            <div className="relative flex flex-col md:flex-row md:items-center justify-between w-full mb-12 md:mb-16">
              <div className="hidden md:block w-5/12"></div>
              <div className="absolute left-4 md:left-1/2 top-8 md:top-1/2 -translate-y-1/2 md:-translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-[#13072e] border border-[#d946ef]/50 shadow-[0_0_20px_-5px_rgba(217,70,239,0.5)] z-10">
                <Lock className="h-5 w-5 text-[#d946ef]" />
              </div>
              <div className="w-full md:w-5/12 pl-24 md:pl-0">
                <div className="rounded-3xl border border-white/5 bg-[#1e1b4b]/40 p-8 backdrop-blur-md transition-all hover:bg-[#2e1065]/50 hover:-translate-y-1 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-2">로그인</h3>
                  <p className="text-white/60 text-sm">구글 계정으로 간편하게 시작하세요.</p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col md:flex-row md:items-center justify-between w-full mb-12 md:mb-16">
              <div className="w-full md:w-5/12 pl-24 md:pl-0 md:pr-0 md:text-right order-2 md:order-1">
                <div className="rounded-3xl border border-white/5 bg-[#1e1b4b]/40 p-8 backdrop-blur-md transition-all hover:bg-[#2e1065]/50 hover:-translate-y-1 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-2">프로필 꾸미기</h3>
                  <p className="text-white/60 text-sm">사진을 올리고 나만의 링크들을 추가하세요.</p>
                </div>
              </div>
              <div className="absolute left-4 md:left-1/2 top-8 md:top-1/2 -translate-y-1/2 md:-translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-[#13072e] border border-[#a855f7]/50 shadow-[0_0_20px_-5px_rgba(168,85,247,0.5)] z-10 order-1 md:order-2">
                <Palette className="h-5 w-5 text-[#a855f7]" />
              </div>
              <div className="hidden md:block w-5/12 order-3"></div>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col md:flex-row md:items-center justify-between w-full">
              <div className="hidden md:block w-5/12"></div>
              <div className="absolute left-4 md:left-1/2 top-8 md:top-1/2 -translate-y-1/2 md:-translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-[#13072e] border border-[#8b5cf6]/50 shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)] z-10">
                <Share2 className="h-5 w-5 text-[#8b5cf6]" />
              </div>
              <div className="w-full md:w-5/12 pl-24 md:pl-0">
                <div className="rounded-3xl border border-white/5 bg-[#1e1b4b]/40 p-8 backdrop-blur-md transition-all hover:bg-[#2e1065]/50 hover:-translate-y-1 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-2">공유하기</h3>
                  <p className="text-white/60 text-sm">완성된 링크를 인스타그램, 이력서에 공유하세요.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-24 relative z-10">
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="group h-14 px-8 rounded-2xl bg-white text-[15px] font-bold text-[#13072E] transition-all hover:scale-[1.02] hover:bg-slate-50 focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#13072E] disabled:pointer-events-none disabled:opacity-70 shadow-[0_10px_30px_rgba(255,255,255,0.2)]"
            >
              {isLoggingIn ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <svg className="mr-3 w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              {isLoggingIn ? "로그인 중..." : "Google 계정으로 시작하기"}
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/5 py-8 text-center bg-[#13072e]/50 backdrop-blur-md">
          <p className="text-sm text-white/40 font-medium">
            © {new Date().getFullYear()} My Link. All rights reserved.
          </p>
        </footer>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* 배경 그라디언트 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-violet-600/10 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-cyan-600/10 blur-[100px]" />
      </div>

      {/* 헤더 부분 */}
      <header className="relative z-20 flex w-full items-center justify-between p-4">
        <div 
          className="flex select-none items-center gap-2.5 pl-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#5B5FC7] to-purple-600 shadow-sm ring-1 ring-white/20">
            <Plus className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
            MY LINK
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex cursor-pointer items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors focus:outline-none">
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt={user.displayName || "Profile"}
                width={40}
                height={40}
                className="rounded-full"
                unoptimized
              />
            ) : (
              <span className="text-sm text-white font-bold">
                {user.email ? user.email.charAt(0).toUpperCase() : "U"}
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800 text-white shadow-xl shadow-black/50 rounded-xl">
            <div className="px-2.5 py-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.displayName || "이름 없음"}</p>
                <p className="text-xs leading-none text-white/50">{user.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem
              className="focus:bg-slate-800 focus:text-white cursor-pointer"
              onClick={() => {
                const profileName = user.email?.split("@")[0] ?? "";
                const url = `${window.location.origin}/${profileName}`;
                navigator.clipboard.writeText(url);
                toast.success("포트폴리오 주소가 복사되었습니다.");
              }}
            >
              내 포트폴리오 주소 복사
            </DropdownMenuItem>
            <DropdownMenuItem
              className="focus:bg-slate-800 focus:text-white cursor-pointer"
              onClick={() => {
                const profileName = user.email?.split("@")[0] ?? "";
                const url = `${window.location.origin}/${profileName}`;
                window.open(url, "_blank", "noopener,noreferrer");
              }}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              내 페이지 미리보기
            </DropdownMenuItem>
            <DropdownMenuItem
              className="focus:bg-slate-800 focus:text-white cursor-pointer"
              onClick={() => {
                router.push('/stats');
              }}
            >
              <BarChart2 className="mr-2 h-4 w-4" />
              통계 보기
            </DropdownMenuItem>
            <DropdownMenuItem
              className="focus:bg-slate-800 focus:text-white cursor-pointer"
              onClick={() => {
                toast.info("프로필 설정 기능은 준비 중입니다.");
              }}
            >
              프로필 및 테마 설정
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem
              className="focus:bg-red-500/20 focus:text-red-400 text-red-400 cursor-pointer"
              onClick={handleLogout}
            >
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="relative z-10 flex flex-col items-center px-4 py-8">
        {/* 프로필 섹션 */}
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt={user.displayName || "Profile"}
              width={80}
              height={80}
              className="rounded-full shadow-lg shadow-indigo-500/30 ring-2 ring-white/10"
              unoptimized
            />
          ) : (
            <div className="w-[80px] h-[80px] rounded-full bg-indigo-500/30 ring-2 ring-white/10 flex items-center justify-center">
              <span className="text-xl text-white font-bold">
                {user.email
                  ? user.email.charAt(0).toUpperCase()
                  : (user.displayName ? user.displayName.charAt(0) : "U")}
              </span>
            </div>
          )}
          <div className="w-full flex flex-col items-center">
            <div className="flex items-center justify-center min-h-[32px] mb-1 w-full relative">
              {isEditingName ? (
                <div className="flex items-center gap-2 justify-center w-full">
                  <Input
                    value={editNameValue}
                    onChange={(e) => setEditNameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveName();
                      if (e.key === 'Escape') setIsEditingName(false);
                    }}
                    autoFocus
                    placeholder="이름 입력"
                    className="h-8 max-w-[200px] text-lg font-bold text-center bg-white/5 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-1 focus-visible:ring-indigo-400 focus-visible:ring-offset-0"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 shrink-0 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10"
                    onClick={handleSaveName}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className="group flex items-center justify-center gap-2 cursor-pointer relative"
                  onClick={() => {
                    setEditNameValue(user.displayName || (user.email ? user.email.split("@")[0] : "이름 없음"));
                    setIsEditingName(true);
                  }}
                >
                  <h1 className="text-2xl font-bold tracking-tight text-white group-hover:text-white/80 transition-colors">
                    {user.displayName || (user.email ? user.email.split("@")[0] : "이름 없음")}
                  </h1>
                  <div className="absolute -right-6 flex items-center justify-center">
                    <Pencil className="h-3.5 w-3.5 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              )}
            </div>

            {user.email && (
              <p className="mb-2 text-sm font-medium text-white/60 text-center">
                @{user.email.split("@")[0]}
              </p>
            )}

            {/* 한줄소개 (Bio) 하단 영역 */}
            <div className="mt-1 min-h-[24px] flex justify-center w-full relative">
              {isEditingBio ? (
                <div className="flex items-center gap-2 justify-center w-full">
                  <Input
                    value={editBioValue}
                    onChange={(e) => setEditBioValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveBio();
                      if (e.key === 'Escape') setIsEditingBio(false);
                    }}
                    autoFocus
                    placeholder="한 줄 소개를 입력해주세요 (50자 이내)"
                    className="h-8 w-full max-w-[250px] text-xs text-center bg-white/5 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-1 focus-visible:ring-indigo-400 focus-visible:ring-offset-0"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 shrink-0 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10"
                    onClick={handleSaveBio}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className="group flex items-center justify-center gap-1.5 cursor-pointer text-sm text-white/50 hover:text-white/80 transition-colors relative"
                  onClick={() => {
                    setEditBioValue(bio === "한 줄 소개를 입력해주세요." ? "" : bio);
                    setIsEditingBio(true);
                  }}
                >
                  <p className="text-center">{bio}</p>
                  <div className="absolute -right-5 flex items-center justify-center">
                    <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              )}
            </div>
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
            <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">새 링크 추가</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddSubmit} className="flex flex-col space-y-4 py-4">
                {error && (
                  <div className="p-3 bg-red-500/10 text-red-400 text-sm rounded-md border border-red-500/20">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-slate-300">제목</label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="예: 내 포트폴리오"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-slate-400 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="url" className="text-sm font-medium text-slate-300">주소 (URL)</label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-slate-400 focus-visible:ring-offset-0"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={addLinkMutation.isPending}
                  className="w-full bg-[#5B5FC7] hover:bg-[#4a4ea0] text-white mt-4 flex items-center justify-center gap-2"
                >
                  {addLinkMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      추가 중...
                    </>
                  ) : "추가 완료"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-white/50" />
            </div>
          ) : (
            links.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                uid={user.uid}
                onUpdate={() => queryClient.invalidateQueries({ queryKey: ["links", user.uid] })}
                onDelete={() => queryClient.invalidateQueries({ queryKey: ["links", user.uid] })}
              />
            ))
          )}
        </div>

        {/* 푸터 */}
        <p className="mt-12 text-xs text-white/20">Powered by My Link</p>
      </div>
    </main>
  );
}
