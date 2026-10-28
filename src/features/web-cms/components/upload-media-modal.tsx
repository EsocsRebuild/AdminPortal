"use client";

import * as React from "react";
import { Upload, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { uploadMediaAssetAction } from "../actions";

export function UploadMediaModal() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [url, setUrl] = React.useState("");
  const [fileName, setFileName] = React.useState("");

  const presets = [
    { name: "Altar & Sanctuary", url: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80" },
    { name: "Chorister Assembly", url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80" },
    { name: "Holy Order Prayer", url: "https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=1200&q=80" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await uploadMediaAssetAction({
      fileName: fileName.trim() || `esocs_asset_${Date.now()}.jpg`,
      cdnUrl: url.trim(),
    });

    setLoading(false);
    if (res.ok) {
      setOpen(false);
      setUrl("");
      setFileName("");
      router.refresh();
    } else {
      setError(res.message || "Failed to upload asset");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1.5 bg-amber-500 text-xs font-bold text-slate-950 shadow-md shadow-amber-950/50 hover:bg-amber-400">
          <Upload className="size-4" />
          Upload New Media Asset
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md border-slate-800 bg-slate-950 p-6 text-white shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Upload className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-white">
                Upload Church Media Asset
              </DialogTitle>
              <p className="text-xs text-slate-400">
                Add banner photos, flyers, or church logos to the central media CDN library.
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
          {error && (
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="m-name" className="font-semibold text-slate-200">
              Asset Name / Title *
            </label>
            <Input
              id="m-name"
              required
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="e.g. general_conference_banner_2026.jpg"
              className="border-slate-800 bg-slate-900 text-white placeholder:text-slate-600 focus-visible:ring-amber-500 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="m-url" className="font-semibold text-slate-200">
              Image Web Address (URL) *
            </label>
            <Input
              id="m-url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="border-slate-800 bg-slate-900 text-white placeholder:text-slate-600 focus-visible:ring-amber-500 text-xs"
            />

            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-3xs text-slate-500">Presets:</span>
              {presets.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    setUrl(p.url);
                    if (!fileName) setFileName(`${p.name.toLowerCase().replace(/\s+/g, "_")}.jpg`);
                  }}
                  className="rounded border border-slate-800 bg-slate-900 px-2 py-0.5 text-3xs font-medium text-slate-400 hover:border-slate-700 hover:text-white"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {url.trim().length > 10 && (
            <div className="relative h-36 w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
              <Image src={url} alt="Preview" fill unoptimized className="object-cover" />
            </div>
          )}

          <DialogFooter className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              className="border-slate-800 text-xs text-slate-300 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="gap-1.5 bg-amber-500 text-xs font-bold text-slate-950 hover:bg-amber-400"
            >
              <Sparkles className="size-3.5" />
              {loading ? "Registering..." : "Save to Media Library"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
