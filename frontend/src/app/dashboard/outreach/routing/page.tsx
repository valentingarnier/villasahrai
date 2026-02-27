"use client";

import { useState } from "react";
import clsx from "clsx";
import { Heading } from "@/components/heading";
import { Text } from "@/components/text";
import { Button } from "@/components/button";
import { Badge } from "@/components/badge";
import { Input } from "@/components/input";
import { Dialog, DialogTitle, DialogBody, DialogActions } from "@/components/dialog";
import {
  ArrowsRightLeftIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import { mockRoutingRules } from "@/lib/mock-data";
import type { RoutingRule } from "@/lib/mock-data";

export default function RoutingPage() {
  const [rules, setRules] = useState<RoutingRule[]>(mockRoutingRules);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCondition, setNewCondition] = useState("");
  const [newAction, setNewAction] = useState("");

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
    );
  };

  const addRule = () => {
    if (!newName.trim() || !newCondition.trim() || !newAction.trim()) return;
    setRules((prev) => [
      ...prev,
      {
        id: `route-${Date.now()}`,
        name: newName,
        condition: newCondition,
        action: newAction,
        enabled: true,
      },
    ]);
    setNewName("");
    setNewCondition("");
    setNewAction("");
    setShowAddDialog(false);
  };

  const deleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <Heading>Routage des avis</Heading>
          <Text className="mt-1">
            Définissez où rediriger vos clients en fonction de leur note
          </Text>
        </div>
        <Button color="amber" onClick={() => setShowAddDialog(true)}>
          <PlusIcon />
          Ajouter une règle
        </Button>
      </div>

      {/* Rules list */}
      <div className="mt-6 space-y-3">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={clsx(
              "rounded-xl border bg-white dark:bg-zinc-900 p-5 shadow-sm transition-colors",
              rule.enabled ? "border-zinc-200 dark:border-zinc-700" : "border-zinc-100 dark:border-zinc-800 opacity-60",
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={clsx(
                    "flex size-9 items-center justify-center rounded-lg",
                    rule.enabled ? "bg-amber-50 dark:bg-amber-950" : "bg-zinc-100 dark:bg-zinc-800",
                  )}
                >
                  <ArrowsRightLeftIcon
                    className={clsx(
                      "size-4",
                      rule.enabled ? "text-amber-600" : "text-zinc-400",
                    )}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">{rule.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge>Si {rule.condition}</Badge>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">→</span>
                    <Badge color="amber">{rule.action}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={clsx(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    rule.enabled ? "bg-amber-500" : "bg-zinc-200 dark:bg-zinc-600",
                  )}
                >
                  <span
                    className={clsx(
                      "inline-block size-4 rounded-full bg-white shadow-sm transition-transform",
                      rule.enabled ? "translate-x-6" : "translate-x-1",
                    )}
                  />
                </button>
                <button
                  onClick={() => deleteRule(rule.id)}
                  className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}

        {rules.length === 0 && (
          <div className="py-12 text-center">
            <ArrowsRightLeftIcon className="mx-auto mb-3 size-10 text-zinc-300 dark:text-zinc-600" />
            <Text>Aucune règle de routage configurée</Text>
            <Button className="mt-3" color="amber" onClick={() => setShowAddDialog(true)}>
              <PlusIcon />
              Ajouter une règle
            </Button>
          </div>
        )}
      </div>

      {/* Add rule dialog */}
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)}>
        <DialogTitle>Nouvelle règle de routage</DialogTitle>
        <DialogBody>
          <div className="space-y-4">
            <div>
              <label htmlFor="rule-name" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Nom de la règle
              </label>
              <Input
                id="rule-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex : Avis positifs vers Google"
              />
            </div>
            <div>
              <label htmlFor="rule-condition" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Condition
              </label>
              <Input
                id="rule-condition"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="Ex : note >= 4"
              />
            </div>
            <div>
              <label htmlFor="rule-action" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Action
              </label>
              <Input
                id="rule-action"
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                placeholder="Ex : Rediriger vers Google Reviews"
              />
            </div>
          </div>
        </DialogBody>
        <DialogActions>
          <Button outline onClick={() => setShowAddDialog(false)}>
            Annuler
          </Button>
          <Button color="amber" onClick={addRule}>
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
