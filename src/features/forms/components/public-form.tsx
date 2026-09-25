"use client";

import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { easeOutExpo } from "@/components/motion/reveal";
import { SuccessCheck } from "@/components/motion/success-check";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { issuesToErrors, type Errors } from "@/lib/validate";

import { submitFormResponse } from "../actions";
import { buildAnswerSchema } from "../answer-schema";
import type { Answer, PublicForm as PublicFormData } from "../types";
import { FieldInput } from "./field-input";

export function PublicForm({ form }: { form: PublicFormData }) {
  const [answers, setAnswers] = React.useState<Record<string, Answer>>({});
  const [errors, setErrors] = React.useState<Errors>({});
  const [banner, setBanner] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [honeypot, setHoneypot] = React.useState("");
  const startedAt = React.useRef(0);
  const schema = React.useMemo(() => buildAnswerSchema(form.fields), [form.fields]);

  React.useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const set = (id: string, v: Answer) => {
    setAnswers((a) => ({ ...a, [id]: v }));
    if (errors[id]) setErrors((e) => ({ ...e, [id]: undefined }));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBanner(null);
    const check = schema.safeParse(answers);
    if (!check.success) {
      const found = issuesToErrors(check.error);
      setErrors(found);
      document.getElementById(`q-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    setPending(true);
    const res = await submitFormResponse({ slug: form.slug, answers, website: honeypot, startedAt: startedAt.current });
    setPending(false);
    if (res.ok) {
      if (form.settings.redirectUrl && /^https:\/\//i.test(form.settings.redirectUrl)) {
        window.location.assign(form.settings.redirectUrl);
        return;
      }
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (res.fieldErrors) setErrors(Object.fromEntries(Object.entries(res.fieldErrors).map(([k, v]) => [k, v?.[0]])));
    setBanner(res.message);
  }

  if (form.status !== "published") {
    return (
      <div className="grid gap-2 py-6 text-center">
        <h1 className="text-heading-lg font-semibold">{form.title}</h1>
        <p className="text-md text-muted-foreground">This form is closed and no longer accepting responses. Thank you for your interest.</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {done ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: easeOutExpo }}
          className="grid justify-items-center gap-5 py-8 text-center"
          role="status"
        >
          <SuccessCheck />
          <h1 className="text-heading-lg font-semibold">{form.settings.confirmationTitle}</h1>
          {form.settings.confirmationMessage && <p className="max-w-md text-md whitespace-pre-wrap text-muted-foreground">{form.settings.confirmationMessage}</p>}
        </motion.div>
      ) : (
        <motion.form key="form" exit={{ opacity: 0 }} onSubmit={submit} noValidate className="grid gap-7">
          <header className="grid gap-2">
            <h1 className="text-heading-lg font-semibold">{form.title}</h1>
            {form.description && <p className="text-md whitespace-pre-wrap text-muted-foreground">{form.description}</p>}
            {form.fields.some((f) => f.required) && (
              <p className="text-sm text-muted-foreground">
                Questions marked <span className="text-danger">*</span> are required.
              </p>
            )}
          </header>
          {banner && <Alert tone="danger">{banner}</Alert>}
          {form.fields.map((f) => (
            <FieldInput key={f.id} field={f} value={answers[f.id]} onChange={(v) => set(f.id, v)} error={errors[f.id]} disabled={pending} />
          ))}
          {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
          <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="website">Website</label>
            <input id="website" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
          </div>
          <Button type="submit" size="lg" loading={pending} className="w-full sm:w-fit sm:min-w-40">
            {form.settings.submitLabel}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
