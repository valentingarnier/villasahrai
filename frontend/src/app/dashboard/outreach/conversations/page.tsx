"use client";

import { useState } from "react";
import clsx from "clsx";
import { Heading } from "@/components/heading";
import { Text } from "@/components/text";
import { Badge } from "@/components/badge";
import { Input } from "@/components/input";
import { Avatar } from "@/components/avatar";
import { Dialog, DialogTitle, DialogBody } from "@/components/dialog";
import { Divider } from "@/components/divider";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { mockConversations } from "@/lib/mock-data";
import type { Conversation } from "@/lib/mock-data";

function statusBadge(status: Conversation["status"]) {
  const map = {
    sent: { label: "Envoyé", color: "zinc" as const },
    delivered: { label: "Délivré", color: "blue" as const },
    opened: { label: "Ouvert", color: "amber" as const },
    replied: { label: "Répondu", color: "green" as const },
    failed: { label: "Échoué", color: "red" as const },
  };
  const s = map[status];
  return <Badge color={s.color}>{s.label}</Badge>;
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ConversationsPage() {
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState<"all" | "whatsapp" | "email">("all");
  const [selected, setSelected] = useState<Conversation | null>(null);

  const filtered = mockConversations.filter((c) => {
    const name = `${c.contact.firstName} ${c.contact.lastName}`.toLowerCase();
    if (search && !name.includes(search.toLowerCase())) return false;
    if (channelFilter !== "all" && c.channel !== channelFilter) return false;
    return true;
  });

  return (
    <div>
      <Heading>Conversations</Heading>
      <Text className="mt-1">Suivez les échanges avec vos clients</Text>

      {/* Filters */}
      <div className="mt-5 flex items-center gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          <Input
            type="search"
            placeholder="Rechercher un client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1 rounded-lg border border-zinc-200 dark:border-zinc-700 p-0.5">
          {(["all", "whatsapp", "email"] as const).map((f) => {
            const active = channelFilter === f;
            const labels = { all: "Tous", whatsapp: "WhatsApp", email: "Email" };
            return (
              <button
                key={f}
                onClick={() => setChannelFilter(f)}
                className={clsx(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  active ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200",
                )}
              >
                {labels[f]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversation list */}
      <div className="mt-5 space-y-2">
        {filtered.map((conv) => {
          const lastMsg = conv.messages[conv.messages.length - 1];
          return (
            <button
              key={conv.id}
              onClick={() => setSelected(conv)}
              className="flex w-full items-center gap-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 text-left shadow-sm transition-colors hover:border-zinc-200 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              <Avatar
                className="size-10 bg-amber-100 text-amber-800"
                initials={getInitials(conv.contact.firstName, conv.contact.lastName)}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">
                    {conv.contact.firstName} {conv.contact.lastName}
                  </p>
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                    {lastMsg && formatTime(lastMsg.timestamp)}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {lastMsg?.direction === "inbound" ? `${conv.contact.firstName} : ` : "Vous : "}
                  {lastMsg?.content}
                </p>
              </div>
              <div className="shrink-0">{statusBadge(conv.status)}</div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <Text>Aucune conversation trouvée</Text>
          </div>
        )}
      </div>

      {/* Detail dialog */}
      <Dialog open={selected !== null} onClose={() => setSelected(null)} size="lg">
        {selected && (
          <>
            <DialogTitle>
              <div className="flex items-center gap-3">
                <Avatar
                  className="size-8 bg-amber-100 text-amber-800"
                  initials={getInitials(selected.contact.firstName, selected.contact.lastName)}
                />
                <span>
                  {selected.contact.firstName} {selected.contact.lastName}
                </span>
                <Badge color={selected.channel === "whatsapp" ? "green" : "blue"}>
                  {selected.channel === "whatsapp" ? "WhatsApp" : "Email"}
                </Badge>
                {statusBadge(selected.status)}
              </div>
            </DialogTitle>
            <DialogBody>
              <div className="space-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                {selected.contact.phone && <p>Tél : {selected.contact.phone}</p>}
                {selected.contact.email && <p>Email : {selected.contact.email}</p>}
              </div>
              <Divider className="my-4" />
              <div className="space-y-3">
                {selected.messages.map((msg, i) => (
                  <div
                    key={i}
                    className={clsx(
                      "max-w-[80%] rounded-xl px-4 py-2.5",
                      msg.direction === "outbound"
                        ? "ml-auto bg-amber-50 dark:bg-amber-950 text-zinc-800 dark:text-zinc-100"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100",
                    )}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                ))}
              </div>
            </DialogBody>
          </>
        )}
      </Dialog>
    </div>
  );
}
