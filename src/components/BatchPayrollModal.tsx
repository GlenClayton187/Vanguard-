import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  DollarSign, 
  Building2, 
  FileSpreadsheet,
  Download,
  Loader2
} from 'lucide-react';
import { Employee } from '../types';
import { formatCurrency } from '../utils/formatters';

interface BatchPayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  onCompletePayrollRun: () => void;
}

export const BatchPayrollModal: React.FC<BatchPayrollModalProps> = ({
  isOpen,
  onClose,
  employees,
  onCompletePayrollRun,
}) => {
  const [step, setStep] = useState<'audit' | 'confirm' | 'processing' | 'success'>('audit');
  const [progress, setProgress] = useState(0);
  const [currentStepText, setCurrentStepText] = useState('Verifying direct deposit routing codes...');

  useEffect(() => {
    if (step === 'processing') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStep('success');
            onCompletePayrollRun();
            return 100;
          }
          if (prev === 25) {
            setCurrentStepText('Validating IRS Federal & State tax withholdings...');
          } else if (prev === 55) {
            setCurrentStepText('Generating NACHA ACH Batch file format...');
          } else if (prev === 85) {
            setCurrentStepText('Committing journal entries to corporate general ledger...');
          }
          return prev + 5;
        });
      }, 70);

      return () => clearInterval(interval);
    }
  }, [step, onCompletePayrollRun]);

  if (!isOpen) return null;

  const totalGross = employees.reduce((acc, e) => acc + e.currentPayRun.grossPay, 0);
  const totalNet = employees.reduce((acc, e) => acc + e.currentPayRun.netPay, 0);
  const totalTaxes = employees.reduce(
    (acc, e) => acc + e.currentPayRun.federalTax + e.currentPayRun.stateTax + e.currentPayRun.ficaTax,
    0
  );
  const totalDeductions = employees.reduce(
    (acc, e) => acc + e.currentPayRun.k401Deduction + e.currentPayRun.healthDeduction,
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl rounded-lg border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-cyan-500/10 text-cyan-400">
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-100">
                Run Batch Payroll Cycle
              </h2>
              <p className="text-xs text-neutral-400">
                October 2026 (Cycle A) · Semi-Monthly Disbursement
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          
          {/* STEP 1: PRE-FLIGHT AUDIT */}
          {step === 'audit' && (
            <div className="space-y-5">
              <div className="rounded border border-neutral-800 bg-neutral-950/60 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Pre-Flight System Check
                  </span>
                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-mono">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    All 4 Invariants Passed
                  </span>
                </div>

                <div className="mt-4 space-y-2.5 text-xs font-sans">
                  <div className="flex items-center justify-between text-neutral-300">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span>Bank Routing & Account Numbers Verified</span>
                    </div>
                    <span className="font-mono text-neutral-500">12 / 12 Accounts Valid</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-300">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span>State & Federal Withholding Tables Updated</span>
                    </div>
                    <span className="font-mono text-neutral-500">2026 IRS Rev 104</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-300">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span>Employee Voluntary Deductions & 401(k) Synced</span>
                    </div>
                    <span className="font-mono text-neutral-500">Vanguard 401(k) API</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-300">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span>Corporate Treasury Sufficient Balance</span>
                    </div>
                    <span className="font-mono text-emerald-400">$1,450,000.00 Available</span>
                  </div>
                </div>
              </div>

              {/* Financial Snapshot */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="rounded border border-neutral-800 bg-neutral-950/40 p-3">
                  <span className="text-neutral-500 uppercase text-[10px]">Total Gross Pay</span>
                  <div className="text-base font-semibold text-neutral-100 mt-0.5">
                    {formatCurrency(totalGross)}
                  </div>
                </div>
                <div className="rounded border border-neutral-800 bg-neutral-950/40 p-3">
                  <span className="text-neutral-500 uppercase text-[10px]">Net Direct Deposit</span>
                  <div className="text-base font-semibold text-emerald-400 mt-0.5">
                    {formatCurrency(totalNet)}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setStep('confirm')}
                  className="flex items-center gap-1.5 rounded bg-cyan-500 px-4 py-2 text-xs font-medium text-neutral-950 hover:bg-cyan-400 transition-colors"
                >
                  <span>Proceed to Final Review</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CONFIRMATION REVIEW */}
          {step === 'confirm' && (
            <div className="space-y-5">
              <p className="text-xs text-neutral-300">
                Please confirm the disbursement authorization for the current payroll cycle. Once triggered, the ACH transfer batch will be transmitted to the clearing house.
              </p>

              <div className="rounded border border-neutral-800 bg-neutral-950/60 p-4 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-neutral-300 border-b border-neutral-800/80 pb-2">
                  <span className="font-sans text-neutral-400">Payroll Cycle:</span>
                  <span>October 2026 (Cycle A)</span>
                </div>
                <div className="flex justify-between text-neutral-300 border-b border-neutral-800/80 pb-2">
                  <span className="font-sans text-neutral-400">Effective Pay Date:</span>
                  <span>October 5, 2026</span>
                </div>
                <div className="flex justify-between text-neutral-300 border-b border-neutral-800/80 pb-2">
                  <span className="font-sans text-neutral-400">Active Recipients:</span>
                  <span>{employees.length} personnel</span>
                </div>
                <div className="flex justify-between text-neutral-300 border-b border-neutral-800/80 pb-2">
                  <span className="font-sans text-neutral-400">Total Tax Remittance:</span>
                  <span className="text-rose-400">{formatCurrency(totalTaxes)}</span>
                </div>
                <div className="flex justify-between text-neutral-300 border-b border-neutral-800/80 pb-2">
                  <span className="font-sans text-neutral-400">Retirement & Benefits:</span>
                  <span>{formatCurrency(totalDeductions)}</span>
                </div>
                <div className="flex justify-between text-neutral-100 font-bold pt-1">
                  <span className="font-sans">Total Disbursed Net:</span>
                  <span className="text-emerald-400 text-sm">{formatCurrency(totalNet)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep('audit')}
                  className="rounded px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep('processing');
                    setProgress(0);
                  }}
                  className="rounded bg-cyan-500 px-5 py-2 text-xs font-semibold text-neutral-950 hover:bg-cyan-400 transition-colors"
                >
                  Authorize & Disburse ACH Batch
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PROCESSING SIMULATION */}
          {step === 'processing' && (
            <div className="space-y-6 py-8 text-center">
              <Loader2 className="mx-auto h-8 w-8 text-cyan-400 animate-spin" />
              <div>
                <h3 className="text-sm font-semibold text-neutral-100">
                  Executing Automated Batch Disbursement
                </h3>
                <p className="mt-1 text-xs text-neutral-400 font-mono">
                  {currentStepText}
                </p>
              </div>

              <div className="mx-auto max-w-md">
                <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500 transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-2 text-right text-xs font-mono text-neutral-500">
                  {progress}% Complete
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === 'success' && (
            <div className="space-y-6 py-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-base font-semibold text-neutral-100">
                  Payroll Cycle Disbursed Successfully
                </h3>
                <p className="mt-1 text-xs text-neutral-400 max-w-md mx-auto">
                  {formatCurrency(totalNet)} has been disbursed across {employees.length} bank accounts. Digital paystubs are now certified and accessible to all staff.
                </p>
              </div>

              <div className="rounded border border-neutral-800 bg-neutral-950/60 p-4 text-left font-mono text-xs max-w-md mx-auto space-y-1">
                <div className="text-neutral-500 text-[10px] uppercase">Transaction Receipt</div>
                <div className="text-neutral-200">Ref: ACH-20261005-VANGUARD-EXEC-01</div>
                <div className="text-neutral-400">Timestamp: {new Date().toLocaleTimeString()} UTC</div>
                <div className="text-emerald-400 font-semibold">Status: ACH Clearing Confirmed</div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded bg-cyan-500 px-5 py-2 text-xs font-medium text-neutral-950 hover:bg-cyan-400 transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
