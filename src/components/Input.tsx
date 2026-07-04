import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

type FieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
};

export function Field({ label, error, children }: FieldProps) {
  return (
    <label className="grid gap-2 text-[12px] font-medium text-slate-950">
      <span>{label}</span>
      {children}
      {error ? <span className="text-xs text-red-700">{error}</span> : null}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-9 rounded border border-slate-300 bg-white px-3 text-[12px] text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-[#102084] focus:ring-2 focus:ring-[#102084]/10 disabled:cursor-not-allowed disabled:bg-slate-100"
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="min-h-24 rounded border border-slate-300 bg-white px-3 py-3 text-[12px] text-slate-950 outline-none transition focus:border-[#102084] focus:ring-2 focus:ring-[#102084]/10 disabled:cursor-not-allowed disabled:bg-slate-100"
    />
  );
}
