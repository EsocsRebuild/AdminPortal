import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LogoMark } from "@/components/icons/logo";
import { ServiceUnavailable } from "@/components/auth/service-unavailable";
import { PublicForm } from "@/features/forms/components/public-form";
import { getPublicForm } from "@/features/forms/queries";
import { BackendError } from "@/server/backend";

const SLUG = /^[a-z0-9-]{3,60}$/;

async function load(slug: string) {
  if (!SLUG.test(slug)) notFound();
  try {
    return await getPublicForm(slug);
  } catch (error) {
    if (error instanceof BackendError && error.code === "NOT_FOUND") notFound();
    return null;
  }
}

export async function generateMetadata({ params }: PageProps<"/f/[slug]">): Promise<Metadata> {
  const form = await load((await params).slug);
  return {
    title: form?.title ?? "Form",
    description: form?.description ?? undefined,
    // Public, but not meant for search results.
    robots: { index: false, follow: false },
  };
}

export default async function PublicFormPage({ params, searchParams }: PageProps<"/f/[slug]">) {
  const { slug } = await params;
  const embed = (await searchParams).embed === "1";
  const form = await load(slug);

  const body = form ? <PublicForm form={form} /> : <ServiceUnavailable retryHref={`/f/${slug}`} message="This form can’t load right now. Please try again in a moment." />;

  if (embed) return <main className="mx-auto w-full max-w-2xl p-4 sm:p-6">{body}</main>;

  return (
    <div className="min-h-dvh bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-aurora opacity-70" />
      <main id="main" className="relative mx-auto grid w-full max-w-2xl gap-6 px-gutter py-8 sm:py-14">
        <div className="flex items-center gap-2.5">
          <LogoMark />
          <span className="font-brand text-xl font-semibold tracking-wide">{form?.organisationName ?? "ESOCS"}</span>
        </div>
        <div className="rounded-panel border border-border bg-surface p-5 shadow-sm sm:p-10">{body}</div>
        <p className="text-center text-xs text-subtle-foreground">Your answers are sent securely and only shared with the organisers.</p>
      </main>
    </div>
  );
}
