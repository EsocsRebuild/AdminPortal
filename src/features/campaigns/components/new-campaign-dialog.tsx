"use client";

import * as RadioPrimitive from "@radix-ui/react-radio-group";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { Can } from "@/components/auth/session-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioCard } from "@/components/ui/radio-group";
import { EmailThumbnail } from "@/features/email-builder/email-thumbnail";
import { presets } from "@/features/email-builder/presets";
import type { EmailDocument } from "@/features/email-builder/types";
import type { Template } from "@/features/templates/types";
import { useAction } from "@/hooks/use-action";

import { createCampaign } from "../actions";

export function NewCampaignButton({ templates }: { templates: Template[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = React.useState(() => params.get("new") === "1");
  const [name, setName] = React.useState("");
  const [start, setStart] = React.useState(templates[0] ? `t:${templates[0].id}` : "p:announcement");
  const [error, setError] = React.useState<string>();
  const presetDocs = React.useMemo(() => Object.fromEntries(presets.map((p) => [p.id, p.build()])), []);
  const create = useAction(createCampaign, {
    onSuccess: ({ id }) => router.push(`/campaigns/${id}/edit?step=setup`),
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return setError("Give the campaign a name.");
    const [kind, id] = start.split(":");
    const content: EmailDocument =
      kind === "t"
        ? structuredClone(templates.find((t) => t.id === id)!.content)
        : presets.find((p) => p.id === id)!.build();
    const res = await create.run({ name, content });
    if (!res.ok) setError(res.fieldErrors?.name?.[0]);
  }

  const options = [
    ...templates.map((t) => ({
      value: `t:${t.id}`,
      name: t.name,
      description: "Your template",
      doc: t.content,
    })),
    ...presets.map((p) => ({
      value: `p:${p.id}`,
      name: p.name,
      description: p.description,
      doc: presetDocs[p.id],
    })),
  ];

  return (
    <Can permission="campaigns:manage">
      <Button leftIcon={<Plus />} onClick={() => setOpen(true)}>
        New campaign
      </Button>
      <Dialog open={open} onOpenChange={(o) => !create.pending && setOpen(o)}>
        <DialogContent size="xl">
          <form onSubmit={submit} noValidate className="flex min-h-0 flex-col">
            <DialogHeader>
              <DialogTitle>New email campaign</DialogTitle>
              <DialogDescription>
                Name it, pick a starting design, and we’ll guide you through the rest. Nothing is sent until
                you say so.
              </DialogDescription>
            </DialogHeader>
            <DialogBody className="grid gap-5">
              <Field label="Campaign name" htmlFor="nc-name" error={error} hint="Only your team sees this.">
                <Input
                  id="nc-name"
                  autoFocus
                  placeholder="e.g. October newsletter"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError(undefined);
                  }}
                  aria-invalid={!!error}
                  aria-describedby="nc-name-msg"
                  maxLength={100}
                />
              </Field>
              <RadioPrimitive.Root
                value={start}
                onValueChange={setStart}
                aria-label="Starting design"
                className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
              >
                {options.map((o) => (
                  <RadioCard key={o.value} value={o.value} className="grid gap-0 overflow-hidden p-0">
                    <EmailThumbnail document={o.doc} className="h-28" />
                    <span className="grid gap-0.5 border-t border-border-subtle p-3">
                      <span className="truncate text-sm font-medium">{o.name}</span>
                      <span className="truncate text-xs text-muted-foreground">{o.description}</span>
                    </span>
                  </RadioCard>
                ))}
              </RadioPrimitive.Root>
            </DialogBody>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setOpen(false)} disabled={create.pending}>
                Cancel
              </Button>
              <Button type="submit" loading={create.pending}>
                Create draft
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Can>
  );
}
