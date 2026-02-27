"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Heading } from "@/components/heading";
import { Text } from "@/components/text";
import { StarRating } from "@/components/star-rating";
import { StatusDot } from "@/components/status-dot";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChevronRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/20/solid";
import { mockOverviewData, mockVoiceAgentStatus } from "@/lib/mock-data";
import { mockReviews } from "@/lib/mock-data/reviews";

// --- SVG helpers ---

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

// --- Interactive Sparkline ---

function Sparkline({
  data,
  labels,
}: {
  data: { month: string; count: number }[];
  labels: string[];
}) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const values = data.map((d) => d.count);
  const max = Math.max(...values);
  const min = Math.min(...values) * 0.85;
  const W = 300;
  const H = 60;
  const pts = toPoints(values, 0, 0, W, H, min, max);

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const idx = Math.round(
      ((e.clientX - rect.left) / rect.width) * (data.length - 1),
    );
    setHoverIdx(Math.max(0, Math.min(idx, data.length - 1)));
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H + 16}`}
      className="w-full cursor-crosshair"
      preserveAspectRatio="xMidYMid meet"
      onMouseMove={handleMove}
      onMouseLeave={() => setHoverIdx(null)}
    >
      <defs>
        <linearGradient id="spark-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6345ED" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#6345ED" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath(pts, H)} fill="url(#spark-g)" />
      <path
        d={smoothPath(pts)}
        fill="none"
        stroke="#6345ED"
        strokeWidth="2"
      />
      {hoverIdx !== null && (
        <>
          <line
            x1={pts[hoverIdx][0]}
            y1={0}
            x2={pts[hoverIdx][0]}
            y2={H}
            stroke="#6345ED"
            strokeWidth="1"
            strokeDasharray="3 2"
            opacity="0.4"
          />
          <circle
            cx={pts[hoverIdx][0]}
            cy={pts[hoverIdx][1]}
            r="3.5"
            fill="white"
            stroke="#6345ED"
            strokeWidth="2"
          />
          <rect
            x={pts[hoverIdx][0] - 16}
            y={Math.max(0, pts[hoverIdx][1] - 20)}
            width="32"
            height="15"
            rx="4"
            fill="#6345ED"
          />
          <text
            x={pts[hoverIdx][0]}
            y={Math.max(11, pts[hoverIdx][1] - 9)}
            textAnchor="middle"
            fill="white"
            fontSize="9"
            fontWeight="600"
          >
            {values[hoverIdx]}
          </text>
        </>
      )}
      {labels.map((label, i) => {
        const idx = Math.round(
          (i / (labels.length - 1)) * (data.length - 1),
        );
        return (
          <text
            key={i}
            x={pts[idx]?.[0] ?? 0}
            y={H + 12}
            textAnchor="middle"
            className="fill-zinc-400"
            fontSize="9"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

// --- Interactive Line Chart ---

function LineChart({
  data,
  labels,
  gradientId,
  color = "#6345ED",
  yMax = 100,
  yLabels = ["0", "25", "50", "75", "100"],
}: {
  data: number[];
  labels: string[];
  gradientId: string;
  color?: string;
  yMax?: number;
  yLabels?: string[];
}) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const pL = 28;
  const pR = 10;
  const pT = 10;
  const pB = 24;
  const W = 500;
  const H = 200;
  const cW = W - pL - pR;
  const cH = H - pT - pB;
  const pts = toPoints(data, pL, pT, cW, cH, 0, yMax);
  const gridYs = yLabels.map(
    (_, i) => pT + cH - (i / (yLabels.length - 1)) * cH,
  );

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
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.12" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
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
      <path d={areaPath(pts, pT + cH)} fill={`url(#${gradientId})`} />
      <path
        d={smoothPath(pts)}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
      />
      {labels.map((label, i) => {
        const idx = Math.round(
          (i / (labels.length - 1)) * (data.length - 1),
        );
        return (
          <text
            key={i}
            x={pts[idx]?.[0] ?? 0}
            y={H - 5}
            textAnchor="middle"
            className="fill-zinc-400"
            fontSize="10"
          >
            {label}
          </text>
        );
      })}
      {hoverIdx !== null && pts[hoverIdx] && (
        <>
          <line
            x1={pts[hoverIdx][0]}
            y1={pT}
            x2={pts[hoverIdx][0]}
            y2={pT + cH}
            stroke={color}
            strokeWidth="1"
            strokeDasharray="3 2"
            opacity="0.35"
          />
          <circle
            cx={pts[hoverIdx][0]}
            cy={pts[hoverIdx][1]}
            r="4"
            fill="white"
            stroke={color}
            strokeWidth="2"
          />
          <rect
            x={pts[hoverIdx][0] - 18}
            y={Math.max(0, pts[hoverIdx][1] - 22)}
            width="36"
            height="17"
            rx="4"
            fill={color}
          />
          <text
            x={pts[hoverIdx][0]}
            y={Math.max(12, pts[hoverIdx][1] - 10)}
            textAnchor="middle"
            fill="white"
            fontSize="10"
            fontWeight="600"
          >
            {data[hoverIdx]}
          </text>
        </>
      )}
    </svg>
  );
}

