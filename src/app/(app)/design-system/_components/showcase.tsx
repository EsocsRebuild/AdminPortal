"use client";

import {
  ArrowRight,
  Bell,
  Download,
  Inbox,
  Mail,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Settings,
  Trash2,
  Users,
} from "lucide-react";
import * as React from "react";

import { StatCard } from "@/components/blocks/stat-card";
import { StatusBadge } from "@/components/blocks/status-badge";
import { SectionHeader } from "@/components/layout/page";
import { Alert } from "@/components/ui/alert";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsCount, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import { sleep } from "@/lib/utils";

import { AccountDemos } from "./account-demos";

const sections = [
  ["colors", "Colour"],
  ["type", "Typography"],
  ["buttons", "Buttons"],
  ["badges", "Badges"],
  ["forms", "Forms"],
  ["overlays", "Overlays"],
  ["feedback", "Feedback"],
  ["data", "Data display"],
  ["account", "Account & motion"],
  ["tokens", "Radius & depth"],
] as const;

const swatches = [
  ["background", "bg-background"],
  ["surface", "bg-surface"],
  ["surface-muted", "bg-surface-muted"],
  ["surface-sunken", "bg-surface-sunken"],
  ["foreground", "bg-foreground"],
  ["muted-foreground", "bg-muted-foreground"],
  ["border", "bg-border"],
  ["primary", "bg-primary"],
  ["primary-soft", "bg-primary-soft"],
  ["brand", "bg-brand"],
  ["brand-accent", "bg-brand-accent"],
  ["inverse", "bg-inverse"],
  ["success", "bg-success"],
  ["warning", "bg-warning"],
  ["danger", "bg-danger"],
  ["info", "bg-info"],
  ["chart-1", "bg-chart-1"],
  ["chart-2", "bg-chart-2"],
];

function Demo({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="grid gap-3">
      {title && <p className="text-xs font-medium text-muted-foreground">{title}</p>}
      <div className={className ?? "flex flex-wrap items-center gap-3"}>{children}</div>
    </div>
  );
}

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="grid scroll-mt-20 gap-4">
      <SectionHeader title={title} description={description} />
      <Card>
        <CardContent className="grid gap-8 py-6">{children}</CardContent>
      </Card>
    </section>
  );
}

