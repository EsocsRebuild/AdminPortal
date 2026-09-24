"use client";

import * as RadioPrimitive from "@radix-ui/react-radio-group";
import { Check, Monitor, Moon, Rows3, Rows4, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Field, Fieldset } from "@/components/ui/field";
import { RadioCard } from "@/components/ui/radio-group";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useMounted } from "@/hooks/use-mounted";
import { usePreference } from "@/hooks/use-preference";
import type { Preferences } from "@/lib/preferences";
import { cn } from "@/lib/utils";

const accents: { value: Preferences["accent"]; label: string; swatch: string }[] = [
  { value: "royal", label: "Royal", swatch: "bg-royal-600" },
  { value: "gold", label: "Gold", swatch: "bg-gold-600" },
  { value: "emerald", label: "Emerald", swatch: "bg-[oklch(0.52_0.12_165)]" },
  { value: "rose", label: "Rose", swatch: "bg-[oklch(0.55_0.19_10)]" },
];

const modes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

/** Mini preview of the shell in a given mode, drawn with fixed colours. */
function ModePreview({ mode }: { mode: "light" | "dark" | "system" }) {
  const pane = (dark: boolean) => (
    <div className={cn("flex h-full flex-1 gap-1 p-1.5", dark ? "bg-ink-975" : "bg-ink-50")}>
      <div className={cn("w-1/4 rounded-[3px]", dark ? "bg-ink-925" : "bg-white")} />
      <div className="grid flex-1 content-start gap-1">
        <div className={cn("h-1.5 w-1/2 rounded-full", dark ? "bg-ink-700" : "bg-ink-300")} />
        <div className={cn("h-6 rounded-[3px]", dark ? "bg-ink-925" : "bg-white")} />
        <div className="h-1.5 w-1/3 rounded-full bg-primary" />
      </div>
    </div>
  );
  return (
    <div aria-hidden className="flex h-20 overflow-hidden rounded-control border border-border">
      {mode === "system" ? (
        <>
          {pane(false)}
          {pane(true)}
        </>
      ) : (
        pane(mode === "dark")
      )}
    </div>
  );
}

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const [accent, setAccent] = usePreference("accent");
  const [density, setDensity] = usePreference("density");
  const [tone, setTone] = usePreference("sidebarTone");

  return (
    <Fieldset
      legend="Appearance"
      description="Saved on this device. Colour mode follows your system by default."
    >
      <div className="grid gap-2">
        <p className="text-sm font-medium">Colour mode</p>
        <RadioPrimitive.Root
          value={mounted ? theme : undefined}
          onValueChange={setTheme}
          aria-label="Colour mode"
          className="grid grid-cols-3 gap-3"
        >
          {modes.map((m) => (
            <RadioCard key={m.value} value={m.value} className="grid gap-2.5 p-2.5">
              <ModePreview mode={m.value} />
              <span className="flex items-center gap-1.5 text-sm font-medium">
                <m.icon className="size-3.5 text-subtle-foreground" /> {m.label}
              </span>
            </RadioCard>
          ))}
        </RadioPrimitive.Root>
      </div>

      <div className="grid gap-2">
        <p className="text-sm font-medium" id="accent-label">
          Accent colour
        </p>
        <RadioPrimitive.Root
          value={accent}
          onValueChange={(v) => setAccent(v as Preferences["accent"])}
          aria-labelledby="accent-label"
          orientation="horizontal"
          className="flex flex-wrap gap-3"
        >
          {accents.map((a) => (
            <RadioPrimitive.Item
              key={a.value}
              value={a.value}
              className="group flex cursor-pointer flex-col items-center gap-1.5 rounded-control p-1 focus-visible:outline-2 focus-visible:outline-ring"
            >
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-full text-white ring-offset-2 ring-offset-surface transition-shadow group-data-[state=checked]:ring-2 group-data-[state=checked]:ring-foreground/70",
                  a.swatch,
                )}
              >
                <Check className="size-4 opacity-0 group-data-[state=checked]:opacity-100" />
              </span>
              <span className="text-xs text-muted-foreground group-data-[state=checked]:text-foreground">
                {a.label}
              </span>
            </RadioPrimitive.Item>
          ))}
        </RadioPrimitive.Root>
      </div>

      <Field
        label="Density"
        htmlFor="density"
        hint="Compact fits more rows on screen. Touch devices keep larger targets."
        inline
      >
        <SegmentedControl
          id="density"
          aria-label="Density"
          value={density}
          onValueChange={setDensity}
          options={[
            { value: "comfortable", label: "Comfortable", icon: <Rows3 /> },
            { value: "compact", label: "Compact", icon: <Rows4 /> },
          ]}
        />
      </Field>

      <Field
        label="Sidebar"
        htmlFor="sidebar-tone"
        hint="A deep royal sidebar gives the portal a stronger brand presence."
        inline
      >
        <SegmentedControl
          id="sidebar-tone"
          aria-label="Sidebar style"
          value={tone}
          onValueChange={setTone}
          options={[
            { value: "default", label: "Neutral" },
            { value: "brand", label: "Royal" },
          ]}
        />
      </Field>
    </Fieldset>
  );
}
