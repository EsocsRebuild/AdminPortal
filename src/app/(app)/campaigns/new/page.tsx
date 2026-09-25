import { redirect } from "next/navigation";

/** Shortcut used by quick actions: opens the "New campaign" dialog. */
export default function NewCampaignRedirect() {
  redirect("/campaigns?new=1");
}