// --- Reusable pieces ---

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

function FilterSelect({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        className="appearance-none rounded-lg border border-zinc-200 bg-white py-1.5 pl-3 pr-8 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        aria-label={label}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <svg
          className="size-3.5 text-zinc-400"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    </div>
  );
}

function InfoIcon() {
  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-400">
      <svg className="size-3" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  );
}

// --- Page ---

function getTodayFrench(): string {
  return new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTimeFrench(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DashboardPage() {
  const [sentimentTab, setSentimentTab] = useState<
    "overall" | "positive" | "negative"
  >("overall");
  const today = getTodayFrench();
  const todayDisplay = today.charAt(0).toUpperCase() + today.slice(1);
  const o = mockOverviewData;

  const sentimentData = o.sentimentByMonth.map((d) => d[sentimentTab]);
  const sentimentLabels = o.sentimentByMonth.map((d) => d.month);
  const sentimentColor =
    sentimentTab === "positive"
      ? "#16a34a"
      : sentimentTab === "negative"
        ? "#dc2626"
        : "#6345ED";
  const responseData = o.responseRateByMonth.map((d) => d.rate);
  const responseLabels = o.responseRateByMonth.map((d) => d.month);

  return (
    <div className="flex flex-col">
      {/* Header + Filters */}
      <div>
        <div className="flex items-end justify-between">
          <div>
            <Heading>Bienvenue, Mathilde</Heading>
            <Text className="mt-0.5">{todayDisplay}</Text>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex size-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-400 transition-colors hover:bg-zinc-50 hover:text-zinc-600">
              <QuestionMarkCircleIcon className="size-4" />
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50">
              <ChatBubbleLeftRightIcon className="size-3.5" />
              Contact
            </button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <FilterSelect label="Source">
            <option value="">Toutes les sources</option>
            <option value="google">Google</option>
            <option value="booking">Booking.com</option>
            <option value="tripadvisor">TripAdvisor</option>
            <option value="expedia">Expedia</option>
          </FilterSelect>
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              defaultValue="2025-02-01"
              className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              aria-label="Date de d&eacute;but"
            />
            <span className="text-xs text-zinc-400">&ndash;</span>
            <input
              type="date"
              defaultValue="2026-02-27"
              className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              aria-label="Date de fin"
            />
          </div>
          <FilterSelect label="Type de voyageur">
            <option value="">Tous les types</option>
            <option value="couple">Couple</option>
            <option value="family">Famille</option>
            <option value="business">Business</option>
            <option value="solo">Solo</option>
            <option value="group">Groupe</option>
          </FilterSelect>
          <FilterSelect label="Pays">
            <option value="">Tous les pays</option>
            <option value="ma">Maroc</option>
            <option value="fr">France</option>
            <option value="uk">Royaume-Uni</option>
            <option value="us">&Eacute;tats-Unis</option>
            <option value="de">Allemagne</option>
            <option value="es">Espagne</option>
            <option value="it">Italie</option>
            <option value="ae">&Eacute;mirats arabes unis</option>
          </FilterSelect>
        </div>
      </div>

      {/* Dashboard grid — fills viewport */}
      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)_minmax(0,1fr)]">
        {/* R1 C1 — Reviews (compact) */}
        <Card className="flex flex-col">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-900">Reviews</p>
            <InfoIcon />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <StarRating rating={o.averageRating} size="sm" />
            <span className="text-base font-semibold text-zinc-900">
              {o.averageRating} / 5
            </span>
          </div>
          <div className="my-3 border-t border-zinc-100" />
          <div className="flex items-center gap-1 text-xs font-medium text-red-500">
            <ArrowTrendingDownIcon className="size-3.5" />
            {o.ratingTrend}% vs. p&eacute;riode pr&eacute;c.
          </div>
          <div className="mt-3">
            <Sparkline
              data={o.reviewsByMonth}
              labels={["F&eacute;v", "Juin", "Sep", "F&eacute;v"]}
            />
          </div>
          <div className="mt-3 flex gap-8">
            <div>
              <p className="text-xl font-bold text-zinc-900">
                {o.totalReviews}
              </p>
              <p className="text-xs text-zinc-500">Avis totaux</p>
            </div>
            <div>
              <p className="text-xl font-bold text-zinc-900">
                {o.responseRate}%
              </p>
              <p className="text-xs text-zinc-500">Taux de r&eacute;ponse</p>
            </div>
          </div>
          <div className="mt-auto flex flex-col">
            <div className="mb-2 border-t border-zinc-100" />
            <div className="space-y-1">
              {[...mockReviews]
                .sort(
                  (a, b) =>
                    new Date(b.reviewDate).getTime() -
                    new Date(a.reviewDate).getTime(),
                )
                .slice(0, 3)
                .map((r) => (
                  <Link
                    key={r.id}
                    href={`/dashboard/reviews/${r.id}`}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-zinc-50"
                  >
                    <span className="text-xs font-medium text-amber-500">
                      {r.normalizedRating.toFixed(1)}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-xs text-zinc-700">
                      {r.guestName}
                    </span>
                    <span className={clsx("text-[11px] font-medium", r.status === "responded" ? "text-green-600" : "text-zinc-400")}>
                      {r.status === "responded" ? "R\u00e9pondu" : "Non r\u00e9pondu"}
                    </span>
                  </Link>
                ))}
            </div>
            <Link
              href="/dashboard/reviews"
              className="mt-2 block shrink-0 text-center text-xs font-medium text-amber-600 hover:text-amber-700"
            >
              Voir tous les avis &rarr;
            </Link>
          </div>
        </Card>

        {/* R1 C2 — Sentiment Performance (wide) */}
        <Card className="flex flex-col">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-900">
              Sentiment Performance
            </p>
            <InfoIcon />
          </div>
          <div className="mt-3 flex gap-1">
            {(["overall", "positive", "negative"] as const).map((tab) => {
              const active = sentimentTab === tab;
              const activeStyle =
                tab === "positive"
                  ? "bg-green-50 text-green-700"
                  : tab === "negative"
                    ? "bg-red-50 text-red-700"
                    : "bg-zinc-100 text-zinc-900";
              return (
                <button
                  key={tab}
                  onClick={() => setSentimentTab(tab)}
                  className={clsx(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                    active ? activeStyle : "text-zinc-400 hover:text-zinc-600",
                  )}
                >
                  {tab === "overall"
                    ? "Overall"
                    : tab === "positive"
                      ? "Positive"
                      : "Negative"}
                </button>
              );
            })}
          </div>
          <div className="mt-auto min-h-0 pt-3">
            <LineChart
              data={sentimentData}
              labels={sentimentLabels}
              gradientId="sent-g"
              color={sentimentColor}
            />
          </div>
        </Card>

        {/* R1 C3 — AI Receptionist */}
        <Card className="flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50">
                <PhoneIcon className="size-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  AI Receptionist
                </p>
              </div>
            </div>
            <StatusDot
              status={mockVoiceAgentStatus.status}
              label={
                mockVoiceAgentStatus.status === "online"
                  ? "En ligne"
                  : "Hors ligne"
              }
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-amber-50 p-4">
              <p className="text-3xl font-bold text-zinc-900">
                {o.aiReceptionist.bookingsToday}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                R&eacute;servations aujourd&apos;hui
              </p>
            </div>
            <div className="rounded-xl bg-zinc-50 p-4">
              <p className="text-3xl font-bold text-zinc-900">
                {o.aiReceptionist.callsToday}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Appels aujourd&apos;hui
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/voice-agent"
            className="mt-4 block text-center text-xs font-medium text-amber-600 hover:text-amber-700"
          >
            Voir les d&eacute;tails &rarr;
          </Link>
        </Card>

        {/* R2 C1 — Trends */}
        <Card className="flex flex-col">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-zinc-900">Tendances</p>
            <span className="text-xs text-zinc-400">
              Meilleurs &amp; pires
            </span>
            <span className="ml-auto">
              <InfoIcon />
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {o.trends.map((t) => (
              <div
                key={t.name}
                className={clsx(
                  "flex cursor-pointer items-center gap-3 rounded-xl px-4 py-4 transition-all hover:ring-1 hover:ring-zinc-200",
                  t.direction === "up" ? "bg-green-50" : "bg-violet-50",
                )}
              >
                <div
                  className={clsx(
                    "flex size-9 shrink-0 items-center justify-center rounded-full",
                    t.direction === "up" ? "bg-green-100" : "bg-red-100",
                  )}
                >
                  {t.direction === "up" ? (
                    <ArrowTrendingUpIcon className="size-4 text-green-600" />
                  ) : (
                    <ArrowTrendingDownIcon className="size-4 text-red-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-zinc-500">{t.name}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-xl font-bold text-zinc-900">
                      {t.score}
                    </span>
                    <span className="text-sm text-zinc-400">/ 100</span>
                    <span
                      className={clsx(
                        "text-xs font-medium",
                        t.direction === "up"
                          ? "text-green-600"
                          : "text-red-500",
                      )}
                    >
                      {t.direction === "up" ? "↑ +" : "↓ "}
                      {t.trend}% vs. pr&eacute;c.
                    </span>
                  </div>
                </div>
                <ChevronRightIcon className="size-5 shrink-0 text-zinc-300" />
              </div>
            ))}
          </div>
        </Card>

        {/* R2 C2 — Response Rate (wide) */}
        <Card className="flex flex-col">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-900">
              Taux de r&eacute;ponse
            </p>
            <p className="text-xs text-zinc-500">
              Cette semaine :{" "}
              <span className="font-bold text-zinc-900">
                {o.currentWeekResponseRate}%
              </span>
            </p>
          </div>
          <div className="mt-auto min-h-0 pt-3">
            <LineChart
              data={responseData}
              labels={responseLabels}
              gradientId="resp-g"
            />
          </div>
        </Card>

        {/* R2 C3 — Last Messages */}
        <Card className="flex flex-col">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-900">
              Derniers messages
            </p>
            <Link
              href="/dashboard/outreach/conversations"
              className="text-xs font-medium text-amber-600 hover:text-amber-700"
            >
              Voir tout &rarr;
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {o.lastMessages.map((msg, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border border-zinc-100 bg-zinc-50/50 p-3.5"
              >
                <div
                  className={clsx(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
                    msg.channel === "whatsapp"
                      ? "bg-green-100"
                      : "bg-blue-100",
                  )}
                >
                  {msg.channel === "whatsapp" ? (
                    <svg
                      className="size-4 text-green-600"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  ) : (
                    <EnvelopeIcon className="size-4 text-blue-600" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-zinc-900">
                    {msg.contactName}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-zinc-500">
                    {msg.content}
                  </p>
                  <p className="mt-1.5 text-[11px] text-zinc-400">
                    {msg.campaign} &middot; {formatTimeFrench(msg.sentAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
