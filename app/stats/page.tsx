"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useStatsLinksQuery } from "@/hooks/useQueries";
import { Loader2, ArrowLeft, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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

  if (!user) return null; // router.push가 동작하기 전 렌더링 방지

  const totalClicks = links.reduce((acc, link) => acc + (link.clicks || 0), 0);

  const chartData = links.map(link => ({
    title: link.title.length > 10 ? link.title.substring(0, 10) + '...' : link.title,
    fullTitle: link.title,
    clicks: link.clicks || 0,
  }));

  const chartConfig = {
    clicks: {
      label: "클릭 수",
      color: "#818cf8", // indigo-400
    },
  } satisfies ChartConfig;

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 p-4 pb-20">
      {/* 배경 그라디언트 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto pt-8">
        {/* 헤더 */}
        <div className="flex items-center mb-8 gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#5B5FC7] to-purple-600 shadow-sm ring-1 ring-white/20">
              <BarChart2 className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">통계</h1>
          </div>
        </div>

        {/* 상단: 총 클릭 수 요약 */}
        <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-xl mb-8 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-slate-400 font-medium mb-2">모든 링크 총 조회수</p>
          <div className="flex items-end gap-2">
            <span className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tighter">
              {totalClicks.toLocaleString()}
            </span>
            <span className="text-2xl font-bold text-white/50 mb-1.5">회</span>
          </div>
        </div>

        {/* 하단: 링크별 클릭수 차트 */}
        <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
          <h2 className="text-lg font-semibold text-white mb-6">링크별 클릭 수 순위</h2>
          
          {links.length > 0 ? (
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              <BarChart accessibilityLayer data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#334155" strokeDasharray="3 3" />
                <XAxis
                  dataKey="title"
                  tickLine={false}
                  tickMargin={10}
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
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="clicks" fill="var(--color-clicks)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <p>아직 등록된 링크가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
