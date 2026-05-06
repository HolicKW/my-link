"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Loader2, Pencil, Check, ExternalLink, BarChart2 } from "lucide-react";
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
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 p-4">
        {/* 역동적인 배경 효과 */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="absolute top-0 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-gradient-to-b from-indigo-500/20 to-purple-500/0 blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-fuchsia-500/10 blur-[100px]" />
        </div>

        <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/20 p-10 backdrop-blur-2xl shadow-2xl">
            {/* 카드 내부 우아한 빛 번짐 효과 */}
            <div className="absolute inset-[1px] rounded-[calc(2.5rem-1px)] bg-slate-900/90" />
            <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/20 blur-[50px]" />
            <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-purple-500/20 blur-[50px]" />

            <div className="relative flex flex-col items-center z-20">
              {/* 로고 영역 */}
              <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-[#5B5FC7] to-purple-600 shadow-[0_0_40px_-10px_rgba(91,95,199,0.5)] ring-1 ring-white/20">
                <Plus className="h-10 w-10 text-white" strokeWidth={2.5} />
              </div>

              <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">
                MY LINK
              </h1>

              <p className="mb-10 text-center text-sm font-medium leading-relaxed text-slate-400">
                단 하나의 프로필 링크로 나를 브랜딩하세요.<br />
                <span className="text-white/80">구글 계정으로 1초 만에 시작하기</span>
              </p>

              <Button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="group relative h-14 w-full overflow-hidden rounded-2xl bg-white text-[15px] font-semibold text-slate-900 transition-all hover:scale-[1.02] hover:bg-slate-50 focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:pointer-events-none disabled:opacity-70 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
                ) : (
                  <svg className="mr-2 w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                {isLoggingIn ? "로그인 중..." : "Google 계정으로 시작하기"}
              </Button>
            </div>
          </div>
        </div>
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
