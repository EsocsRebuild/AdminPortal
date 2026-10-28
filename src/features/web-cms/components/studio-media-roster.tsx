"use client";

import * as React from "react";
import Image from "next/image";
import { Image as ImageIcon, Copy, Check, Trash2, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/modals/modal-provider";
import { deleteMediaAssetAction } from "../actions";
import type { MediaAsset } from "../types";

export function StudioMediaRoster({ initialMedia }: { initialMedia: MediaAsset[] }) {
  const router = useRouter();
  const modals = useModals();
  const [media, setMedia] = React.useState<MediaAsset[]>(initialMedia);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const handleCopy = (item: MediaAsset) => {
    navigator.clipboard.writeText(item.cdnUrl);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async (id: string) => {
    const target = media.find((m) => m.id === id);
    const confirmed = await modals.confirm({
      title: "Remove Media Asset?",
      description: target
        ? `Are you sure you want to remove "${target.fileName}" from the church media library?`
        : "Are you sure you want to remove this media asset?",
      confirmLabel: "Remove Asset",
      cancelLabel: "Keep Asset",
      tone: "danger",
    });
    if (!confirmed) return;

    setDeletingId(id);
    const res = await deleteMediaAssetAction({ id });
    setDeletingId(null);
    if (res.ok) {
      setMedia((prev) => prev.filter((m) => m.id !== id));
      router.refresh();
    }
  };

  if (media.length === 0) {
    return (
      <Card className="border-slate-800 bg-slate-900/60 p-10 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
          <ImageIcon className="size-6" />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-white">No media assets in library</h3>
        <p className="mt-1 text-xs text-slate-400">
          Use the button above to upload church banners, flyers, and logos.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
      {media.map((item) => (
        <Card
          key={item.id}
          className="group overflow-hidden border-slate-800 bg-slate-900/80 shadow-md transition-all hover:border-slate-700"
        >
          <div className="relative flex h-44 items-center justify-center overflow-hidden border-b border-slate-800 bg-slate-950">
            <Image
              src={item.cdnUrl}
              alt={item.fileName}
              fill
              unoptimized
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <CardContent className="space-y-3 p-4">
            <div>
              <h4 className="truncate font-mono text-xs font-semibold text-white" title={item.fileName}>
                {item.fileName}
              </h4>
              <div className="mt-0.5 flex items-center justify-between text-3xs text-slate-400">
                <span>{(item.fileSize / 1024).toFixed(1)} KB</span>
                <span>{item.mimeType}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800/80 pt-2">
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => handleCopy(item)}
                className="gap-1 border-slate-800 text-3xs text-slate-300 hover:text-white"
              >
                {copiedId === item.id ? (
                  <>
                    <Check className="size-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied URL!</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>Copy URL</span>
                  </>
                )}
              </Button>

              <div className="flex items-center gap-1">
                <a
                  href={item.cdnUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded p-1 text-slate-400 hover:text-white"
                  title="Open Full Image"
                >
                  <ExternalLink className="size-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="rounded p-1 text-slate-500 hover:text-rose-400"
                  title="Delete Asset"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

