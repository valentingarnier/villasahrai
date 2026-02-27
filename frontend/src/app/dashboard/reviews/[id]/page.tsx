"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Heading, Subheading } from "@/components/heading";
import { Text } from "@/components/text";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Textarea } from "@/components/textarea";
import { Avatar } from "@/components/avatar";
import { SourceBadge } from "@/components/source-badge";
import { StarRating } from "@/components/star-rating";
import {
  ArrowLeftIcon,
  SparklesIcon,
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/20/solid";
import { mockReviews, type Review } from "@/lib/mock-data/reviews";

const countryFlags: Record<string, string> = {
  France: "\u{1F1EB}\u{1F1F7}",
  UK: "\u{1F1EC}\u{1F1E7}",
  Germany: "\u{1F1E9}\u{1F1EA}",
  Morocco: "\u{1F1F2}\u{1F1E6}",
  Spain: "\u{1F1EA}\u{1F1F8}",
  USA: "\u{1F1FA}\u{1F1F8}",
  Japan: "\u{1F1EF}\u{1F1F5}",
  UAE: "\u{1F1E6}\u{1F1EA}",
  Italy: "\u{1F1EE}\u{1F1F9}",
};

const travelTypeLabels: Record<Review["travelType"], string> = {
  couple: "Couple",
  family: "Famille",
  business: "Affaires",
  solo: "Solo",
  group: "Groupe",
};

const languageLabels: Record<string, string> = {
  fr: "FR",
  en: "EN",
  de: "DE",
  es: "ES",
  it: "IT",
  ja: "JA",
  ar: "AR",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const months = [
    "janvier", "fevrier", "mars", "avril", "mai", "juin",
    "juillet", "aout", "septembre", "octobre", "novembre", "decembre",
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  const months = [
    "janv.", "fevr.", "mars", "avr.", "mai", "juin",
    "juil.", "aout", "sept.", "oct.", "nov.", "dec.",
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ReviewDetailPage() {
  const params = useParams();
  const reviewId = params.id as string;
  const review = mockReviews.find((r) => r.id === reviewId);

  const [generating, setGenerating] = useState(false);
  const [draftResponse, setDraftResponse] = useState(
    review?.status === "draft" ? (review.aiDraftResponse ?? "") : ""
  );
  const [sent, setSent] = useState(false);
  const [editing, setEditing] = useState(review?.status === "draft");
  const [savedDraft, setSavedDraft] = useState(false);

  if (!review) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-lg font-medium text-zinc-900">Avis non trouve</p>
        <Text className="mt-2">
          Cet avis n&apos;existe pas ou a ete supprime.
        </Text>
        <Link
          href="/dashboard/reviews"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-sahrai-900 hover:text-sahrai-700"
        >
          <ArrowLeftIcon className="size-4" />
          Retour aux avis
        </Link>
      </div>
    );
  }

  function handleGenerate() {
    setGenerating(true);
    setSavedDraft(false);
    setTimeout(() => {
      setDraftResponse(
        review!.aiDraftResponse ||
          "Merci pour votre retour. Nous prenons note de vos commentaires et nous efforcons d'ameliorer continuellement nos services. Nous esperons avoir le plaisir de vous accueillir a nouveau a Villa Sahrai."
      );
      setGenerating(false);
      setEditing(true);
    }, 1500);
  }

  function handleSend() {
    setSent(true);
    setEditing(false);
  }

  function handleSaveDraft() {
    setSavedDraft(true);
  }

  function handleDeleteDraft() {
    setDraftResponse("");
    setEditing(false);
    setSavedDraft(false);
  }

  const isResponded = review.status === "responded" && !editing;
  const hasDraft = draftResponse.length > 0 && editing;
  const isNew = !isResponded && !hasDraft && !sent;

  return (
    <div>
      {/* Back navigation */}
      <Link
        href="/dashboard/reviews"
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeftIcon className="size-4" />
        Retour aux avis
      </Link>

      <div className="mt-6 lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Left column: Review + Response */}
        <div className="lg:col-span-2 space-y-6">
          {/* Review header */}
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-semibold text-zinc-950">
                {review.guestName}
              </h1>
              <span className="text-lg" title={review.guestCountry}>
                {countryFlags[review.guestCountry] || review.guestCountry}
              </span>
              <Badge color="zinc">{travelTypeLabels[review.travelType]}</Badge>
            </div>
            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <SourceBadge source={review.source} />
              <StarRating rating={review.normalizedRating} size="md" showValue />
              <span className="text-sm text-zinc-500">
                Sejour: {formatShortDate(review.stayDate)}
              </span>
              <span className="text-zinc-300">·</span>
              <span className="text-sm text-zinc-500">
                Publie le {formatShortDate(review.reviewDate)}
              </span>
            </div>
          </div>

          {/* Review card */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-base font-semibold text-zinc-900">
                {review.title}
              </h2>
              <Badge color="zinc">
                {languageLabels[review.language] || review.language.toUpperCase()}
              </Badge>
            </div>

            <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line">
              {review.content}
            </p>

            {/* Booking.com positives/negatives */}
            {review.source === "booking" && (review.positives || review.negatives) && (
              <div className="mt-5 space-y-4">
                {review.positives && (
                  <div className="border-l-[3px] border-l-green-400 pl-4">
                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
                      Points positifs
                    </p>
                    <p className="text-sm text-zinc-600">{review.positives}</p>
                  </div>
                )}
                {review.negatives && (
                  <div className="border-l-[3px] border-l-red-400 pl-4">
                    <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-1">
                      Points negatifs
                    </p>
                    <p className="text-sm text-zinc-600">{review.negatives}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Response section */}
          <div>
            <Subheading>Reponse</Subheading>

            {/* Sent success message */}
            {sent && (
              <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircleIcon className="size-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Reponse envoyee avec succes
                  </span>
                </div>
                <p className="text-sm text-green-700 leading-relaxed whitespace-pre-line">
                  {draftResponse}
                </p>
              </div>
            )}

            {/* State: responded */}
            {isResponded && review.response && !sent && (
              <div className="mt-4 rounded-xl border border-green-200 bg-green-50/50 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="size-4 text-green-600" />
                    <span className="text-xs font-medium text-green-700">
                      Repondu par {review.response.respondedBy} le{" "}
                      {formatShortDate(review.response.respondedAt)}
                    </span>
                  </div>
                  <Button
                    plain
                    onClick={() => {
                      setDraftResponse(review.response!.content);
                      setEditing(true);
                    }}
                  >
                    <PencilIcon className="size-4" />
                    Modifier
                  </Button>
                </div>
                <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line">
                  {review.response.content}
                </p>
              </div>
            )}

            {/* State: draft / editing */}
            {hasDraft && !sent && (
              <div className="mt-4 space-y-4">
                <Textarea
                  rows={6}
                  value={draftResponse}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setDraftResponse(e.target.value)
                  }
                />
                {savedDraft && (
                  <p className="text-sm text-green-600 font-medium">
                    Brouillon sauvegarde.
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-3">
                  <Button color="sahrai" onClick={handleSend}>
                    Envoyer la reponse
                  </Button>
                  <Button outline onClick={handleGenerate} disabled={generating}>
                    <SparklesIcon className="size-4" />
                    {generating ? "Regeneration..." : "Regenerer"}
                  </Button>
                  <Button outline onClick={handleSaveDraft}>
                    Sauvegarder comme brouillon
                  </Button>
                  <Button plain onClick={handleDeleteDraft}>
                    <TrashIcon className="size-4 text-red-500" />
                    <span className="text-red-600">Supprimer le brouillon</span>
                  </Button>
                </div>
              </div>
            )}

            {/* State: new (no response, no draft) */}
            {isNew && !sent && (
              <div className="mt-4">
                <Button
                  color="sahrai"
                  onClick={handleGenerate}
                  disabled={generating}
                >
                  {generating ? (
                    <>
                      <ArrowPathIcon className="size-4 animate-spin" />
                      Generation en cours...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="size-4" />
                      Generer une reponse IA
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Guest info sidebar */}
        <div className="mt-8 lg:mt-0">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            {/* Guest avatar + name */}
            <div className="flex flex-col items-center text-center">
              <Avatar
                className="size-16 bg-sahrai-100 text-sahrai-700"
                initials={getInitials(review.guestName)}
              />
              <h3 className="mt-3 text-base font-semibold text-zinc-900">
                {review.guestName}
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                {countryFlags[review.guestCountry] || ""} {review.guestCountry}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Sejours</span>
                <span className="text-sm font-medium text-zinc-900">
                  3 sejours a Villa Sahrai
                </span>
              </div>
              <div className="h-px bg-zinc-100" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Chambre</span>
                <span className="text-sm font-medium text-zinc-900">
                  {review.roomType}
                </span>
              </div>
              <div className="h-px bg-zinc-100" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Sejour</span>
                <span className="text-sm font-medium text-zinc-900">
                  {formatShortDate(review.stayDate)}
                </span>
              </div>
              <div className="h-px bg-zinc-100" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Type</span>
                <Badge color="zinc">
                  {travelTypeLabels[review.travelType]}
                </Badge>
              </div>
              <div className="h-px bg-zinc-100" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Langue</span>
                <Badge color="zinc">
                  {languageLabels[review.language] || review.language.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Mini history */}
            <div className="mt-6 rounded-lg bg-zinc-50 p-4">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
                Historique client
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Dernier avis</span>
                  <span className="text-xs font-medium text-zinc-700">
                    {review.normalizedRating.toFixed(1)}/5
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Satisfaction</span>
                  <span className="text-xs font-medium text-zinc-700">
                    {review.normalizedRating >= 4
                      ? "Tres satisfait"
                      : review.normalizedRating >= 3
                      ? "Satisfait"
                      : "Insatisfait"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
