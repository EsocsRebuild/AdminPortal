"use client";

import { AnimatePresence, motion, Reorder, useDragControls } from "motion/react";
import {
  AlignLeft,
  ArrowDown,
  ArrowUp,
  AtSign,
  Calendar,
  CircleDot,
  Copy,
  Eye,
  GripVertical,
  Hash,
  Heading,
  ListChecks,
  ChevronDownSquare,
  PencilRuler,
  Phone,
  Plus,
  ShieldCheck,
  Trash2,
  Type,
  X,
  type LucideIcon,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SaveStatus } from "@/components/ui/save-status";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip } from "@/components/ui/tooltip";
import { useAutosave } from "@/hooks/use-autosave";
import { cn } from "@/lib/utils";

import { updateForm } from "../actions";
import { choiceTypes, type Answer, type FieldType, type Form, type FormField } from "../types";
import { FieldInput } from "./field-input";

export const fieldMeta: Record<FieldType, { label: string; icon: LucideIcon; hint: string }> = {
  short_text: { label: "Short answer", icon: Type, hint: "A name, a word or a line" },
  long_text: { label: "Paragraph", icon: AlignLeft, hint: "A longer answer" },
  email: { label: "Email", icon: AtSign, hint: "Checks it’s a real address" },
  phone: { label: "Phone", icon: Phone, hint: "A phone number" },
  number: { label: "Number", icon: Hash, hint: "Age, quantity, amount" },
  date: { label: "Date", icon: Calendar, hint: "Pick a day" },
  select: { label: "Dropdown", icon: ChevronDownSquare, hint: "Choose one from a list" },
  radio: { label: "Multiple choice", icon: CircleDot, hint: "Choose one, all visible" },
  checkboxes: { label: "Checkboxes", icon: ListChecks, hint: "Choose any that apply" },
  consent: { label: "Agreement", icon: ShieldCheck, hint: "Tick to agree, e.g. to emails" },
  section: { label: "Section heading", icon: Heading, hint: "Break the form into parts" },
};

const uid = () => Math.random().toString(36).slice(2, 10);

function newField(type: FieldType): FormField {
  const withOptions = choiceTypes.includes(type);
  return {
    id: uid(),
    type,
    label: type === "consent" ? "I’m happy to receive emails from the church" : "",
    description: null,
    placeholder: null,
    required: false,
    options: withOptions ? [{ id: uid(), label: "Option 1" }, { id: uid(), label: "Option 2" }] : null,
    validation: null,
  };
}

