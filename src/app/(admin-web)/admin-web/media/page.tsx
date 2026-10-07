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
              <h1 className="text-2xl font-bold text-white tracking-tight">Media Asset Library</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Upload banners, logos, and public photos for events and web sections.
            </p>
          </div>

          <Button className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5 shadow-md shadow-emerald-950">
            <Upload className="size-4" />
            Upload New Media Asset
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {media.map((item) => (
            <Card key={item.id} className="bg-slate-900/80 border-slate-800 overflow-hidden hover:border-slate-700 transition-all group">
              <div className="h-40 bg-slate-950 relative overflow-hidden flex items-center justify-center border-b border-slate-800">
                <Image
                  src={item.cdnUrl}
                  alt={item.fileName}
                  width={400}
                  height={200}
                  unoptimized
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white truncate max-w-44">{item.fileName}</span>
                  <span className="text-2xs text-slate-400 font-mono">{(item.fileSize / 1024).toFixed(0)} KB</span>
                </div>
                <div className="flex items-center justify-between text-2xs text-slate-500">
                  <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
                  <Tooltip content="Copies asset CDN URL to clipboard">
                    <button className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium">
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
