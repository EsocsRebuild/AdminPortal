"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { SaveStatus } from "@/components/ui/save-status";
import { EmailEditor } from "@/features/email-builder/email-editor";
import type { EmailDocument } from "@/features/email-builder/types";
import { useAutosave } from "@/hooks/use-autosave";

import { updateTemplate } from "../actions";
import type { Template } from "../types";

export function TemplateEditor({ template }: { template: Template }) {
  const [name, setName] = React.useState(template.name);
  const [content, setContent] = React.useState<EmailDocument>(template.content);
  const draft = React.useMemo(() => ({ name: name.trim(), content }), [name, content]);
  const save = useAutosave(draft, (d) =>
    updateTemplate({ id: template.id, name: d.name.length >= 2 ? d.name : undefined, content: d.content }),
  );

  return (
    <div className="grid gap-page">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="icon" asChild aria-label="Back to templates">
          <Link href="/templates">
            <ArrowLeft />
          </Link>
        </Button>
        <input
          aria-label="Template name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          className="min-w-0 flex-1 rounded-control bg-transparent px-2 py-1 text-heading-md font-semibold outline-none hover:bg-surface-hover focus-visible:bg-surface focus-visible:ring-3 focus-visible:ring-ring/20"
        />
        <SaveStatus state={save.state} onRetry={save.flush} />
      </div>
      <EmailEditor value={content} onChange={setContent} />
    </div>
  );
}
