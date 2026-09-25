import { Code2, Download, ExternalLink, Link2, QrCode } from "lucide-react";
import type { Metadata } from "next";
import QRCode from "qrcode";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { getForm, publicFormUrl } from "@/features/forms/queries";
import { assertId, findOrNotFound } from "@/server/query";

export const metadata: Metadata = { title: "Share form" };

export default async function ShareFormPage({ params }: PageProps<"/forms/[id]/share">) {
  const form = await findOrNotFound(getForm(assertId((await params).id)));
  const url = publicFormUrl(form.slug);
  // Generated on the server; the SVG contains only paths, no scripts.
  const svg = await QRCode.toString(url, {
    type: "svg",
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#0f172a", light: "#ffffff" },
  });
  const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  const embed = `<iframe src="${url}?embed=1" title="${form.title.replace(/"/g, "&quot;")}" width="100%" height="720" style="border:0" loading="lazy"></iframe>`;

  return (
    <div className="grid gap-page">
      {form.status !== "published" && (
        <Alert
          tone="info"
          title={form.status === "draft" ? "This form isn’t published yet" : "This form is closed"}
        >
          You can copy the link now, but people will only be able to fill it in while it’s published.
        </Alert>
      )}
      <div className="grid gap-page lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="grid content-start gap-page">
          <Card>
            <CardHeader
              title="Share a link"
              description="Send it by email, WhatsApp or text, or post it on social media."
            />
            <CardContent className="grid gap-3">
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex h-control-md min-w-0 flex-1 items-center gap-2 rounded-control border border-input bg-surface-muted px-3">
                  <Link2 className="size-4 shrink-0 text-subtle-foreground" />
                  <span className="truncate font-mono text-sm">{url}</span>
                </div>
                <CopyButton value={url} label="Copy link" />
                <Button variant="secondary" size="sm" asChild leftIcon={<ExternalLink />}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    Open
                  </a>
                </Button>
              </div>
              <Button variant="secondary" size="sm" className="w-fit" asChild>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${form.title} ${url}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Share on WhatsApp
                </a>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader
              title="Put it on your website"
              description="Paste this code where the form should appear."
            />
            <CardContent className="grid gap-3">
              <pre className="overflow-x-auto rounded-control bg-surface-sunken p-3 font-mono text-xs leading-relaxed">
                <code>{embed}</code>
              </pre>
              <CopyButton value={embed} label="Copy code" className="w-fit" leftIcon={<Code2 />} />
              <p className="text-xs text-muted-foreground">
                Only websites your administrator has allowed can embed forms. Ask them to add your site if it
                doesn’t appear.
              </p>
            </CardContent>
          </Card>
        </div>
        <Card className="h-fit">
          <CardHeader title="QR code" description="For posters, bulletins and screens." />
          <CardContent className="grid justify-items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- inline SVG data URL */}
            <img
              src={dataUrl}
              alt={`QR code linking to ${url}`}
              className="size-52 rounded-control border border-border bg-white p-2"
            />
            <Button variant="secondary" size="sm" asChild leftIcon={<Download />}>
              <a href={dataUrl} download={`${form.slug}-qr.svg`}>
                Download QR code
              </a>
            </Button>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <QrCode className="size-3.5" /> Scans open the form directly.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
