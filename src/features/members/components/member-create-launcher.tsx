"use client";

import { Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import type { Parish } from "@/features/lookups/queries";

import { MemberFormDialog } from "./member-form-dialog";

/** "Add member" button. `?new=1` opens it too, so other pages can link straight to the form. */
export function MemberCreateLauncher({ parishes }: { parishes: Parish[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const open = params.get("new") === "1";

  const setOpen = (next: boolean) => {
    const q = new URLSearchParams(params.toString());
    if (next) q.set("new", "1");
    else q.delete("new");
    router.replace(q.size ? `${pathname}?${q}` : pathname, { scroll: false });
  };

  return (
    <>
      <Button leftIcon={<Plus />} onClick={() => setOpen(true)}>
        Add member
      </Button>
      <MemberFormDialog open={open} onOpenChange={setOpen} parishes={parishes} />
    </>
  );
}
