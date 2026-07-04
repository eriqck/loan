"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Field, Input } from "@/components/Input";
import {
  loanApplicationSchema,
  type LoanApplicationFormValues,
  type LoanApplicationInput,
} from "@/lib/validation";
import type { LoanApplicationRecord } from "@/types/application";

const loanTypes = [
  "Personal Loan",
  "Salary Based Loan",
  "Business Loan",
  "Education Loan",
  "Asset Finance",
];

const repaymentPeriods = [6, 12, 18, 24, 36, 48, 60];

export function LoanForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoanApplicationFormValues, unknown, LoanApplicationInput>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      fullName: "",
      idNumber: "",
      loanType: "",
      employmentStatus: "Permanently Employed",
      company: "",
    },
  });

  async function onSubmit(values: LoanApplicationInput) {
    setServerError(null);

    const response = await fetch("/api/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const payload = (await response.json()) as {
      application?: LoanApplicationRecord;
      reference?: string;
      error?: string;
    };

    if (!response.ok || !payload.reference) {
      setServerError(payload.error ?? "We could not submit the application.");
      return;
    }

    if (payload.application) {
      window.localStorage.setItem(
        "loan:lastApplication",
        JSON.stringify(payload.application),
      );
    }

    router.push(`/auth?reference=${encodeURIComponent(payload.reference)}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <input
        {...register("company")}
        aria-hidden="true"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full Name" error={errors.fullName?.message}>
          <Input autoComplete="name" placeholder="John Doe" {...register("fullName")} />
        </Field>

        <Field label="ID Number" error={errors.idNumber?.message}>
          <Input
            autoComplete="off"
            placeholder="e.g. 08-123456 A 77"
            {...register("idNumber")}
          />
        </Field>
      </div>

      <Field label="Select Loan Type" error={errors.loanType?.message}>
        <select
          {...register("loanType")}
          className="h-9 rounded border border-slate-300 bg-white px-3 text-[12px] text-slate-950 outline-none transition focus:border-[#102084] focus:ring-2 focus:ring-[#102084]/10"
        >
          <option value="">-- Choose a Product --</option>
          {loanTypes.map((loanType) => (
            <option key={loanType} value={loanType}>
              {loanType}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Loan Amount Requested (USD/ZWL)"
          error={errors.amount?.message}
        >
          <Input
            type="number"
            min="100"
            step="1"
            placeholder="e.g. 5000"
            {...register("amount")}
          />
        </Field>

        <Field
          label="Repayment Period (Months)"
          error={errors.repaymentMonths?.message}
        >
          <select
            {...register("repaymentMonths", { valueAsNumber: true })}
            className="h-9 rounded border border-slate-300 bg-white px-3 text-[12px] text-slate-950 outline-none transition focus:border-[#102084] focus:ring-2 focus:ring-[#102084]/10"
          >
            {repaymentPeriods.map((period) => (
              <option key={period} value={period}>
                {period} Months
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Employment Status"
          error={errors.employmentStatus?.message}
        >
          <select
            {...register("employmentStatus")}
            className="h-9 rounded border border-slate-300 bg-white px-3 text-[12px] text-slate-950 outline-none transition focus:border-[#102084] focus:ring-2 focus:ring-[#102084]/10"
          >
            <option value="Permanently Employed">Permanently Employed</option>
            <option value="Contract Employed">Contract Employed</option>
            <option value="Self-employed">Self-employed</option>
            <option value="Business owner">Business owner</option>
          </select>
        </Field>

        <Field
          label="Monthly Net Income"
          error={errors.monthlyNetIncome?.message}
        >
          <Input
            type="number"
            min="0"
            step="1"
            placeholder="0.00"
            {...register("monthlyNetIncome")}
          />
        </Field>
      </div>

      {serverError ? (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
          {serverError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 h-9 rounded-full bg-[#102084] px-5 text-[12px] font-bold uppercase text-white transition hover:bg-[#0b1764] disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}
