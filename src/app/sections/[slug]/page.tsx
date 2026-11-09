import { redirect } from "next/navigation";
import { getWebFrontendUrl } from "@/lib/web-url";

export default async function SectionSlugRedirectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(getWebFrontendUrl(`/church/${slug}`));
}
