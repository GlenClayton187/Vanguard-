import React from 'react';
import { X, Printer, Download, CheckCircle, ShieldCheck, Building } from 'lucide-react';
import { Employee } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface PaystubModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

export const PaystubModal: React.FC<PaystubModalProps> = ({
  isOpen,
  onClose,
  employee,
}) => {
  if (!isOpen || !employee) return null;

  const payRun = employee.currentPayRun;
  const comp = employee.compensation;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(employee, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Paystub_${employee.name.replace(/\s+/g, '_')}_${payRun.payDate}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-lg border border-neutral-800 bg-neutral-900 shadow-2xl my-8 overflow-hidden print:border-none print:bg-white print:text-black">
        
        {/* Modal Toolbar (hidden on print) */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-3 print:hidden">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <span>Certified Electronic Earnings Statement (Form W-2 / Pay Statement)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-xs text-neutral-300 hover:text-white transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 rounded border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-xs text-neutral-300 hover:text-white transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Record</span>
            </button>
            <button
              onClick={onClose}
              className="rounded p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* The Printable Pay Statement */}
        <div className="p-8 space-y-6 bg-neutral-900 text-neutral-100 print:bg-white print:text-neutral-900 text-xs">
          
          {/* Header & Corporate Info */}
          <div className="flex flex-col justify-between gap-4 border-b border-neutral-800 pb-5 sm:flex-row sm:items-start print:border-neutral-300">
            <div>
              <div className="text-base font-bold tracking-tight text-neutral-100 print:text-black">
                VANGUARD ENTERPRISE SYSTEMS, INC.
              </div>
              <div className="text-neutral-400 print:text-neutral-600 space-y-0.5 mt-0.5">
                <div>500 Howard Street, Suite 400</div>
                <div>San Francisco, CA 94105 · United States</div>
                <div className="font-mono text-[11px]">EIN: 94-2819021</div>
              </div>
            </div>

            <div className="text-left sm:text-right font-mono space-y-0.5">
              <div className="text-sm font-semibold text-cyan-400 print:text-black">
                DIRECT DEPOSIT ADVICE
              </div>
              <div className="text-neutral-300 print:text-neutral-700">
                Pay Date: <span className="font-bold">{formatDate(payRun.payDate)}</span>
              </div>
              <div className="text-neutral-400 print:text-neutral-500 text-[11px]">
                Period: {formatDate(payRun.periodStart)} to {formatDate(payRun.periodEnd)}
              </div>
              <div className="text-neutral-400 print:text-neutral-500 text-[11px]">
                Advice Ref: {payRun.paymentReference || 'DIR-2026-10-8812'}
              </div>
            </div>
          </div>

          {/* Employee & Direct Deposit Details Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded border border-neutral-800 bg-neutral-950/40 p-4 print:border-neutral-300 print:bg-neutral-50">
            <div className="space-y-1">
              <div className="text-[11px] font-semibold uppercase text-neutral-500">Employee Details</div>
              <div className="font-semibold text-sm text-neutral-100 print:text-black">{employee.name}</div>
              <div className="text-neutral-400 print:text-neutral-600">{employee.role} · {employee.department}</div>
              <div className="text-neutral-500 font-mono text-[11px]">ID: {employee.id} · Location: {employee.location}</div>
            </div>

            <div className="space-y-1 font-mono text-left sm:text-right">
              <div className="text-[11px] font-semibold uppercase text-neutral-500">Disbursement Method</div>
              <div className="text-neutral-200 print:text-black">{comp.directDepositBank}</div>
              <div className="text-neutral-400 print:text-neutral-600 text-[11px]">
                Account: *******{comp.accountLast4} (Checking)
              </div>
              <div className="text-neutral-500 text-[11px]">
                Tax Filing: {comp.taxFilingStatus} · Single Withholding
              </div>
            </div>
          </div>

          {/* Earnings Breakdown Table */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 print:text-neutral-700 mb-2">
              Gross Earnings
            </div>
            <div className="rounded border border-neutral-800 overflow-hidden print:border-neutral-300">
              <table className="w-full text-left font-mono">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-400 print:bg-neutral-100 print:text-neutral-700 text-[11px]">
                    <th className="py-2 pl-3">Pay Type</th>
                    <th className="py-2 px-2 text-right">Hours</th>
                    <th className="py-2 px-2 text-right">Hourly Rate</th>
                    <th className="py-2 px-2 text-right">Current Period</th>
                    <th className="py-2 pr-3 text-right">YTD Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/80 print:divide-neutral-200">
                  <tr>
                    <td className="py-2 pl-3 font-sans text-neutral-200 print:text-black">Regular Salary / Base</td>
                    <td className="py-2 px-2 text-right text-neutral-300">{payRun.hoursRegular}.00</td>
                    <td className="py-2 px-2 text-right text-neutral-400">${comp.hourlyRate.toFixed(2)}</td>
                    <td className="py-2 px-2 text-right font-medium text-neutral-100 print:text-black">
                      {formatCurrency(payRun.grossPay - (payRun.hoursOvertime * comp.hourlyRate * 1.5))}
                    </td>
                    <td className="py-2 pr-3 text-right text-neutral-400">
                      {formatCurrency(comp.baseSalaryAnnual * 0.75)}
                    </td>
                  </tr>
                  {payRun.hoursOvertime > 0 && (
                    <tr>
                      <td className="py-2 pl-3 font-sans text-neutral-200 print:text-black">Overtime (1.5x)</td>
                      <td className="py-2 px-2 text-right text-amber-400">{payRun.hoursOvertime}.00</td>
                      <td className="py-2 px-2 text-right text-neutral-400">${(comp.hourlyRate * 1.5).toFixed(2)}</td>
                      <td className="py-2 px-2 text-right font-medium text-amber-400">
                        {formatCurrency(payRun.hoursOvertime * comp.hourlyRate * 1.5)}
                      </td>
                      <td className="py-2 pr-3 text-right text-neutral-400">
                        {formatCurrency(payRun.hoursOvertime * comp.hourlyRate * 1.5 * 3)}
                      </td>
                    </tr>
                  )}
                  {comp.bonusYTD > 0 && (
                    <tr>
                      <td className="py-2 pl-3 font-sans text-neutral-200 print:text-black">Incentive / Bonus</td>
                      <td className="py-2 px-2 text-right text-neutral-400">—</td>
                      <td className="py-2 px-2 text-right text-neutral-400">—</td>
                      <td className="py-2 px-2 text-right text-neutral-400">$0.00</td>
                      <td className="py-2 pr-3 text-right text-cyan-400">{formatCurrency(comp.bonusYTD)}</td>
                    </tr>
                  )}
                  <tr className="bg-neutral-950/60 font-semibold print:bg-neutral-100">
                    <td className="py-2 pl-3 font-sans">Total Gross Earnings</td>
                    <td className="py-2 px-2 text-right">{payRun.hoursRegular + payRun.hoursOvertime}.00</td>
                    <td className="py-2 px-2 text-right">—</td>
                    <td className="py-2 px-2 text-right text-neutral-100 print:text-black">
                      {formatCurrency(payRun.grossPay)}
                    </td>
                    <td className="py-2 pr-3 text-right">
                      {formatCurrency((comp.baseSalaryAnnual * 0.75) + comp.bonusYTD)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Deductions & Withholdings 2-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Taxes Withheld */}
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 print:text-neutral-700 mb-2">
                Taxes Withheld
              </div>
              <div className="rounded border border-neutral-800 overflow-hidden font-mono print:border-neutral-300">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-neutral-800/80 print:divide-neutral-200">
                    <tr>
                      <td className="py-1.5 pl-3 font-sans text-neutral-300 print:text-black">Federal Income Tax</td>
                      <td className="py-1.5 pr-3 text-right text-rose-400 font-medium">{formatCurrency(payRun.federalTax)}</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pl-3 font-sans text-neutral-300 print:text-black">State Income Tax</td>
                      <td className="py-1.5 pr-3 text-right text-rose-400 font-medium">{formatCurrency(payRun.stateTax)}</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pl-3 font-sans text-neutral-300 print:text-black">Social Security (OASDI)</td>
                      <td className="py-1.5 pr-3 text-right text-rose-400 font-medium">
                        {formatCurrency(payRun.ficaTax * 0.77)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pl-3 font-sans text-neutral-300 print:text-black">Medicare Tax</td>
                      <td className="py-1.5 pr-3 text-right text-rose-400 font-medium">
                        {formatCurrency(payRun.ficaTax * 0.23)}
                      </td>
                    </tr>
                    <tr className="bg-neutral-950/60 font-semibold print:bg-neutral-100">
                      <td className="py-2 pl-3 font-sans">Total Statutory Taxes</td>
                      <td className="py-2 pr-3 text-right text-rose-400">
                        {formatCurrency(payRun.federalTax + payRun.stateTax + payRun.ficaTax)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Voluntary Deductions & 401(k) */}
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 print:text-neutral-700 mb-2">
                Pre-Tax Deductions
              </div>
              <div className="rounded border border-neutral-800 overflow-hidden font-mono print:border-neutral-300">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-neutral-800/80 print:divide-neutral-200">
                    <tr>
                      <td className="py-1.5 pl-3 font-sans text-neutral-300 print:text-black">
                        401(k) Employee Deferral ({Math.round(comp.k401ContributionRate * 100)}%)
                      </td>
                      <td className="py-1.5 pr-3 text-right text-neutral-200 font-medium">
                        {formatCurrency(payRun.k401Deduction)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pl-3 font-sans text-neutral-300 print:text-black">
                        Health / Dental / Vision Pre-Tax
                      </td>
                      <td className="py-1.5 pr-3 text-right text-neutral-200 font-medium">
                        {formatCurrency(payRun.healthDeduction)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pl-3 font-sans text-neutral-500 italic print:text-neutral-600">
                        * Employer 401(k) Match (4.0%)
                      </td>
                      <td className="py-1.5 pr-3 text-right text-neutral-400">
                        ({formatCurrency(payRun.grossPay * 0.04)})
                      </td>
                    </tr>
                    <tr className="bg-neutral-950/60 font-semibold print:bg-neutral-100">
                      <td className="py-2 pl-3 font-sans">Total Deductions</td>
                      <td className="py-2 pr-3 text-right text-neutral-200">
                        {formatCurrency(payRun.k401Deduction + payRun.healthDeduction)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* NET PAY HIGHLIGHT SLIP */}
          <div className="rounded border border-neutral-700 bg-neutral-950 p-4 font-mono print:border-neutral-400 print:bg-neutral-50">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <div className="text-[11px] font-sans font-semibold uppercase text-neutral-400 print:text-neutral-600">
                  Net Amount Deposited
                </div>
                <div className="text-2xl font-bold text-emerald-400 print:text-neutral-900 mt-0.5">
                  {formatCurrency(payRun.netPay)}
                </div>
              </div>
              <div className="text-left sm:text-right text-[11px] text-neutral-400 print:text-neutral-600 font-sans">
                <div>Transferred via ACH to: {comp.directDepositBank}</div>
                <div className="font-mono text-neutral-500">Trace ID: 0910000192837190283</div>
              </div>
            </div>
          </div>

          {/* Footer Legal & Compliance Notice */}
          <div className="border-t border-neutral-800 pt-3 text-[10px] text-neutral-500 print:text-neutral-500 space-y-1">
            <div>
              This electronic advice statement is an accurate reflection of compensation earned and taxes withheld in compliance with federal and state labor standards.
            </div>
            <div>Questions regarding this stub? Contact corporate payroll at payroll@vanguard.internal</div>
          </div>

        </div>

      </div>
    </div>
  );
};
