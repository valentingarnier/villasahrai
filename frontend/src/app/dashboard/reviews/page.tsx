"use client";

import { useState, useMemo } from "react";
import clsx from "clsx";
import { Heading } from "@/components/heading";
import { Text } from "@/components/text";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Input, InputGroup } from "@/components/input";
import { Select } from "@/components/select";
import { Textarea } from "@/components/textarea";
import { SourceBadge } from "@/components/source-badge";
import { StarRating } from "@/components/star-rating";
import {
  MagnifyingGlassIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { mockReviews, type Review } from "@/lib/mock-data/reviews";

type SourceFilter = "booking" | "google" | "expedia" | "tripadvisor";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ReviewsPage() {
  const [sourcesFilter, setSourcesFilter] = useState<Set<SourceFilter>>(new Set());
  const [ratingFilter, setRatingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState("");
  const [generating, setGenerating] = useState(false);

  function toggleSource(source: SourceFilter) {
    setSourcesFilter((prev) => {
      const next = new Set(prev);
      if (next.has(source)) {
        next.delete(source);
      } else {
        next.add(source);
      }
      return next;
    });
  }

  const filteredReviews = useMemo(() => {
    let reviews = [...mockReviews];

    if (sourcesFilter.size > 0) {
      reviews = reviews.filter((r) => sourcesFilter.has(r.source));
    }
    if (ratingFilter !== "all") {
      const targetRating = parseInt(ratingFilter);
      reviews = reviews.filter((r) => Math.floor(r.normalizedRating) === targetRating);
    }
    if (statusFilter !== "all") {
      reviews = reviews.filter((r) => r.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      reviews = reviews.filter(
        (r) =>
          r.guestName.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.content.toLowerCase().includes(q)
      );
    }

    reviews.sort(
      (a, b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime()
    );
    return reviews;
  }, [sourcesFilter, ratingFilter, statusFilter, searchQuery]);

  // Stats
  const totalReviews = mockReviews.length;
  const respondedCount = mockReviews.filter((r) => r.status === "responded").length;

  function selectReview(review: Review) {
    setSelectedReview(review);
    if (review.status === "responded" && review.response) {
      setReplyText(review.response.content);
    } else if (review.aiDraftResponse) {
      setReplyText(review.aiDraftResponse);
    } else {
      setReplyText("");
    }
  }

  function handleGenerate() {
    if (!selectedReview) return;
    setGenerating(true);
    setTimeout(() => {
      setReplyText(
        selectedReview.aiDraftResponse ||
          "Merci pour votre retour. Nous prenons note de vos commentaires et nous efforçons d'améliorer continuellement nos services. Nous espérons avoir le plaisir de vous accueillir à nouveau à Villa Sahrai."
      );
      setGenerating(false);
    }, 1500);
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* Header */}
      <div className="shrink-0">
        <div className="flex items-center justify-between">
          <Heading>Review Inbox</Heading>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Total :</span>
              <span className="text-sm font-semibold text-zinc-900 dark:text-white">{totalReviews}</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950 px-3 py-1.5">
              <span className="text-sm text-green-600 dark:text-green-400">Répondus :</span>
              <span className="text-sm font-semibold text-green-700 dark:text-green-400">{respondedCount}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex items-center gap-3">
          <div className="w-64">
            <InputGroup>
              <MagnifyingGlassIcon data-slot="icon" />
              <Input
                type="search"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </div>

          <div className="hidden sm:block h-6 w-px bg-zinc-200 dark:bg-zinc-700" />

          {(["booking", "google", "expedia", "tripadvisor"] as SourceFilter[]).map((source) => (
            <button
              key={source}
              type="button"
              onClick={() => toggleSource(source)}
              className={clsx(
                "cursor-pointer transition-opacity",
                sourcesFilter.size === 0 || sourcesFilter.has(source)
                  ? "opacity-100"
                  : "opacity-40"
              )}
            >
              <SourceBadge source={source} />
            </button>
          ))}

          <div className="hidden sm:block h-6 w-px bg-zinc-200 dark:bg-zinc-700" />

          <Select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
            <option value="all">Toutes notes</option>
            <option value="5">5 étoiles</option>
            <option value="4">4 étoiles</option>
            <option value="3">3 étoiles</option>
            <option value="2">2 étoiles</option>
            <option value="1">1 étoile</option>
          </Select>

          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Tous statuts</option>
            <option value="new">Non répondu</option>
            <option value="responded">Répondu</option>
          </Select>
        </div>
      </div>

      {/* Main content: list + detail panel */}
      <div className="mt-4 flex min-h-0 flex-1 gap-4">
        {/* Review list */}
        <div
          className={clsx(
            "shrink-0 overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm",
            selectedReview ? "w-[420px]" : "w-full"
          )}
        >
          {filteredReviews.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm font-medium text-zinc-900 dark:text-white">Aucun avis trouvé</p>
              <Text className="mt-1">Modifiez vos filtres pour voir plus de résultats.</Text>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredReviews.map((review) => (
                <button
                  key={review.id}
                  type="button"
                  onClick={() => selectReview(review)}
                  className={clsx(
                    "w-full px-4 py-4 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800",
                    selectedReview?.id === review.id && "bg-amber-50/50 dark:bg-amber-900/20"
                  )}
                >
                  {/* Row 1: name, stars, date */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                      {review.guestName}
                    </span>
                    <StarRating rating={review.normalizedRating} size="sm" showValue />
                    <span className="ml-auto text-xs text-zinc-400 dark:text-zinc-500 whitespace-nowrap shrink-0">
                      {formatDate(review.reviewDate)}
                    </span>
                  </div>

                  {/* Row 2: content preview */}
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">
                    {review.content}
                  </p>

                  {/* Row 3: source + responded badge */}
                  <div className="mt-2 flex items-center gap-2">
                    <SourceBadge source={review.source} />
                    {review.status === "responded" && (
                      <Badge color="green">Répondu</Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selectedReview && (
          <div className="flex min-w-0 flex-1 flex-col overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm">
            {/* Panel header */}
            <div className="shrink-0 border-b border-zinc-100 dark:border-zinc-800 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SourceBadge source={selectedReview.source} />
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    Publié le {formatDate(selectedReview.reviewDate)}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="rounded-md p-1 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  <XMarkIcon className="size-5" />
                </button>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <p className="text-base font-semibold text-zinc-900 dark:text-white">
                  {selectedReview.guestName}
                </p>
                <StarRating rating={selectedReview.normalizedRating} size="sm" showValue />
                {selectedReview.status === "responded" && (
                  <Badge color="green">Répondu</Badge>
                )}
              </div>
            </div>

            {/* Review content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
                {selectedReview.content}
              </p>

              {/* Booking.com positives/negatives */}
              {selectedReview.source === "booking" &&
                (selectedReview.positives || selectedReview.negatives) && (
                  <div className="mt-5 space-y-3">
                    {selectedReview.positives && (
                      <div className="border-l-[3px] border-l-green-400 pl-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-green-400 mb-1">
                          Points positifs
                        </p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {selectedReview.positives}
                        </p>
                      </div>
                    )}
                    {selectedReview.negatives && (
                      <div className="border-l-[3px] border-l-red-400 pl-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-red-700 dark:text-red-400 mb-1">
                          Points négatifs
                        </p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {selectedReview.negatives}
                        </p>
                      </div>
                    )}
                  </div>
                )}

              {/* Scores */}
              <div className="mt-5 flex items-center gap-6 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 px-4 py-3">
                <div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">NPS</span>
                  <p className="text-sm font-semibold text-amber-600">
                    {selectedReview.normalizedRating >= 4
                      ? Math.round(selectedReview.normalizedRating * 20)
                      : "N/A"}
                    {selectedReview.normalizedRating >= 4 && (
                      <span className="text-zinc-400 dark:text-zinc-500">/100</span>
                    )}
                  </p>
                </div>
                <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-700" />
                <div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">Quality Score</span>
                  <p className="text-sm font-semibold text-amber-600">
                    {selectedReview.normalizedRating >= 3
                      ? (selectedReview.normalizedRating * 2).toFixed(1)
                      : "N/A"}
                    {selectedReview.normalizedRating >= 3 && (
                      <span className="text-zinc-400 dark:text-zinc-500">/10</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Reply area */}
            <div className="shrink-0 border-t border-zinc-100 dark:border-zinc-800 px-6 py-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Select defaultValue={selectedReview.language}>
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                    <option value="es">Español</option>
                    <option value="it">Italiano</option>
                    <option value="ar">عربي</option>
                  </Select>
                </div>
              </div>
              <Textarea
                rows={4}
                placeholder="Écrivez votre réponse ou utilisez 'Générer une réponse'..."
                value={replyText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setReplyText(e.target.value)
                }
              />
              <div className="mt-3 flex items-center gap-2">
                <Button color="amber" onClick={handleGenerate} disabled={generating}>
                  <SparklesIcon className="size-4" />
                  {generating ? "Génération..." : "Générer une réponse"}
                </Button>
                <Button outline disabled={!replyText.trim()}>
                  Sauvegarder
                </Button>
                <Button color="amber" className="ml-auto" disabled={!replyText.trim()}>
                  Envoyer
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
