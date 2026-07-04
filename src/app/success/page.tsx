import Link from "next/link";

type SuccessPageProps = {
  searchParams: Promise<{
    reference?: string;
  }>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { reference } = await searchParams;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-950 sm:px-6">
      <section className="mx-auto flex min-h-[70vh] max-w-2xl items-center">
        <div className="w-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Application received
          </p>
          <h1 className="mt-4 text-3xl font-semibold">Your loan application is in review.</h1>
          <p className="mt-4 leading-7 text-slate-600">
            Our team will review your details and contact you using the phone
            number provided.
          </p>

          <div className="mt-6 rounded-md border border-slate-200 bg-slate-50 p-4">
            <span className="text-sm font-medium text-slate-600">Reference</span>
            <p className="mt-1 font-mono text-xl font-semibold text-slate-950">
              {reference ?? "Pending"}
            </p>
          </div>

          <Link
            href="/"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-emerald-700 px-5 font-semibold text-white transition hover:bg-emerald-800"
          >
            Submit another application
          </Link>
        </div>
      </section>
    </main>
  );
}
