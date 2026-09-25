"use client";

import { CalendarX } from "lucide-react";
import { useRouter } from "next/navigation";

import { Can } from "@/components/auth/session-provider";
import { useModals } from "@/components/modals/modal-provider";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";

import { unscheduleCampaign } from "../actions";

export function UnscheduleButton({ id }: { id: string }) {
  const router = useRouter();
  const modals = useModals();
  const run = useAction(unscheduleCampaign, {
    success: "Schedule cancelled. It’s a draft again.",
    onSuccess: () => router.push(`/campaigns/${id}/edit?step=review`),
  });
  return (
    <Can permission="campaigns:send">
      <Button
        variant="secondary"
        leftIcon={<CalendarX />}
        loading={run.pending}
        onClick={async () => {
          if (await modals.confirm({ title: "Cancel the schedule?", description: "The campaign goes back to draft so you can edit it.", confirmLabel: "Cancel schedule" }))
            await run.run({ id });
        }}
      >
        Cancel schedule
      </Button>
    </Can>
  );
}
