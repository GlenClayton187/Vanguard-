export type Department = 'Engineering' | 'Product' | 'Design' | 'Finance' | 'Sales' | 'Operations';

export type EmploymentType = 'Full-Time' | 'Contractor' | 'Executive';

export type PaymentStatus = 'Paid' | 'Pending_Approval' | 'Processing' | 'Held';

export type PayFrequency = 'Bi-Weekly' | 'Monthly' | 'Semi-Monthly';

export type ProjectStatus = 'Planning' | 'Active' | 'At_Risk' | 'Review' | 'Completed';

export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export type TaskStatus = 'Todo' | 'InProgress' | 'Review' | 'Done';

export type UserRole = 'CEO / Executive' | 'HR & Finance Director' | 'Engineering Lead' | 'Staff Member';

export interface Competencies {
  execution: number; // 0-100
  leadership: number;
  impact: number;
  collaboration: number;
  velocity: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: Department;
  email: string;
  avatar?: string;
  hireDate: string;
  employmentType: EmploymentType;
  location: string;
  
  // Payroll & Compensation
  compensation: {
    baseSalaryAnnual: number;
    hourlyRate: number;
    payFrequency: PayFrequency;
    directDepositBank: string;
    accountLast4: string;
    taxFilingStatus: 'Single' | 'Married' | 'Head of Household';
    taxWithholdingRate: number; // decimal e.g. 0.22
    k401ContributionRate: number; // decimal e.g. 0.05
    healthPlanMonthlyDeduction: number;
    bonusYTD: number;
  };

  // Current Pay Run
  currentPayRun: {
    periodStart: string;
    periodEnd: string;
    payDate: string;
    hoursRegular: number;
    hoursOvertime: number;
    grossPay: number;
    federalTax: number;
    stateTax: number;
    ficaTax: number;
    k401Deduction: number;
    healthDeduction: number;
    netPay: number;
    paymentStatus: PaymentStatus;
    paymentReference?: string;
  };

  // Performance & Talent
  performance: {
    currentRating: number; // 1.0 - 5.0
    potentialLevel: 'High' | 'Medium' | 'Growth';
    performanceLevel: 'Exceeding' | 'Achieving' | 'Developing';
    velocityScore: number; // 0-100
    okrProgress: number; // 0-100
    flightRisk: 'Low' | 'Moderate' | 'Elevated';
    lastReviewDate: string;
    reviewCycleStatus: 'Self_Review' | 'Peer_Review' | 'Manager_Review' | 'Completed';
    competencies: Competencies;
    managerNotes: string;
  };

  assignedProjectIds: string[];
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string;
  assigneeName: string;
  estimatedHours: number;
  loggedHours: number;
  dueDate: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  description: string;
  clientOrDomain: string;
  department: Department;
  status: ProjectStatus;
  priority: Priority;
  progress: number; // 0 - 100
  budgetTotal: number;
  budgetSpent: number;
  billableRatePerHour: number;
  hoursLogged: number;
  hoursEstimated: number;
  startDate: string;
  targetEndDate: string;
  leadEmployeeId: string;
  teamMemberIds: string[];
  tasks: ProjectTask[];
  milestones: ProjectMilestone[];
}

export interface PayrollCycle {
  id: string;
  cycleName: string;
  periodStart: string;
  periodEnd: string;
  payDate: string;
  totalGross: number;
  totalNet: number;
  totalTaxes: number;
  totalDeductions: number;
  headcount: number;
  status: 'Draft' | 'Audited' | 'Disbursed';
  batchRef: string;
}

export interface TimesheetEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  projectId: string;
  projectName: string;
  date: string;
  hours: number;
  billable: boolean;
  description: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface CompanyOKR {
  id: string;
  objective: string;
  department: Department | 'Company-wide';
  ownerName: string;
  targetMetric: string;
  currentMetric: string;
  progress: number; // 0-100
  status: 'On_Track' | 'Needs_Attention' | 'At_Risk';
  quarter: string;
}
