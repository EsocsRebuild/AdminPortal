import type { Metadata } from "next";
import Image from "next/image";
import { Image as ImageIcon, Upload, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { getMediaAssets } from "@/features/web-cms/queries";

export const metadata: Metadata = { title: "Media Asset Library · ESOCS Web Admin" };

export default async function MediaGalleryPage() {
  const media = await getMediaAssets();

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <ImageIcon className="size-5 text-emerald-400" />
              <h1 className="text-2xl font-bold tracking-tight text-white">Media Asset Library</h1>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Upload banners, logos, and public photos for events and web sections.
            </p>
          </div>

          <Button className="gap-1.5 bg-emerald-600 text-xs text-white shadow-md shadow-emerald-950 hover:bg-emerald-500">
            <Upload className="size-4" />
            Upload New Media Asset
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {media.map((item) => (
            <Card
              key={item.id}
              className="group overflow-hidden border-slate-800 bg-slate-900/80 transition-all hover:border-slate-700"
            >
              <div className="relative flex h-40 items-center justify-center overflow-hidden border-b border-slate-800 bg-slate-950">
                <Image
                  src={item.cdnUrl}
                  alt={item.fileName}
                  width={400}
                  height={200}
                  unoptimized
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="space-y-2 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="max-w-44 truncate text-xs font-semibold text-white">{item.fileName}</span>
                  <span className="font-mono text-2xs text-slate-400">
                    {(item.fileSize / 1024).toFixed(0)} KB
                  </span>
                </div>
                <div className="flex items-center justify-between text-2xs text-slate-500">
                  <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
                  <Tooltip content="Copies asset CDN URL to clipboard">
                    <button className="flex items-center gap-1 font-medium text-emerald-400 hover:text-emerald-300">
                      <Copy className="size-3" />
                      Copy CDN URL
                    </button>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
