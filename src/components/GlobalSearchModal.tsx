import React, { useState, useEffect } from 'react';
import { Search, X, Users, FolderGit2, DollarSign, Target, ChevronRight } from 'lucide-react';
import { Employee, Project, CompanyOKR } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  projects: Project[];
  okrs: CompanyOKR[];
  onSelectEmployee: (emp: Employee) => void;
  onSelectProject: (projId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  employees,
  projects,
  okrs,
  onSelectEmployee,
  onSelectProject,
  onNavigateTab,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingEmployees = q
    ? employees.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.role.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q)
      )
    : employees.slice(0, 4);

  const matchingProjects = q
    ? projects.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.clientOrDomain.toLowerCase().includes(q)
      )
    : projects.slice(0, 3);

  const matchingOkrs = q
    ? okrs.filter(
        (o) =>
          o.objective.toLowerCase().includes(q) ||
          o.department.toLowerCase().includes(q) ||
          o.ownerName.toLowerCase().includes(q)
      )
    : okrs.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-xs p-4 pt-20">
      <div className="w-full max-w-2xl rounded-lg border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-neutral-800 px-4">
          <Search className="h-4 w-4 text-neutral-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search employees, project codes, payroll, or OKRs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent px-3 py-3.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4 text-xs">
          
          {/* Projects Group */}
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">
              <FolderGit2 className="h-3.5 w-3.5 text-cyan-400" />
              <span>Projects & Initiatives</span>
            </div>
            <div className="space-y-1">
              {matchingProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    onNavigateTab('projects');
                    onSelectProject(p.id);
                    onClose();
                  }}
                  className="flex items-center justify-between rounded p-2 text-neutral-300 hover:bg-neutral-800 hover:text-white cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-400 font-semibold">{p.code}</span>
                    <span>{p.name}</span>
                    <span className="text-neutral-500 text-[11px]">({p.department})</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-neutral-500" />
                </div>
              ))}
            </div>
          </div>

          {/* Employees Group */}
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">
              <Users className="h-3.5 w-3.5 text-purple-400" />
              <span>Staff & Personnel</span>
            </div>
            <div className="space-y-1">
              {matchingEmployees.map((e) => (
                <div
                  key={e.id}
                  onClick={() => {
                    onNavigateTab('payroll');
                    onSelectEmployee(e);
                    onClose();
                  }}
                  className="flex items-center justify-between rounded p-2 text-neutral-300 hover:bg-neutral-800 hover:text-white cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    {e.avatar ? (
                      <img 
                        src={e.avatar} 
                        alt={e.name} 
                        referrerPolicy="no-referrer"
                        className="h-5 w-5 rounded-full object-cover" 
                      />
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-neutral-800 flex items-center justify-center text-[9px]">
                        {e.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">{e.name}</span>
                      <span className="text-neutral-400 text-[11px] ml-2">{e.role}</span>
                    </div>
                  </div>
                  <span className="font-mono text-neutral-500 text-[11px]">{e.department}</span>
                </div>
              ))}
            </div>
          </div>

          {/* OKRs Group */}
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">
              <Target className="h-3.5 w-3.5 text-emerald-400" />
              <span>Strategic Objectives & OKRs</span>
            </div>
            <div className="space-y-1">
              {matchingOkrs.map((o) => (
                <div
                  key={o.id}
                  onClick={() => {
                    onNavigateTab('performance');
                    onClose();
                  }}
                  className="flex items-center justify-between rounded p-2 text-neutral-300 hover:bg-neutral-800 hover:text-white cursor-pointer transition-colors"
                >
                  <div className="truncate max-w-md">
                    <span>{o.objective}</span>
                  </div>
                  <span className="font-mono text-cyan-400">{o.progress}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="border-t border-neutral-800 bg-neutral-950 px-4 py-2 text-[11px] text-neutral-500 flex justify-between font-mono">
          <span>Navigate with mouse or arrow keys</span>
          <span>Press ESC to exit</span>
        </div>

      </div>
    </div>
  );
};
