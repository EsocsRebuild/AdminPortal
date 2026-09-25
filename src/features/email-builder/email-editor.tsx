"use client";

import { AnimatePresence, motion, Reorder, useDragControls } from "motion/react";
import {
  AlignCenter,
  AlignLeft,
  ArrowDown,
  ArrowUp,
  Copy,
  GripVertical,
  Heading,
  Image as ImageIcon,
  Minus,
  MousePointerClick,
  MoveVertical,
  Pilcrow,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { EmailPreview, type EmailPreviewProps } from "./email-preview";
import { mergeTags, unknownTags } from "./merge-tags";
import { newBlock, newId } from "./presets";
import { blockSchema } from "./schema";
import type { Block, BlockType, EmailDocument } from "./types";

const blockMeta: Record<BlockType, { label: string; icon: LucideIcon; hint: string }> = {
  heading: { label: "Heading", icon: Heading, hint: "A title" },
  text: { label: "Text", icon: Pilcrow, hint: "A paragraph" },
  button: { label: "Button", icon: MousePointerClick, hint: "A link people tap" },
  image: { label: "Image", icon: ImageIcon, hint: "A picture from the web" },
  divider: { label: "Divider", icon: Minus, hint: "A thin line" },
  spacer: { label: "Space", icon: MoveVertical, hint: "Extra room" },
};

const accents = ["#2f4fb4", "#8a6420", "#1f7a5a", "#b3264a", "#111827"];

function summary(block: Block) {
  switch (block.type) {
    case "heading":
    case "text":
      return block.text.split("\n")[0] || "Empty";
    case "button":
      return block.label || "Empty";
    case "image":
      return block.alt || (block.src ? "Image" : "No image yet");
    case "divider":
      return "Line";
    case "spacer":
      return { sm: "Small", md: "Medium", lg: "Large" }[block.size] + " space";
  }
}

function blockErrors(block: Block) {
  const r = blockSchema.safeParse(block);
  const out: Record<string, string> = {};
  if (!r.success) for (const i of r.error.issues) out[String(i.path[0])] ??= i.message;
  return out;
}

function AlignPicker({
  value,
  onChange,
}: {
  value: "left" | "center";
  onChange: (v: "left" | "center") => void;
}) {
  return (
    <SegmentedControl
      size="sm"
      aria-label="Alignment"
      value={value}
      onValueChange={onChange}
      options={[
        { value: "left", label: "Left", icon: <AlignLeft /> },
        { value: "center", label: "Centre", icon: <AlignCenter /> },
      ]}
    />
  );
}

function Inspector({ block, onChange }: { block: Block; onChange: (b: Block) => void }) {
  const errors = blockErrors(block);
  const id = (k: string) => `blk-${block.id}-${k}`;
  // Only flag problems once the author has typed something.
  const show = (k: string, v: string) => (v ? errors[k] : undefined);

  switch (block.type) {
    case "heading":
      return (
        <div className="grid gap-3">
          <Field label="Heading" htmlFor={id("text")}>
            <Input
              id={id("text")}
              autoFocus
              value={block.text}
              maxLength={200}
              onChange={(e) => onChange({ ...block, text: e.target.value })}
            />
          </Field>
          <AlignPicker value={block.align} onChange={(align) => onChange({ ...block, align })} />
        </div>
      );
    case "text": {
      const unknown = unknownTags(block.text);
      return (
        <div className="grid gap-3">
          <Field
            label="Text"
            htmlFor={id("text")}
            hint="Wrap words in **double stars** for bold. Press Enter for a new line."
          >
            <Textarea
              id={id("text")}
              autoFocus
              rows={5}
              value={block.text}
              maxLength={5000}
              onChange={(e) => onChange({ ...block, text: e.target.value })}
              aria-describedby={`${id("text")}-msg`}
            />
          </Field>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Insert:</span>
            {mergeTags.map((t) => (
              <button
                key={t.tag}
                type="button"
                onClick={() =>
                  onChange({
                    ...block,
                    text: `${block.text}${block.text && !block.text.endsWith(" ") ? " " : ""}${t.tag}`,
                  })
                }
                className="cursor-pointer rounded-full border border-border px-2 py-0.5 text-xs transition-colors hover:border-primary hover:text-primary"
              >
                {t.label}
              </button>
            ))}
          </div>
          {unknown.length > 0 && (
            <p className="text-xs text-warning-soft-foreground">
              {unknown.join(", ")} won’t be replaced. Use the Insert buttons above.
            </p>
          )}
          <AlignPicker value={block.align} onChange={(align) => onChange({ ...block, align })} />
        </div>
      );
    }
    case "button":
      return (
        <div className="grid gap-3">
          <Field label="Button text" htmlFor={id("label")} error={show("label", block.label)}>
            <Input
              id={id("label")}
              autoFocus
              value={block.label}
              maxLength={60}
              onChange={(e) => onChange({ ...block, label: e.target.value })}
            />
          </Field>
          <Field
            label="Link"
            htmlFor={id("url")}
            error={show("url", block.url)}
            hint="Where people go when they tap it."
          >
            <Input
              id={id("url")}
              type="url"
              inputMode="url"
              placeholder="https://"
              value={block.url}
              onChange={(e) => onChange({ ...block, url: e.target.value })}
              aria-describedby={`${id("url")}-msg`}
            />
          </Field>
          <div className="flex flex-wrap gap-2">
            <AlignPicker value={block.align} onChange={(align) => onChange({ ...block, align })} />
            <SegmentedControl
              size="sm"
              aria-label="Button style"
              value={block.style}
              onValueChange={(style) => onChange({ ...block, style })}
              options={[
                { value: "filled", label: "Solid" },
                { value: "outline", label: "Outline" },
              ]}
            />
          </div>
        </div>
      );
    case "image":
      return (
        <div className="grid gap-3">
          <Field
            label="Image address"
            htmlFor={id("src")}
            error={show("src", block.src)}
            hint="Paste the link to an image that’s already online."
          >
            <Input
              id={id("src")}
              type="url"
              autoFocus
              placeholder="https://"
              value={block.src}
              onChange={(e) => onChange({ ...block, src: e.target.value })}
              aria-describedby={`${id("src")}-msg`}
            />
          </Field>
          <Field
            label="Description"
            htmlFor={id("alt")}
            hint="Read aloud to people using screen readers, and shown if images are off."
          >
            <Input
              id={id("alt")}
              value={block.alt}
              maxLength={200}
              onChange={(e) => onChange({ ...block, alt: e.target.value })}
              aria-describedby={`${id("alt")}-msg`}
            />
          </Field>
          <Field label="Link when tapped" htmlFor={id("href")} optional error={show("href", block.href)}>
            <Input
              id={id("href")}
              type="url"
              placeholder="https://"
              value={block.href}
              onChange={(e) => onChange({ ...block, href: e.target.value })}
            />
          </Field>
          <SegmentedControl
            size="sm"
            aria-label="Image width"
            value={block.width}
            onValueChange={(width) => onChange({ ...block, width })}
            options={[
              { value: "full", label: "Full width" },
              { value: "medium", label: "Medium" },
            ]}
          />
        </div>
      );
    case "spacer":
      return (
        <SegmentedControl
          size="sm"
          aria-label="Space size"
          value={block.size}
          onValueChange={(size) => onChange({ ...block, size })}
          options={[
            { value: "sm", label: "Small" },
            { value: "md", label: "Medium" },
            { value: "lg", label: "Large" },
          ]}
        />
      );
    case "divider":
      return (
        <p className="text-sm text-muted-foreground">A thin line to separate sections. Nothing to set.</p>
      );
  }
}

function BlockRow({
  block,
  index,
  count,
  selected,
  onSelect,
  onChange,
  onMove,
  onDuplicate,
  onRemove,
  disabled,
}: {
  block: Block;
  index: number;
  count: number;
  selected: boolean;
  onSelect: () => void;
  onChange: (b: Block) => void;
  onMove: (dir: -1 | 1) => void;
  onDuplicate: () => void;
  onRemove: () => void;
  disabled?: boolean;
}) {
  const controls = useDragControls();
  const meta = blockMeta[block.type];
  const incomplete = Object.keys(blockErrors(block)).length > 0;

  return (
    <Reorder.Item
      value={block}
      dragListener={false}
      dragControls={controls}
      className={cn(
        "relative rounded-card border bg-surface transition-[border-color,box-shadow]",
        selected
          ? "border-primary/60 shadow-sm ring-3 ring-primary/10"
          : "border-border hover:border-border-strong",
      )}
      whileDrag={{ scale: 1.02, boxShadow: "var(--shadow-lg)", zIndex: 10 }}
    >
      <div className="flex items-center gap-1 p-1.5 pl-1">
        <button
          type="button"
          aria-label="Drag to reorder"
          onPointerDown={(e) => !disabled && controls.start(e)}
          className="grid size-8 shrink-0 cursor-grab touch-none place-items-center rounded-xs text-faint-foreground hover:text-foreground active:cursor-grabbing"
        >
          <GripVertical className="size-4" />
        </button>
        <button
          type="button"
          onClick={onSelect}
          aria-expanded={selected}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 rounded-xs py-1 text-left"
        >
          <span className="grid size-7 shrink-0 place-items-center rounded-xs bg-surface-muted text-muted-foreground">
            <meta.icon className="size-3.5" />
          </span>
          <span className="grid min-w-0">
            <span className="text-xs text-muted-foreground">{meta.label}</span>
            <span className="truncate text-sm">{summary(block)}</span>
          </span>
          {incomplete && (
            <span
              className="ml-auto size-1.5 shrink-0 rounded-full bg-warning"
              role="img"
              aria-label="Needs attention"
            />
          )}
        </button>
        <div className="flex shrink-0 items-center">
          <Tooltip content="Move up">
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Move up"
              disabled={disabled || index === 0}
              onClick={() => onMove(-1)}
            >
              <ArrowUp />
            </Button>
          </Tooltip>
          <Tooltip content="Move down">
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Move down"
              disabled={disabled || index === count - 1}
              onClick={() => onMove(1)}
            >
              <ArrowDown />
            </Button>
          </Tooltip>
          <Tooltip content="Duplicate">
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Duplicate"
              disabled={disabled}
              onClick={onDuplicate}
            >
              <Copy />
            </Button>
          </Tooltip>
          <Tooltip content="Remove">
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Remove"
              disabled={disabled}
              onClick={onRemove}
              className="hover:text-danger"
            >
              <Trash2 />
            </Button>
          </Tooltip>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {selected && !disabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-border-subtle p-3.5">
              <Inspector block={block} onChange={onChange} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
}

export interface EmailEditorProps {
  value: EmailDocument;
  onChange: (doc: EmailDocument) => void;
  disabled?: boolean;
  preview?: Omit<EmailPreviewProps, "document" | "device" | "selectedId" | "onSelect">;
}

/** Block-based email editor with a live preview. Controlled. */
export function EmailEditor({ value, onChange, disabled, preview }: EmailEditorProps) {
  const [selected, setSelected] = React.useState<string | null>(value.blocks[0]?.id ?? null);
  const [device, setDevice] = React.useState<"desktop" | "mobile">("desktop");
  const blocks = value.blocks;

  const setBlocks = (next: Block[]) => onChange({ ...value, blocks: next });
  const update = (b: Block) => setBlocks(blocks.map((x) => (x.id === b.id ? b : x)));
  const add = (type: BlockType) => {
    const b = newBlock(type);
    const at = selected ? blocks.findIndex((x) => x.id === selected) + 1 : blocks.length;
    const next = [...blocks];
    next.splice(at || blocks.length, 0, b);
    setBlocks(next);
    setSelected(b.id);
  };
  const move = (i: number, dir: -1 | 1) => {
    const next = [...blocks];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    setBlocks(next);
  };

  return (
    <div className="grid gap-page lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
      <div className="grid content-start gap-5">
        <section className="grid gap-2" aria-label="Email content">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Content</h3>
            <span className="text-xs text-muted-foreground">{blocks.length} blocks</span>
          </div>
          <Reorder.Group axis="y" values={blocks} onReorder={setBlocks} className="grid gap-2">
            {blocks.map((b, i) => (
              <BlockRow
                key={b.id}
                block={b}
                index={i}
                count={blocks.length}
                disabled={disabled}
                selected={selected === b.id}
                onSelect={() => setSelected(selected === b.id ? null : b.id)}
                onChange={update}
                onMove={(dir) => move(i, dir)}
                onDuplicate={() => {
                  const copy = { ...b, id: newId() };
                  const next = [...blocks];
                  next.splice(i + 1, 0, copy);
                  setBlocks(next);
                  setSelected(copy.id);
                }}
                onRemove={() => {
                  setBlocks(blocks.filter((x) => x.id !== b.id));
                  if (selected === b.id) setSelected(null);
                }}
              />
            ))}
          </Reorder.Group>
        </section>

        {!disabled && (
          <section className="grid gap-2" aria-label="Add a block">
            <h3 className="text-sm font-medium">Add a block</h3>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(blockMeta) as BlockType[]).map((type) => {
                const m = blockMeta[type];
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => add(type)}
                    className="group grid cursor-pointer justify-items-center gap-1.5 rounded-card border border-border bg-surface px-2 py-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-ring active:scale-[0.97]"
                  >
                    <m.icon className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                    <span className="text-xs font-medium">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        <section className="grid gap-3" aria-label="Style">
          <h3 className="text-sm font-medium">Style</h3>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Accent</span>
            {accents.map((c) => (
              <button
                key={c}
                type="button"
                disabled={disabled}
                aria-label={`Accent colour ${c}`}
                aria-pressed={value.settings.accentColor === c}
                onClick={() => onChange({ ...value, settings: { ...value.settings, accentColor: c } })}
                className={cn(
                  "size-7 cursor-pointer rounded-full ring-offset-2 ring-offset-surface transition-shadow",
                  value.settings.accentColor === c && "ring-2 ring-foreground/60",
                )}
                style={{ background: c }}
              />
            ))}
            <label
              className="relative size-7 cursor-pointer overflow-hidden rounded-full border border-dashed border-border-strong"
              aria-label="Custom colour"
            >
              <input
                type="color"
                disabled={disabled}
                value={value.settings.accentColor}
                onChange={(e) =>
                  onChange({ ...value, settings: { ...value.settings, accentColor: e.target.value } })
                }
                className="absolute inset-0 size-full cursor-pointer opacity-0"
              />
              <span className="grid size-full place-items-center text-xs text-muted-foreground">+</span>
            </label>
          </div>
          <SegmentedControl
            size="sm"
            aria-label="Background"
            value={value.settings.background}
            onValueChange={(background) =>
              !disabled && onChange({ ...value, settings: { ...value.settings, background } })
            }
            options={[
              { value: "muted", label: "Soft grey background" },
              { value: "light", label: "White background" },
            ]}
          />
        </section>
      </div>

      <div className="grid content-start gap-3 lg:sticky lg:top-[calc(var(--spacing-topbar)+1rem)] lg:self-start">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Preview</h3>
          <SegmentedControl
            size="sm"
            aria-label="Preview size"
            value={device}
            onValueChange={setDevice}
            options={[
              { value: "desktop", label: "Computer" },
              { value: "mobile", label: "Phone" },
            ]}
          />
        </div>
        <EmailPreview
          {...preview}
          document={value}
          device={device}
          selectedId={selected}
          onSelect={disabled ? undefined : setSelected}
        />
      </div>
    </div>
  );
}
