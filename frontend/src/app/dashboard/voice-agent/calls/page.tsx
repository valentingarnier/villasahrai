"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Heading } from "@/components/heading";
import { Badge } from "@/components/badge";
import { Input } from "@/components/input";
import { Select } from "@/components/select";
import { mockCalls, type Call } from "@/lib/mock-data";
import {
  CalendarDaysIcon,
} from "@heroicons/react/20/solid";

const outcomeBadgeColor: Record<Call["outcome"], "green" | "blue" | "zinc" | "amber" | "red"> = {
  reservation_made: "green",
  transferred_to_human: "blue",
  information_provided: "zinc",
  callback_scheduled: "amber",
  abandoned: "red",
};

const outcomeLabel: Record<Call["outcome"], string> = {
  reservation_made: "Réservation effectuée",
  transferred_to_human: "Transféré",
  information_provided: "Info fournie",
  callback_scheduled: "Rappel programmé",
  abandoned: "Abandonné",
};

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function isWithinDays(dateStr: string, days: number): boolean {
  const date = new Date(dateStr);
  const now = new Date("2026-02-27T14:00:00Z");
  const diff = now.getTime() - date.getTime();
  return diff <= days * 24 * 60 * 60 * 1000;
}

export default function VoiceAgentCallsPage() {
  const [expandedCallId, setExpandedCallId] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [outcomeFilter, setOutcomeFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredCalls = useMemo(() => {
    return mockCalls.filter((call) => {
      if (dateFilter === "today" && !isWithinDays(call.startTime, 1)) return false;
      if (dateFilter === "7days" && !isWithinDays(call.startTime, 7)) return false;
      if (dateFilter === "30days" && !isWithinDays(call.startTime, 30)) return false;

      if (outcomeFilter !== "all" && call.outcome !== outcomeFilter) return false;

      if (search) {
        const q = search.toLowerCase();
        if (!call.callerPhone.toLowerCase().includes(q)) return false;
      }

      return true;
    });
  }, [dateFilter, outcomeFilter, search]);

  function toggleExpand(callId: string) {
    setExpandedCallId((prev) => (prev === callId ? null : callId));
  }

  return (
    <div>
      {/* Header */}
      <Heading>Historique d&apos;appels</Heading>

      {/* Sub-navigation */}
      <nav className="mt-4 flex gap-1 border-b border-zinc-200 mb-8">
        <Link
          href="/dashboard/voice-agent"
          className="pb-2 px-3 text-sm font-medium text-zinc-500 hover:text-zinc-700"
        >
          Tableau de bord
        </Link>
        <Link
          href="/dashboard/voice-agent/calls"
          className="pb-2 px-3 text-sm font-medium border-b-2 border-sahrai-900 text-sahrai-900"
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

      {/* Filter Row */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <Select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
          <option value="all">Tout</option>
          <option value="today">Aujourd&apos;hui</option>
          <option value="7days">7 derniers jours</option>
          <option value="30days">30 derniers jours</option>
        </Select>
        <Select value={outcomeFilter} onChange={(e) => setOutcomeFilter(e.target.value)}>
          <option value="all">Tous les résultats</option>
          <option value="reservation_made">Réservation effectuée</option>
          <option value="transferred_to_human">Transféré</option>
          <option value="information_provided">Information fournie</option>
        </Select>
        <Input
          type="search"
          placeholder="Rechercher par téléphone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Call List */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_1.5fr_0.6fr_1fr] gap-3 px-4 py-3 bg-zinc-50 border-b border-zinc-200 text-xs font-medium text-zinc-500 uppercase tracking-wider">
          <span>Date / Heure</span>
          <span>Appelant</span>
          <span>Durée</span>
          <span>Résultat</span>
        </div>

        {filteredCalls.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-zinc-500">
            Aucun appel ne correspond aux filtres sélectionnés.
          </div>
        )}

        {filteredCalls.map((call) => (
          <div key={call.id}>
            {/* Call Row */}
            <button
              type="button"
              onClick={() => toggleExpand(call.id)}
              className="w-full grid grid-cols-2 lg:grid-cols-[1fr_1.5fr_0.6fr_1fr] gap-3 px-4 py-3 border-b border-zinc-100 hover:bg-zinc-50 transition-colors text-left items-center"
            >
              <span className="text-sm text-zinc-600">{formatDateTime(call.startTime)}</span>
              <span className="text-sm font-medium text-zinc-900">
                {call.callerPhone}
              </span>
              <span className="text-sm text-zinc-600 hidden lg:block">
                {formatDuration(call.duration)}
              </span>
              <span className="hidden lg:block">
                {call.outcome === "reservation_made" && (
                  <Badge color="green">Réservation effectuée</Badge>
                )}
              </span>
            </button>

            {/* Expanded Transcript */}
            {expandedCallId === call.id && (
              <div className="px-4 py-4 bg-zinc-50 border-b border-zinc-200">
                {/* Mobile-only metadata */}
                <div className="flex flex-wrap gap-2 mb-4 lg:hidden">
                  {call.outcome === "reservation_made" && (
                    <Badge color="green">Réservation effectuée</Badge>
                  )}
                  <span className="text-xs text-zinc-500">{formatDuration(call.duration)}</span>
                </div>

                {/* Reservation Details */}
                {call.reservationDetails && (
                  <div className="mb-4 rounded-lg border border-sahrai-200 bg-sahrai-50 p-3">
                    <p className="text-sm font-medium text-sahrai-800 mb-1">
                      Réservation {call.reservationType === "restaurant" ? "restaurant" : "spa"}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-sahrai-700">
                      <span>
                        <CalendarDaysIcon className="inline size-3.5 mr-1" />
                        {call.reservationDetails.date} à {call.reservationDetails.time}
                      </span>
                      {call.reservationDetails.partySize && (
                        <span>{call.reservationDetails.partySize} personnes</span>
                      )}
                      {call.reservationDetails.service && (
                        <span>{call.reservationDetails.service}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Transcript */}
                {call.transcript.length === 0 ? (
                  <p className="text-sm text-zinc-400 italic">Transcription non disponible</p>
                ) : (
                  <div className="space-y-3 max-w-2xl">
                    {call.transcript.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.speaker === "caller" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-xl px-4 py-2.5 ${
                            msg.speaker === "agent"
                              ? "bg-zinc-100 text-zinc-800"
                              : "bg-sahrai-50 text-zinc-800"
                          }`}
                        >
                          <p className="text-xs font-medium text-zinc-500 mb-0.5">
                            {msg.speaker === "agent" ? "Agent" : "Appelant"}{" "}
                            <span className="text-zinc-400">{formatTimestamp(msg.timestamp)}</span>
                          </p>
                          <p className="text-sm">{msg.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
