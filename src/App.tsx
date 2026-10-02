/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { ExecutiveOverview } from './components/ExecutiveOverview';
import { PayrollSuite } from './components/PayrollSuite';
import { ProjectTrackingSuite } from './components/ProjectTrackingSuite';
import { PerformanceSuite } from './components/PerformanceSuite';
import { TimesheetsView } from './components/TimesheetsView';
import { BatchPayrollModal } from './components/BatchPayrollModal';
import { PaystubModal } from './components/PaystubModal';
import { CompensationModal } from './components/CompensationModal';
import { NewProjectModal } from './components/NewProjectModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { NotificationDrawer } from './components/NotificationDrawer';

import {
  INITIAL_EMPLOYEES,
  INITIAL_PROJECTS,
  INITIAL_PAYROLL_CYCLES,
  INITIAL_TIMESHEETS,
  INITIAL_OKRS,
} from './data/mockData';

import {
  Employee,
  Project,
  PayrollCycle,
  TimesheetEntry,
  CompanyOKR,
  UserRole,
  PaymentStatus,
  TaskStatus,
} from './types';

export default function App() {
  // Local persistence and state initialization
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('vanguard_employees');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_EMPLOYEES;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('vanguard_projects');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_PROJECTS;
  });

  const [payrollCycles, setPayrollCycles] = useState<PayrollCycle[]>(() => {
    const saved = localStorage.getItem('vanguard_payroll_cycles');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_PAYROLL_CYCLES;
  });

  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>(() => {
    const saved = localStorage.getItem('vanguard_timesheets');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_TIMESHEETS;
  });

  const [okrs, setOkrs] = useState<CompanyOKR[]>(() => {
    const saved = localStorage.getItem('vanguard_okrs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_OKRS;
  });

  // Navigation & Role State
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [currentRole, setCurrentRole] = useState<UserRole>('CEO / Executive');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals & Drawers
  const [batchPayrollOpen, setBatchPayrollOpen] = useState(false);
  const [paystubEmployee, setPaystubEmployee] = useState<Employee | null>(null);
  const [compensationEmployee, setCompensationEmployee] = useState<Employee | null>(null);
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'October Payroll Cycle A Pending Sign-Off',
      message: 'Semi-monthly disbursement of $50,849.20 net is queued for direct deposit execution.',
      time: '12m ago',
      type: 'action' as const,
      read: false,
      tabTarget: 'payroll',
    },
    {
      id: 'notif-2',
      title: 'Krypton Multi-Cloud Migration At Risk',
      message: 'Spend has reached 78% of allocation while delivery progress is currently at 48%.',
      time: '1h ago',
      type: 'warning' as const,
      read: false,
      tabTarget: 'projects',
    },
    {
      id: 'notif-3',
      title: 'Timesheet Approvals Submitted',
      message: '3 timesheet logs submitted for Argus AI Agent and Zephyr Mobile engineering tracks.',
      time: '2h ago',
      type: 'info' as const,
      read: true,
      tabTarget: 'timesheets',
    },
  ]);

  // Persist state updates to localStorage
  useEffect(() => {
    localStorage.setItem('vanguard_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('vanguard_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('vanguard_payroll_cycles', JSON.stringify(payrollCycles));
  }, [payrollCycles]);

  useEffect(() => {
    localStorage.setItem('vanguard_timesheets', JSON.stringify(timesheets));
  }, [timesheets]);

  useEffect(() => {
    localStorage.setItem('vanguard_okrs', JSON.stringify(okrs));
  }, [okrs]);

  // Keyboard shortcut listener for Global Search (/)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for Payroll
  const handleCompletePayrollRun = () => {
    // Mark all employees' payRun status as Paid
    setEmployees((prev) =>
      prev.map((emp) => ({
        ...emp,
        currentPayRun: {
          ...emp.currentPayRun,
          paymentStatus: 'Paid',
        },
      }))
    );

    // Update the October cycle to Disbursed
    setPayrollCycles((prev) =>
      prev.map((c) =>
        c.id === 'cycle-2026-10' ? { ...c, status: 'Disbursed' } : c
      )
    );

    // Add confirmation notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'October Payroll Cycle A Disbursed',
        message: 'Direct deposits successfully released to clearing house. 12 accounts credited.',
        time: 'Just now',
        type: 'info',
        read: false,
        tabTarget: 'payroll',
      },
      ...prev,
    ]);
  };

  const handleUpdatePaymentStatus = (employeeId: string, status: PaymentStatus) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employeeId
          ? {
              ...emp,
              currentPayRun: {
                ...emp.currentPayRun,
                paymentStatus: status,
              },
            }
          : emp
      )
    );
  };

  const handleSaveCompensation = (employeeId: string, updatedComp: Employee['compensation']) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id !== employeeId) return emp;
        // Recalculate biweekly gross
        const biweeklyGross = updatedComp.baseSalaryAnnual / 26;
        const fedTax = biweeklyGross * updatedComp.taxWithholdingRate;
        const stateTax = emp.currentPayRun.stateTax > 0 ? biweeklyGross * 0.04 : 0;
        const ficaTax = biweeklyGross * 0.0765;
        const k401 = biweeklyGross * updatedComp.k401ContributionRate;
        const health = updatedComp.healthPlanMonthlyDeduction / 2;
        const net = Math.max(0, biweeklyGross - fedTax - stateTax - ficaTax - k401 - health);

        return {
          ...emp,
          compensation: updatedComp,
          currentPayRun: {
            ...emp.currentPayRun,
            grossPay: parseFloat(biweeklyGross.toFixed(2)),
            federalTax: parseFloat(fedTax.toFixed(2)),
            stateTax: parseFloat(stateTax.toFixed(2)),
            ficaTax: parseFloat(ficaTax.toFixed(2)),
            k401Deduction: parseFloat(k401.toFixed(2)),
            healthDeduction: parseFloat(health.toFixed(2)),
            netPay: parseFloat(net.toFixed(2)),
          },
        };
      })
    );
  };

  // Handlers for Projects
  const handleUpdateTaskStatus = (projectId: string, taskId: string, newStatus: TaskStatus) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updatedTasks = p.tasks.map((t) =>
          t.id === taskId ? { ...t, status: newStatus } : t
        );
        const doneTasks = updatedTasks.filter((t) => t.status === 'Done').length;
        const newProgress = Math.round((doneTasks / updatedTasks.length) * 100);

        return {
          ...p,
          tasks: updatedTasks,
          progress: updatedTasks.length ? newProgress : p.progress,
        };
      })
    );
  };

  const handleToggleMilestone = (projectId: string, milestoneId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updatedMilestones = p.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        return {
          ...p,
          milestones: updatedMilestones,
        };
      })
    );
  };

  const handleAddTask = (projectId: string, taskTitle: string, assigneeId: string, hours: number) => {
    const assignee = employees.find((e) => e.id === assigneeId);
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const newTask = {
          id: `t-${Date.now()}`,
          projectId,
          title: taskTitle,
          status: 'Todo' as TaskStatus,
          priority: 'High' as const,
          assigneeId,
          assigneeName: assignee?.name || 'Assigned Engineer',
          estimatedHours: hours,
          loggedHours: 0,
          dueDate: p.targetEndDate,
        };
        return {
          ...p,
          tasks: [...p.tasks, newTask],
        };
      })
    );
  };

  const handleCreateProject = (newProjData: Omit<Project, 'id' | 'hoursLogged' | 'tasks' | 'progress' | 'budgetSpent'>) => {
    const createdProject: Project = {
      ...newProjData,
      id: `proj-${Date.now()}`,
      hoursLogged: 0,
      budgetSpent: 0,
      progress: 0,
      tasks: [],
    };
    setProjects((prev) => [createdProject, ...prev]);
    setSelectedProjectId(createdProject.id);
  };

  // Handlers for Timesheets
  const handleApproveTimesheet = (id: string) => {
    const entry = timesheets.find((t) => t.id === id);
    if (!entry) return;

    setTimesheets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Approved' } : t))
    );

    // Increase project logged hours
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === entry.projectId) {
          return {
            ...p,
            hoursLogged: p.hoursLogged + entry.hours,
            budgetSpent: p.budgetSpent + entry.hours * p.billableRatePerHour,
          };
        }
        return p;
      })
    );
  };

  const handleRejectTimesheet = (id: string) => {
    setTimesheets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Rejected' } : t))
    );
  };

  const handleApproveAllPending = () => {
    const pendingList = timesheets.filter((t) => t.status === 'Pending');
    setTimesheets((prev) =>
      prev.map((t) => (t.status === 'Pending' ? { ...t, status: 'Approved' } : t))
    );

    // Update projects with approved hours
    setProjects((prev) =>
      prev.map((p) => {
        const addedHours = pendingList
          .filter((t) => t.projectId === p.id)
          .reduce((acc, t) => acc + t.hours, 0);
        return {
          ...p,
          hoursLogged: p.hoursLogged + addedHours,
          budgetSpent: p.budgetSpent + addedHours * p.billableRatePerHour,
        };
      })
    );
  };

  // Handlers for Performance
  const handleUpdateEmployeeRating = (employeeId: string, newRating: number) => {
    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id !== employeeId) return e;
        const perfLevel = newRating >= 4.5 ? 'Exceeding' : newRating >= 3.8 ? 'Achieving' : 'Developing';
        return {
          ...e,
          performance: {
            ...e.performance,
            currentRating: newRating,
            performanceLevel: perfLevel,
          },
        };
      })
    );
  };

  const handleUpdateOkrProgress = (okrId: string, newProgress: number) => {
    setOkrs((prev) =>
      prev.map((o) => (o.id === okrId ? { ...o, progress: newProgress } : o))
    );
  };

  const pendingTimesheetsCount = timesheets.filter((t) => t.status === 'Pending').length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      
      {/* 1-Row 3-Zone Top Navigation Bar */}
      <TopBar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'projects') setSelectedProjectId(null);
        }}
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenBatchPayroll={() => setBatchPayrollOpen(true)}
        pendingTimesheetCount={pendingTimesheetsCount}
        unreadNotificationCount={unreadNotificationsCount}
        onOpenNotifications={() => setNotificationDrawerOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Viewport Container (Desktop baseline: max-w-7xl, 1440px presence) */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        
        {/* VIEW 1: Executive Overview */}
        {currentTab === 'overview' && (
          <ExecutiveOverview
            employees={employees}
            projects={projects}
            payrollCycles={payrollCycles}
            timesheets={timesheets}
            currentRole={currentRole}
            onNavigateTab={setCurrentTab}
            onSelectProject={(projId) => {
              setSelectedProjectId(projId);
              setCurrentTab('projects');
            }}
            onOpenBatchPayroll={() => setBatchPayrollOpen(true)}
          />
        )}

        {/* VIEW 2: Employee Payroll Suite */}
        {currentTab === 'payroll' && (
          <PayrollSuite
            employees={employees}
            currentRole={currentRole}
            onOpenBatchPayroll={() => setBatchPayrollOpen(true)}
            onViewPaystub={(emp) => setPaystubEmployee(emp)}
            onAdjustCompensation={(emp) => setCompensationEmployee(emp)}
            onUpdatePaymentStatus={handleUpdatePaymentStatus}
          />
        )}

        {/* VIEW 3: Project Tracking Suite */}
        {currentTab === 'projects' && (
          <ProjectTrackingSuite
            projects={projects}
            employees={employees}
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
            onOpenNewProjectModal={() => setNewProjectModalOpen(true)}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onToggleMilestone={handleToggleMilestone}
            onAddTask={handleAddTask}
          />
        )}

        {/* VIEW 4: Performance Analytics & Talent Matrix */}
        {currentTab === 'performance' && (
          <PerformanceSuite
            employees={employees}
            okrs={okrs}
            onUpdateEmployeeRating={handleUpdateEmployeeRating}
            onUpdateOkrProgress={handleUpdateOkrProgress}
          />
        )}

        {/* VIEW 5: Timesheets & Approvals */}
        {currentTab === 'timesheets' && (
          <TimesheetsView
            timesheets={timesheets}
            currentRole={currentRole}
            onApproveTimesheet={handleApproveTimesheet}
            onRejectTimesheet={handleRejectTimesheet}
            onApproveAllPending={handleApproveAllPending}
          />
        )}

      </main>

      {/* Discreet Human Footer (Anti-slop compliant: no telemetry tickers, no fake engines) */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950 py-4 text-xs text-neutral-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-400">Vanguard Core</span>
            <span>·</span>
            <span>Enterprise Operations Portal</span>
            <span>·</span>
            <span className="font-mono text-neutral-400">v2026.10</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>SOC2 Type II Certified</span>
            <span>·</span>
            <span>GAAP & SOX Compliant</span>
            <span>·</span>
            <span>Direct Clearing House ACH</span>
          </div>
        </div>
      </footer>

      {/* Global Interactive Modals */}
      <BatchPayrollModal
        isOpen={batchPayrollOpen}
        onClose={() => setBatchPayrollOpen(false)}
        employees={employees}
        onCompletePayrollRun={handleCompletePayrollRun}
      />

      <PaystubModal
        isOpen={!!paystubEmployee}
        onClose={() => setPaystubEmployee(null)}
        employee={paystubEmployee}
      />

      <CompensationModal
        isOpen={!!compensationEmployee}
        onClose={() => setCompensationEmployee(null)}
        employee={compensationEmployee}
        onSaveCompensation={handleSaveCompensation}
      />

      <NewProjectModal
        isOpen={newProjectModalOpen}
        onClose={() => setNewProjectModalOpen(false)}
        employees={employees}
        onCreateProject={handleCreateProject}
      />

      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        employees={employees}
        projects={projects}
        okrs={okrs}
        onSelectEmployee={(emp) => {
          setPaystubEmployee(emp);
        }}
        onSelectProject={(projId) => {
          setSelectedProjectId(projId);
        }}
        onNavigateTab={setCurrentTab}
      />

      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
        onNavigateTab={setCurrentTab}
        notifications={notifications}
        onMarkAllRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
      />

    </div>
  );
}
