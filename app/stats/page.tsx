"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useStatsLinksQuery } from "@/hooks/useQueries";
import { Loader2, ArrowLeft, BarChart2, Plus, Trophy, MousePointerClick, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";

export default function StatsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/");
      } else {
        setUser(currentUser);
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const { data: links = [], isLoading } = useStatsLinksQuery(user?.uid);

  if (isAuthLoading || isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-white/50" />
      </main>
    );
  }

  if (!user) return null;

  const totalClicks = links.reduce((acc, link) => acc + (link.clicks || 0), 0);
  const topLink = links.length > 0 ? links[0] : null;

  const chartData = links.map((link) => ({
    title: link.title.length > 8 ? link.title.substring(0, 8) + "..." : link.title,
    fullTitle: link.title,
    clicks: link.clicks || 0,
  }));

  const chartConfig = {
    clicks: {
      label: "조회수",
      color: "url(#colorClicks)",
    },
  } satisfies ChartConfig;

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 pb-20">
      {/* 프리미엄 동적 배경 */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-fuchsia-600/10 blur-[100px] animate-pulse duration-[10000ms]" />
        <div className="absolute top-[40%] left-[60%] h-[300px] w-[300px] rounded-full bg-blue-600/10 blur-[80px]" />
      </div>

      {/* 헤더 */}
      <header className="relative z-20 flex w-full items-center justify-between p-4 bg-slate-950/50 backdrop-blur-md border-b border-white/5 sticky top-0">
        <div 
          className="flex select-none items-center gap-2.5 pl-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => router.push("/")}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#5B5FC7] to-purple-600 shadow-sm ring-1 ring-white/20">
            <Plus className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
            MY LINK
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/")}
          className="text-white/70 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          돌아가기
        </Button>
      </header>

      <div className="relative z-10 max-w-3xl mx-auto px-4 pt-8">
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <BarChart2 className="h-8 w-8 text-indigo-400" />
            인사이트
          </h1>
          <p className="text-slate-400 mt-2">등록된 링크들의 조회 성과를 확인하세요.</p>
        </div>

        {/* 대시보드 듀얼 카드 요약 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          {/* 총 조회수 카드 */}
          <div className="group relative bg-slate-900/40 border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-xl overflow-hidden hover:-translate-y-1 transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-center gap-2 mb-4 text-indigo-300">
                <MousePointerClick className="h-5 w-5" />
                <h3 className="font-medium">총 누적 조회수</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-tighter">
                  {totalClicks.toLocaleString()}
                </span>
                <span className="text-xl font-bold text-slate-500">회</span>
              </div>
            </div>
          </div>

          {/* 최고 인기 링크 카드 */}
          <div className="group relative bg-slate-900/40 border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-xl overflow-hidden hover:-translate-y-1 transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-center gap-2 mb-4 text-fuchsia-300">
                <Trophy className="h-5 w-5" />
                <h3 className="font-medium">최고 인기 링크</h3>
              </div>
              {topLink && topLink.clicks ? (
                <div>
                  <h4 className="text-xl font-bold text-white truncate mb-1" title={topLink.title}>
                    {topLink.title}
                  </h4>
                  <p className="text-fuchsia-400 font-semibold">{topLink.clicks.toLocaleString()}회 조회</p>
                </div>
              ) : (
                <div className="text-slate-500 italic">아직 조회된 링크가 없습니다.</div>
              )}
            </div>
          </div>
        </div>

        {/* 차트 영역 */}
        <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-xl mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-semibold text-white">클릭 수 추이</h2>
          </div>
          
          {links.length > 0 ? (
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              <BarChart accessibilityLayer data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                {/* 프리미엄 그라디언트 정의 */}
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#c084fc" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#334155" strokeDasharray="3 3" opacity={0.4} />
                <XAxis
                  dataKey="title"
                  tickLine={false}
                  tickMargin={12}
                  axisLine={false}
                  stroke="#94a3b8"
                  fontSize={12}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  stroke="#94a3b8"
                  fontSize={12}
                  tickFormatter={(value) => `${value}`}
                />
                <ChartTooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  content={
                    <ChartTooltipContent 
                      className="bg-slate-900 border-slate-700 shadow-2xl rounded-xl"
                      hideLabel={false} 
                    />
                  }
                />
                <Bar 
                  dataKey="clicks" 
                  radius={[6, 6, 0, 0]} 
                  fill="url(#colorClicks)"
                  animationDuration={1500}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 border border-dashed border-white/10 rounded-2xl">
              <p>표시할 데이터가 없습니다.</p>
            </div>
          )}
        </div>

        {/* 랭킹 리스트 영역 */}
        <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-xl animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
          <h2 className="text-lg font-semibold text-white mb-6">상세 순위 리스트</h2>
          {links.length > 0 ? (
            <div className="flex flex-col gap-3">
              {links.map((link, index) => {
                const isTop3 = index < 3 && (link.clicks || 0) > 0;
                return (
                  <div 
                    key={link.id} 
                    className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all cursor-pointer"
                    onClick={() => window.open(link.url, '_blank')}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                        ${index === 0 && (link.clicks || 0) > 0 ? 'bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/50' : 
                          index === 1 && (link.clicks || 0) > 0 ? 'bg-slate-300/20 text-slate-300 ring-1 ring-slate-400/50' :
                          index === 2 && (link.clicks || 0) > 0 ? 'bg-amber-700/20 text-amber-500 ring-1 ring-amber-600/50' : 
                          'bg-slate-800 text-slate-400'}
                      `}>
                        {index + 1}
                      </div>
                      <div className="flex flex-col">
                        <span className={`font-semibold ${isTop3 ? 'text-white' : 'text-slate-300'}`}>
                          {link.title}
                        </span>
                        <span className="text-xs text-slate-500 truncate max-w-[150px] sm:max-w-[300px]">
                          {link.url}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className={`font-bold ${isTop3 ? 'text-indigo-400' : 'text-slate-400'}`}>
                          {link.clicks || 0}
                        </span>
                        <span className="text-xs text-slate-500 ml-1">클릭</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center py-10 text-slate-500">순위를 집계할 수 없습니다.</p>
          )}
        </div>
        
      </div>
    </main>
  );
}
