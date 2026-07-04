import { getSupabase } from "@/lib/supabase";
import type { LoanApplicationInput } from "@/lib/validation";
import type { LoanApplicationRecord } from "@/types/application";

const globalForApplications = globalThis as unknown as {
  loanApplications?: LoanApplicationRecord[];
};

function memoryStore() {
  if (!globalForApplications.loanApplications) {
    globalForApplications.loanApplications = [];
  }

  return globalForApplications.loanApplications;
}

function toRecord(application: Record<string, unknown>): LoanApplicationRecord {
  const createdAt = (application.createdAt ?? application.created_at) as
    | Date
    | string
    | undefined;
  const updatedAt = (application.updatedAt ?? application.updated_at) as
    | Date
    | string
    | undefined;

  return {
    id: String(application.id ?? crypto.randomUUID()),
    reference: String(application.reference ?? ""),
    fullName: String(
      application.fullName ?? application.full_name ?? "",
    ),
    idNumber: String(application.idNumber ?? application.id_number ?? ""),
    loanType: String(application.loanType ?? application.loan_type ?? ""),
    amount: Number(application.amount ?? 0),
    repaymentMonths: Number(
      application.repaymentMonths ?? application.repayment_months ?? 0,
    ),
    employmentStatus: String(
      application.employmentStatus ?? application.employment_status ?? "",
    ),
    monthlyNetIncome: Number(
      application.monthlyNetIncome ?? application.monthly_net_income ?? 0,
    ),
    status: (application.status as LoanApplicationRecord["status"]) ?? "PENDING",
    createdAt:
      createdAt instanceof Date ? createdAt.toISOString() : String(createdAt ?? ""),
    updatedAt:
      updatedAt instanceof Date ? updatedAt.toISOString() : String(updatedAt ?? ""),
  };
}

export async function createLoanApplication(
  data: Omit<LoanApplicationInput, "company">,
  reference: string,
) {
  try {
    const supabase = getSupabase();
    const { data: inserted, error } = await supabase
      .from("loan_applications")
      .insert({
        reference,
        full_name: data.fullName,
        id_number: data.idNumber,
        loan_type: data.loanType,
        amount: data.amount,
        repayment_months: data.repaymentMonths,
        employment_status: data.employmentStatus,
        monthly_net_income: data.monthlyNetIncome,
        status: "PENDING",
      })
      .select()
      .single();

    if (!error && inserted) {
      return toRecord(inserted);
    }
  } catch (error) {
    console.error("Supabase create failed, using local memory store.", error);
  }

  const now = new Date().toISOString();
  const application: LoanApplicationRecord = {
    id: crypto.randomUUID(),
    reference,
    ...data,
    status: "PENDING",
    createdAt: now,
    updatedAt: now,
  };

  memoryStore().unshift(application);
  return application;
}

export async function listLoanApplications(reference?: string | null) {
  try {
    const supabase = getSupabase();
    let query = supabase.from("loan_applications").select("*");

    if (reference) {
      query = query.eq("reference", reference);
    }

    query = query.order("created_at", { ascending: false });
    const { data, error } = await query;

    if (!error && data) {
      return data.map(toRecord);
    }
  } catch (error) {
    console.error("Supabase list failed, using local memory store.", error);
  }

  return memoryStore().filter((application) =>
    reference ? application.reference === reference : true,
  );
}
