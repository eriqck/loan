"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { LoanApplicationRecord } from "@/types/application";

type Session = {
  role: "client" | "admin";
  mobile: string;
  fullName: string;
  reference: string | null;
};

export default function DashboardPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [applications, setApplications] = useState<LoanApplicationRecord[]>([]);

  useEffect(() => {
    const rawSession = window.localStorage.getItem("loan:session");
    const rawApplication = window.localStorage.getItem("loan:lastApplication");

    if (rawSession) {
      setSession(JSON.parse(rawSession) as Session);
    }

    if (rawApplication) {
      setApplications([JSON.parse(rawApplication) as LoanApplicationRecord]);
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#f4f7f6] text-slate-950">
      <header className="border-b-2 border-[#4b9d15] bg-white">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-4 py-4">
          <div className="text-2xl font-black text-[#1c2c73]">
            CABS<span className="ml-1 text-[#4b9d15]">//</span>
          </div>
          <Link href="/" className="text-[12px] font-bold text-[#102084]">
            New Application
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-[940px] px-4 py-8">
        <h1 className="text-2xl font-bold text-[#102084]">Client Dashboard</h1>
        <p className="mt-2 text-[12px] text-[#4b9d15]">
          Welcome, {session?.fullName ?? "Client"}
        </p>

        <div className="mt-6 rounded-md bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#102084]">Loan Requests</h2>
          <div className="mt-4 grid gap-3">
            {applications.length ? (
              applications.map((application) => (
                <div
                  key={application.reference}
                  className="rounded border border-slate-200 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-sm font-bold">
                        {application.reference}
                      </p>
                      <p className="mt-1 text-[12px] text-slate-600">
                        {application.loanType} - {application.repaymentMonths}{" "}
                        months
                      </p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-800">
                      {application.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-bold text-slate-950">
                    Amount: {application.amount.toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-600">
                No local loan requests found for this session.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
