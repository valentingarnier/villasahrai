"use client";

import { useState } from "react";
import Link from "next/link";
import { Heading } from "@/components/heading";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Textarea } from "@/components/textarea";
import { mockVoiceAgentConfig } from "@/lib/mock-data";
import {
  SparklesIcon,
  BuildingStorefrontIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/20/solid";

export default function VoiceAgentConfigPage() {
  const [config, setConfig] = useState(mockVoiceAgentConfig);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaving(true);
    setSaved(false);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  }

  return (
    <div>
      {/* Header */}
      <Heading>Configuration de l&apos;agent</Heading>

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
          className="pb-2 px-3 text-sm font-medium text-zinc-500 hover:text-zinc-700"
        >
          Historique d&apos;appels
        </Link>
        <Link
          href="/dashboard/voice-agent/config"
          className="pb-2 px-3 text-sm font-medium border-b-2 border-sahrai-900 text-sahrai-900"
        >
          Configuration
        </Link>
      </nav>

      <div className="space-y-6 max-w-3xl">
        {/* Agent Identity */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-zinc-950 mb-4">Identité de l&apos;agent</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Nom de l&apos;agent
              </label>
              <Input
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Numéro de téléphone
              </label>
              <Input
                type="tel"
                value={config.phoneNumber}
                onChange={(e) => setConfig({ ...config, phoneNumber: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Langues</label>
              <div className="flex gap-4">
                {[
                  { code: "fr", label: "Français" },
                  { code: "en", label: "English" },
                ].map(({ code, label }) => (
                  <label key={code} className="flex items-center gap-2 text-sm text-zinc-700">
                    <input
                      type="checkbox"
                      checked={config.languages.includes(code)}
                      onChange={(e) => {
                        const languages = e.target.checked
                          ? [...config.languages, code]
                          : config.languages.filter((l) => l !== code);
                        setConfig({ ...config, languages });
                      }}
                      className="size-4 rounded border-zinc-300 text-sahrai-900 focus:ring-sahrai-500"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Message d&apos;accueil
              </label>
              <Textarea
                rows={3}
                value={config.greeting}
                onChange={(e) => setConfig({ ...config, greeting: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Message de repli
              </label>
              <Textarea
                rows={2}
                value={config.fallbackMessage}
                onChange={(e) => setConfig({ ...config, fallbackMessage: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Knowledge Base */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-zinc-950 mb-4">Base de connaissances</h3>
          <div className="space-y-3">
            {[
              {
                key: "restaurantMenu" as const,
                label: "Menu du restaurant",
                icon: <BuildingStorefrontIcon className="size-5 text-sahrai-900" />,
              },
              {
                key: "spaServices" as const,
                label: "Services spa",
                icon: <SparklesIcon className="size-5 text-emerald-600" />,
              },
            ].map(({ key, label, icon }) => (
              <div
                key={key}
                className="flex items-center justify-between rounded-lg border border-zinc-100 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  {icon}
                  <span className="text-sm font-medium text-zinc-900">{label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge color={config.knowledgeBase[key] ? "green" : "zinc"}>
                    {config.knowledgeBase[key] ? "Activé" : "Désactivé"}
                  </Badge>
                  <button
                    type="button"
                    onClick={() =>
                      setConfig({
                        ...config,
                        knowledgeBase: {
                          ...config.knowledgeBase,
                          [key]: !config.knowledgeBase[key],
                        },
                      })
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      config.knowledgeBase[key] ? "bg-sahrai-900" : "bg-zinc-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        config.knowledgeBase[key] ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Eat Now Integration */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-zinc-950 mb-4">Intégration Eat Now</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-zinc-600">Statut :</span>
              <Badge color="green">Connecté</Badge>
            </div>
            <div>
              <span className="text-sm text-zinc-600">API endpoint :</span>
              <p className="mt-1 font-mono text-xs text-zinc-500 bg-zinc-50 rounded-lg px-3 py-2">
                {config.eatNowIntegration.apiEndpoint}
              </p>
            </div>
            <div>
              <span className="text-sm text-zinc-500">
                Dernière synchronisation :{" "}
                {new Date(config.eatNowIntegration.lastSync).toLocaleString("fr-FR")}
              </span>
            </div>
            <div className="flex gap-3 pt-2">
              <Button outline>
                <ArrowPathIcon className="size-4" />
                Tester la connexion
              </Button>
              <Button plain className="!text-red-600">
                Déconnecter
              </Button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-3">
          <Button
            color="sahrai"
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto"
          >
            {saving ? "Sauvegarde en cours..." : "Sauvegarder la configuration"}
          </Button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
              <CheckCircleIcon className="size-4" />
              Configuration sauvegardée
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
