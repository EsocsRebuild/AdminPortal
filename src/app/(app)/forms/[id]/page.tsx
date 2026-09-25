import { redirect } from "next/navigation";

export default async function FormIndex({ params }: PageProps<"/forms/[id]">) {
  redirect(`/forms/${(await params).id}/edit`);
}
