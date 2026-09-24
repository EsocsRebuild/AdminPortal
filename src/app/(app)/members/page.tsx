import type { Metadata } from "next";
import { Suspense } from "react";

import { Page } from "@/components/layout/page";
import { members } from "@/lib/fixtures";

import { MembersView } from "./_components/members-view";

export const metadata: Metadata = { title: "Members" };

export default function MembersPage() {
  // TODO: fetch from the API, e.g. `await api.get<Paginated<Member>>("/members")`.
  return (
    <Page>
      <Suspense>
        <MembersView members={members} />
      </Suspense>
    </Page>
  );
}
