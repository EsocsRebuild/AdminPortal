import type { Metadata } from "next";
import { Image as ImageIcon } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getMediaAssets } from "@/features/web-cms/queries";
import { UploadMediaModal } from "@/features/web-cms/components/upload-media-modal";
import { StudioMediaRoster } from "@/features/web-cms/components/studio-media-roster";
import { requireSession } from "@/server/session";

export const metadata: Metadata = { title: "Media Asset Library · ESOCS Web Admin" };

export default async function MediaGalleryPage() {
  await requireSession();
  const media = await getMediaAssets();

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <ImageIcon className="size-5 text-amber-400" />
              <h1 className="text-2xl font-bold tracking-tight text-white">Media Asset Library</h1>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Upload banners, logos, and public photos for events and web sections.
            </p>
          </div>

          <UploadMediaModal />
        </div>

        <StudioMediaRoster
          key={media.map((m) => m.id).join(":")}
          initialMedia={media}
        />
      </div>
    </TooltipProvider>
  );
}
