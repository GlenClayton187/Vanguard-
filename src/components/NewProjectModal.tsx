import React, { useState } from 'react';
import { X, FolderPlus, DollarSign, Calendar, User } from 'lucide-react';
import { Employee, Project, Department, Priority } from '../types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  onCreateProject: (project: Omit<Project, 'id' | 'hoursLogged' | 'tasks' | 'progress' | 'budgetSpent'>) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  employees,
  onCreateProject,
}) => {
  if (!isOpen) return null;

  const [code, setCode] = useState(`ENG-${Math.floor(100 + Math.random() * 899)}`);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [clientOrDomain, setClientOrDomain] = useState('Enterprise Cloud Infrastructure');
  const [department, setDepartment] = useState<Department>('Engineering');
  const [priority, setPriority] = useState<Priority>('High');
  const [budgetTotal, setBudgetTotal] = useState(250000);
  const [billableRate, setBillableRate] = useState(175);
  const [hoursEstimated, setHoursEstimated] = useState(1400);
  const [startDate, setStartDate] = useState('2026-10-01');
  const [targetEndDate, setTargetEndDate] = useState('2027-02-28');
  const [leadEmployeeId, setLeadEmployeeId] = useState(employees[0]?.id || '');
  const [milestoneTitle, setMilestoneTitle] = useState('Architecture Design Sign-Off');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateProject({
      code,
      name: name.trim(),
      description: description.trim() || 'Enterprise systems initiative.',
      clientOrDomain,
      department,
      status: 'Active',
      priority,
      budgetTotal,
      billableRatePerHour: billableRate,
      hoursEstimated,
      startDate,
      targetEndDate,
      leadEmployeeId,
      teamMemberIds: [leadEmployeeId],
      milestones: [
        {
          id: `m-${Date.now()}`,
          title: milestoneTitle.trim() || 'Milestone 1',
          dueDate: targetEndDate,
          completed: false,
        },
      ],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl rounded-lg border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <FolderPlus className="h-4 w-4 text-cyan-400" />
            <h2 className="text-base font-semibold text-neutral-100">
              Create New Project Initiative
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-medium text-neutral-300">Project Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="mt-1 w-full rounded border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 font-mono text-cyan-400 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="text-[11px] font-medium text-neutral-300">Project Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Hyperion Core Data Pipeline"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 text-neutral-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-neutral-300">Description</label>
            <textarea
              rows={2}
              placeholder="Primary strategic objective and deliverables..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded border border-neutral-800 bg-neutral-950 p-2.5 text-neutral-200 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-medium text-neutral-300">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="mt-1 w-full rounded border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 text-neutral-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
                <option value="Finance">Finance</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-medium text-neutral-300">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="mt-1 w-full rounded border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 text-neutral-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-medium text-neutral-300">Project Lead</label>
              <select
                value={leadEmployeeId}
                onChange={(e) => setLeadEmployeeId(e.target.value)}
                className="mt-1 w-full rounded border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 text-neutral-200 focus:border-cyan-500 focus:outline-none"
              >
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-medium text-neutral-300">Budget ($)</label>
              <input
                type="number"
                step="5000"
                min="10000"
                value={budgetTotal}
                onChange={(e) => setBudgetTotal(parseInt(e.target.value) || 0)}
                className="mt-1 w-full rounded border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 font-mono text-neutral-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-neutral-300">Rate ($/hr)</label>
              <input
                type="number"
                step="5"
                min="50"
                value={billableRate}
                onChange={(e) => setBillableRate(parseInt(e.target.value) || 150)}
                className="mt-1 w-full rounded border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 font-mono text-neutral-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-neutral-300">Est Hours</label>
              <input
                type="number"
                step="50"
                min="100"
                value={hoursEstimated}
                onChange={(e) => setHoursEstimated(parseInt(e.target.value) || 500)}
                className="mt-1 w-full rounded border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 font-mono text-neutral-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-neutral-300">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 w-full rounded border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 text-neutral-200 focus:border-cyan-500 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-neutral-300">Target Delivery Date</label>
              <input
                type="date"
                value={targetEndDate}
                onChange={(e) => setTargetEndDate(e.target.value)}
                className="mt-1 w-full rounded border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 text-neutral-200 focus:border-cyan-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-neutral-300">Initial Milestone</label>
            <input
              type="text"
              placeholder="e.g. Architecture Spec Approved"
              value={milestoneTitle}
              onChange={(e) => setMilestoneTitle(e.target.value)}
              className="mt-1 w-full rounded border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 text-neutral-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-neutral-800">
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
              Create Initiative
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
