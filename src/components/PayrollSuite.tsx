import React, { useState } from 'react';
import { 
  DollarSign, 
  Download, 
  Search, 
  Filter, 
  FileText, 
  Edit3, 
  CheckCircle, 
  Clock, 
  Play, 
  ArrowUpDown,
  Building2,
  FileSpreadsheet
} from 'lucide-react';
import { Employee, Department, PaymentStatus, UserRole } from '../types';
import { formatCurrency, formatDate, exportToCSV } from '../utils/formatters';

interface PayrollSuiteProps {
  employees: Employee[];
  currentRole: UserRole;
  onOpenBatchPayroll: () => void;
  onViewPaystub: (employee: Employee) => void;
  onAdjustCompensation: (employee: Employee) => void;
  onUpdatePaymentStatus: (employeeId: string, status: PaymentStatus) => void;
}

export const PayrollSuite: React.FC<PayrollSuiteProps> = ({
  employees,
  currentRole,
  onOpenBatchPayroll,
  onViewPaystub,
  onAdjustCompensation,
  onUpdatePaymentStatus,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'compensation' | 'taxes' | 'ledger'>('roster');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortField, setSortField] = useState<'name' | 'grossPay' | 'netPay'>('grossPay');
  const [sortAsc, setSortAsc] = useState(false);

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || emp.currentPayRun.paymentStatus === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  }).sort((a, b) => {
    if (sortField === 'name') {
      return sortAsc 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    }
    if (sortField === 'grossPay') {
      return sortAsc 
        ? a.currentPayRun.grossPay - b.currentPayRun.grossPay 
        : b.currentPayRun.grossPay - a.currentPayRun.grossPay;
    }
    if (sortField === 'netPay') {
      return sortAsc 
        ? a.currentPayRun.netPay - b.currentPayRun.netPay 
        : b.currentPayRun.netPay - a.currentPayRun.netPay;
    }
    return 0;
  });

  // Calculate aggregates
  const totalGross = filteredEmployees.reduce((acc, e) => acc + e.currentPayRun.grossPay, 0);
  const totalNet = filteredEmployees.reduce((acc, e) => acc + e.currentPayRun.netPay, 0);
  const totalFederalTax = filteredEmployees.reduce((acc, e) => acc + e.currentPayRun.federalTax, 0);
  const totalStateTax = filteredEmployees.reduce((acc, e) => acc + e.currentPayRun.stateTax, 0);
  const totalFica = filteredEmployees.reduce((acc, e) => acc + e.currentPayRun.ficaTax, 0);
  const totalTaxes = totalFederalTax + totalStateTax + totalFica;
  const totalDeductions = filteredEmployees.reduce(
    (acc, e) => acc + e.currentPayRun.k401Deduction + e.currentPayRun.healthDeduction, 
    0
  );

  const handleExportCSV = () => {
    const exportRows = filteredEmployees.map((e) => ({
      ID: e.id,
      Name: e.name,
      Department: e.department,
      Role: e.role,
      PayFrequency: e.compensation.payFrequency,
      BaseAnnual: e.compensation.baseSalaryAnnual,
      GrossPay: e.currentPayRun.grossPay.toFixed(2),
      FederalTax: e.currentPayRun.federalTax.toFixed(2),
      StateTax: e.currentPayRun.stateTax.toFixed(2),
      FICA_Medicare: e.currentPayRun.ficaTax.toFixed(2),
      Retirement401k: e.currentPayRun.k401Deduction.toFixed(2),
      HealthDeduction: e.currentPayRun.healthDeduction.toFixed(2),
      NetPay: e.currentPayRun.netPay.toFixed(2),
      Bank: e.compensation.directDepositBank,
      AccountLast4: e.compensation.accountLast4,
      PaymentStatus: e.currentPayRun.paymentStatus,
      PayPeriod: `${e.currentPayRun.periodStart} to ${e.currentPayRun.periodEnd}`,
      PayDate: e.currentPayRun.payDate,
    }));
    exportToCSV(`vanguard_payroll_cycle_${new Date().toISOString().slice(0, 10)}`, exportRows);
  };

  const handleExportACH = () => {
    // Generate realistic NACHA ACH text file
    let achContent = `101 091000019 123456789 ${new Date().toISOString().slice(2, 10).replace(/-/g, '')} 0930 A 094 101 VANGUARD OPS CORP\n`;
    achContent += `5200 VANGUARD ENTERPRISE        942819021 PPD PAYROLL   ${new Date().toISOString().slice(2, 10).replace(/-/g, '')} 261005   1 09100001 0000001\n`;
    filteredEmployees.forEach((e, idx) => {
      const cents = Math.round(e.currentPayRun.netPay * 100).toString().padStart(10, '0');
      const trace = (idx + 1).toString().padStart(7, '0');
      achContent += `622 121000248 ${e.compensation.accountLast4.padEnd(17, ' ')} ${cents} ${e.id.padEnd(15, ' ')} ${e.name.padEnd(22, ' ')}  009100001${trace}\n`;
    });
    achContent += `8200 000012 000000000000 000000000000 000000000000 09100001 0000001\n`;
    achContent += `9000001 000001 00000012 000000000000 000000000000 000000000000\n`;

    const blob = new Blob([achContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `NACHA_ACH_VANGUARD_${new Date().toISOString().slice(0, 10)}.ach`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Cycle Metadata */}
      <div className="flex flex-col justify-between gap-4 border-b border-neutral-800 pb-5 lg:flex-row lg:items-end">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>Corporate Finance</span>
            <span aria-hidden="true">·</span>
            <span>Semi-Monthly Cycle A</span>
            <span aria-hidden="true">·</span>
            <span>Period: Sep 16 - Sep 30, 2026</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-400 font-mono">Disbursement: Oct 5, 2026</span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-100 sm:text-3xl">
            Employee Payroll & Compensation Engine
          </h1>
          <p className="mt-1 text-sm text-neutral-400 max-w-3xl">
            Automated tax calculation, voluntary benefit deductions, ACH bank batch distribution, and individual digital paystub auditing.
          </p>
        </div>

        {/* Global Payroll Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:border-neutral-700 hover:text-white transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportACH}
            className="flex items-center gap-1.5 rounded border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:border-neutral-700 hover:text-white transition-colors"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>Export NACHA ACH</span>
          </button>

          {currentRole !== 'Staff Member' && (
            <button
              onClick={onOpenBatchPayroll}
              className="flex items-center gap-1.5 rounded bg-cyan-500 px-3.5 py-1.5 text-xs font-medium text-neutral-950 hover:bg-cyan-400 transition-colors shadow-xs"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Simulate Pay Run Execution</span>
            </button>
          )}
        </div>
      </div>

      {/* Cycle Summary Metrics Strip (Tabular, unboxed metadata) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        <div className="rounded border border-neutral-800 bg-neutral-900/60 p-3.5">
          <div className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
            Total Gross Pay
          </div>
          <div className="mt-1 text-lg font-semibold font-mono tabular-nums text-neutral-100">
            {formatCurrency(totalGross)}
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">
            {filteredEmployees.length} employees included
          </div>
        </div>

        <div className="rounded border border-neutral-800 bg-neutral-900/60 p-3.5">
          <div className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
            Tax Withholdings
          </div>
          <div className="mt-1 text-lg font-semibold font-mono tabular-nums text-rose-400">
            {formatCurrency(totalTaxes)}
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">
            Fed + State + FICA
          </div>
        </div>

        <div className="rounded border border-neutral-800 bg-neutral-900/60 p-3.5">
          <div className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
            Retirement & Health
          </div>
          <div className="mt-1 text-lg font-semibold font-mono tabular-nums text-neutral-200">
            {formatCurrency(totalDeductions)}
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">
            401(k) + Medical plan
          </div>
        </div>

        <div className="rounded border border-neutral-800 bg-neutral-900/60 p-3.5">
          <div className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
            Net Disbursed
          </div>
          <div className="mt-1 text-lg font-semibold font-mono tabular-nums text-emerald-400">
            {formatCurrency(totalNet)}
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">
            Direct deposit total
          </div>
        </div>

        <div className="col-span-2 sm:col-span-4 lg:col-span-1 rounded border border-neutral-800 bg-neutral-900/60 p-3.5 flex flex-col justify-between">
          <div className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
            Batch Status
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-amber-400 font-mono">
            <Clock className="h-3.5 w-3.5" />
            <span>Ready for Audit</span>
          </div>
          <div className="mt-1 text-[11px] text-neutral-500 truncate">
            Ref: ACH-20261005-VANGUARD
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation and Live Filters */}
      <div className="flex flex-col justify-between gap-3 border-b border-neutral-800 pb-3 sm:flex-row sm:items-center">
        {/* Segmented Sub Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveSubTab('roster')}
            className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
              activeSubTab === 'roster'
                ? 'bg-neutral-800 text-cyan-400'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Pay Run Roster
          </button>
          <button
            onClick={() => setActiveSubTab('compensation')}
            className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
              activeSubTab === 'compensation'
                ? 'bg-neutral-800 text-cyan-400'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Base Salary & Direct Deposit
          </button>
          <button
            onClick={() => setActiveSubTab('taxes')}
            className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
              activeSubTab === 'taxes'
                ? 'bg-neutral-800 text-cyan-400'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Tax Schedule & FICA
          </button>
        </div>

        {/* Live Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Filter by name, role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-44 sm:w-56 rounded border border-neutral-800 bg-neutral-900/80 py-1.5 pl-8 pr-3 text-xs text-neutral-200 placeholder:text-neutral-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Department Select */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="rounded border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-xs text-neutral-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Design">Design</option>
            <option value="Finance">Finance</option>
            <option value="Sales">Sales</option>
            <option value="Operations">Operations</option>
          </select>

          {/* Status Select */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-xs text-neutral-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Pending_Approval">Pending Approval</option>
            <option value="Paid">Disbursed (Paid)</option>
            <option value="Processing">Processing</option>
            <option value="Held">Held for Review</option>
          </select>
        </div>
      </div>

      {/* Main High-Density Table */}
      <div className="overflow-hidden rounded border border-neutral-800 bg-neutral-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900/80 text-neutral-400">
                <th className="py-3 pl-4 pr-3 font-medium">
                  <button 
                    onClick={() => {
                      setSortField('name');
                      setSortAsc(!sortAsc);
                    }}
                    className="flex items-center gap-1 hover:text-white"
                  >
                    <span>Employee</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3 px-3 font-medium">Department</th>
                {activeSubTab === 'roster' && (
                  <>
                    <th className="py-3 px-3 font-medium text-right">Hours (Reg/OT)</th>
                    <th className="py-3 px-3 font-medium text-right">
                      <button 
                        onClick={() => {
                          setSortField('grossPay');
                          setSortAsc(!sortAsc);
                        }}
                        className="flex items-center gap-1 ml-auto hover:text-white"
                      >
                        <span>Gross Pay</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="py-3 px-3 font-medium text-right text-rose-400/90">Fed Tax</th>
                    <th className="py-3 px-3 font-medium text-right text-rose-400/90">State Tax</th>
                    <th className="py-3 px-3 font-medium text-right text-rose-400/90">FICA</th>
                    <th className="py-3 px-3 font-medium text-right">401k & Health</th>
                    <th className="py-3 px-3 font-medium text-right">
                      <button 
                        onClick={() => {
                          setSortField('netPay');
                          setSortAsc(!sortAsc);
                        }}
                        className="flex items-center gap-1 ml-auto hover:text-white text-emerald-400"
                      >
                        <span>Net Pay</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                  </>
                )}
                {activeSubTab === 'compensation' && (
                  <>
                    <th className="py-3 px-3 font-medium text-right">Base Salary (Annual)</th>
                    <th className="py-3 px-3 font-medium text-right">Hourly Equiv</th>
                    <th className="py-3 px-3 font-medium">Pay Frequency</th>
                    <th className="py-3 px-3 font-medium">Direct Deposit Routing</th>
                    <th className="py-3 px-3 font-medium text-right">YTD Bonus</th>
                  </>
                )}
                {activeSubTab === 'taxes' && (
                  <>
                    <th className="py-3 px-3 font-medium">Filing Status</th>
                    <th className="py-3 px-3 font-medium text-right">Withholding Rate</th>
                    <th className="py-3 px-3 font-medium text-right">401(k) Match Rate</th>
                    <th className="py-3 px-3 font-medium text-right">Medical Deduction</th>
                    <th className="py-3 px-3 font-medium text-right">Total Taxes / Cycle</th>
                  </>
                )}
                <th className="py-3 px-3 font-medium">Status</th>
                <th className="py-3 pr-4 pl-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono">
              {filteredEmployees.map((emp) => {
                const isPaid = emp.currentPayRun.paymentStatus === 'Paid';
                const isPending = emp.currentPayRun.paymentStatus === 'Pending_Approval';

                return (
                  <tr key={emp.id} className="hover:bg-neutral-800/30 transition-colors">
                    {/* Employee Identity */}
                    <td className="py-3 pl-4 pr-3 font-sans">
                      <div className="flex items-center gap-2.5">
                        {emp.avatar ? (
                          <img 
                            src={emp.avatar} 
                            alt={emp.name} 
                            referrerPolicy="no-referrer"
                            className="h-7 w-7 rounded-full object-cover border border-neutral-700 shrink-0" 
                          />
                        ) : (
                          <div className="h-7 w-7 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[10px] text-neutral-300 font-medium shrink-0">
                            {emp.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-neutral-200">{emp.name}</div>
                          <div className="text-[11px] text-neutral-400">
                            {emp.role}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3 px-3 font-sans text-neutral-300">
                      {emp.department}
                    </td>

                    {/* View 1: Roster View */}
                    {activeSubTab === 'roster' && (
                      <>
                        <td className="py-3 px-3 text-right text-neutral-300 tabular-nums">
                          {emp.currentPayRun.hoursRegular}h
                          {emp.currentPayRun.hoursOvertime > 0 && (
                            <span className="text-amber-400 ml-1">+{emp.currentPayRun.hoursOvertime}h OT</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right text-neutral-100 font-medium tabular-nums">
                          {formatCurrency(emp.currentPayRun.grossPay)}
                        </td>
                        <td className="py-3 px-3 text-right text-rose-400/90 tabular-nums">
                          {formatCurrency(emp.currentPayRun.federalTax)}
                        </td>
                        <td className="py-3 px-3 text-right text-rose-400/90 tabular-nums">
                          {formatCurrency(emp.currentPayRun.stateTax)}
                        </td>
                        <td className="py-3 px-3 text-right text-rose-400/90 tabular-nums">
                          {formatCurrency(emp.currentPayRun.ficaTax)}
                        </td>
                        <td className="py-3 px-3 text-right text-neutral-300 tabular-nums">
                          {formatCurrency(emp.currentPayRun.k401Deduction + emp.currentPayRun.healthDeduction)}
                        </td>
                        <td className="py-3 px-3 text-right text-emerald-400 font-semibold tabular-nums">
                          {formatCurrency(emp.currentPayRun.netPay)}
                        </td>
                      </>
                    )}

                    {/* View 2: Compensation View */}
                    {activeSubTab === 'compensation' && (
                      <>
                        <td className="py-3 px-3 text-right text-neutral-100 font-medium tabular-nums">
                          {formatCurrency(emp.compensation.baseSalaryAnnual)}
                        </td>
                        <td className="py-3 px-3 text-right text-neutral-400 tabular-nums">
                          ${emp.compensation.hourlyRate.toFixed(2)}/hr
                        </td>
                        <td className="py-3 px-3 font-sans text-neutral-300">
                          {emp.compensation.payFrequency}
                        </td>
                        <td className="py-3 px-3 font-sans text-neutral-300">
                          <div>{emp.compensation.directDepositBank}</div>
                          <div className="text-[11px] text-neutral-500 font-mono">
                            Acct ending in ****{emp.compensation.accountLast4}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right text-cyan-400 tabular-nums">
                          {formatCurrency(emp.compensation.bonusYTD)}
                        </td>
                      </>
                    )}

                    {/* View 3: Tax Schedule */}
                    {activeSubTab === 'taxes' && (
                      <>
                        <td className="py-3 px-3 font-sans text-neutral-300">
                          {emp.compensation.taxFilingStatus}
                        </td>
                        <td className="py-3 px-3 text-right text-neutral-300 tabular-nums">
                          {Math.round(emp.compensation.taxWithholdingRate * 100)}%
                        </td>
                        <td className="py-3 px-3 text-right text-neutral-300 tabular-nums">
                          {Math.round(emp.compensation.k401ContributionRate * 100)}%
                        </td>
                        <td className="py-3 px-3 text-right text-neutral-300 tabular-nums">
                          {formatCurrency(emp.compensation.healthPlanMonthlyDeduction / 2)}
                        </td>
                        <td className="py-3 px-3 text-right text-rose-400 font-medium tabular-nums">
                          {formatCurrency(
                            emp.currentPayRun.federalTax + 
                            emp.currentPayRun.stateTax + 
                            emp.currentPayRun.ficaTax
                          )}
                        </td>
                      </>
                    )}

                    {/* Status */}
                    <td className="py-3 px-3 font-sans">
                      <button
                        onClick={() => {
                          const nextStatus = isPaid ? 'Pending_Approval' : 'Paid';
                          onUpdatePaymentStatus(emp.id, nextStatus);
                        }}
                        className={`text-[11px] flex items-center gap-1.5 transition-colors ${
                          isPaid 
                            ? 'text-emerald-400 hover:text-emerald-300' 
                            : isPending 
                            ? 'text-amber-400 hover:text-amber-300' 
                            : 'text-neutral-400'
                        }`}
                        title="Click to toggle status"
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          isPaid ? 'bg-emerald-400' : isPending ? 'bg-amber-400' : 'bg-neutral-500'
                        }`} />
                        <span>{isPaid ? 'Paid' : isPending ? 'Pending' : emp.currentPayRun.paymentStatus}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 pr-4 pl-3 text-right font-sans">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewPaystub(emp)}
                          className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                          title="Generate Paystub Slip"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span>Paystub</span>
                        </button>

                        {currentRole !== 'Staff Member' && (
                          <button
                            onClick={() => onAdjustCompensation(emp)}
                            className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors"
                            title="Edit Compensation"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Adjust</span>
                          </button>
                        )}
                      </div>
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
