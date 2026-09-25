import type { Metadata } from "next";

import { SendingSettingsView } from "@/features/sending/components/sending-settings";
import { getSendingSettings } from "@/features/sending/queries";

export const metadata: Metadata = { title: "Email sending" };

export default async function EmailSendingPage() {
  return <SendingSettingsView settings={await getSendingSettings()} />;
}
