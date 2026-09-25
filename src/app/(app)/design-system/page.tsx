import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Page, PageHeader } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";

import { env } from "@/server/env";

import { Showcase } from "./_components/showcase";

export const metadata: Metadata = { title: "Design system" };

export default function DesignSystemPage() {
  // Developer tool: not part of the product in production unless explicitly enabled.
  if (env().NODE_ENV === "production" && !env().ENABLE_DESIGN_SYSTEM) notFound();
  return (
    <Page>
      <PageHeader
        eyebrow={
          <Badge tone="primary" className="w-fit">
            v0.1
          </Badge>
        }
        title="Design system"
        description="Every token and component in one place. Switch colour mode, accent and density from Settings or ⌘K to see them adapt."
      />
      <Showcase />
    </Page>
  );
}
