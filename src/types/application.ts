export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type LoanApplicationRecord = {
  id: string;
  reference: string;
  fullName: string;
  idNumber: string;
  loanType: string;
  amount: number;
  repaymentMonths: number;
  employmentStatus: string;
  monthlyNetIncome: number;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
};
