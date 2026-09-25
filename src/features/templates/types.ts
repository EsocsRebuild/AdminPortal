import type { EmailDocument } from "@/features/email-builder/types";

export interface TemplateSummary {
  id: string;
  name: string;
  description: string | null;
  updatedAt: string;
  updatedBy: { id: string; name: string } | null;
}

export interface Template extends TemplateSummary {
  content: EmailDocument;
}
