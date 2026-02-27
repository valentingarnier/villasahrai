"use client";

import { useState } from "react";
import clsx from "clsx";
import { Heading } from "@/components/heading";
import { Text } from "@/components/text";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Badge } from "@/components/badge";
import {
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  UserIcon,
  PhoneIcon,
} from "@heroicons/react/20/solid";

export default function SmartCollectorPage() {
  const [activeTab, setActiveTab] = useState<"csv" | "single">("csv");
  const [channel, setChannel] = useState<"whatsapp" | "email">("whatsapp");
  const [csvSelected, setCsvSelected] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestLanguage, setGuestLanguage] = useState("fr");

  const handleSend = () => {
    if (activeTab === "csv" && csvSelected) {
      setCsvSelected(false);
    } else if (activeTab === "single" && guestName.trim()) {
      setGuestName("");
      setGuestPhone("");
    }
  };

  const tabs = [
    { key: "csv" as const, label: "Import CSV", icon: ArrowUpTrayIcon },
    { key: "single" as const, label: "Client unique", icon: UserIcon },
  ];

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950">
          <PhoneIcon className="size-5 text-amber-600" />
        </div>
        <div>
          <Heading>Demande d&apos;avis</Heading>
          <Text>Envoyez des demandes d&apos;avis individuellement ou en masse</Text>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-1">
        {tabs.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={clsx(
                "flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200",
              )}
            >
              <tab.icon className={clsx("size-4", active ? "text-amber-600" : "text-zinc-400")} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Channel toggle */}
      <div className="mt-5 flex gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 p-1.5">
        <button
          onClick={() => setChannel("whatsapp")}
          className={clsx(
            "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
            channel === "whatsapp"
              ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 ring-1 ring-green-200 dark:ring-green-800"
              : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800",
          )}
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </button>
        <button
          onClick={() => setChannel("email")}
          className={clsx(
            "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
            channel === "email"
              ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-800"
              : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800",
          )}
        >
          <svg className="size-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.161V6a2 2 0 00-2-2H3z" />
            <path d="M19 8.839l-7.616 3.808a2.75 2.75 0 01-2.768 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
          </svg>
          Email
        </button>
      </div>

      {/* Tab content */}
      <div className="mt-5">
        {activeTab === "csv" && (
          <div>
            <div
              onClick={() => setCsvSelected(!csvSelected)}
              className={clsx(
                "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors",
                csvSelected
                  ? "border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-950/50"
                  : "border-zinc-300 dark:border-zinc-600 hover:border-amber-400 hover:bg-amber-50/30 dark:hover:bg-amber-950/30",
              )}
            >
              <ArrowUpTrayIcon className={clsx("mb-3 size-10", csvSelected ? "text-green-500" : "text-zinc-400")} />
              <p className="text-center text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {csvSelected
                  ? "guests_export.csv sélectionné (24 contacts)"
                  : "Glissez votre fichier ici"}
              </p>
              <p className="mt-1 text-center text-xs text-zinc-500 dark:text-zinc-400">
                ou cliquez pour parcourir
              </p>
              <div className="mt-4 flex gap-2">
                <Badge>CSV &amp; Excel</Badge>
                <Badge>Taille max : 5 Mo</Badge>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Format : <span className="text-amber-600">nom;telephone;langue</span>
                </p>
                <p className="mt-0.5 text-xs italic text-zinc-500 dark:text-zinc-400">
                  Exemple : John Smith;+1234567890;en
                </p>
              </div>
              <Button outline>
                <ArrowDownTrayIcon />
                Télécharger un CSV exemple
              </Button>
            </div>
          </div>
        )}

        {activeTab === "single" && (
          <div className="space-y-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 shadow-sm">
            <div>
              <label htmlFor="guest-name" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Nom du client
              </label>
              <Input
                id="guest-name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Ex : John Smith"
              />
            </div>
            <div>
              <label htmlFor="guest-phone" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {channel === "whatsapp" ? "Téléphone" : "Email"}
              </label>
              <Input
                id="guest-phone"
                type={channel === "whatsapp" ? "tel" : "email"}
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder={channel === "whatsapp" ? "+212 6XX XXX XXX" : "client@email.com"}
              />
            </div>
            <div>
              <label htmlFor="guest-lang" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Langue
              </label>
              <select
                id="guest-lang"
                value={guestLanguage}
                onChange={(e) => setGuestLanguage(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="ar">عربي</option>
              </select>
            </div>
          </div>
        )}

      </div>

      {/* Send button */}
      <div className="mt-5">
        <Button
          color="amber"
          className="w-full"
          onClick={handleSend}
          disabled={
            (activeTab === "csv" && !csvSelected) ||
            (activeTab === "single" && !guestName.trim())
          }
        >
          Envoyer les demandes
        </Button>
      </div>
    </div>
  );
}
