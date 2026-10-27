"use client";

import * as React from "react";
import Link from "next/link";
import {
  Heart,
  Share2,
  MessageCircle,
  Bookmark,
  Building,
  Calendar,
  Award,
  Bell,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { FeedItem } from "../types";

interface EcclesiasticalFeedProps {
  initialItems: FeedItem[];
  availableProvinces?: string[];
}

export function EcclesiasticalFeed({
  initialItems,
  availableProvinces = ["All Provinces", "Diobu Province", "Lagos Central Province", "Lagos Province"],
}: EcclesiasticalFeedProps) {
  const [selectedProvince, setSelectedProvince] = React.useState("All Provinces");
  const [selectedType, setSelectedType] = React.useState<string>("all");
  const [amenedIds, setAmenedIds] = React.useState<Record<string, boolean>>({});
  const [amenCounts, setAmenCounts] = React.useState<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    for (const it of initialItems) {
      counts[it.id] = it.stats.amens;
    }
    return counts;
  });
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const toggleAmen = (id: string) => {
    setAmenedIds((prev) => {
      const next = !prev[id];
      setAmenCounts((c) => ({
        ...c,
        [id]: (c[id] || 0) + (next ? 1 : -1),
      }));
      return { ...prev, [id]: next };
    });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const filteredItems = initialItems.filter((item) => {
    if (selectedProvince !== "All Provinces") {
      const normProv = selectedProvince.toLowerCase().replace(/\bprovince\b/gi, "").trim();
      const itemProv = item.provinceName.toLowerCase().replace(/\bprovince\b/gi, "").trim();
      if (!itemProv.includes(normProv)) return false;
    }
    if (selectedType !== "all" && item.type !== selectedType) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Live Stream Controller Header */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Flame className="size-5 text-amber-500" />
            <span className="absolute -top-1 -right-1 flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-3 rounded-full bg-emerald-500" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">
                Ecclesiastical Live Stream & Doomscrolling Feed
              </h3>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-3xs font-semibold text-emerald-500">
                REALTIME ALGORITHM ACTIVE
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Dynamic multi-province timeline aggregating events, holy order elevations, and secretarial bulletins.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh Stream
          </Button>
        </div>
      </div>

      {/* Filter Tabs Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        {/* Province Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {availableProvinces.map((prov) => (
            <button
              key={prov}
              type="button"
              onClick={() => setSelectedProvince(prov)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                selectedProvince === prov
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {prov}
            </button>
          ))}
        </div>

        {/* Content Type Filter */}
        <div className="flex items-center gap-1 text-2xs text-muted-foreground">
          <button
            type="button"
            onClick={() => setSelectedType("all")}
            className={`rounded-md px-2 py-1 transition-colors ${
              selectedType === "all" ? "bg-card font-bold text-foreground" : "hover:text-foreground"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("event")}
            className={`rounded-md px-2 py-1 transition-colors ${
              selectedType === "event" ? "bg-card font-bold text-emerald-500" : "hover:text-foreground"
            }`}
          >
            Events
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("ordination")}
            className={`rounded-md px-2 py-1 transition-colors ${
              selectedType === "ordination" ? "bg-card font-bold text-amber-500" : "hover:text-foreground"
            }`}
          >
            Ordinations
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("bulletin")}
            className={`rounded-md px-2 py-1 transition-colors ${
              selectedType === "bulletin" ? "bg-card font-bold text-indigo-500" : "hover:text-foreground"
            }`}
          >
            Bulletins
          </button>
        </div>
      </div>

      {/* Feed Stream List */}
      {filteredItems.length === 0 ? (
        <Card className="border-border">
          <CardContent className="p-8 text-center">
            <Sparkles className="mx-auto size-8 text-muted-foreground/60" />
            <h4 className="mt-3 text-sm font-semibold text-foreground">No Feed Activity in Selected Scope</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              New happenings and events published across administrative portals will stream here automatically.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isAmened = Boolean(amenedIds[item.id]);
            const currentAmens = amenCounts[item.id] || item.stats.amens;

            return (
              <Card
                key={item.id}
                className="overflow-hidden border-border bg-card shadow-xs transition-all hover:border-primary/40"
              >
                <CardContent className="space-y-3.5 p-5">
                  {/* Post Author / Jurisdiction Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface-muted text-xs font-bold text-foreground">
                        {item.type === "event" ? (
                          <Calendar className="size-5 text-emerald-500" />
                        ) : item.type === "ordination" ? (
                          <Award className="size-5 text-amber-500" />
                        ) : (
                          <Bell className="size-5 text-indigo-500" />
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-foreground">{item.authorName}</span>
                          <span className="rounded-full bg-muted px-2 py-0.5 text-3xs font-semibold text-muted-foreground">
                            {item.authorRole}
                          </span>
                          <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-3xs font-semibold text-indigo-400">
                            <Building className="mr-0.5 inline-block size-2.5" />
                            {item.provinceName}
                          </span>
                        </div>
                        <p className="text-2xs text-muted-foreground">
                          {item.unitName} • {new Date(item.timestamp).toLocaleDateString()} at{" "}
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>

                    {item.badgeText && (
                      <span className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-3xs font-bold text-primary">
                        {item.badgeText}
                      </span>
                    )}
                  </div>

                  {/* Post Body Content */}
                  <div className="space-y-1.5">
                    <h4 className="text-base font-bold text-foreground leading-snug">{item.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.content}</p>
                  </div>

                  {/* Optional Media Preview */}
                  {item.mediaUrl && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-slate-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.mediaUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  {/* Action Link if Present */}
                  {item.actionUrl && (
                    <div className="pt-1">
                      <Link href={item.actionUrl}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 gap-1 border-border text-2xs hover:bg-muted"
                        >
                          <span>{item.actionText || "View Dossier"}</span>
                          <ExternalLink className="size-3" />
                        </Button>
                      </Link>
                    </div>
                  )}

                  {/* Social Reaction Bar (Facebook / Instagram Style) */}
                  <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      {/* Amen / Praise Button */}
                      <button
                        type="button"
                        onClick={() => toggleAmen(item.id)}
                        className={`flex items-center gap-1.5 font-medium transition-colors ${
                          isAmened ? "font-bold text-rose-500" : "hover:text-foreground"
                        }`}
                      >
                        <Heart className={`size-4 ${isAmened ? "fill-rose-500 text-rose-500" : ""}`} />
                        <span>{currentAmens} Amen{currentAmens === 1 ? "" : "s"}</span>
                      </button>

                      {/* Comments / Fellowship Discussions */}
                      <button
                        type="button"
                        className="flex items-center gap-1.5 font-medium hover:text-foreground"
                      >
                        <MessageCircle className="size-4" />
                        <span>{item.stats.comments} Fellowships</span>
                      </button>

                      {/* Share Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({ title: item.title, text: item.content, url: window.location.href });
                          }
                        }}
                        className="flex items-center gap-1.5 font-medium hover:text-foreground"
                      >
                        <Share2 className="size-4" />
                        <span>{item.stats.shares} Shares</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground"
                      title="Bookmark for Synod Review"
                    >
                      <Bookmark className="size-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
