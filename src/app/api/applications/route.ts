import { NextResponse } from "next/server";
import { listLoanApplications } from "@/lib/application-store";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const reference = url.searchParams.get("reference");
  const applications = await listLoanApplications(reference);

  return NextResponse.json({ applications });
}
