"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

type AuthMode = "login" | "register";
type AuthRole = "client" | "admin";

const ADMIN_PHONE = "0115683498";

function AuthPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const [mode, setMode] = useState<AuthMode>("login");
  const [role, setRole] = useState<AuthRole>("client");
  const [mobile, setMobile] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submitAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!mobile.trim()) {
      setError("Enter your mobile number to continue.");
      return;
    }

    if (role === "admin" && mobile.trim() !== ADMIN_PHONE) {
      setError("Only the registered admin phone number can access admin.");
      return;
    }

    if (mode === "register" && role === "client" && !fullName.trim()) {
      setError("Enter your full name to register.");
      return;
    }

    const session = {
      role,
      mobile: mobile.trim(),
      fullName: role === "admin" ? "Admin" : fullName.trim() || "Client",
      reference,
      signedInAt: new Date().toISOString(),
    };

    window.localStorage.setItem("loan:session", JSON.stringify(session));
    router.push(role === "admin" ? "/admin" : "/dashboard");
  }

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-10">
        <div className="mb-10 text-center">
          <div className="text-3xl font-black tracking-tight text-[#1c2c73]">
            CABS<span className="ml-1 text-[#4b9d15]">//</span>
          </div>
          <div className="mt-1 text-[8px] uppercase tracking-wide text-slate-500">
            A member of Old Mutual Group
          </div>
        </div>

        <div className="mb-7">
          <h1 className="text-3xl font-black leading-tight text-[#102084]">
            Welcome to
            <span className="block text-[#4b9d15]">Internet Banking</span>
          </h1>
          {reference ? (
            <p className="mt-3 text-[12px] text-slate-600">
              Application {reference} is ready. Login or register to view your
              loan dashboard.
            </p>
          ) : null}
        </div>

        <div className="mb-5 grid grid-cols-2 rounded-full bg-slate-100 p-1 text-[12px] font-bold">
          {(["login", "register"] as AuthMode[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              className={`h-9 rounded-full capitalize ${
                mode === item ? "bg-[#102084] text-white" : "text-[#102084]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <form onSubmit={submitAuth} className="grid gap-5">
          <label className="grid gap-2 text-[12px] text-slate-700">
            Account Type
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as AuthRole)}
              className="h-10 rounded border border-slate-300 px-3 text-[12px] outline-none focus:border-[#102084] focus:ring-2 focus:ring-[#102084]/10"
            >
              <option value="client">Client</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          {mode === "register" && role === "client" ? (
            <label className="grid gap-2 text-[12px] text-slate-700">
              Full Name
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="John Doe"
                className="h-10 rounded border border-slate-300 px-3 text-[12px] outline-none focus:border-[#102084] focus:ring-2 focus:ring-[#102084]/10"
              />
            </label>
          ) : null}

          <label className="grid gap-2 text-[12px] text-slate-700">
            Mobile Number
            <input
              value={mobile}
              onChange={(event) => setMobile(event.target.value)}
              placeholder="eg. 263777777777"
              className="h-10 rounded border border-slate-300 px-3 text-[12px] outline-none focus:border-[#102084] focus:ring-2 focus:ring-[#102084]/10"
            />
          </label>

          {error ? <p className="text-[12px] text-red-700">{error}</p> : null}

          <button className="h-10 rounded-full bg-[#102084] text-[12px] font-bold uppercase text-white hover:bg-[#0b1764]">
            {mode === "register" ? "Register" : "Login"}
          </button>
        </form>

        <a
          href="#"
          className="mt-8 text-[12px] leading-5 text-slate-600 underline"
        >
          IMPORTANT: Security advice to help keep your online banking secure and
          convenient
        </a>
      </section>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthPanel />
    </Suspense>
  );
}
