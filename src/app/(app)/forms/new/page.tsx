import { redirect } from "next/navigation";

export default function NewFormRedirect() {
  redirect("/forms?new=1");
}