export function Showcase() {
  const [range, setRange] = React.useState<"day" | "week" | "month">("week");
  const [confirm, setConfirm] = React.useState(false);

  return (
    <div className="grid gap-10 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-12">
      <nav aria-label="Sections" className="lg:sticky lg:top-20 lg:self-start">
        <ul className="scrollbar-none flex gap-1 overflow-x-auto mask-fade-x px-1 lg:grid lg:[mask-image:none] lg:px-0">
          {sections.map(([id, label]) => (
            <li key={id} className="shrink-0">
              <a
                href={`#${id}`}
                className="block rounded-control px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground max-lg:border max-lg:border-border max-lg:bg-surface"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="grid min-w-0 gap-12">
        <Section
          id="colors"
          title="Colour"
          description="Semantic tokens. Use these, never raw palette values, so themes work for free."
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {swatches.map(([name, cls]) => (
              <div key={name} className="grid gap-1.5">
                <div className={`h-14 rounded-control border border-border ${cls}`} />
                <code className="truncate font-mono text-2xs text-muted-foreground">{name}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="type"
          title="Typography"
          description="Geist for UI, Geist Mono for IDs and code, Cormorant for brand moments."
        >
          <div className="grid gap-4">
            <p className="text-heading-xl font-semibold">Heading XL — Page hero</p>
            <p className="text-heading-lg font-semibold">Heading LG — Page title</p>
            <p className="text-heading-md font-semibold">Heading MD — Section</p>
            <p className="text-heading-sm font-semibold">Heading SM — Card title</p>
            <p className="text-md">Body MD — Lead text and descriptions.</p>
            <p className="text-base">Body — The default 14px size for dense admin interfaces.</p>
            <p className="text-sm text-muted-foreground">Small — Secondary information and helper text.</p>
            <p className="text-overline font-semibold text-subtle-foreground uppercase">Overline label</p>
            <p className="tabular text-metric font-semibold">₦18,450,000</p>
            <p className="font-mono text-sm">MBR-01041 · tabular 0123456789</p>
            <p className="font-brand text-4xl font-semibold">Eternal Sacred Order</p>
          </div>
        </Section>

        <Section id="buttons" title="Buttons">
          <Demo title="Variants">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="soft">Soft</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="inverse">Inverse</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="danger-soft">Danger soft</Button>
            <Button variant="link">Link</Button>
          </Demo>
          <Demo title="Sizes">
            <Button size="xs">Extra small</Button>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </Demo>
          <Demo title="Icons, states">
            <Button leftIcon={<Plus />}>New member</Button>
            <Button variant="secondary" rightIcon={<ArrowRight />}>
              Continue
            </Button>
            <Button loading>Saving</Button>
            <Button disabled>Disabled</Button>
            <Tooltip content="Settings">
              <Button variant="secondary" size="icon" aria-label="Settings">
                <Settings />
              </Button>
            </Tooltip>
            <Tooltip content="Search" shortcut="⌘K">
              <Button variant="ghost" size="icon" aria-label="Search">
                <Search />
              </Button>
            </Tooltip>
          </Demo>
        </Section>

        <Section id="badges" title="Badges">
          <Demo>
            <Badge>Neutral</Badge>
            <Badge tone="primary">Primary</Badge>
            <Badge tone="success" dot>
              Success
            </Badge>
            <Badge tone="warning" dot>
              Warning
            </Badge>
            <Badge tone="danger" dot="pulse">
              Live issue
            </Badge>
            <Badge tone="info">Info</Badge>
            <Badge tone="outline">Outline</Badge>
            <Badge tone="solid" shape="square">
              Solid
            </Badge>
          </Demo>
          <Demo title="Status badges">
            {["active", "pending", "scheduled", "draft", "suspended"].map((s) => (
              <StatusBadge key={s} status={s} />
            ))}
          </Demo>
        </Section>

        <Section id="forms" title="Forms">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" htmlFor="ds-name" hint="As it appears on the register." required>
              <Input id="ds-name" placeholder="Alex Example" aria-describedby="ds-name-msg" />
            </Field>
            <Field label="Email" htmlFor="ds-email" error="Enter a valid email address.">
              <Input
                id="ds-email"
                defaultValue="adaeze@"
                prefix={<Mail />}
                aria-invalid
                aria-describedby="ds-email-msg"
              />
            </Field>
            <Field label="Parish" htmlFor="ds-parish">
              <Select defaultValue="lagos">
                <SelectTrigger id="ds-parish">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lagos">Mount Zion, Lagos</SelectItem>
                  <SelectItem value="abuja">Seraph Temple, Abuja</SelectItem>
                  <SelectItem value="ibadan">Holy Trinity, Ibadan</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Disabled" htmlFor="ds-disabled">
              <Input id="ds-disabled" disabled defaultValue="Read only value" />
            </Field>
            <Field label="Notes" htmlFor="ds-notes" optional className="sm:col-span-2">
              <Textarea id="ds-notes" placeholder="Grows as you type…" />
            </Field>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <Demo title="Checkbox" className="grid gap-3">
              <Checkbox label="Email updates" defaultChecked />
              <Checkbox label="SMS updates" description="Carrier rates apply." />
              <Checkbox label="Indeterminate" checked="indeterminate" />
            </Demo>
            <Demo title="Radio" className="grid gap-3">
              <RadioGroup defaultValue="monthly">
                <RadioGroupItem value="weekly" label="Weekly" />
                <RadioGroupItem value="monthly" label="Monthly" />
                <RadioGroupItem value="yearly" label="Yearly" disabled />
              </RadioGroup>
            </Demo>
            <Demo title="Switch" className="grid gap-3">
              <Switch label="Two-factor auth" defaultChecked />
              <Switch label="Small switch" size="sm" />
              <Switch label="Disabled" disabled />
            </Demo>
          </div>
          <Demo title="Segmented control">
            <SegmentedControl
              aria-label="Range"
              value={range}
              onValueChange={setRange}
              options={[
                { value: "day", label: "Day" },
                { value: "week", label: "Week" },
                { value: "month", label: "Month" },
              ]}
            />
          </Demo>
        </Section>

        <Section id="overlays" title="Overlays" description="Dialogs become bottom sheets on phones.">
          <Demo>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename parish</DialogTitle>
                  <DialogDescription>This updates the name everywhere it appears.</DialogDescription>
                </DialogHeader>
                <DialogBody>
                  <Field label="Parish name" htmlFor="ds-dlg">
                    <Input id="ds-dlg" defaultValue="Mount Zion, Lagos" />
                  </Field>
                </DialogBody>
                <DialogFooter>
                  <Button variant="secondary">Cancel</Button>
                  <Button>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary">Sheet</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Member details</SheetTitle>
                  <SheetDescription>Side panel for records and long edits.</SheetDescription>
                </SheetHeader>
                <SheetBody>
                  <SkeletonText lines={6} />
                </SheetBody>
                <SheetFooter>
                  <Button>Done</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            <Button variant="danger-soft" onClick={() => setConfirm(true)}>
              Confirm dialog
            </Button>
            <ConfirmDialog
              open={confirm}
              onOpenChange={setConfirm}
              tone="danger"
              title="Delete this event?"
              description="Registrations will be cancelled and attendees notified."
              confirmLabel="Delete event"
              onConfirm={() => sleep(700)}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" rightIcon={<MoreHorizontal />}>
                  Menu
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>
                  <Pencil /> Edit <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download /> Export
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem tone="danger">
                  <Trash2 /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary">Popover</Button>
              </PopoverTrigger>
              <PopoverContent className="grid gap-2">
                <p className="font-semibold">Quick note</p>
                <Textarea rows={2} placeholder="Add a note…" />
                <Button size="sm">Save note</Button>
              </PopoverContent>
            </Popover>
          </Demo>
          <Demo title="Toasts">
            <Button
              variant="secondary"
              onClick={() =>
                toast.success("Member approved", { description: "Alex Example can now sign in." })
              }
            >
              Success
            </Button>
            <Button
              variant="secondary"
              onClick={() => toast.error("Payout failed", { description: "Bank rejected the transfer." })}
            >
              Error
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                toast("Event archived", { action: { label: "Undo", onClick: () => toast("Restored") } })
              }
            >
              With action
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                toast.promise(sleep(1500), {
                  loading: "Exporting…",
                  success: "Export ready",
                  error: "Failed",
                })
              }
            >
              Promise
            </Button>
          </Demo>
        </Section>

        <Section id="feedback" title="Feedback">
          <div className="grid gap-3">
            <Alert tone="info" title="Scheduled maintenance">
              The portal will be read-only on Sunday from 02:00 to 03:00.
            </Alert>
            <Alert tone="success" title="Import complete">
              1,204 members were imported.
            </Alert>
            <Alert
              tone="warning"
              title="Remittance overdue"
              action={
                <Button size="sm" variant="secondary">
                  Review
                </Button>
              }
            >
              3 parishes haven&apos;t submitted September remittances.
            </Alert>
            <Alert tone="danger" title="Payout failed">
              The bank rejected the transfer to Grace Parish.
            </Alert>
          </div>
          <Demo title="Progress & loading" className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-3">
              <Progress value={72} aria-label="Primary progress" />
              <Progress value={94} tone="success" aria-label="Success progress" />
              <Progress value={38} tone="warning" size="sm" aria-label="Warning progress" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner /> Syncing…
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <SkeletonText lines={2} className="flex-1" />
            </div>
          </Demo>
          <Card variant="outline">
            <EmptyState
              icon={<Inbox />}
              title="No messages yet"
              description="Announcements you send to parishes will appear here."
              action={<Button leftIcon={<Plus />}>New announcement</Button>}
            />
          </Card>
        </Section>

        <Section id="data" title="Data display">
          <div className="grid gap-page sm:grid-cols-2">
            <StatCard
              label="Total members"
              value="48,294"
              delta={0.042}
              trend={[40, 42, 41, 44, 46, 45, 48, 50, 53, 58]}
              icon={<Users />}
            />
            <StatCard
              label="Failed payments"
              value="7"
              delta={-0.3}
              invertDelta
              trend={[12, 11, 12, 10, 9, 9, 8, 7]}
              icon={<Bell />}
            />
          </div>
          <Demo title="Avatars">
            <Avatar name="Alex Example" size="xs" />
            <Avatar name="Sam Sample" size="sm" />
            <Avatar name="Kim Demo" status="online" />
            <Avatar name="Jo Placeholder" size="lg" status="away" />
            <Avatar name="Lee Test" size="xl" />
            <AvatarGroup
              people={[
                "Alex Example",
                "Sam Sample",
                "Kim Demo",
                "Jo Placeholder",
                "Lee Test",
                "Max Preview",
              ].map((name) => ({ name }))}
            />
          </Demo>
          <Demo title="Tabs" className="grid gap-6">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="members">
                  Members <TabsCount>128</TabsCount>
                </TabsTrigger>
                <TabsTrigger value="giving">Giving</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="text-muted-foreground">
                Line tabs for page sections.
              </TabsContent>
              <TabsContent value="members" className="text-muted-foreground">
                128 members.
              </TabsContent>
              <TabsContent value="giving" className="text-muted-foreground">
                Giving history.
              </TabsContent>
            </Tabs>
            <Tabs defaultValue="list">
              <TabsList variant="pill">
                <TabsTrigger value="list">List</TabsTrigger>
                <TabsTrigger value="board">Board</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
              </TabsList>
              <TabsContent value="list" className="text-muted-foreground">
                Pill tabs for view switches.
              </TabsContent>
              <TabsContent value="board" className="text-muted-foreground">
                Board view.
              </TabsContent>
              <TabsContent value="calendar" className="text-muted-foreground">
                Calendar view.
              </TabsContent>
            </Tabs>
          </Demo>
          <Demo title="Keyboard">
            <Kbd keys={["⌘", "K"]} /> <span className="text-sm text-muted-foreground">Search</span>
            <Kbd keys={["⌘", "B"]} /> <span className="text-sm text-muted-foreground">Toggle sidebar</span>
          </Demo>
          <Card>
            <CardHeader
              title="Card header"
              description="With description and actions"
              actions={
                <Button size="sm" variant="secondary">
                  Action
                </Button>
              }
            />
            <CardContent className="text-muted-foreground">
              Cards group related content. Padding follows density.
            </CardContent>
            <CardFooter>Updated 2 minutes ago</CardFooter>
          </Card>
        </Section>

        <Section
          id="account"
          title="Account & motion"
          description="Building blocks for sign-up, verification and celebratory moments."
        >
          <AccountDemos />
        </Section>

        <Section id="tokens" title="Radius & depth">
          <Demo title="Radius">
            {[
              ["xs", "rounded-xs"],
              ["control", "rounded-control"],
              ["card", "rounded-card"],
              ["panel", "rounded-panel"],
            ].map(([n, c]) => (
              <div key={n} className="grid justify-items-center gap-1.5">
                <div className={`size-16 border border-border-strong bg-surface-muted ${c}`} />
                <code className="font-mono text-2xs text-muted-foreground">{n}</code>
              </div>
            ))}
          </Demo>
          <Demo title="Shadow">
            {["shadow-xs", "shadow-sm", "shadow-md", "shadow-lg"].map((s) => (
              <div key={s} className="grid justify-items-center gap-1.5">
                <div className={`size-16 rounded-card bg-surface-raised ${s}`} />
                <code className="font-mono text-2xs text-muted-foreground">{s}</code>
              </div>
            ))}
          </Demo>
        </Section>
      </div>
    </div>
  );
}
