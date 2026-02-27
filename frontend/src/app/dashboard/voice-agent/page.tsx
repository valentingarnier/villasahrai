"use client";

import { useState } from "react";
import Link from "next/link";
import { Heading } from "@/components/heading";
import { Badge } from "@/components/badge";
import { StatCard } from "@/components/stat-card";
import { StatusDot } from "@/components/status-dot";
import {
  mockVoiceAgentAnalytics,
  mockVoiceAgentConfig,
  mockCalls,
  type Call,
} from "@/lib/mock-data";
import {
  PhoneIcon,
  CalendarDaysIcon,
} from "@heroicons/react/20/solid";

const intentBadgeColor: Record<Call["intent"], "amber" | "emerald" | "blue" | "red" | "zinc"> = {
  restaurant_reservation: "amber",
  spa_booking: "emerald",
  information: "blue",
  complaint: "red",
  other: "zinc",
};

const intentLabel: Record<Call["intent"], string> = {
  restaurant_reservation: "Restaurant",
  spa_booking: "Spa",
  information: "Information",
  complaint: "Réclamation",
  other: "Autre",
};

const outcomeBadgeColor: Record<Call["outcome"], "green" | "blue" | "zinc" | "amber" | "red"> = {
  reservation_made: "green",
  transferred_to_human: "blue",
  information_provided: "zinc",
  callback_scheduled: "amber",
  abandoned: "red",
};

const outcomeLabel: Record<Call["outcome"], string> = {
  reservation_made: "Réservation",
  transferred_to_human: "Transféré",
  information_provided: "Info fournie",
  callback_scheduled: "Rappel",
  abandoned: "Abandonné",
};

const sentimentColor: Record<Call["sentiment"], string> = {
  positive: "bg-green-500",
  neutral: "bg-amber-500",
  negative: "bg-red-500",
};

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
}

// --- SVG helpers for trend line ---

function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cpx = (pts[i][0] + pts[i + 1][0]) / 2;
    d += ` C ${cpx},${pts[i][1]} ${cpx},${pts[i + 1][1]} ${pts[i + 1][0]},${pts[i + 1][1]}`;
  }
  return d;
}

function areaPath(pts: [number, number][], baseY: number): string {
  return `${smoothPath(pts)} L ${pts[pts.length - 1][0]},${baseY} L ${pts[0][0]},${baseY} Z`;
}

function toPoints(
  data: number[],
  x0: number,
  y0: number,
  w: number,
  h: number,
  min: number,
  max: number,
): [number, number][] {
  const range = max - min || 1;
  return data.map((v, i) => [
    x0 + (i / (data.length - 1)) * w,
    y0 + h - ((v - min) / range) * h,
  ]);
}

function WeeklyTrendChart({ data }: { data: { day: string; count: number }[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const values = data.map((d) => d.count);
  const labels = data.map((d) => d.day);
  const max = Math.max(...values);
  const min = Math.min(...values) * 0.85;
  const pL = 28;
  const pR = 10;
  const pT = 10;
  const pB = 24;
  const W = 500;
  const H = 180;
  const cW = W - pL - pR;
  const cH = H - pT - pB;
  const pts = toPoints(values, pL, pT, cW, cH, min, max);

  const yMax = Math.ceil(max / 10) * 10;
  const yLabels = [0, Math.round(yMax * 0.25), Math.round(yMax * 0.5), Math.round(yMax * 0.75), yMax];
  const gridYs = yLabels.map((_, i) => pT + cH - (i / (yLabels.length - 1)) * cH);

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * W;
    const idx = Math.round(((svgX - pL) / cW) * (data.length - 1));
    setHoverIdx(Math.max(0, Math.min(idx, data.length - 1)));
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full cursor-crosshair"
      onMouseMove={handleMove}
      onMouseLeave={() => setHoverIdx(null)}
    >
      <defs>
        <linearGradient id="week-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6345ED" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#6345ED" stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {gridYs.map((y, i) => (
        <g key={i}>
          <line
            x1={pL}
            x2={W - pR}
            y1={y}
            y2={y}
            stroke="#e4e4e7"
            strokeWidth="0.75"
            strokeDasharray="4 3"
          />
          <text
            x={pL - 5}
            y={y + 3.5}
            textAnchor="end"
            className="fill-zinc-400"
            fontSize="10"
          >
            {yLabels[i]}
          </text>
        </g>
      ))}
      <path d={areaPath(pts, pT + cH)} fill="url(#week-g)" />
      <path d={smoothPath(pts)} fill="none" stroke="#6345ED" strokeWidth="1.5" />
      {labels.map((label, i) => (
        <text
          key={i}
          x={pts[i]?.[0] ?? 0}
          y={H - 5}
          textAnchor="middle"
          className="fill-zinc-400"
          fontSize="10"
        >
          {label}
        </text>
      ))}
      {hoverIdx !== null && pts[hoverIdx] && (
        <>
          <line
            x1={pts[hoverIdx][0]}
            y1={pT}
            x2={pts[hoverIdx][0]}
            y2={pT + cH}
            stroke="#6345ED"
            strokeWidth="1"
            strokeDasharray="3 2"
            opacity="0.35"
          />
          <circle
            cx={pts[hoverIdx][0]}
            cy={pts[hoverIdx][1]}
            r="4"
            fill="white"
            stroke="#6345ED"
            strokeWidth="2"
          />
          <rect
            x={pts[hoverIdx][0] - 18}
            y={Math.max(0, pts[hoverIdx][1] - 22)}
            width="36"
            height="17"
            rx="4"
            fill="#6345ED"
          />
          <text
            x={pts[hoverIdx][0]}
            y={Math.max(12, pts[hoverIdx][1] - 10)}
            textAnchor="middle"
            fill="white"
            fontSize="10"
            fontWeight="600"
          >
            {values[hoverIdx]}
          </text>
        </>
      )}
    </svg>
  );
}

