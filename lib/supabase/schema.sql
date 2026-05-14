-- VOLT Platform Database Schema

-- Companies
create table companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  size text not null,
  industry text not null,
  created_at timestamptz default now()
);

-- Users (extends Supabase auth.users)
create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role text not null default 'recruiter' check (role in ('admin', 'recruiter', 'hiring_manager')),
  company_id uuid references companies(id),
  avatar_url text,
  created_at timestamptz default now()
);

-- Job Roles
create table roles (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  title text not null,
  department text not null default '',
  description text not null default '',
  requirements text[] default '{}',
  salary_min integer default 0,
  salary_max integer default 0,
  location text default '',
  remote boolean default false,
  status text default 'open' check (status in ('open', 'paused', 'closed', 'draft')),
  priority text default 'medium' check (priority in ('urgent', 'high', 'medium', 'low')),
  health_score integer default 75,
  urgency_score integer default 50,
  difficulty_score integer default 50,
  avg_days_to_fill integer default 45,
  ai_summary text,
  interview_questions text[] default '{}',
  ideal_candidate_profile text,
  top_risks text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Candidates
create table candidates (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  role_id uuid references roles(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text,
  linkedin_url text,
  current_company text,
  current_title text,
  years_experience integer default 0,
  stage text default 'applied' check (stage in ('applied', 'screened', 'interview', 'offer', 'hired', 'rejected')),
  ai_one_liner text,
  ai_score integer,
  predicted_ramp_weeks integer,
  risk_flag text,
  resume_text text,
  notes text,
  last_activity timestamptz default now(),
  created_at timestamptz default now()
);

-- Interviews
create table interviews (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references candidates(id) on delete cascade,
  role_id uuid references roles(id) on delete set null,
  company_id uuid references companies(id) on delete cascade,
  scheduled_at timestamptz not null,
  duration_minutes integer default 60,
  format text default 'video' check (format in ('video', 'phone', 'in_person')),
  interviewer_ids uuid[] default '{}',
  status text default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
  ai_guide text,
  debrief_notes text,
  decision_confidence integer,
  created_at timestamptz default now()
);

-- Employees (HR side)
create table employees (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  email text not null,
  department text not null default '',
  role text not null default '',
  manager_id uuid references employees(id),
  employment_type text default 'full_time' check (employment_type in ('full_time', 'part_time', 'contract')),
  status text default 'active' check (status in ('active', 'inactive', 'on_leave')),
  salary numeric default 0,
  join_date date not null default current_date,
  performance_score numeric,
  attrition_risk numeric,
  avatar_url text,
  created_at timestamptz default now()
);

-- Attendance
create table attendance (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references employees(id) on delete cascade,
  date date not null,
  check_in time,
  check_out time,
  status text default 'present' check (status in ('present', 'absent', 'late', 'half_day')),
  unique(employee_id, date)
);

-- Leave Requests
create table leaves (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references employees(id) on delete cascade,
  type text not null check (type in ('annual', 'sick', 'maternity', 'paternity', 'unpaid')),
  start_date date not null,
  end_date date not null,
  days integer not null,
  reason text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now()
);

-- Payroll
create table payroll (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references employees(id) on delete cascade,
  month text not null,
  year integer not null,
  base_salary numeric not null,
  bonus numeric default 0,
  deductions numeric default 0,
  net_pay numeric not null,
  status text default 'draft' check (status in ('draft', 'processed', 'paid')),
  ai_anomalies text[] default '{}',
  created_at timestamptz default now()
);

-- Performance Reviews
create table performance_reviews (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references employees(id) on delete cascade,
  reviewer_id uuid references employees(id),
  period text not null,
  goals text[] default '{}',
  rating numeric not null,
  ai_summary text,
  created_at timestamptz default now()
);

-- Announcements
create table announcements (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  title text not null,
  content text not null,
  author_id uuid references users(id),
  pinned boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS
alter table companies enable row level security;
alter table users enable row level security;
alter table roles enable row level security;
alter table candidates enable row level security;
alter table interviews enable row level security;
alter table employees enable row level security;
alter table attendance enable row level security;
alter table leaves enable row level security;
alter table payroll enable row level security;
alter table performance_reviews enable row level security;
alter table announcements enable row level security;

-- Basic RLS policies (company-scoped)
create policy "Users can view their company" on companies for select using (
  id in (select company_id from users where id = auth.uid())
);

create policy "Users can view company members" on users for select using (
  company_id in (select company_id from users where id = auth.uid())
);

create policy "Company roles access" on roles for all using (
  company_id in (select company_id from users where id = auth.uid())
);

create policy "Company candidates access" on candidates for all using (
  company_id in (select company_id from users where id = auth.uid())
);

create policy "Company interviews access" on interviews for all using (
  company_id in (select company_id from users where id = auth.uid())
);

create policy "Company employees access" on employees for all using (
  company_id in (select company_id from users where id = auth.uid())
);

create policy "Company announcements access" on announcements for all using (
  company_id in (select company_id from users where id = auth.uid())
);
