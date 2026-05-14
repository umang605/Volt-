export type UserRole = "admin" | "recruiter" | "hiring_manager";
export type AppMode = "volt" | "hr";

export interface Company {
  id: string;
  name: string;
  size: string;
  industry: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  company_id: string;
  avatar_url?: string;
  created_at: string;
}

export type RoleStatus = "open" | "paused" | "closed" | "draft";
export type RolePriority = "urgent" | "high" | "medium" | "low";

export interface JobRole {
  id: string;
  company_id: string;
  title: string;
  department: string;
  description: string;
  requirements: string[];
  salary_min: number;
  salary_max: number;
  location: string;
  remote: boolean;
  status: RoleStatus;
  priority: RolePriority;
  health_score: number;
  urgency_score: number;
  difficulty_score: number;
  avg_days_to_fill: number;
  ai_summary?: string;
  interview_questions?: string[];
  ideal_candidate_profile?: string;
  top_risks?: string[];
  created_at: string;
  updated_at: string;
}

export type CandidateStage =
  | "applied"
  | "screened"
  | "interview"
  | "offer"
  | "hired"
  | "rejected";

export interface Candidate {
  id: string;
  company_id: string;
  role_id: string;
  full_name: string;
  email: string;
  phone?: string;
  linkedin_url?: string;
  current_company?: string;
  current_title?: string;
  years_experience: number;
  stage: CandidateStage;
  ai_one_liner?: string;
  ai_score?: number;
  predicted_ramp_weeks?: number;
  risk_flag?: string | null;
  resume_text?: string;
  notes?: string;
  last_activity: string;
  created_at: string;
  job_role?: JobRole;
}

export interface Interview {
  id: string;
  candidate_id: string;
  role_id: string;
  company_id: string;
  scheduled_at: string;
  duration_minutes: number;
  format: "video" | "phone" | "in_person";
  interviewer_ids: string[];
  status: "scheduled" | "completed" | "cancelled";
  ai_guide?: string;
  debrief_notes?: string;
  decision_confidence?: number;
  created_at: string;
  candidate?: Candidate;
}

export type EmploymentType = "full_time" | "part_time" | "contract";
export type EmployeeStatus = "active" | "inactive" | "on_leave";

export interface Employee {
  id: string;
  company_id: string;
  user_id?: string;
  full_name: string;
  email: string;
  department: string;
  role: string;
  manager_id?: string;
  employment_type: EmploymentType;
  status: EmployeeStatus;
  salary: number;
  join_date: string;
  performance_score?: number;
  attrition_risk?: number;
  avatar_url?: string;
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string;
  check_in?: string;
  check_out?: string;
  status: "present" | "absent" | "late" | "half_day";
}

export interface LeaveRequest {
  id: string;
  employee_id: string;
  type: "annual" | "sick" | "maternity" | "paternity" | "unpaid";
  start_date: string;
  end_date: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface PayrollRecord {
  id: string;
  employee_id: string;
  month: string;
  year: number;
  base_salary: number;
  bonus: number;
  deductions: number;
  net_pay: number;
  status: "draft" | "processed" | "paid";
  ai_anomalies?: string[];
}

export interface PerformanceReview {
  id: string;
  employee_id: string;
  reviewer_id: string;
  period: string;
  goals: string[];
  rating: number;
  ai_summary?: string;
  created_at: string;
}

export interface Announcement {
  id: string;
  company_id: string;
  title: string;
  content: string;
  author_id: string;
  pinned: boolean;
  created_at: string;
}

export interface PipelineStage {
  id: string;
  name: CandidateStage;
  label: string;
  color: string;
  order: number;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  { id: "1", name: "applied", label: "Applied", color: "#5c5c80", order: 1 },
  { id: "2", name: "screened", label: "Screened", color: "#818cf8", order: 2 },
  { id: "3", name: "interview", label: "Interview", color: "#a855f7", order: 3 },
  { id: "4", name: "offer", label: "Offer", color: "#f59e0b", order: 4 },
  { id: "5", name: "hired", label: "Hired", color: "#22c55e", order: 5 },
];