export default function VoiceAgentDashboardPage() {
  const analytics = mockVoiceAgentAnalytics;
  const recentCalls = mockCalls
    .filter((c) => c.intent === "restaurant_reservation" || c.intent === "spa_booking")
    .slice(0, 5);

  const totalReservations = analytics.restaurantReservations + analytics.spaBookings;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3">
        <Heading>AI Receptionist</Heading>
        <StatusDot status="online" label="En ligne" />
        <span className="text-sm text-zinc-500">{mockVoiceAgentConfig.phoneNumber}</span>
      </div>

      {/* Sub-navigation */}
      <nav className="mt-4 flex gap-1 border-b border-zinc-200 mb-8">
        <Link
          href="/dashboard/voice-agent"
          className="pb-2 px-3 text-sm font-medium border-b-2 border-sahrai-900 text-sahrai-900"
        >
          Tableau de bord
        </Link>
        <Link
          href="/dashboard/voice-agent/calls"
          className="pb-2 px-3 text-sm font-medium text-zinc-500 hover:text-zinc-700"
        >
          Historique d&apos;appels
        </Link>
        <Link
          href="/dashboard/voice-agent/config"
          className="pb-2 px-3 text-sm font-medium text-zinc-500 hover:text-zinc-700"
        >
          Configuration
        </Link>
      </nav>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          title="Appels aujourd'hui"
          value={analytics.callsToday}
          icon={<PhoneIcon className="size-5" />}
          trend={{ value: 15, direction: "up" }}
        />
        <StatCard
          title="Réservations par téléphone"
          value={totalReservations}
          icon={<CalendarDaysIcon className="size-5" />}
          trend={{ value: 8, direction: "up" }}
        />
      </div>

      {/* Calls This Week — trend line */}
      <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-zinc-950 mb-4">Appels cette semaine</h3>
        <WeeklyTrendChart data={analytics.callsByDay} />
      </div>

      {/* Recent Calls */}
      <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-zinc-950">Appels récents</h3>
          <Link
            href="/dashboard/voice-agent/calls"
            className="text-sm font-medium text-sahrai-900 hover:text-sahrai-700"
          >
            Voir tout &rarr;
          </Link>
        </div>
        <div className="space-y-3">
          {recentCalls.map((call) => (
            <div
              key={call.id}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-zinc-100 px-4 py-3"
            >
              <span className="text-xs text-zinc-500 w-20">
                {formatDate(call.startTime)} {formatTime(call.startTime)}
              </span>
              <span className="text-sm font-medium text-zinc-900 min-w-[140px]">
                {call.callerPhone}
              </span>
              <span className="text-xs text-zinc-500 w-16">{formatDuration(call.duration)}</span>
              <Badge color={intentBadgeColor[call.intent]}>{intentLabel[call.intent]}</Badge>
              <Badge color={outcomeBadgeColor[call.outcome]}>{outcomeLabel[call.outcome]}</Badge>
              <span className="inline-flex items-center gap-1.5">
                <span className={`size-2 rounded-full ${sentimentColor[call.sentiment]}`} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
