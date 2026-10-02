import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Filter, 
  Check, 
  AlertCircle,
  FileCheck2,
  DollarSign
} from 'lucide-react';
import { TimesheetEntry, UserRole } from '../types';
import { formatDate } from '../utils/formatters';

interface TimesheetsViewProps {
  timesheets: TimesheetEntry[];
  currentRole: UserRole;
  onApproveTimesheet: (id: string) => void;
  onRejectTimesheet: (id: string) => void;
  onApproveAllPending: () => void;
}

export const TimesheetsView: React.FC<TimesheetsViewProps> = ({
  timesheets,
  currentRole,
  onApproveTimesheet,
  onRejectTimesheet,
  onApproveAllPending,
}) => {
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  const filteredTimesheets = timesheets.filter((t) => {
    return statusFilter === 'All' || t.status === statusFilter;
  });

  const pendingCount = timesheets.filter((t) => t.status === 'Pending').length;
  const pendingHours = timesheets
    .filter((t) => t.status === 'Pending')
    .reduce((acc, t) => acc + t.hours, 0);

  const totalLoggedHours = timesheets.reduce((acc, t) => acc + t.hours, 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-neutral-800 pb-5 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>Resource Time Tracking</span>
            <span aria-hidden="true">·</span>
            <span>Client Billable Logs</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-cyan-400">{pendingHours} Pending Hours</span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-100 sm:text-3xl">
            Timesheets & Billable Approvals
          </h1>
          <p className="mt-1 text-sm text-neutral-400 max-w-2xl">
            Review and certify employee logged project hours prior to client invoice generation and payroll ledger reconciliation.
          </p>
        </div>

        {/* Global Action: Approve All Pending */}
        {pendingCount > 0 && currentRole !== 'Staff Member' && (
          <button
            onClick={onApproveAllPending}
            className="flex items-center gap-1.5 rounded bg-cyan-500 px-3.5 py-1.5 text-xs font-medium text-neutral-950 hover:bg-cyan-400 transition-colors"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Approve All {pendingCount} Pending</span>
          </button>
        )}
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded border border-neutral-800 bg-neutral-900/60 p-4">
          <div className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
            Pending Approval Queue
          </div>
          <div className="mt-1 text-2xl font-semibold font-mono tabular-nums text-amber-400">
            {pendingCount} logs
          </div>
          <div className="mt-1 text-xs text-neutral-500 font-mono">
            {pendingHours} hours awaiting manager sign-off
          </div>
        </div>

        <div className="rounded border border-neutral-800 bg-neutral-900/60 p-4">
          <div className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
            Total Cycle Logged Hours
          </div>
          <div className="mt-1 text-2xl font-semibold font-mono tabular-nums text-neutral-100">
            {totalLoggedHours} hrs
          </div>
          <div className="mt-1 text-xs text-neutral-500">
            Across active client engineering deliverables
          </div>
        </div>

        <div className="rounded border border-neutral-800 bg-neutral-900/60 p-4">
          <div className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
            Estimated Billable Value
          </div>
          <div className="mt-1 text-2xl font-semibold font-mono tabular-nums text-emerald-400">
            ${(totalLoggedHours * 175).toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-neutral-500">
            Average billing realization: $175/hr
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 border-b border-neutral-800 pb-3">
        {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
              statusFilter === status
                ? 'bg-neutral-800 text-cyan-400 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {status} ({status === 'All' ? timesheets.length : timesheets.filter(t => t.status === status).length})
          </button>
        ))}
      </div>

      {/* High-density Table */}
      <div className="overflow-hidden rounded border border-neutral-800 bg-neutral-900/40">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-900/80 text-neutral-400">
              <th className="py-3 pl-4 pr-3 font-medium">Team Member</th>
              <th className="py-3 px-3 font-medium">Project</th>
              <th className="py-3 px-3 font-medium">Work Narrative</th>
              <th className="py-3 px-3 font-medium text-right">Date</th>
              <th className="py-3 px-3 font-medium text-right">Hours</th>
              <th className="py-3 px-3 font-medium">Status</th>
              <th className="py-3 pr-4 pl-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60 font-mono">
            {filteredTimesheets.map((entry) => {
              const isPending = entry.status === 'Pending';
              const isApproved = entry.status === 'Approved';

              return (
                <tr key={entry.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3 pl-4 pr-3 font-sans font-medium text-neutral-200">
                    {entry.employeeName}
                  </td>
                  <td className="py-3 px-3 font-sans text-neutral-300">
                    {entry.projectName}
                  </td>
                  <td className="py-3 px-3 font-sans text-neutral-400 max-w-sm truncate">
                    {entry.description}
                  </td>
                  <td className="py-3 px-3 text-right text-neutral-400">
                    {formatDate(entry.date)}
                  </td>
                  <td className="py-3 px-3 text-right text-neutral-200 font-bold tabular-nums">
                    {entry.hours}h
                  </td>
                  <td className="py-3 px-3 font-sans">
                    <span className={`text-[11px] font-medium ${
                      isApproved
                        ? 'text-emerald-400'
                        : isPending
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 pl-3 text-right font-sans">
                    {isPending && currentRole !== 'Staff Member' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onApproveTimesheet(entry.id)}
                          className="rounded bg-emerald-500/20 px-2 py-1 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onRejectTimesheet(entry.id)}
                          className="rounded bg-rose-500/20 px-2 py-1 text-rose-400 hover:bg-rose-500/30 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-neutral-600 text-[11px]">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
