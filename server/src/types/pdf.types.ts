/**
 * PDF Export Service DTOs and Interfaces
 * Ensures type safety for institutional document generation.
 */

export interface PdfOrganization {
  name: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  city?: string | null;
  country?: string | null;
}

export interface PdfAssignable {
  fullName: string;
  employeeCode?: string;
  jobTitle?: string;
  departmentObj?: { name: string };
  signatureUrl?: string | null;
}

export interface PdfTargetMetric {
  title: string;
  targetValue: number;
  currentValue: number;
  unit?: string;
}

export interface PdfTargetContent {
  title: string;
  description?: string;
  progress: number;
  assignee?: PdfAssignable;
  department?: { name: string };
  metrics?: PdfTargetMetric[];
}

export interface PdfReview {
  reviewStage: string;
  reviewer?: PdfAssignable;
  overallRating?: number;
  summary?: string;
  strengths?: string;
  achievements?: string;
  weaknesses?: string;
  developmentNeeds?: string;
  responses?: any; // JSON string or object
}

export interface PdfAppraisalContent {
  employee?: PdfAssignable;
  cycle?: { title: string };
  finalScore?: number | string;
  reviews?: PdfReview[];
  finalVerdict?: string;
  arbitrationLogic?: string;
  finalReviewer?: PdfAssignable;
}

export interface PdfLeaveContent {
  id: string;
  employee?: PdfAssignable;
  leaveType: string;
  startDate: string | Date;
  endDate: string | Date;
  leaveDays: number;
  reason?: string;
  reliever?: PdfAssignable;
  relieverStatus?: string;
  handoverAcknowledged?: boolean;
  hrReviewer?: PdfAssignable;
  manager?: PdfAssignable;
}

export interface PdfPayslipContent {
  id: string;
  currency?: string;
  baseSalary: number;
  overtime: number;
  bonus: number;
  allowances: number;
  tax: number;
  ssnit: number;
  otherDeductions: number;
  grossPay: number;
  netPay: number;
  notes?: string;
  employee?: PdfAssignable;
  run?: {
    period: string;
    updatedAt: string | Date;
  };
}

export interface PdfBoardReportContent {
  totalEmployees: number;
  pendingLeaves: number;
  pendingAppraisals: number;
  payrollTotal: number;
  insights?: { label: string; description: string }[];
}
