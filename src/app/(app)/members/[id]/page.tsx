import { ArrowLeft, Mail, MailCheck, MailX, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { StatusBadge } from "@/components/blocks/status-badge";
import { Page } from "@/components/layout/page";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getParishes } from "@/features/lookups/queries";
import { MemberActions } from "@/features/members/components/member-actions";
import { getMember } from "@/features/members/queries";
import { statusLabels } from "@/features/members/types";
import { formatDate, formatDateTime } from "@/lib/format";
import { assertId, findOrNotFound } from "@/server/query";

export async function generateMetadata({ params }: PageProps<"/members/[id]">): Promise<Metadata> {
  const { id } = await params;
  const member = await getMember(assertId(id)).catch(() => null);
  return { title: member ? `${member.firstName} ${member.lastName}` : "Member" };
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-base">{children ?? <span className="text-subtle-foreground">Not set</span>}</dd>
    </div>
  );
}

export default async function MemberPage({ params }: PageProps<"/members/[id]">) {
  const { id } = await params;
  const [member, parishes] = await Promise.all([findOrNotFound(getMember(assertId(id))), getParishes()]);
  const name = `${member.firstName} ${member.lastName}`;

  return (
    <Page width="narrow">
      <Button variant="ghost" size="sm" asChild leftIcon={<ArrowLeft />} className="-ml-2 w-fit">
        <Link href="/members">All members</Link>
      </Button>

      <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={name} src={member.avatarUrl} size="xl" />
          <div className="grid gap-1.5">
            <h1 className="text-heading-lg font-semibold">{name}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <StatusBadge status={member.status} label={statusLabels[member.status]} />
              <span className="font-mono text-xs">{member.memberNumber}</span>
            </div>
          </div>
        </div>
        <MemberActions member={member} parishes={parishes} />
      </header>

      <div className="grid gap-page md:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="grid content-start gap-page">
          <Card>
            <CardHeader title="Contact" />
            <CardContent className="grid gap-3">
              <p className="flex items-center gap-3">
                <Mail className="size-4 text-subtle-foreground" />
                {member.email ? (
                  <a href={`mailto:${member.email}`} className="hover:text-primary">
                    {member.email}
                  </a>
                ) : (
                  <span className="text-subtle-foreground">No email</span>
                )}
              </p>
              <p className="flex items-center gap-3">
                <Phone className="size-4 text-subtle-foreground" />
                {member.phone ? (
                  <a href={`tel:${member.phone.replace(/\s/g, "")}`} className="hover:text-primary">
                    {member.phone}
                  </a>
                ) : (
                  <span className="text-subtle-foreground">No phone</span>
                )}
              </p>
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 text-subtle-foreground" />
                {member.address ?? <span className="text-subtle-foreground">No address</span>}
              </p>
              <p className="flex items-center gap-3 border-t border-border-subtle pt-3 text-sm">
                {member.emailConsent ? (
                  <>
                    <MailCheck className="size-4 text-success" /> Agreed to receive email updates
                  </>
                ) : (
                  <>
                    <MailX className="size-4 text-subtle-foreground" />
                    <span className="text-muted-foreground">Hasn’t agreed to email updates</span>
                  </>
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Details" />
            <CardContent>
              <dl className="grid gap-5 sm:grid-cols-2">
                <Detail label="Parish">{member.parish?.name}</Detail>
                <Detail label="Rank or title">{member.rank}</Detail>
                <Detail label="Gender">
                  {member.gender && member.gender[0].toUpperCase() + member.gender.slice(1)}
                </Detail>
                <Detail label="Date of birth">{member.dateOfBirth && formatDate(member.dateOfBirth)}</Detail>
                <Detail label="Member since">{formatDate(member.joinedAt)}</Detail>
              </dl>
            </CardContent>
          </Card>

          {member.notes && (
            <Card>
              <CardHeader title="Notes" description="Only administrators can see these." />
              <CardContent className="text-base whitespace-pre-wrap">{member.notes}</CardContent>
            </Card>
          )}
        </div>

        <Card variant="muted" className="h-fit">
          <CardContent>
            <dl className="grid gap-4 text-sm">
              <Detail label="Added">
                {formatDateTime(member.createdAt)}
                {member.createdBy && (
                  <span className="block text-muted-foreground">by {member.createdBy.name}</span>
                )}
              </Detail>
              <Detail label="Last updated">{formatDateTime(member.updatedAt)}</Detail>
            </dl>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
