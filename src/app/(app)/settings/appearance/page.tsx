import type { Metadata } from "next";

import { AppearanceSettings } from "@/components/theme/appearance-settings";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Appearance" };

export default function AppearancePage() {
  return (
    <Card>
      <CardContent className="grid gap-8 py-6">
        <AppearanceSettings />
      </CardContent>
    </Card>
  );
}
