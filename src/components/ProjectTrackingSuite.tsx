import React, { useState } from 'react';
import { 
  FolderGit2, 
  Calendar, 
  Clock, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  X, 
  User, 
  DollarSign, 
  CheckSquare, 
  Square,
  BarChart2,
  Kanban,
  List
} from 'lucide-react';
import { Project, Employee, TaskStatus, Priority } from '../types';
import { formatCurrency, formatCompactCurrency, formatDate } from '../utils/formatters';

interface ProjectTrackingSuiteProps {
  projects: Project[];
  employees: Employee[];
  selectedProjectId: string | null;
  onSelectProject: (id: string | null) => void;
  onOpenNewProjectModal: () => void;
  onUpdateTaskStatus: (projectId: string, taskId: string, newStatus: TaskStatus) => void;
  onToggleMilestone: (projectId: string, milestoneId: string) => void;
  onAddTask: (projectId: string, taskTitle: string, assigneeId: string, hours: number) => void;
}

export const ProjectTrackingSuite: React.FC<ProjectTrackingSuiteProps> = ({
  projects,
  employees,
  selectedProjectId,
  onSelectProject,
  onOpenNewProjectModal,
  onUpdateTaskStatus,
  onToggleMilestone,
  onAddTask,
}) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'kanban' | 'table'>('timeline');
  const [deptFilter, setDeptFilter] = useState<string>('All');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState(employees[0]?.id || '');
  const [newTaskHours, setNewTaskHours] = useState(40);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);

  const filteredProjects = projects.filter((p) => {
    return deptFilter === 'All' || p.department === deptFilter;
  });

  const activeProject = projects.find((p) => p.id === selectedProjectId) || null;

  // Flatten all tasks for global Kanban view
  const allTasks = filteredProjects.flatMap((p) => 
    p.tasks.map((t) => ({ ...t, projectCode: p.code, projectName: p.name }))
  );

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !newTaskTitle.trim()) return;
    onAddTask(activeProject.id, newTaskTitle.trim(), newTaskAssignee, newTaskHours);
    setNewTaskTitle('');
    setShowAddTaskForm(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Bar: Title & View Switcher */}
      <div className="flex flex-col justify-between gap-4 border-b border-neutral-800 pb-5 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>Engineering & Delivery</span>
            <span aria-hidden="true">·</span>
            <span>Sprint & Portfolio Operations</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-cyan-400">{projects.length} Total Projects</span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-100 sm:text-3xl">
            Project Delivery & Resource Allocation
          </h1>
          <p className="mt-1 text-sm text-neutral-400 max-w-2xl">
            Real-time Gantt tracking, milestone burndown, and billable engineering task dispatch.
          </p>
        </div>

        {/* View Mode & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 rounded border border-neutral-800 bg-neutral-900 p-1">
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                viewMode === 'timeline'
                  ? 'bg-neutral-800 text-cyan-400 font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <BarChart2 className="h-3.5 w-3.5" />
              <span>Gantt / Timeline</span>
            </button>

            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-neutral-800 text-cyan-400 font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Kanban className="h-3.5 w-3.5" />
              <span>Kanban Tasks</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-neutral-800 text-cyan-400 font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>Portfolio Table</span>
            </button>
          </div>

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="rounded border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-xs text-neutral-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Design">Design</option>
            <option value="Finance">Finance</option>
          </select>

          {/* New Project CTA */}
          <button
            onClick={onOpenNewProjectModal}
            className="flex items-center gap-1 rounded bg-cyan-500 px-3 py-1.5 text-xs font-medium text-neutral-950 hover:bg-cyan-400 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Project</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Left Column (Span 2 or 3 depending on whether details drawer is active) */}
        <div className={`space-y-6 ${activeProject ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          
          {/* VIEW 1: GANTT / TIMELINE VIEW */}
          {viewMode === 'timeline' && (
            <div className="rounded border border-neutral-800 bg-neutral-900/40 p-5">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-sm font-semibold tracking-tight text-neutral-100">
                    Portfolio Delivery Timeline (May – Dec 2026)
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Horizontal milestone tracking, current progress fill, and target delivery windows.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-xs bg-cyan-400" />
                    <span>Completed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-xs bg-neutral-700" />
                    <span>Remaining</span>
                  </div>
                </div>
              </div>

              {/* Visual Gantt Matrix */}
              <div className="mt-6 space-y-5">
                {/* Timeline Header Months */}
                <div className="hidden sm:grid grid-cols-8 gap-2 border-b border-neutral-800/80 pb-2 text-[11px] font-mono text-neutral-500 uppercase">
                  <div className="col-span-2">Project & Code</div>
                  <div>May</div>
                  <div>Jun</div>
                  <div>Jul</div>
                  <div>Aug</div>
                  <div>Sep</div>
                  <div>Oct/Nov</div>
                </div>

                {filteredProjects.map((proj) => {
                  const lead = employees.find((e) => e.id === proj.leadEmployeeId);
                  const isSelected = activeProject?.id === proj.id;
                  const isAtRisk = proj.status === 'At_Risk';

                  return (
                    <div
                      key={proj.id}
                      onClick={() => onSelectProject(proj.id)}
                      className={`group cursor-pointer rounded border p-3.5 transition-all ${
                        isSelected
                          ? 'border-cyan-500/80 bg-neutral-900/90'
                          : 'border-neutral-800/80 bg-neutral-900/30 hover:border-neutral-700 hover:bg-neutral-900/60'
                      }`}
                    >
                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-3">
                          {lead?.avatar ? (
                            <img 
                              src={lead.avatar} 
                              alt={lead.name}
                              referrerPolicy="no-referrer"
                              className="h-7 w-7 rounded-full object-cover border border-neutral-700 shrink-0" 
                            />
                          ) : (
                            <div className="h-7 w-7 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[10px] text-neutral-300 font-medium shrink-0">
                              {lead ? lead.name.slice(0, 2).toUpperCase() : 'LD'}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-semibold text-neutral-200">
                                {proj.code}
                              </span>
                              <span className="text-xs font-medium text-neutral-100">
                                {proj.name}
                              </span>
                            </div>
                            <div className="text-[11px] text-neutral-500 font-mono">
                              Lead: {lead?.name} · {formatDate(proj.startDate)} to {formatDate(proj.targetEndDate)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono">
                          <span className={`text-[11px] ${
                            isAtRisk ? 'text-rose-400' : proj.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'
                          }`}>
                            {isAtRisk ? 'At Risk' : proj.status}
                          </span>
                          <span className="text-neutral-300 tabular-nums">{proj.progress}%</span>
                          <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:text-cyan-400 transition-colors" />
                        </div>
                      </div>

                      {/* Visual Gantt Bar */}
                      <div className="mt-3">
                        <div className="h-2 w-full rounded-xs bg-neutral-800 overflow-hidden flex">
                          <div 
                            className={`h-full transition-all duration-500 ${
                              isAtRisk ? 'bg-rose-500' : 'bg-cyan-500'
                            }`}
                            style={{ width: `${proj.progress}%` }}
                          />
                        </div>
                        
                        {/* Milestones markers summary */}
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-neutral-400">
                          {proj.milestones.map((m) => (
                            <div key={m.id} className="flex items-center gap-1">
                              <span className={`h-1.5 w-1.5 rounded-full ${m.completed ? 'bg-cyan-400' : 'bg-neutral-600'}`} />
                              <span className={m.completed ? 'text-neutral-300' : 'text-neutral-500'}>
                                {m.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW 2: KANBAN TASKS VIEW */}
          {viewMode === 'kanban' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {(['Todo', 'InProgress', 'Review', 'Done'] as TaskStatus[]).map((colStatus) => {
                const colTasks = allTasks.filter((t) => t.status === colStatus);
                const colLabels: Record<TaskStatus, { name: string; color: string }> = {
                  Todo: { name: 'Backlog / Scheduled', color: 'text-neutral-400' },
                  InProgress: { name: 'In Progress', color: 'text-cyan-400' },
                  Review: { name: 'In Code Review', color: 'text-amber-400' },
                  Done: { name: 'Completed & Shipped', color: 'text-emerald-400' },
                };

                return (
                  <div key={colStatus} className="rounded border border-neutral-800 bg-neutral-900/30 p-4">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold tracking-wide ${colLabels[colStatus].color}`}>
                          {colLabels[colStatus].name}
                        </span>
                      </div>
                      <span className="font-mono text-xs text-neutral-500">
                        {colTasks.length}
                      </span>
                    </div>

                    <div className="mt-3 space-y-3">
                      {colTasks.map((task) => (
                        <div
                          key={task.id}
                          className="rounded border border-neutral-800 bg-neutral-900/80 p-3 shadow-xs hover:border-neutral-700 transition-colors"
                        >
                          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                            <span className="text-cyan-400 font-semibold">{task.projectCode}</span>
                            <span className={
                              task.priority === 'Critical' 
                                ? 'text-rose-400 font-medium' 
                                : task.priority === 'High' 
                                ? 'text-amber-400' 
                                : 'text-neutral-400'
                            }>
                              {task.priority}
                            </span>
                          </div>
                          <div className="mt-1 text-xs font-medium text-neutral-200">
                            {task.title}
                          </div>
                          <div className="mt-2.5 flex items-center justify-between border-t border-neutral-800/80 pt-2 text-[11px] text-neutral-400 font-mono">
                            <div className="flex items-center gap-1.5">
                              <User className="h-3 w-3 text-neutral-500" />
                              <span className="truncate max-w-[90px]">{task.assigneeName}</span>
                            </div>
                            <span className="text-neutral-300">
                              {task.loggedHours}/{task.estimatedHours}h
                            </span>
                          </div>

                          {/* Quick Move Action */}
                          <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-500">
                            <span>Move to:</span>
                            <div className="flex items-center gap-1">
                              {(['Todo', 'InProgress', 'Review', 'Done'] as TaskStatus[])
                                .filter((s) => s !== task.status)
                                .map((s) => (
                                  <button
                                    key={s}
                                    onClick={() => onUpdateTaskStatus(task.projectId, task.id, s)}
                                    className="rounded bg-neutral-800 px-1.5 py-0.5 text-neutral-300 hover:bg-neutral-700 hover:text-white"
                                  >
                                    {s === 'InProgress' ? 'Prog' : s}
                                  </button>
                                ))}
                            </div>
                          </div>
                        </div>
                      ))}

                      {colTasks.length === 0 && (
                        <div className="py-6 text-center text-xs text-neutral-600 font-mono">
                          No tasks in {colStatus}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW 3: PORTFOLIO DATA TABLE */}
          {viewMode === 'table' && (
            <div className="overflow-hidden rounded border border-neutral-800 bg-neutral-900/40">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-800 bg-neutral-900/80 text-neutral-400">
                      <th className="py-3 pl-4 pr-3 font-medium">Project</th>
                      <th className="py-3 px-3 font-medium">Domain</th>
                      <th className="py-3 px-3 font-medium">Lead</th>
                      <th className="py-3 px-3 font-medium">Status</th>
                      <th className="py-3 px-3 font-medium">Progress</th>
                      <th className="py-3 px-3 font-medium text-right">Spend / Budget</th>
                      <th className="py-3 px-3 font-medium text-right">Target Date</th>
                      <th className="py-3 pr-4 pl-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 font-mono">
                    {filteredProjects.map((proj) => {
                      const lead = employees.find((e) => e.id === proj.leadEmployeeId);
                      const isSelected = activeProject?.id === proj.id;
                      const spendPercent = Math.round((proj.budgetSpent / proj.budgetTotal) * 100);

                      return (
                        <tr 
                          key={proj.id} 
                          className={`hover:bg-neutral-800/30 transition-colors ${
                            isSelected ? 'bg-neutral-800/40' : ''
                          }`}
                        >
                          <td className="py-3 pl-4 pr-3 font-sans">
                            <div className="font-semibold text-neutral-200">{proj.name}</div>
                            <div className="text-[11px] text-neutral-500 font-mono">{proj.code}</div>
                          </td>
                          <td className="py-3 px-3 font-sans text-neutral-300">
                            {proj.clientOrDomain}
                          </td>
                          <td className="py-3 px-3 font-sans text-neutral-300">
                            {lead?.name ?? 'Assigned Lead'}
                          </td>
                          <td className="py-3 px-3 font-sans">
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
                          <td className="py-3 px-3">
                            <div className="w-24">
                              <div className="text-[11px] text-neutral-300 mb-1">{proj.progress}%</div>
                              <div className="h-1.5 w-full rounded-xs bg-neutral-800 overflow-hidden">
                                <div 
                                  className="h-full bg-cyan-400 rounded-xs" 
                                  style={{ width: `${proj.progress}%` }} 
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right text-neutral-200 tabular-nums">
                            <div>{formatCompactCurrency(proj.budgetSpent)}</div>
                            <div className="text-[11px] text-neutral-500">
                              of {formatCompactCurrency(proj.budgetTotal)} ({spendPercent}%)
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right text-neutral-400">
                            {formatDate(proj.targetEndDate)}
                          </td>
                          <td className="py-3 pr-4 pl-3 text-right font-sans">
                            <button
                              onClick={() => onSelectProject(proj.id)}
                              className="text-xs text-cyan-400 hover:text-cyan-300"
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
          )}

        </div>

        {/* Right Column: Project Details & Task Management Drawer */}
        {activeProject && (
          <div className="rounded border border-neutral-800 bg-neutral-900/60 p-5 space-y-6">
            <div className="flex items-start justify-between border-b border-neutral-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-cyan-400 font-bold">{activeProject.code}</span>
                  <span className="text-[11px] text-neutral-400 font-sans">{activeProject.department}</span>
                </div>
                <h3 className="mt-1 text-base font-semibold text-neutral-100">
                  {activeProject.name}
                </h3>
              </div>
              <button
                onClick={() => onSelectProject(null)}
                className="rounded p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                aria-label="Close project drawer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Financial Telemetry */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="rounded border border-neutral-800 bg-neutral-950/60 p-3">
                <div className="text-[11px] text-neutral-500 uppercase">Budget Spend</div>
                <div className="mt-1 text-sm font-semibold text-neutral-200">
                  {formatCurrency(activeProject.budgetSpent)}
                </div>
                <div className="mt-0.5 text-[11px] text-neutral-500">
                  Total: {formatCompactCurrency(activeProject.budgetTotal)}
                </div>
              </div>
              <div className="rounded border border-neutral-800 bg-neutral-950/60 p-3">
                <div className="text-[11px] text-neutral-500 uppercase">Billable Rate</div>
                <div className="mt-1 text-sm font-semibold text-emerald-400">
                  ${activeProject.billableRatePerHour}/hr
                </div>
                <div className="mt-0.5 text-[11px] text-neutral-500">
                  Logged: {activeProject.hoursLogged} hrs
                </div>
              </div>
            </div>

            {/* Milestone Checklists */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-300">
                <span>Key Milestones</span>
                <span className="font-mono text-[11px] text-neutral-500">
                  {activeProject.milestones.filter(m => m.completed).length}/{activeProject.milestones.length}
                </span>
              </div>
              <div className="mt-2 space-y-2">
                {activeProject.milestones.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => onToggleMilestone(activeProject.id, m.id)}
                    className="flex cursor-pointer items-start gap-2 rounded border border-neutral-800/80 bg-neutral-950/40 p-2 text-xs hover:border-neutral-700 transition-colors"
                  >
                    {m.completed ? (
                      <CheckSquare className="mt-0.5 h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    ) : (
                      <Square className="mt-0.5 h-3.5 w-3.5 text-neutral-600 shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className={m.completed ? 'line-through text-neutral-500' : 'text-neutral-300'}>
                        {m.title}
                      </div>
                      <div className="text-[10px] font-mono text-neutral-500">
                        Due: {formatDate(m.dueDate)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assigned Team & Billable Cost Breakdown */}
            <div>
              <div className="text-xs font-semibold text-neutral-300">
                Assigned Team Members ({activeProject.teamMemberIds.length})
              </div>
              <div className="mt-2 space-y-2">
                {activeProject.teamMemberIds.map((memberId) => {
                  const member = employees.find((e) => e.id === memberId);
                  if (!member) return null;
                  return (
                    <div key={member.id} className="flex items-center justify-between text-xs font-sans border-b border-neutral-800/40 pb-1.5">
                      <div className="flex items-center gap-2">
                        {member.avatar ? (
                          <img 
                            src={member.avatar} 
                            alt={member.name}
                            referrerPolicy="no-referrer"
                            className="h-5 w-5 rounded-full object-cover border border-neutral-700" 
                          />
                        ) : (
                          <div className="h-5 w-5 rounded-full bg-neutral-800 flex items-center justify-center text-[9px] text-neutral-300">
                            {member.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span className="text-neutral-300">{member.name}</span>
                      </div>
                      <span className="font-mono text-neutral-400 text-[11px]">
                        ${member.compensation.hourlyRate.toFixed(0)}/hr
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Task Dispatch Section */}
            <div>
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-neutral-300">
                  Sprint Tasks ({activeProject.tasks.length})
                </div>
                <button
                  onClick={() => setShowAddTaskForm(!showAddTaskForm)}
                  className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Task</span>
                </button>
              </div>

              {/* Add Task Form */}
              {showAddTaskForm && (
                <form onSubmit={handleCreateTask} className="mt-3 space-y-2 rounded border border-neutral-800 bg-neutral-950 p-3 text-xs">
                  <div>
                    <label className="text-[11px] text-neutral-400">Task Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Audit event streaming schemas"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="mt-1 w-full rounded border border-neutral-800 bg-neutral-900 px-2 py-1 text-xs text-neutral-200 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-neutral-400">Assignee</label>
                      <select
                        value={newTaskAssignee}
                        onChange={(e) => setNewTaskAssignee(e.target.value)}
                        className="mt-1 w-full rounded border border-neutral-800 bg-neutral-900 px-2 py-1 text-xs text-neutral-200 focus:border-cyan-500 focus:outline-none"
                      >
                        {employees.map((e) => (
                          <option key={e.id} value={e.id}>{e.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-neutral-400">Est Hours</label>
                      <input
                        type="number"
                        min="1"
                        max="200"
                        value={newTaskHours}
                        onChange={(e) => setNewTaskHours(parseInt(e.target.value) || 20)}
                        className="mt-1 w-full rounded border border-neutral-800 bg-neutral-900 px-2 py-1 text-xs text-neutral-200 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddTaskForm(false)}
                      className="px-2 py-1 text-neutral-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded bg-cyan-500 px-2.5 py-1 text-neutral-950 font-medium hover:bg-cyan-400"
                    >
                      Dispatch Task
                    </button>
                  </div>
                </form>
              )}

              {/* Task List */}
              <div className="mt-3 space-y-2">
                {activeProject.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded border border-neutral-800/80 bg-neutral-950/40 p-2.5 text-xs font-sans"
                  >
                    <div>
                      <div className="font-medium text-neutral-200">{task.title}</div>
                      <div className="text-[11px] font-mono text-neutral-500">
                        {task.assigneeName} · {task.loggedHours}/{task.estimatedHours}h
                      </div>
                    </div>
                    <select
                      value={task.status}
                      onChange={(e) => onUpdateTaskStatus(activeProject.id, task.id, e.target.value as TaskStatus)}
                      className="rounded border border-neutral-800 bg-neutral-900 px-2 py-1 text-[11px] text-neutral-300 focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="Todo">Todo</option>
                      <option value="InProgress">In Progress</option>
                      <option value="Review">In Review</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
