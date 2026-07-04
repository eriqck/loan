import { z } from "zod";

export const loanApplicationSchema = z.object({
  fullName: z.string().trim().min(2, "Enter the applicant's full name."),
  idNumber: z
    .string()
    .trim()
    .min(6, "Enter a valid ID number.")
    .max(30, "ID number is too long."),
  loanType: z.string().trim().min(2, "Choose a loan product."),
  amount: z.coerce
    .number()
    .int("Loan amount must be a whole number.")
    .min(100, "Minimum loan amount is 100.")
    .max(1000000, "Maximum loan amount is 1,000,000."),
  repaymentMonths: z.coerce
    .number()
    .int("Repayment period must be a whole number.")
    .min(3, "Minimum repayment period is 3 months.")
    .max(60, "Maximum repayment period is 60 months."),
  employmentStatus: z.string().trim().min(2, "Choose employment status."),
  monthlyNetIncome: z.coerce
    .number()
    .int("Monthly net income must be a whole number.")
    .min(0, "Monthly net income cannot be negative."),
  company: z.string().max(0).optional(),
});

export type LoanApplicationFormValues = z.input<typeof loanApplicationSchema>;
export type LoanApplicationInput = z.output<typeof loanApplicationSchema>;
