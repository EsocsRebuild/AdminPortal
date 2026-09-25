"use client";

import * as RadioPrimitive from "@radix-ui/react-radio-group";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { useAction } from "@/hooks/use-action";

import { createTemplate } from "../actions";

export function NewTemplateButton() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [preset, setPreset] = React.useState("announcement");
  const [error, setError] = React.useState<string>();
  const create = useAction(createTemplate, {
    success: "Template created",
    onSuccess: ({ id }) => router.push(`/templates/${id}`),
  });
  const previews = React.useMemo(() => Object.fromEntries(presets.map((p) => [p.id, p.build()])), []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return setError("Give the template a name.");
    const content = presets.find((p) => p.id === preset)!.build();
    const res = await create.run({ name, content });
    if (!res.ok) setError(res.fieldErrors?.name?.[0]);
  }

  return (
    <Can permission="templates:manage">
      <Button leftIcon={<Plus />} onClick={() => setOpen(true)}>
        New template
      </Button>
      <Dialog open={open} onOpenChange={(o) => !create.pending && setOpen(o)}>
        <DialogContent size="xl">
          <form onSubmit={submit} noValidate className="flex min-h-0 flex-col">
            <DialogHeader>
              <DialogTitle>New template</DialogTitle>
              <DialogDescription>
                Templates are reusable designs. Start from a layout and change anything.
              </DialogDescription>
            </DialogHeader>
            <DialogBody className="grid gap-5">
              <Field label="Template name" htmlFor="tpl-name" error={error}>
                <Input
                  id="tpl-name"
                  autoFocus
                  placeholder="e.g. Monthly newsletter"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError(undefined);
                  }}
                  aria-invalid={!!error}
                  aria-describedby="tpl-name-msg"
                  maxLength={80}
                />
              </Field>
              <RadioPrimitive.Root
                value={preset}
                onValueChange={setPreset}
                aria-label="Starting layout"
                className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
              >
                {presets.map((p) => (
                  <RadioCard key={p.id} value={p.id} className="grid gap-0 overflow-hidden p-0">
                    <EmailThumbnail document={previews[p.id]} className="h-32" />
                    <span className="grid gap-0.5 border-t border-border-subtle p-3">
                      <span className="text-sm font-medium">{p.name}</span>
                      <span className="text-xs text-muted-foreground">{p.description}</span>
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
                Create and edit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Can>
  );
}
