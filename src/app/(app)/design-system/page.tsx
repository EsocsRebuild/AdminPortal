import type { Metadata } from "next";

import { Page, PageHeader } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";

import { Showcase } from "./_components/showcase";

export const metadata: Metadata = { title: "Design system" };

export default function DesignSystemPage() {
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
