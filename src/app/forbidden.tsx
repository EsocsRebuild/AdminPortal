import { ShieldAlert } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function Forbidden() {
  return (
    <main className="grid min-h-[70dvh] place-items-center px-gutter">
      <EmptyState
        icon={<ShieldAlert />}
        title="You don’t have access to this page"
        description="Your role doesn’t include this area. If you need it for your work, ask an administrator to update your role."
        action={
          <Button asChild>
            <Link href="/dashboard">Go to the dashboard</Link>
          </Button>
        }
      />
    </main>
  );
}
