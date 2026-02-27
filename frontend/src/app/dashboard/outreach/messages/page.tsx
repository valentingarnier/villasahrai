"use client";

import { useState } from "react";
import clsx from "clsx";
import { Heading } from "@/components/heading";
import { Text } from "@/components/text";
import { Button } from "@/components/button";
import { Badge } from "@/components/badge";
import { Textarea } from "@/components/textarea";
import { PlusIcon, PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { mockReviewMessageTemplates } from "@/lib/mock-data";
import type { ReviewMessageTemplate } from "@/lib/mock-data";

const languages = [
  { code: "fr" as const, label: "FR", flag: "🇫🇷" },
  { code: "en" as const, label: "EN", flag: "🇬🇧" },
  { code: "ar" as const, label: "AR", flag: "🇲🇦" },
];

export default function MessagesPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<"fr" | "en" | "ar">("fr");
  const [templates, setTemplates] = useState<ReviewMessageTemplate[]>(mockReviewMessageTemplates);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");

  const currentTemplate = templates.find((t) => t.language === selectedLanguage);
  const currentMessages = currentTemplate?.messages ?? [];

  const startEdit = (messageId: string, body: string) => {
    setEditingMessageId(messageId);
    setEditBody(body);
  };

  const saveEdit = () => {
    if (!editingMessageId) return;
    setTemplates((prev) =>
      prev.map((t) =>
        t.language === selectedLanguage
          ? {
              ...t,
              messages: t.messages.map((m) =>
                m.id === editingMessageId ? { ...m, body: editBody } : m,
              ),
              updatedAt: new Date().toISOString(),
            }
          : t,
      ),
    );
    setEditingMessageId(null);
    setEditBody("");
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditBody("");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      {/* Left — Editor */}
      <div>
        <Heading>Modèles de messages</Heading>
        <Text className="mt-1">
          Personnalisez les messages envoyés à vos clients
        </Text>

        {/* Language selector */}
        <div className="mt-5 flex items-center gap-2">
          {languages.map((lang) => {
            const active = selectedLanguage === lang.code;
            return active ? (
              <Button key={lang.code} color="amber" onClick={() => setSelectedLanguage(lang.code)}>
                {lang.flag} {lang.label}
              </Button>
            ) : (
              <Button key={lang.code} outline onClick={() => setSelectedLanguage(lang.code)}>
                {lang.flag} {lang.label}
              </Button>
            );
          })}
          <Button outline>
            <PlusIcon />
          </Button>
        </div>

        {/* Variables */}
        <div className="mt-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3">
          <div className="flex items-center gap-2">
            <svg className="size-4 text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
            </svg>
            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Variables disponibles</p>
          </div>
          <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
            Utilisez des variables pour personnaliser vos messages :
          </p>
          <div className="mt-2 flex items-center gap-2">
            <code className="rounded bg-white dark:bg-zinc-900 px-2 py-0.5 text-xs font-mono font-semibold text-amber-700 dark:text-amber-400 ring-1 ring-zinc-200 dark:ring-zinc-700">
              {"{{1}}"}
            </code>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Nom du client</span>
            <span className="ml-2 text-xs italic text-zinc-400 dark:text-zinc-500">ex : John</span>
          </div>
        </div>

        {/* Messages */}
        <div className="mt-6 space-y-4">
          {currentMessages.map((msg) => {
            const isEditing = editingMessageId === msg.id;
            return (
              <div key={msg.id} className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                      Message {msg.order}
                    </p>
                    {msg.delayDays > 0 && (
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">
                        J+{msg.delayDays}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge color={currentTemplate?.status === "approved" ? "green" : "zinc"}>
                      {currentTemplate?.status === "approved" ? "Approuvé" : "Brouillon"}
                    </Badge>
                    {!isEditing && (
                      <button
                        onClick={() => startEdit(msg.id, msg.body)}
                        className="rounded-md p-1 text-zinc-400 dark:text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-600 dark:hover:text-zinc-300"
                      >
                        <PencilIcon className="size-4" />
                      </button>
                    )}
                  </div>
                </div>
                {isEditing ? (
                  <div className="mt-3">
                    <Textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      rows={6}
                    />
                    <div className="mt-2 flex gap-2">
                      <Button color="amber" onClick={saveEdit}>
                        <CheckIcon />
                        Enregistrer
                      </Button>
                      <Button outline onClick={cancelEdit}>
                        <XMarkIcon />
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 px-4 py-3">
                    <p className="whitespace-pre-line text-sm text-zinc-700 dark:text-zinc-300">
                      {msg.body}
                    </p>
                  </div>
                )}
                {!isEditing && msg.body && (
                  <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
                    Variables utilisées : {msg.body.includes("{{1}}") ? "{{1}}" : "aucune"}
                  </p>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* Right — Phone preview */}
      <div className="hidden lg:block">
        <p className="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">Aperçu</p>
        <div className="sticky top-8">
          {/* Phone frame */}
          <div className="mx-auto w-[300px] overflow-hidden rounded-[2rem] border-[3px] border-zinc-800 bg-zinc-800 shadow-xl">
            {/* WhatsApp header */}
            <div className="flex items-center gap-2 bg-[#075e54] px-4 py-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">
                VS
              </div>
              <div>
                <p className="text-xs font-medium text-white">Villa Sahrai</p>
                <p className="text-[10px] text-white/60">en ligne</p>
              </div>
            </div>

            {/* Chat area */}
            <div className="min-h-[400px] space-y-2 bg-[#ece5dd] px-3 py-4">
              {currentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="ml-auto max-w-[85%] rounded-lg rounded-tr-sm bg-[#dcf8c6] px-3 py-2 shadow-sm"
                >
                  <p className="whitespace-pre-line text-[11px] leading-relaxed text-zinc-800">
                    {msg.body.replace(/\{\{1\}\}/g, "John") || "(message vide)"}
                  </p>
                  <p className="mt-1 text-right text-[9px] text-zinc-500">
                    {msg.order === 1 ? "09:40" : `J+${msg.delayDays} · 09:40`}
                  </p>
                </div>
              ))}
              {currentMessages.length === 0 && (
                <p className="py-8 text-center text-xs text-zinc-500">
                  Aucun message configuré
                </p>
              )}
            </div>

            {/* Input bar */}
            <div className="bg-[#f0f0f0] px-3 py-2">
              <div className="rounded-full bg-white px-4 py-2">
                <p className="text-[11px] text-zinc-400">Message...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
