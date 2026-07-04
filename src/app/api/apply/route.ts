import { NextResponse } from "next/server";
import { createLoanApplication } from "@/lib/application-store";
import { sendLoanApplicationNotification } from "@/lib/telegram";
import { loanApplicationSchema } from "@/lib/validation";

export const runtime = "nodejs";

function makeReference() {
  const date = new Date();
  const stamp = date.toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();

  return `LOAN-${stamp}-${suffix}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loanApplicationSchema.safeParse(body);

    if (!parsed.success || parsed.data.company) {
      return NextResponse.json(
        { error: "Please check the application details and try again." },
        { status: 400 },
      );
    }

    const { company: _company, ...data } = parsed.data;
    const reference = makeReference();
    const application = await createLoanApplication(data, reference);

    try {
      await sendLoanApplicationNotification({
        reference: application.reference,
        fullName: application.fullName,
        loanType: application.loanType,
        amount: application.amount,
        repaymentMonths: application.repaymentMonths,
      });
    } catch (error) {
      console.error(error);
    }

    return NextResponse.json(
      { application, reference: application.reference },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong while submitting the application." },
      { status: 500 },
    );
  }
}
