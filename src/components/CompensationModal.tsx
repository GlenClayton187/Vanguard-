import React, { useState } from 'react';
import { X, DollarSign, Calculator, Check, ArrowRight } from 'lucide-react';
import { Employee } from '../types';
import { formatCurrency } from '../utils/formatters';

interface CompensationModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onSaveCompensation: (employeeId: string, updatedComp: Employee['compensation']) => void;
}

export const CompensationModal: React.FC<CompensationModalProps> = ({
  isOpen,
  onClose,
  employee,
  onSaveCompensation,
}) => {
  if (!isOpen || !employee) return null;

  const [baseSalary, setBaseSalary] = useState(employee.compensation.baseSalaryAnnual);
  const [taxRate, setTaxRate] = useState(employee.compensation.taxWithholdingRate);
  const [k401Rate, setK401Rate] = useState(employee.compensation.k401ContributionRate);
  const [healthDeduction, setHealthDeduction] = useState(employee.compensation.healthPlanMonthlyDeduction);
  const [bonusYTD, setBonusYTD] = useState(employee.compensation.bonusYTD);
  const [taxFilingStatus, setTaxFilingStatus] = useState(employee.compensation.taxFilingStatus);

  // Live simulation of bi-weekly pay
  const hourlyCalculated = baseSalary / 2080;
  const biweeklyGross = baseSalary / 26;
  const fedStateTaxEstimated = biweeklyGross * taxRate;
  const ficaEstimated = biweeklyGross * 0.0765;
  const k401Estimated = biweeklyGross * k401Rate;
  const healthHalf = healthDeduction / 2;
  const biweeklyNetEstimated = Math.max(0, biweeklyGross - fedStateTaxEstimated - ficaEstimated - k401Estimated - healthHalf);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCompensation(employee.id, {
      ...employee.compensation,
      baseSalaryAnnual: baseSalary,
      hourlyRate: parseFloat(hourlyCalculated.toFixed(2)),
      taxWithholdingRate: taxRate,
      k401ContributionRate: k401Rate,
      healthPlanMonthlyDeduction: healthDeduction,
      bonusYTD: bonusYTD,
      taxFilingStatus: taxFilingStatus,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl rounded-lg border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-neutral-100">
              Adjust Compensation Package
            </h2>
            <p className="text-xs text-neutral-400">
              {employee.name} · {employee.role} ({employee.department})
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          
          {/* Base Salary Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-medium text-neutral-300">
                Annual Base Salary ($)
              </label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-2 text-neutral-500 font-mono">$</span>
                <input
                  type="number"
                  step="1000"
                  min="40000"
                  max="500000"
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(parseFloat(e.target.value) || 0)}
                  className="w-full rounded border border-neutral-800 bg-neutral-950 py-1.5 pl-7 pr-3 font-mono text-neutral-100 focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div className="mt-1 text-[10px] font-mono text-neutral-500">
                Hourly Equiv: ${hourlyCalculated.toFixed(2)}/hr
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-neutral-300">
                Bonus YTD ($)
              </label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-2 text-neutral-500 font-mono">$</span>
                <input
                  type="number"
                  step="500"
                  min="0"
                  max="200000"
                  value={bonusYTD}
                  onChange={(e) => setBonusYTD(parseFloat(e.target.value) || 0)}
                  className="w-full rounded border border-neutral-800 bg-neutral-950 py-1.5 pl-7 pr-3 font-mono text-neutral-100 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Tax Status & Rates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-medium text-neutral-300">
                Tax Filing Status
              </label>
              <select
                value={taxFilingStatus}
                onChange={(e) => setTaxFilingStatus(e.target.value as any)}
                className="mt-1 w-full rounded border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-neutral-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="Single">Single</option>
                <option value="Married">Married Filing Jointly</option>
                <option value="Head of Household">Head of Household</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-neutral-300">
                Withholding Rate ({Math.round(taxRate * 100)}%)
              </label>
              <input
                type="range"
                min="0.12"
                max="0.35"
                step="0.01"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value))}
                className="mt-2 w-full accent-cyan-500"
              />
            </div>
          </div>

          {/* 401(k) & Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-medium text-neutral-300">
                401(k) Employee Deferral ({Math.round(k401Rate * 100)}%)
              </label>
              <input
                type="range"
                min="0.00"
                max="0.15"
                step="0.01"
                value={k401Rate}
                onChange={(e) => setK401Rate(parseFloat(e.target.value))}
                className="mt-2 w-full accent-cyan-500"
              />
              <div className="mt-1 text-[10px] text-neutral-500">
                Employer match: 100% up to 4.0%
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-neutral-300">
                Health Plan Monthly Deduction ($)
              </label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-2 text-neutral-500 font-mono">$</span>
                <input
                  type="number"
                  step="10"
                  min="0"
                  max="600"
                  value={healthDeduction}
                  onChange={(e) => setHealthDeduction(parseFloat(e.target.value) || 0)}
                  className="w-full rounded border border-neutral-800 bg-neutral-950 py-1.5 pl-7 pr-3 font-mono text-neutral-100 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Real-time Pay Forecast Callout */}
          <div className="rounded border border-neutral-800 bg-neutral-950/70 p-4 font-mono space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-sans font-medium uppercase">
              <Calculator className="h-3.5 w-3.5 text-cyan-400" />
              <span>Projected Bi-Weekly Pay Check Impact</span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="rounded border border-neutral-800/80 bg-neutral-900/60 p-2">
                <span className="text-[10px] text-neutral-500 uppercase">Gross</span>
                <div className="text-xs font-semibold text-neutral-200 mt-0.5">
                  {formatCurrency(biweeklyGross)}
                </div>
              </div>
              <div className="rounded border border-neutral-800/80 bg-neutral-900/60 p-2">
                <span className="text-[10px] text-neutral-500 uppercase">Taxes & 401k</span>
                <div className="text-xs font-semibold text-rose-400 mt-0.5">
                  {formatCurrency(fedStateTaxEstimated + ficaEstimated + k401Estimated + healthHalf)}
                </div>
              </div>
              <div className="rounded border border-neutral-800/80 bg-neutral-900/60 p-2">
                <span className="text-[10px] text-neutral-500 uppercase">Estimated Net</span>
                <div className="text-xs font-bold text-emerald-400 mt-0.5">
                  {formatCurrency(biweeklyNetEstimated)}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-cyan-500 px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-cyan-400 transition-colors"
            >
              Save Compensation Update
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
