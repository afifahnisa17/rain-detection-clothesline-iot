"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  Tooltip,
} from "recharts";

import { Info, Activity, ShieldAlert, Clock } from "lucide-react";

interface AnalyticsPageStats {
  title: string;
  description: string;
  value: string | number;
  unit?: string;
  footer: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
}

// LOGIKA DATA TIDAK DIUBAH
const buildTrend = (v: number) =>
  Array.from({ length: 10 }).map((_, i) => ({
    x: i,
    y: Number(v) + Math.sin(i) * (Number(v) * 0.05),
  }));

const buildFlatTrend = (v: number) =>
  Array.from({ length: 8 }).map((_, i) => ({
    x: i,
    y: Number(v) + (Math.random() - 0.5) * 2,
  }));

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;

  return (
    <div className="rounded-xl border border-white/20 bg-background/80 backdrop-blur-md px-4 py-3 shadow-2xl">
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Point #{data.x}</p>
      <p className="text-base font-bold mt-1 text-foreground">
        {data.y.toFixed?.(2) ?? data.y}
      </p>
    </div>
  );
}

export default function AnalyticsPage({
  stats,
}: {
  stats: AnalyticsPageStats[];
}) {
  if (!stats?.length) return null;

  // Memecah array data menjadi variabel individu
  const [stat1, stat2, stat3, stat4, stat5, stat6, stat7, stat8] = stats;

  // Grid utama sekarang hanya berisi 4 metrik sensor standar
  const mainCards = [
    { s: stat1, type: "area", color: "#6366f1", data: buildTrend(Number(stat1.value)) },
    { s: stat2, type: "line", color: "#3b82f6", data: buildFlatTrend(Number(stat2.value)) },
    { s: stat3, type: "area", color: "#f59e0b", data: buildTrend(Number(stat3.value)) },
    { s: stat4, type: "line", color: "#10b981", data: buildFlatTrend(Number(stat4.value)) },
  ];

  return (
    <main className="p-4 md:p-8 space-y-10 bg-[#f8fafc] dark:bg-background min-h-screen font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border/50">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/20">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              System Analytics
            </h1>
            <p className="text-sm font-medium text-muted-foreground mt-1">
              Real-time monitoring & analytics overview
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Last sync: {new Date().toLocaleString("id-ID")}
        </div>
      </div>

      {/* TYPOGRAPHY HIGHLIGHTS (Tanpa Kotak/Box) */}
      {/* stat5: Penyelamatan Jemuran | stat6: Jam Rawan Hujan */}
      <div className="flex flex-col md:flex-row gap-10 py-4 px-2">
        
        {/* Highlight 1 */}
        <div className="flex-1 flex items-center gap-5">
          <div className="p-4 rounded-full bg-rose-500/10 text-rose-500">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wider text-rose-500/80 uppercase">
              {stat5.title}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-5xl md:text-6xl font-black tracking-tighter text-foreground">
                {stat5.value}
              </span>
              <span className="text-lg font-bold text-muted-foreground">
                {stat5.unit || "Kali"}
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-2">
              {stat5.footer}
            </p>
          </div>
        </div>

        {/* Divider untuk layar besar */}
        <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-border to-transparent" />

        {/* Highlight 2 */}
        <div className="flex-1 flex items-center gap-5">
          <div className="p-4 rounded-full bg-purple-500/10 text-purple-500">
            <Clock className="w-10 h-10" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wider text-purple-500/80 uppercase">
              {stat6.title}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-5xl md:text-6xl font-black tracking-tighter text-foreground">
                {stat6.value}
              </span>
              <span className="text-lg font-bold text-muted-foreground">
                {stat6.unit}
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-2">
              {stat6.footer}
            </p>
          </div>
        </div>

      </div>

      {/* SENSOR KPI GRID (Sisa 4 Cards, disebar menjadi 4 Kolom) */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {mainCards.map((c, i) => (
          <Card
            key={i}
            className="group relative overflow-hidden bg-card hover:bg-accent/5 border-border/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
          >
            <div 
              className="absolute -top-24 -right-24 w-48 h-48 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-3xl rounded-full"
              style={{ backgroundColor: c.color }}
            />

            <CardHeader className="pb-0 pt-5 px-5">
              <CardTitle className="text-[13px] font-semibold text-foreground/80 line-clamp-1">
                {c.s.title}
              </CardTitle>
              <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                {c.s.description}
              </p>
            </CardHeader>

            <CardContent className="px-5 pb-5 pt-3 space-y-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black tracking-tight text-foreground">
                  {c.s.value}
                </span>
                {c.s.unit && (
                  <span className="text-xs font-semibold text-muted-foreground">
                    {c.s.unit}
                  </span>
                )}
              </div>

              <div className="h-16 w-full -mx-1">
                <ResponsiveContainer width="100%" height="100%">
                  {c.type === "area" ? (
                    <AreaChart data={c.data}>
                      <defs>
                        <linearGradient id={`colorGradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={c.color} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={c.color} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: c.color, strokeWidth: 1, strokeDasharray: "4 4" }} />
                      <Area
                        type="monotone"
                        dataKey="y"
                        stroke={c.color}
                        strokeWidth={2.5}
                        fill={`url(#colorGradient-${i})`}
                      />
                    </AreaChart>
                  ) : (
                    <LineChart data={c.data}>
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: c.color, strokeWidth: 1, strokeDasharray: "4 4" }} />
                      <Line
                        type="monotone"
                        dataKey="y"
                        stroke={c.color}
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0, fill: c.color }}
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* BOTTOM SECTION (Tren Suhu & Korelasi) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* BIG TREND */}
        <Card className="lg:col-span-2 shadow-sm border-border/40 hover:shadow-lg transition-shadow duration-500">
          <CardHeader className="px-6 pt-6 pb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-emerald-500/10">
                <Activity className="w-4 h-4 text-emerald-500" />
              </div>
              <CardTitle className="text-base font-bold">{stat7.title}</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black text-foreground">{stat7.value}</span>
              <span className="text-sm font-bold text-muted-foreground">{stat7.unit}</span>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={buildTrend(Number(stat7.value))} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBigTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#10b981", strokeWidth: 1, strokeDasharray: "4 4" }} />
                  <Area
                    type="monotone"
                    dataKey="y"
                    stroke="#10b981"
                    strokeWidth={3}
                    fill="url(#colorBigTrend)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* RADIAL INSIGHT */}
        <Card className="shadow-sm border-border/40 hover:shadow-lg transition-shadow duration-500 flex flex-col">
          <CardHeader className="px-6 pt-6 pb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-purple-500/10">
                <Info className="w-4 h-4 text-purple-500" />
              </div>
              <CardTitle className="text-base font-bold">{stat8.title}</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col items-center justify-center flex-1 p-6">
            <div className="w-full h-[220px] relative flex items-center justify-center">
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                <span className="text-4xl font-black text-foreground">{stat8.value}</span>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-1">Index</span>
              </div>
              
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="75%"
                  outerRadius="100%"
                  barSize={18}
                  data={[
                    {
                      name: "value",
                      value: Number(stat8.value) * 100,
                      fill: "#a855f7",
                    },
                  ]}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar 
                    dataKey="value" 
                    background={{ fill: 'var(--muted)', opacity: 0.5 }} 
                    cornerRadius={10} 
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-muted/40 border border-border/50 w-full">
              <p className="text-xs font-medium text-muted-foreground text-center leading-relaxed">
                {stat8.footer}
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </main>
  );
}