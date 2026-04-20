create extension if not exists pgcrypto;

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  sale_date date not null,
  product_name text not null,
  product_category text,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12, 2) not null check (unit_price > 0),
  total_price numeric(12, 2) generated always as ((quantity::numeric * unit_price)) stored,
  payment_method text not null default 'pix',
  installments integer,
  customer_name text,
  order_code text,
  status text not null check (status in ('pending', 'paid', 'completed', 'cancelled')),
  notes text,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade
);

alter table public.sales
  add column if not exists payment_method text;

alter table public.sales
  add column if not exists installments integer;

alter table public.sales
  alter column payment_method set default 'pix';

update public.sales
set payment_method = 'pix'
where payment_method is null;

alter table public.sales
  alter column payment_method set not null;

alter table public.sales
  drop constraint if exists sales_payment_method_check;

alter table public.sales
  add constraint sales_payment_method_check
  check (payment_method in ('cash', 'pix', 'debit_card', 'credit_card'));

alter table public.sales
  drop constraint if exists sales_installments_check;

alter table public.sales
  add constraint sales_installments_check
  check (
    (payment_method = 'credit_card' and installments between 1 and 5)
    or (payment_method <> 'credit_card' and installments is null)
  );

create index if not exists sales_user_id_idx on public.sales (user_id);
create index if not exists sales_sale_date_idx on public.sales (sale_date desc);
create index if not exists sales_status_idx on public.sales (status);
create index if not exists sales_product_name_idx on public.sales (product_name);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_sales_updated_at on public.sales;
create trigger set_sales_updated_at
before update on public.sales
for each row
execute function public.handle_updated_at();

alter table public.sales enable row level security;

drop policy if exists "Users can view own sales" on public.sales;
create policy "Users can view own sales"
on public.sales
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own sales" on public.sales;
create policy "Users can insert own sales"
on public.sales
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own sales" on public.sales;
create policy "Users can update own sales"
on public.sales
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own sales" on public.sales;
create policy "Users can delete own sales"
on public.sales
for delete
using (auth.uid() = user_id);
