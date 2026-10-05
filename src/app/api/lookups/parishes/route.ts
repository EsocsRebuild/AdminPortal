import { NextResponse } from "next/server";
import { getParishes } from "@/features/lookups/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const parishes = await getParishes();
    return NextResponse.json(parishes);
  } catch {
    return NextResponse.json([]);
  }
}
