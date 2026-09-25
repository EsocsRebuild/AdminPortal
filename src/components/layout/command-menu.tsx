"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { FormInput, Laptop, MailPlus, Moon, PanelLeft, Rows3, Search, Sun, UserPlus, UserRoundPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import * as React from "react";

import { useSession } from "@/components/auth/session-provider";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DialogOverlay } from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";
import { useHotkey } from "@/hooks/use-hotkey";
import { setPreference } from "@/hooks/use-preference";
import { can } from "@/lib/permissions";
import { cn } from "@/lib/utils";

import { useVisibleNavigation } from "./shell-context";

const quickActions = [
  { label: "Add a member", href: "/members?new=1", icon: UserRoundPlus, permission: "members:manage" },
  { label: "Create an email campaign", href: "/campaigns/new", icon: MailPlus, permission: "campaigns:manage" },
  { label: "Build a form", href: "/forms/new", icon: FormInput, permission: "forms:manage" },
  { label: "Invite an administrator", href: "/users?invite=1", icon: UserPlus, permission: "users:manage" },
] as const;

/** Global search and quick actions. Opens with ⌘K or `/`. */
export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const user = useSession();
  const groups = useVisibleNavigation();
  const { setTheme } = useTheme();

  useHotkey("mod+k", () => setOpen((o) => !o), { allowInInputs: true });
  useHotkey("/", () => setOpen(true));

  const run = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          className={cn(
            "group flex h-control-md cursor-pointer items-center gap-2 rounded-control text-muted-foreground transition-colors",
            "focus-visible:outline-2 focus-visible:outline-ring",
            // Icon button on phones, search field from `md`.
            "w-control-md justify-center hover:bg-surface-hover hover:text-foreground",
            "md:w-64 md:justify-start md:border md:border-border md:bg-surface md:px-2.5 md:shadow-xs md:hover:border-border-strong md:hover:bg-surface lg:w-72",
          )}
          aria-label="Search"
        >
          <Search className="size-4 shrink-0" />
          <span className="hidden flex-1 text-left text-base text-subtle-foreground md:block">
            Search or jump to…
          </span>
          <Kbd keys={["⌘", "K"]} className="hidden md:inline-flex" />
        </button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogOverlay />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(
            "fixed inset-x-3 top-3 z-50 overflow-hidden rounded-panel border border-border shadow-lg",
            "sm:inset-x-auto sm:top-[14vh] sm:left-1/2 sm:w-full sm:max-w-xl sm:-translate-x-1/2",
            "data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in",
          )}
        >
          <DialogPrimitive.Title className="sr-only">Command menu</DialogPrimitive.Title>
          <Command loop>
            <CommandInput placeholder="Search pages and actions…" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {groups.map(({ items, ...group }) => {
                return (
                  <CommandGroup key={group.title} heading={group.title}>
                    {items.map((item) => (
                      <CommandItem
                        key={item.href}
                        value={`${item.title} ${item.keywords?.join(" ") ?? ""}`}
                        onSelect={() => run(() => router.push(item.href))}
                      >
                        <item.icon />
                        {item.title}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                );
              })}
              <CommandGroup heading="Actions">
                {quickActions
                  .filter((a) => can(user, a.permission))
                  .map((a) => (
                    <CommandItem key={a.href} onSelect={() => run(() => router.push(a.href))}>
                      <a.icon /> {a.label}
                    </CommandItem>
                  ))}
                <CommandItem onSelect={() => run(() => setTheme("light"))}>
                  <Sun /> Switch to light mode
                </CommandItem>
                <CommandItem onSelect={() => run(() => setTheme("dark"))}>
                  <Moon /> Switch to dark mode
                </CommandItem>
                <CommandItem onSelect={() => run(() => setTheme("system"))}>
                  <Laptop /> Use system colour mode
                </CommandItem>
                <CommandItem
                  value="compact density"
                  onSelect={() => run(() => setPreference("density", "compact"))}
                >
                  <Rows3 /> Compact density
                </CommandItem>
                <CommandItem
                  value="comfortable density"
                  onSelect={() => run(() => setPreference("density", "comfortable"))}
                >
                  <Rows3 /> Comfortable density
                </CommandItem>
                <CommandItem
                  value="toggle sidebar"
                  onSelect={() =>
                    run(() => {
                      const collapsed = document.documentElement.dataset.sidebar === "collapsed";
                      setPreference("sidebar", collapsed ? "expanded" : "collapsed");
                    })
                  }
                >
                  <PanelLeft /> Toggle sidebar
                </CommandItem>
              </CommandGroup>
            </CommandList>
            <div className="hidden items-center gap-4 border-t border-border px-4 py-2 text-xs text-subtle-foreground sm:flex">
              <span className="flex items-center gap-1.5">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd> navigate
              </span>
              <span className="flex items-center gap-1.5">
                <Kbd>↵</Kbd> open
              </span>
              <span className="flex items-center gap-1.5">
                <Kbd>esc</Kbd> close
              </span>
            </div>
          </Command>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
