"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { LoanApplicationRecord } from "@/types/application";

const ADMIN_PHONE = "0115683498";

export default function AdminPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<LoanApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rawSession = window.localStorage.getItem("loan:session");
    const session = rawSession
      ? (JSON.parse(rawSession) as { role?: string; mobile?: string })
      : null;

    if (session?.role !== "admin" || session.mobile !== ADMIN_PHONE) {
      router.replace("/auth");
      return;
    }

    fetch("/api/applications")
      .then((response) => response.json())
      .then((payload: { applications: LoanApplicationRecord[] }) => {
        setApplications(payload.applications);
      })
      .finally(() => setLoading(false));
  }, [router]);

  function logout() {
    window.localStorage.removeItem("loan:session");
    router.push("/auth");
  }

  return (
    <main className="min-h-screen bg-[#f4f7f6] text-slate-950">
      <header className="border-b-2 border-[#4b9d15] bg-white">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-4 py-4">
          <div className="text-2xl font-black text-[#1c2c73]">
            CABS<span className="ml-1 text-[#4b9d15]">//</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[12px] font-bold text-[#102084]">
              Home
            </Link>
            <button
              type="button"
              onClick={logout}
              className="text-[12px] font-bold text-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1100px] px-4 py-8">
        <h1 className="text-2xl font-bold text-[#102084]">Admin Dashboard</h1>
        <p className="mt-2 text-[12px] text-[#4b9d15]">
          Review submitted loan applications.
        </p>

        <div className="mt-6 overflow-hidden rounded-md bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-[12px]">
              <thead className="bg-slate-100 text-[#102084]">
                <tr>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Applicant</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-4 py-5 text-slate-600" colSpan={6}>
                      Loading applications...
                    </td>
                  </tr>
                ) : applications.length ? (
                  applications.map((application) => (
                    <tr key={application.reference} className="border-t">
                      <td className="px-4 py-3 font-mono">
                        {application.reference}
                      </td>
                      <td className="px-4 py-3">{application.fullName}</td>
                      <td className="px-4 py-3">{application.loanType}</td>
                      <td className="px-4 py-3">
                        {application.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">{application.status}</td>
                      <td className="px-4 py-3">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-5 text-slate-600" colSpan={6}>
                      No applications have been submitted yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
