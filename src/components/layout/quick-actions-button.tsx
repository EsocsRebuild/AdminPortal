"use client";

import * as React from "react";
import { Plus, Sparkles, UserPlus, UsersRound, HeartHandshake } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd } from "@/components/ui/kbd";
import { QuickActionsModal, type QuickActionType } from "@/components/modals/quick-actions-modal";

export function QuickActionButton() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<QuickActionType>("member");

  function openAction(tab: QuickActionType) {
    setActiveTab(tab);
    setModalOpen(true);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus className="size-4" />}
            className="hidden font-semibold sm:inline-flex"
          >
            Quick Action
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex items-center gap-1.5 text-2xs font-semibold uppercase text-muted-foreground">
            <Sparkles className="size-3 text-primary" /> Instant Operations
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => openAction("member")}>
            <UserPlus className="size-4 text-primary" />
            <span className="flex-1">Add Member</span>
            <Kbd keys={["Alt", "N"]} />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openAction("headcount")}>
            <UsersRound className="size-4 text-emerald-500" />
            <span className="flex-1">Record Headcount</span>
            <Kbd keys={["Alt", "H"]} />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openAction("prayer")}>
            <HeartHandshake className="size-4 text-amber-500" />
            <span className="flex-1">Prayer / Pastoral</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Phone Icon Button */}
      <Button
        size="icon-sm"
        variant="primary"
        onClick={() => openAction("member")}
        className="sm:hidden"
        aria-label="Quick Action"
      >
        <Plus className="size-4" />
      </Button>

      <QuickActionsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialTab={activeTab}
      />
    </>
  );
}
