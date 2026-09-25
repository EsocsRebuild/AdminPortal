"use client";

import * as RadioPrimitive from "@radix-ui/react-radio-group";
import * as React from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import type { Answer, FormField } from "../types";

export interface FieldInputProps {
  field: FormField;
  value: Answer | undefined;
  onChange: (value: Answer) => void;
  error?: string;
  disabled?: boolean;
}

/** One question, rendered the same in the builder preview and on the public page. */
export function FieldInput({ field, value, onChange, error, disabled }: FieldInputProps) {
  const id = `q-${field.id}`;
  const msgId = `${id}-msg`;
  const describedBy = [field.description ? `${id}-desc` : null, error ? msgId : null].filter(Boolean).join(" ") || undefined;
  const common = { id, disabled, "aria-invalid": !!error || undefined, "aria-describedby": describedBy, "aria-required": field.required || undefined };

  if (field.type === "section") {
    return (
      <div className="grid gap-1 border-t border-border pt-6 first:border-0 first:pt-0">
        <h2 className="text-heading-sm font-semibold">{field.label || "Section title"}</h2>
        {field.description && <p className="text-muted-foreground">{field.description}</p>}
      </div>
    );
  }

  const label = field.label || "Untitled question";
  let control: React.ReactNode;
  switch (field.type) {
    case "short_text":
      control = <Input {...common} size="lg" placeholder={field.placeholder ?? undefined} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} maxLength={field.validation?.maxLength ?? 300} />;
      break;
    case "long_text":
      control = <Textarea {...common} rows={4} placeholder={field.placeholder ?? undefined} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} maxLength={field.validation?.maxLength ?? 5000} />;
      break;
    case "email":
      control = <Input {...common} size="lg" type="email" autoComplete="email" placeholder={field.placeholder ?? "name@example.com"} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} />;
      break;
    case "phone":
      control = <Input {...common} size="lg" type="tel" autoComplete="tel" placeholder={field.placeholder ?? "+234"} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} />;
      break;
    case "number":
      control = (
        <Input
          {...common}
          size="lg"
          type="number"
          inputMode="decimal"
          min={field.validation?.min ?? undefined}
          max={field.validation?.max ?? undefined}
          value={(value as string | number) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="max-w-48"
        />
      );
      break;
    case "date":
      control = <Input {...common} size="lg" type="date" value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} className="max-w-56" />;
      break;
    case "select":
      control = (
        <Select value={(value as string) || undefined} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger {...common} size="lg">
            <SelectValue placeholder={field.placeholder ?? "Choose an option"} />
          </SelectTrigger>
          <SelectContent>
            {(field.options ?? []).filter((o) => o.label).map((o) => (
              <SelectItem key={o.id} value={o.id}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
      break;
    case "radio":
      control = (
        <RadioPrimitive.Root
          aria-labelledby={`${id}-label`}
          aria-describedby={describedBy}
          value={(value as string) ?? ""}
          onValueChange={onChange}
          disabled={disabled}
          className="grid gap-2.5"
        >
          {(field.options ?? []).map((o) => (
            <RadioGroupItem key={o.id} value={o.id} label={o.label || "Option"} />
          ))}
        </RadioPrimitive.Root>
      );
      break;
    case "checkboxes": {
      const selected = Array.isArray(value) ? value : [];
      control = (
        <div role="group" aria-labelledby={`${id}-label`} aria-describedby={describedBy} className="grid gap-2.5">
          {(field.options ?? []).map((o) => (
            <Checkbox
              key={o.id}
              label={o.label || "Option"}
              disabled={disabled}
              checked={selected.includes(o.id)}
              onCheckedChange={(v) => onChange(v === true ? [...selected, o.id] : selected.filter((x) => x !== o.id))}
            />
          ))}
        </div>
      );
      break;
    }
    case "consent":
      control = (
        <Checkbox
          id={id}
          disabled={disabled}
          label={label}
          description={field.description ?? undefined}
          checked={value === true}
          onCheckedChange={(v) => onChange(v === true)}
          aria-invalid={!!error}
        />
      );
      break;
  }

  if (field.type === "consent") {
    return (
      <div className={cn("grid gap-1.5 rounded-card border p-4", error ? "border-danger/50" : "border-border")}>
        {control}
        {error && <p id={msgId} role="alert" className="text-sm text-danger">{error}</p>}
      </div>
    );
  }

  const groupLabel = field.type === "radio" || field.type === "checkboxes";
  return (
    <div className="grid gap-2">
      {groupLabel ? (
        <p id={`${id}-label`} className="text-base font-medium">
          {label}
          {field.required && <span aria-hidden className="ml-0.5 text-danger">*</span>}
        </p>
      ) : (
        <Label htmlFor={id} required={field.required} className="text-base">
          {label}
        </Label>
      )}
      {field.description && (
        <p id={`${id}-desc`} className="-mt-1 text-sm text-muted-foreground">
          {field.description}
        </p>
      )}
      {control}
      {error && (
        <p id={msgId} role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
