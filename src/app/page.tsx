import { LoanForm } from "@/components/LoanForm";

const navItems = [
  "Overview",
  "Apply for a Loan",
  "Transactional Services",
  "Bancassurance",
];

export default function Home() {
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
            const active = item === "Apply for a Loan";
            return (
              <div
                key={item}
                className={`border-l-4 px-4 py-3 text-[12px] ${
                  active
                    ? "border-[#102084] bg-slate-100 text-[#102084]"
                    : "border-transparent text-slate-950"
                }`}
              >
                {item}
              </div>
            );
          })}
        </aside>

        <div className="rounded-md bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#102084]">
              Loan Application
            </h1>
            <p className="mt-2 text-[12px] text-[#4b9d15]">
              Fast, secure, and convenient financing.
            </p>
          </div>
          <LoanForm />
        </div>
      </section>
    </main>
  );
}
