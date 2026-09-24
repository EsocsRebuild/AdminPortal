import type { Metadata } from "next";

import { Page, PageHeader } from "@/components/layout/page";
import { AppearanceSettings } from "@/components/theme/appearance-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, Fieldset } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { demoUser } from "@/lib/fixtures";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <Page width="narrow">
      <PageHeader
        title="Settings"
        description="Manage your profile, notifications and how the portal looks."
      />

      <Card>
        <CardContent className="grid gap-8 py-6">
          <AppearanceSettings />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="grid gap-6 py-6">
          <Fieldset legend="Profile" description="How you appear to other administrators.">
            <Field label="Full name" htmlFor="name" inline>
              <Input id="name" defaultValue={demoUser.name} autoComplete="name" />
            </Field>
            <Field label="Email" htmlFor="email" hint="Used for sign-in and alerts." inline>
              <Input
                id="email"
                type="email"
                defaultValue={demoUser.email}
                autoComplete="email"
                aria-describedby="email-msg"
              />
            </Field>
            <Field label="Bio" htmlFor="bio" optional inline>
              <Textarea id="bio" rows={3} placeholder="A sentence about your role." />
            </Field>
          </Fieldset>
        </CardContent>
        <CardFooter className="justify-end">
          <Button variant="secondary">Cancel</Button>
          <Button>Save changes</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardContent className="grid gap-5 py-6">
          <Fieldset legend="Notifications" description="Choose what we email you about.">
            <Switch
              label="Membership applications"
              description="When someone applies to join a parish you manage."
              defaultChecked
            />
            <Separator />
            <Switch
              label="Finance alerts"
              description="Failed payouts and unusual transactions."
              defaultChecked
            />
            <Separator />
            <Switch label="Weekly summary" description="A Monday digest of attendance and giving." />
          </Fieldset>
        </CardContent>
      </Card>
    </Page>
  );
}
