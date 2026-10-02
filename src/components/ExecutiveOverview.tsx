import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  FolderGit2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Employee, Project, PayrollCycle, TimesheetEntry, UserRole } from '../types';
import { formatCurrency, formatCompactCurrency, formatDate } from '../utils/formatters';

interface ExecutiveOverviewProps {
  employees: Employee[];
  projects: Project[];
  payrollCycles: PayrollCycle[];
  timesheets: TimesheetEntry[];
  currentRole: UserRole;
  onNavigateTab: (tab: string) => void;
  onSelectProject: (projectId: string) => void;
  onOpenBatchPayroll: () => void;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  employees,
  projects,
  payrollCycles,
  timesheets,
  currentRole,
  onNavigateTab,
  onSelectProject,
  onOpenBatchPayroll,
}) => {
  const [selectedHorizon, setSelectedHorizon] = useState<'Q4 2026' | 'Q3 2026' | 'YTD'>('Q4 2026');

  // Compute live aggregates
  const totalPayrollMonthly = employees.reduce(
    (acc, emp) => acc + (emp.compensation.baseSalaryAnnual / 12), 
    0
  );
  
  const currentPayRunTotal = employees.reduce(
    (acc, emp) => acc + emp.currentPayRun.grossPay, 
    0
  );

  const totalProjectBudget = projects.reduce((acc, p) => acc + p.budgetTotal, 0);
  const totalProjectSpent = projects.reduce((acc, p) => acc + p.budgetSpent, 0);
  const overallProjectProgress = Math.round(
    projects.reduce((acc, p) => acc + p.progress, 0) / projects.length
  );

  const pendingTimesheets = timesheets.filter((t) => t.status === 'Pending');
  const criticalProjects = projects.filter((p) => p.status === 'At_Risk');
  const averagePerformanceRating = (
    employees.reduce((acc, e) => acc + e.performance.currentRating, 0) / employees.length
  ).toFixed(2);

  // Department distribution
  const departments = ['Engineering', 'Product', 'Design', 'Finance', 'Sales', 'Operations'] as const;
  const deptData = departments.map((dept) => {
    const deptEmps = employees.filter((e) => e.department === dept);
    const payrollGross = deptEmps.reduce((acc, e) => acc + e.currentPayRun.grossPay, 0);
    const deptProjects = projects.filter((p) => p.department === dept);
    const projectSpend = deptProjects.reduce((acc, p) => acc + p.budgetSpent, 0);
    return {
      department: dept,
      headcount: deptEmps.length,
      payrollGross,
      projectSpend,
    };
  });

  const maxDeptSpend = Math.max(...deptData.map((d) => Math.max(d.payrollGross, d.projectSpend)));

  return (
    <div className="space-y-6">
      
      {/* Editorial Top Section: Context & Time Horizon */}
      <div className="flex flex-col justify-between gap-4 border-b border-neutral-800 pb-5 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>Enterprise Operations</span>
            <span aria-hidden="true">·</span>
            <span>Real-Time Telemetry</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 flex items-center gap-1 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              Live Ledger Synced
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-100 sm:text-3xl">
            Executive Operations Cockpit
          </h1>
          <p className="mt-1 text-sm text-neutral-400 max-w-2xl">
            Integrated command view uniting semi-monthly payroll burn, multi-track engineering delivery, and team talent velocity.
          </p>
        </div>

        {/* Time Horizon Segmented Control (Interactive button filter) */}
        <div className="flex items-center gap-1 self-start rounded border border-neutral-800 bg-neutral-900/90 p-1 sm:self-auto">
          {(['Q4 2026', 'Q3 2026', 'YTD'] as const).map((horizon) => (
            <button
              key={horizon}
              onClick={() => setSelectedHorizon(horizon)}
              className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                selectedHorizon === horizon
                  ? 'bg-neutral-800 text-cyan-400 font-semibold shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {horizon}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Primary High-Density KPI Cards (Zero-pill, tabular numbers) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Metric 1: Monthly Payroll Burn */}
        <div className="rounded border border-neutral-800 bg-neutral-900/60 p-5 transition-colors hover:border-neutral-700">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-medium uppercase tracking-wider text-[11px] text-neutral-400">
              Monthly Payroll Burn
            </span>
            <DollarSign className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-neutral-100 font-mono tabular-nums">
              {formatCurrency(totalPayrollMonthly)}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-neutral-800/80 pt-2.5 text-xs text-neutral-400">
            <span className="flex items-center text-emerald-400 font-mono">
              <ArrowDownRight className="mr-0.5 h-3.5 w-3.5" />
              -1.4% variance
            </span>
            <span className="text-[11px]">Next: Oct 5, 2026</span>
          </div>
        </div>

        {/* Metric 2: Active Project Portfolio Spend */}
        <div className="rounded border border-neutral-800 bg-neutral-900/60 p-5 transition-colors hover:border-neutral-700">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-medium uppercase tracking-wider text-[11px] text-neutral-400">
              Portfolio Spend / Budget
            </span>
            <FolderGit2 className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-neutral-100 font-mono tabular-nums">
              {formatCompactCurrency(totalProjectSpent)}
            </span>
            <span className="text-xs font-mono text-neutral-400">
              / {formatCompactCurrency(totalProjectBudget)}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-neutral-800/80 pt-2.5 text-xs text-neutral-400">
            <span className="font-mono text-neutral-300">
              {Math.round((totalProjectSpent / totalProjectBudget) * 100)}% consumed
            </span>
            <span className="text-[11px] text-neutral-400">{projects.length} tracks active</span>
          </div>
        </div>

        {/* Metric 3: Resource Utilization & Headcount */}
        <div className="rounded border border-neutral-800 bg-neutral-900/60 p-5 transition-colors hover:border-neutral-700">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-medium uppercase tracking-wider text-[11px] text-neutral-400">
              Billable Utilization
            </span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-neutral-100 font-mono tabular-nums">
              83.4%
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              target: 85%
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-neutral-800/80 pt-2.5 text-xs text-neutral-400">
            <span className="flex items-center text-emerald-400 font-mono">
              <ArrowUpRight className="mr-0.5 h-3.5 w-3.5" />
              +2.8% MoM
            </span>
            <span className="text-[11px]">{employees.length} active staff</span>
          </div>
        </div>

        {/* Metric 4: Org Talent Rating & Health */}
        <div className="rounded border border-neutral-800 bg-neutral-900/60 p-5 transition-colors hover:border-neutral-700">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-medium uppercase tracking-wider text-[11px] text-neutral-400">
              Talent Benchmark
            </span>
            <Users className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-neutral-100 font-mono tabular-nums">
              {averagePerformanceRating}
            </span>
            <span className="text-xs text-neutral-400 font-mono">/ 5.0</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-neutral-800/80 pt-2.5 text-xs text-neutral-400">
            <span className="text-emerald-400 font-mono">96.2% retention</span>
            <span className="text-[11px] text-neutral-400">Q3 Review closed</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Department Allocation & Critical Delivery Tracks */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Left 2 Cols: Department Capital & Payroll Breakdown (Custom Data Viz) */}
        <div className="rounded border border-neutral-800 bg-neutral-900/40 p-5 lg:col-span-2">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-neutral-100">
                Departmental Spend Allocation
              </h2>
              <p className="text-xs text-neutral-400">
                Current pay run gross commitments versus cumulative project burn by department.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-neutral-400">
                <span className="h-2.5 w-2.5 rounded-xs bg-cyan-500 inline-block" />
                <span>Pay Run Gross</span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-400">
                <span className="h-2.5 w-2.5 rounded-xs bg-blue-600 inline-block" />
                <span>Project Burn</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="mt-6 space-y-4">
            {deptData.map((item) => {
              const payrollWidth = Math.max(8, (item.payrollGross / maxDeptSpend) * 100);
              const projectWidth = Math.max(8, (item.projectSpend / maxDeptSpend) * 100);

              return (
                <div key={item.department} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-neutral-200">{item.department}</span>
                      <span className="text-neutral-500 font-mono text-[11px]">
                        ({item.headcount} {item.headcount === 1 ? 'member' : 'members'})
                      </span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-neutral-300 text-xs">
                      <span>Payroll: {formatCurrency(item.payrollGross)}</span>
                      <span className="text-neutral-600">|</span>
                      <span className="text-neutral-400">Project: {formatCompactCurrency(item.projectSpend)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-1">
                    {/* Pay Run Gross Bar */}
                    <div className="h-2 w-full rounded-xs bg-neutral-800/80 overflow-hidden">
                      <div 
                        className="h-full bg-cyan-500 transition-all duration-500 rounded-xs"
                        style={{ width: `${payrollWidth}%` }}
                        title={`${item.department} Payroll: ${formatCurrency(item.payrollGross)}`}
                      />
                    </div>
                    {/* Project Burn Bar */}
                    <div className="h-2 w-full rounded-xs bg-neutral-800/80 overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-500 rounded-xs"
                        style={{ width: `${projectWidth}%` }}
                        title={`${item.department} Project Spend: ${formatCurrency(item.projectSpend)}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-neutral-800/80 pt-4 text-xs text-neutral-400">
            <span>Cycle totals: {formatCurrency(currentPayRunTotal)} gross across 6 divisions</span>
            <button
              onClick={() => onNavigateTab('payroll')}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>Inspect full payroll roster</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Right 1 Col: Operational Action Queue & Alerts */}
        <div className="rounded border border-neutral-800 bg-neutral-900/40 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-tight text-neutral-100">
                Action Required
              </h2>
              <span className="text-xs font-mono text-amber-400">
                {pendingTimesheets.length + criticalProjects.length} items pending
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-400">
              Immediate operational approvals and budget variances requiring leadership sign-off.
            </p>

            <div className="mt-4 space-y-3">
              {/* Pay Run Pending Approval Alert */}
              <div className="rounded border border-neutral-800 bg-neutral-900/80 p-3">
                <div className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-neutral-200">October 2026 (Cycle A)</span>
                      <span className="text-[11px] font-mono text-amber-400">Pre-Flight</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-neutral-400">
                      Disbursement scheduled for Oct 5. Total gross obligation: {formatCurrency(84667.67)}.
                    </p>
                    <div className="mt-2.5">
                      <button
                        onClick={onOpenBatchPayroll}
                        className="rounded bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                      >
                        Audit & Disburse Batch
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Timesheets */}
              {pendingTimesheets.length > 0 && (
                <div className="rounded border border-neutral-800 bg-neutral-900/80 p-3">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-neutral-200">Timesheet Approvals</span>
                        <span className="font-mono text-xs text-amber-400">
                          {pendingTimesheets.length} Pending
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-neutral-400">
                        {pendingTimesheets.reduce((acc, t) => acc + t.hours, 0)} hours submitted across active client milestones.
                      </p>
                      <div className="mt-2.5">
                        <button
                          onClick={() => onNavigateTab('timesheets')}
                          className="rounded bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-200 hover:bg-neutral-700 transition-colors"
                        >
                          Review Submissions
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Project Risk Flag */}
              {criticalProjects.map((p) => (
                <div key={p.id} className="rounded border border-neutral-800 bg-neutral-900/80 p-3">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-neutral-200">{p.code}: {p.name}</span>
                        <span className="text-[11px] font-mono text-rose-400">Budget Warning</span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-neutral-400">
                        Spend at {Math.round((p.budgetSpent / p.budgetTotal) * 100)}% while progress is {p.progress}%. Target: {formatDate(p.targetEndDate)}.
                      </p>
                      <div className="mt-2.5">
                        <button
                          onClick={() => {
                            onNavigateTab('projects');
                            onSelectProject(p.id);
                          }}
                          className="rounded bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-200 hover:bg-neutral-700 transition-colors"
                        >
                          Inspect Budget Burn
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 border-t border-neutral-800/80 pt-3 text-[11px] text-neutral-500">
            Compliance: SOC2 Type II · US Tax Code 2026 Compliant
          </div>
        </div>

      </div>

      {/* Active Project Delivery Portfolio Table Preview */}
      <div className="rounded border border-neutral-800 bg-neutral-900/40 p-5">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-neutral-100">
              Active Project Portfolio Delivery Status
            </h2>
            <p className="text-xs text-neutral-400">
              Tracking burn rates, completion percentages, and milestone delivery dates.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('projects')}
            className="flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors self-start sm:self-auto"
          >
            <span>Open Gantt & Kanban Suite</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400">
                <th className="pb-2.5 font-medium">Project</th>
                <th className="pb-2.5 font-medium">Lead</th>
                <th className="pb-2.5 font-medium">Status</th>
                <th className="pb-2.5 font-medium">Progress</th>
                <th className="pb-2.5 font-medium text-right">Spend / Budget</th>
                <th className="pb-2.5 font-medium text-right">Target Delivery</th>
                <th className="pb-2.5 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono">
              {projects.map((proj) => {
                const lead = employees.find((e) => e.id === proj.leadEmployeeId);
                const spendRatio = Math.round((proj.budgetSpent / proj.budgetTotal) * 100);

                return (
                  <tr key={proj.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="py-3 pr-4 font-sans">
                      <div className="font-medium text-neutral-200">{proj.name}</div>
                      <div className="text-[11px] text-neutral-500 font-mono">
                        {proj.code} · {proj.clientOrDomain}
                      </div>
                    </td>
                    <td className="py-3 pr-4 font-sans">
                      <div className="flex items-center gap-2">
                        {lead?.avatar ? (
                          <img 
                            src={lead.avatar} 
                            alt={lead.name} 
                            referrerPolicy="no-referrer"
                            className="h-6 w-6 rounded-full object-cover border border-neutral-700" 
                          />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[10px] text-neutral-300 font-medium">
                            {lead ? lead.name.slice(0, 2).toUpperCase() : 'LD'}
                          </div>
                        )}
                        <span className="text-neutral-300">{lead?.name ?? 'Assigned Lead'}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 font-sans">
                      <span className={`text-[11px] ${
                        proj.status === 'Active' 
                          ? 'text-emerald-400' 
                          : proj.status === 'At_Risk' 
                          ? 'text-rose-400' 
                          : 'text-amber-400'
                      }`}>
                        {proj.status === 'At_Risk' ? 'At Risk' : proj.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="w-32">
                        <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                          <span>{proj.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-xs bg-neutral-800 overflow-hidden">
                          <div
                            className={`h-full rounded-xs ${
                              proj.progress >= 70 ? 'bg-cyan-400' : 'bg-blue-500'
                            }`}
                            style={{ width: `${proj.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-right tabular-nums">
                      <div className="text-neutral-200">{formatCompactCurrency(proj.budgetSpent)}</div>
                      <div className="text-[11px] text-neutral-500">
                        of {formatCompactCurrency(proj.budgetTotal)} ({spendRatio}%)
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-right text-neutral-400">
                      {formatDate(proj.targetEndDate)}
                    </td>
                    <td className="py-3 text-right font-sans">
                      <button
                        onClick={() => {
                          onNavigateTab('projects');
                          onSelectProject(proj.id);
                        }}
                        className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
