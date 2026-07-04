create table if not exists public.loan_applications (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  full_name text not null,
  id_number text not null,
  loan_type text not null,
  amount integer not null,
  repayment_months integer not null,
  employment_status text not null,
  monthly_net_income integer not null,
  status text not null default 'PENDING',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists loan_applications_set_updated_at on public.loan_applications;
create trigger loan_applications_set_updated_at
before update on public.loan_applications
for each row execute procedure public.handle_updated_at();
