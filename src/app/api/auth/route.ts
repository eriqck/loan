import { NextResponse } from "next/server";
import {
  loginAccount,
  registerAccount,
  type AccountRole,
} from "@/lib/account-store";

export const runtime = "nodejs";

type AuthRequest = {
  mode?: "login" | "register";
  role?: AccountRole;
  mobile?: string;
  fullName?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AuthRequest;
    const mode = body.mode;
    const role = body.role;
    const mobile = body.mobile?.trim();
    const fullName = body.fullName?.trim();

    if (!mode || !role || !mobile) {
      return NextResponse.json(
        { error: "Mobile number, role, and auth mode are required." },
        { status: 400 },
      );
    }

    if (mode === "register") {
      if (role === "admin") {
        return NextResponse.json(
          { error: "Admin registration is not available." },
          { status: 403 },
        );
      }

      if (!fullName) {
        return NextResponse.json(
          { error: "Full name is required to register." },
          { status: 400 },
        );
      }

      const result = await registerAccount(mobile, fullName);
      return NextResponse.json({ session: result.session }, { status: result.status });
    }

    const result = await loginAccount(mobile, role);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ session: result.session }, { status: result.status });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Authentication failed. Please try again." },
      { status: 500 },
    );
  }
}
