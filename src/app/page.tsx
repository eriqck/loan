"use client";

import { useMemo, useState } from "react";
import { LoanForm } from "@/components/LoanForm";

const navItems = [
  "Overview",
  "Apply for a Loan",
  "Transactional Services",
  "Bancassurance",
];

function LoanCalculator() {
  const [amount, setAmount] = useState(1000);
  const [months, setMonths] = useState(12);

  const monthlyPayment = useMemo(() => {
    const annualRate = 0.12;
    const monthlyRate = annualRate / 12;
    const payment =
      (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

    return Number.isFinite(payment) ? payment : 0;
  }, [amount, months]);

  return (
    <div className="rounded border border-slate-300 bg-white p-4">
      <h2 className="text-[14px] font-bold text-[#102084]">Loan Calculator</h2>

      <div className="mt-4 grid gap-4">
        <label className="grid gap-2 text-[12px] text-slate-950">
          Amount (USD)
          <input
            type="number"
            min="100"
            step="100"
            value={amount}
            onChange={(event) => setAmount(Number(event.target.value))}
            className="h-9 rounded border border-slate-300 px-3 text-[12px] outline-none focus:border-[#102084] focus:ring-2 focus:ring-[#102084]/10"
          />
        </label>

        <label className="grid gap-2 text-[12px] text-slate-950">
          Tenure (Months)
          <select
            value={months}
            onChange={(event) => setMonths(Number(event.target.value))}
            className="h-9 rounded border border-slate-300 px-3 text-[12px] outline-none focus:border-[#102084] focus:ring-2 focus:ring-[#102084]/10"
          >
            {[6, 12, 18, 24, 36, 48, 60].map((period) => (
              <option key={period} value={period}>
                {period}
              </option>
            ))}
          </select>
        </label>

        <p className="text-[12px] font-bold text-slate-950">
          Estimated Monthly: ${monthlyPayment.toFixed(2)}
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("Apply for a Loan");
  const isOverview = activeSection === "Overview";

  return (
    <main className="min-h-screen bg-[#f4f7f6] text-slate-950">
      <div className="h-9 border-b border-slate-200 bg-[#f1f2f2]">
        <div className="mx-auto flex h-full max-w-[1180px] items-center px-4 text-2xl font-bold text-slate-800">
          CABS
        </div>
      </div>

      <header className="border-b-2 border-[#4b9d15] bg-white">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-black tracking-tight text-[#1c2c73]">
              CABS<span className="ml-1 text-[#4b9d15]">//</span>
            </div>
            <div className="h-10 border-l border-slate-300" />
            <div>
              <div className="text-xl font-bold tracking-wide text-[#102084]">
                CABS
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-wide text-[#4b9d15]">
                A member of the Old Mutual Group
              </div>
            </div>
          </div>

          <div className="text-[12px] font-medium text-[#102084]">
            <span className="mr-1 text-[#3a246f]">User:</span>
            Welcome, Client <span className="text-slate-500">|</span>{" "}
            <span className="text-red-600">Logout</span>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-[940px] gap-4 px-4 py-6 md:grid-cols-[188px_minmax(0,1fr)]">
        <aside className="rounded-md bg-white py-4 shadow-sm">
          {navItems.map((item) => {
            const active = item === activeSection;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setActiveSection(item)}
                className={`w-full border-l-4 px-4 py-3 text-left text-[12px] ${
                  active
                    ? "border-[#102084] bg-slate-100 text-[#102084]"
                    : "border-transparent text-slate-950"
                }`}
              >
                {item}
              </button>
            );
          })}
        </aside>

        <div className="rounded-md bg-white p-6 shadow-sm">
          {isOverview ? (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#102084]">
                  Banking at CABS
                </h1>
                <p className="mt-2 text-[12px] text-[#4b9d15]">
                  Manage your financial journey with us.
                </p>
                <p className="mt-6 text-[12px] text-slate-950">
                  Welcome to your CABS dashboard. Use the calculator below to
                  estimate your loan repayments.
                </p>
              </div>
              <LoanCalculator />
            </>
          ) : activeSection === "Apply for a Loan" ? (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#102084]">
                  Loan Application
                </h1>
                <p className="mt-2 text-[12px] text-[#4b9d15]">
                  Fast, secure, and convenient financing.
                </p>
              </div>
              <LoanForm />
            </>
          ) : (
            <div>
              <h1 className="text-2xl font-bold text-[#102084]">
                {activeSection}
              </h1>
              <p className="mt-2 text-[12px] text-slate-600">
                This service area is coming soon.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
