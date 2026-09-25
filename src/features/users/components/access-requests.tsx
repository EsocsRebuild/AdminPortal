"use client";

import { Check, Church, Clock, Mail, MailCheck, Phone, X } from "lucide-react";
import * as React from "react";

import { Can } from "@/components/auth/session-provider";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAction } from "@/hooks/use-action";
import { formatRelative } from "@/lib/format";

import { approveAccessRequest, rejectAccessRequest } from "../actions";
import type { AccessRequest, Role } from "../types";

function RequestCard({ request, roles }: { request: AccessRequest; roles: Role[] }) {
  const [mode, setMode] = React.useState<"approve" | "reject" | null>(null);
  const [roleId, setRoleId] = React.useState(request.requestedRole?.id ?? "");
  const [reason, setReason] = React.useState("");
  const approve = useAction(approveAccessRequest, {
    success: `${request.name} now has access`,
    onSuccess: () => setMode(null),
  });
  const reject = useAction(rejectAccessRequest, {
    success: "Request declined",
    onSuccess: () => setMode(null),
  });

  return (
    <Card className="gap-4 p-card">
      <div className="flex items-start gap-3">
        <Avatar name={request.name} size="lg" />
        <div className="grid min-w-0 flex-1 gap-1">
          <p className="font-semibold">{request.name}</p>
          <p className="flex items-center gap-1.5 truncate text-sm text-muted-foreground">
            <Mail className="size-3.5 shrink-0" /> {request.email}
            {request.emailVerified ? (
              <Badge tone="success" className="ml-1">
                <MailCheck /> Confirmed
              </Badge>
            ) : (
              <Badge tone="warning" className="ml-1">
                Not confirmed
              </Badge>
            )}
          </p>
          {request.phone && (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Phone className="size-3.5" /> {request.phone}
            </p>
          )}
        </div>
      </div>
      <dl className="grid gap-2 rounded-control bg-surface-muted p-3 text-sm">
        <div className="flex items-center gap-2">
          <Church className="size-4 text-subtle-foreground" />
          <dt className="sr-only">Parish</dt>
          <dd>{request.parish?.name ?? "No parish given"}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Check className="size-4 text-subtle-foreground" />
          <dt className="sr-only">Asked for</dt>
          <dd>Asked for: {request.requestedRole?.name ?? "Not specified"}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-subtle-foreground" />
          <dt className="sr-only">Requested</dt>
          <dd suppressHydrationWarning>{formatRelative(request.createdAt)}</dd>
        </div>
      </dl>
      <Can permission="users:manage">
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" leftIcon={<X />} onClick={() => setMode("reject")}>
            Decline
          </Button>
          <Button
            className="flex-1"
            leftIcon={<Check />}
            onClick={() => setMode("approve")}
            disabled={!request.emailVerified}
          >
            Approve
          </Button>
        </div>
      </Can>

      <Dialog open={mode !== null} onOpenChange={(o) => !o && setMode(null)}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>
              {mode === "approve" ? `Give ${request.name} access` : `Decline ${request.name}’s request`}
            </DialogTitle>
            <DialogDescription>
              {mode === "approve"
                ? "Choose the role that fits their work. You can change it later."
                : "They’ll get a short email letting them know."}
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            {mode === "approve" ? (
              <Field label="Role" htmlFor={`rq-role-${request.id}`}>
                <Select value={roleId || undefined} onValueChange={setRoleId}>
                  <SelectTrigger id={`rq-role-${request.id}`}>
                    <SelectValue placeholder="Choose a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles
                      .filter((r) => !r.locked)
                      .map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </Field>
            ) : (
              <Field
                label="Reason"
                htmlFor={`rq-reason-${request.id}`}
                optional
                hint="Included in the email."
              >
                <Textarea
                  id={`rq-reason-${request.id}`}
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  maxLength={500}
                  aria-describedby={`rq-reason-${request.id}-msg`}
                />
              </Field>
            )}
          </DialogBody>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setMode(null)}>
              Cancel
            </Button>
            {mode === "approve" ? (
              <Button
                loading={approve.pending}
                disabled={!roleId}
                onClick={() => approve.run({ id: request.id, roleId })}
              >
                Approve
              </Button>
            ) : (
              <Button
                variant="danger"
                loading={reject.pending}
                onClick={() => reject.run({ id: request.id, reason })}
              >
                Decline request
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export function AccessRequests({ requests, roles }: { requests: AccessRequest[]; roles: Role[] }) {
  if (requests.length === 0) {
    return (
      <Card variant="outline">
        <EmptyState
          icon={<MailCheck />}
          title="No requests waiting"
          description="When someone requests an account, it appears here for you to approve."
        />
      </Card>
    );
  }
  return (
    <Stagger className="grid gap-page md:grid-cols-2 xl:grid-cols-3">
      {requests.map((r) => (
        <StaggerItem key={r.id}>
          <RequestCard request={r} roles={roles} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