function AddQuestionMenu({ onAdd, variant = "secondary" }: { onAdd: (t: FieldType) => void; variant?: "secondary" | "primary" }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={variant} leftIcon={<Plus />} className="w-full sm:w-auto">
          Add a question
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[min(34rem,calc(100vw-1.5rem))] p-2">
        <div className="grid gap-1 sm:grid-cols-2">
          {(Object.keys(fieldMeta) as FieldType[]).map((t) => {
            const m = fieldMeta[t];
            return (
              <button
                key={t}
                type="button"
                onClick={() => {
                  onAdd(t);
                  setOpen(false);
                }}
                className="flex cursor-pointer items-start gap-3 rounded-control p-2.5 text-left transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-ring"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-control bg-primary-soft text-primary-soft-foreground">
                  <m.icon className="size-4" />
                </span>
                <span className="grid">
                  <span className="text-sm font-medium">{m.label}</span>
                  <span className="text-xs text-muted-foreground">{m.hint}</span>
                </span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function OptionsEditor({ field, onChange }: { field: FormField; onChange: (f: FormField) => void }) {
  const options = field.options ?? [];
  const set = (next: typeof options) => onChange({ ...field, options: next });
  return (
    <div className="grid gap-2">
      <p className="text-sm font-medium">Options</p>
      <Reorder.Group axis="y" values={options} onReorder={set} className="grid gap-1.5">
        {options.map((o, i) => (
          <Reorder.Item key={o.id} value={o} className="flex items-center gap-1.5">
            <GripVertical className="size-4 shrink-0 cursor-grab text-faint-foreground" aria-hidden />
            <Input
              size="sm"
              aria-label={`Option ${i + 1}`}
              value={o.label}
              maxLength={200}
              onChange={(e) => set(options.map((x) => (x.id === o.id ? { ...x, label: e.target.value } : x)))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const next = [...options];
                  next.splice(i + 1, 0, { id: uid(), label: "" });
                  set(next);
                  requestAnimationFrame(() => (document.querySelector(`[aria-label="Option ${i + 2}"]`) as HTMLInputElement | null)?.focus());
                }
              }}
            />
            <Button variant="ghost" size="icon-sm" aria-label={`Remove option ${i + 1}`} disabled={options.length <= 1} onClick={() => set(options.filter((x) => x.id !== o.id))}>
              <X />
            </Button>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <Button variant="ghost" size="sm" leftIcon={<Plus />} className="w-fit" onClick={() => set([...options, { id: uid(), label: `Option ${options.length + 1}` }])} disabled={options.length >= 100}>
        Add option
      </Button>
      <p className="text-xs text-muted-foreground">Tip: press Enter in an option to add the next one.</p>
    </div>
  );
}

function Inspector({ field, onChange }: { field: FormField; onChange: (f: FormField) => void }) {
  const m = fieldMeta[field.type];
  const textual = ["short_text", "long_text", "email", "phone", "select"].includes(field.type);
  return (
    <div className="grid gap-5">
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 place-items-center rounded-control bg-primary-soft text-primary-soft-foreground">
          <m.icon className="size-4" />
        </span>
        <div className="grid">
          <span className="text-sm font-semibold">{m.label}</span>
          <span className="text-xs text-muted-foreground">{m.hint}</span>
        </div>
      </div>
      <Field label={field.type === "section" ? "Heading" : field.type === "consent" ? "What they agree to" : "Question"} htmlFor="fi-label">
        <Textarea id="fi-label" autoFocus rows={2} value={field.label} maxLength={300} onChange={(e) => onChange({ ...field, label: e.target.value })} />
      </Field>
      <Field label="Help text" htmlFor="fi-desc" optional hint="Shown under the question.">
        <Input id="fi-desc" value={field.description ?? ""} maxLength={1000} onChange={(e) => onChange({ ...field, description: e.target.value || null })} aria-describedby="fi-desc-msg" />
      </Field>
      {textual && (
        <Field label="Placeholder" htmlFor="fi-ph" optional hint="Example text inside the empty box.">
          <Input id="fi-ph" value={field.placeholder ?? ""} maxLength={150} onChange={(e) => onChange({ ...field, placeholder: e.target.value || null })} aria-describedby="fi-ph-msg" />
        </Field>
      )}
      {choiceTypes.includes(field.type) && <OptionsEditor field={field} onChange={onChange} />}
      {field.type === "number" && (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Lowest" htmlFor="fi-min" optional>
            <Input id="fi-min" type="number" value={field.validation?.min ?? ""} onChange={(e) => onChange({ ...field, validation: { ...field.validation, min: e.target.value === "" ? null : Number(e.target.value) } })} />
          </Field>
          <Field label="Highest" htmlFor="fi-max" optional>
            <Input id="fi-max" type="number" value={field.validation?.max ?? ""} onChange={(e) => onChange({ ...field, validation: { ...field.validation, max: e.target.value === "" ? null : Number(e.target.value) } })} />
          </Field>
        </div>
      )}
      {field.type !== "section" && (
        <div className="rounded-card border border-border bg-surface-muted/50 p-3.5">
          <Switch
            label="Required"
            description={field.type === "consent" ? "People must tick this to submit." : "People must answer before submitting."}
            checked={field.required}
            onCheckedChange={(required) => onChange({ ...field, required })}
          />
        </div>
      )}
    </div>
  );
}

function CanvasItem({
  field,
  index,
  count,
  selected,
  onSelect,
  onMove,
  onDuplicate,
  onRemove,
}: {
  field: FormField;
  index: number;
  count: number;
  selected: boolean;
  onSelect: () => void;
  onMove: (d: -1 | 1) => void;
  onDuplicate: () => void;
  onRemove: () => void;
}) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={field}
      dragListener={false}
      dragControls={controls}
      whileDrag={{ scale: 1.015, boxShadow: "var(--shadow-lg)", zIndex: 10 }}
      className={cn(
        "group relative rounded-card border bg-surface transition-[border-color,box-shadow]",
        selected ? "border-primary/60 ring-4 ring-primary/10" : "border-transparent hover:border-border",
      )}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={`Edit ${field.label || fieldMeta[field.type].label}`}
        aria-pressed={selected}
        onClick={onSelect}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && e.target === e.currentTarget && (e.preventDefault(), onSelect())}
        className="cursor-pointer rounded-card p-4 pl-10 focus-visible:outline-2 focus-visible:outline-ring"
      >
        {/* Inputs are for show only in the builder. */}
        <div className="pointer-events-none">
          <FieldInput field={field} value={undefined} onChange={() => {}} disabled />
        </div>
      </div>
      <button
        type="button"
        aria-label="Drag to reorder"
        onPointerDown={(e) => controls.start(e)}
        className={cn(
          "absolute top-3 left-2 grid size-7 cursor-grab touch-none place-items-center rounded-xs text-faint-foreground transition-opacity hover:text-foreground active:cursor-grabbing",
          selected ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100 pointer-coarse:opacity-100",
        )}
      >
        <GripVertical className="size-4" />
      </button>
      <div
        className={cn(
          "absolute -top-3.5 right-3 flex items-center rounded-control border border-border bg-surface-raised p-0.5 shadow-sm transition-all",
          selected ? "opacity-100" : "pointer-events-none translate-y-1 opacity-0 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100",
        )}
      >
        <Tooltip content="Move up">
          <Button variant="ghost" size="icon-xs" aria-label="Move up" disabled={index === 0} onClick={() => onMove(-1)}>
            <ArrowUp />
          </Button>
        </Tooltip>
        <Tooltip content="Move down">
          <Button variant="ghost" size="icon-xs" aria-label="Move down" disabled={index === count - 1} onClick={() => onMove(1)}>
            <ArrowDown />
          </Button>
        </Tooltip>
        <Tooltip content="Duplicate">
          <Button variant="ghost" size="icon-xs" aria-label="Duplicate" onClick={onDuplicate}>
            <Copy />
          </Button>
        </Tooltip>
        <Tooltip content="Delete">
          <Button variant="ghost" size="icon-xs" aria-label="Delete question" onClick={onRemove} className="hover:text-danger">
            <Trash2 />
          </Button>
        </Tooltip>
      </div>
    </Reorder.Item>
  );
}

function LivePreview({ form, fields }: { form: { title: string; description: string }; fields: FormField[] }) {
  const [answers, setAnswers] = React.useState<Record<string, Answer>>({});
  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardContent className="grid gap-7 p-6 sm:p-10">
        <div className="grid gap-2">
          <h2 className="text-heading-lg font-semibold">{form.title || "Untitled form"}</h2>
          {form.description && <p className="whitespace-pre-wrap text-md text-muted-foreground">{form.description}</p>}
        </div>
        {fields.map((f) => (
          <FieldInput key={f.id} field={f} value={answers[f.id]} onChange={(v) => setAnswers((a) => ({ ...a, [f.id]: v }))} />
        ))}
        <Button size="lg" className="w-full sm:w-fit" disabled>
          Submit
        </Button>
        <p className="text-xs text-muted-foreground">Preview only. Nothing is submitted.</p>
      </CardContent>
    </Card>
  );
}

export function FormBuilder({ form, readOnly }: { form: Form; readOnly?: boolean }) {
  const [title, setTitle] = React.useState(form.title);
  const [description, setDescription] = React.useState(form.description ?? "");
  const [fields, setFields] = React.useState<FormField[]>(form.fields);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [mode, setMode] = React.useState<"build" | "preview">("build");

  const draft = React.useMemo(() => ({ title: title.trim(), description: description.trim() || null, fields }), [title, description, fields]);
  const save = useAutosave(draft, (d) => updateForm({ id: form.id, title: d.title || undefined, description: d.description, fields: d.fields }), { enabled: !readOnly });

  const current = fields.find((f) => f.id === selected) ?? null;
  const update = (f: FormField) => setFields(fields.map((x) => (x.id === f.id ? f : x)));
  const add = (type: FieldType) => {
    const f = newField(type);
    const at = current ? fields.indexOf(current) + 1 : fields.length;
    const next = [...fields];
    next.splice(at, 0, f);
    setFields(next);
    setSelected(f.id);
  };

  return (
    <div className="grid gap-page">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SegmentedControl
          aria-label="Mode"
          value={mode}
          onValueChange={setMode}
          options={[
            { value: "build", label: "Build", icon: <PencilRuler /> },
            { value: "preview", label: "Preview", icon: <Eye /> },
          ]}
        />
        {!readOnly && <SaveStatus state={save.state} onRetry={save.flush} />}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {mode === "preview" ? (
          <motion.div key="preview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <LivePreview form={{ title, description }} fields={fields} />
          </motion.div>
        ) : (
          <motion.div key="build" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid gap-page lg:grid-cols-[minmax(0,1fr)_22rem]">
            <Card>
              <CardContent className="grid gap-5 p-4 sm:p-6">
                <div className="grid gap-2 rounded-card p-2">
                  <input
                    aria-label="Form title"
                    placeholder="Form title"
                    value={title}
                    maxLength={150}
                    disabled={readOnly}
                    onChange={(e) => setTitle(e.target.value)}
                    className="rounded-control bg-transparent px-2 py-1 text-heading-lg font-semibold outline-none placeholder:text-faint-foreground hover:bg-surface-hover focus-visible:bg-surface focus-visible:ring-3 focus-visible:ring-ring/20"
                  />
                  <textarea
                    aria-label="Form description"
                    placeholder="Add a short introduction (optional)"
                    value={description}
                    maxLength={2000}
                    disabled={readOnly}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="field-sizing-content resize-none rounded-control bg-transparent px-2 py-1 text-md text-muted-foreground outline-none placeholder:text-faint-foreground hover:bg-surface-hover focus-visible:bg-surface focus-visible:ring-3 focus-visible:ring-ring/20"
                  />
                </div>

                {fields.length === 0 ? (
                  <div className="grid justify-items-center gap-3 rounded-card border-2 border-dashed border-border-strong px-6 py-12 text-center">
                    <p className="font-medium">Your form is empty</p>
                    <p className="max-w-sm text-sm text-muted-foreground">Add your first question. You can reorder, change and remove questions any time.</p>
                    {!readOnly && <AddQuestionMenu onAdd={add} variant="primary" />}
                  </div>
                ) : (
                  <Reorder.Group axis="y" values={fields} onReorder={readOnly ? () => {} : setFields} className="grid gap-3">
                    {fields.map((f, i) => (
                      <CanvasItem
                        key={f.id}
                        field={f}
                        index={i}
                        count={fields.length}
                        selected={selected === f.id}
                        onSelect={() => !readOnly && setSelected(f.id)}
                        onMove={(d) => {
                          const next = [...fields];
                          [next[i], next[i + d]] = [next[i + d], next[i]];
                          setFields(next);
                        }}
                        onDuplicate={() => {
                          const copy = { ...f, id: uid(), options: f.options?.map((o) => ({ ...o, id: uid() })) ?? null };
                          const next = [...fields];
                          next.splice(i + 1, 0, copy);
                          setFields(next);
                          setSelected(copy.id);
                        }}
                        onRemove={() => {
                          setFields(fields.filter((x) => x.id !== f.id));
                          if (selected === f.id) setSelected(null);
                        }}
                      />
                    ))}
                  </Reorder.Group>
                )}
                {fields.length > 0 && !readOnly && (
                  <div>
                    <AddQuestionMenu onAdd={add} />
                  </div>
                )}
              </CardContent>
            </Card>

            <aside className="lg:sticky lg:top-[calc(var(--spacing-topbar)+1rem)] lg:self-start" aria-label="Question settings">
              <Card>
                <CardContent className="p-5">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div key={current?.id ?? "none"} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18 }}>
                      {current && !readOnly ? (
                        <Inspector field={current} onChange={update} />
                      ) : (
                        <div className="grid gap-2 py-6 text-center">
                          <p className="font-medium">{readOnly ? "This form is read-only" : "Select a question to edit it"}</p>
                          <p className="text-sm text-muted-foreground">
                            {readOnly ? "You can view this form but your role can’t change it." : "Click any question on the left. Its settings appear here."}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </CardContent>
              </Card>
            </aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
