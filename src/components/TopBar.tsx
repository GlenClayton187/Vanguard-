import React from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  X,
  Play,
  Briefcase,
  Layers,
  ChevronDown
} from 'lucide-react';
import { UserRole } from '../types';

interface TopBarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenSearch: () => void;
  onOpenBatchPayroll: () => void;
  pendingTimesheetCount: number;
  unreadNotificationCount: number;
  onOpenNotifications: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onTabChange,
  currentRole,
  onRoleChange,
  onOpenSearch,
  onOpenBatchPayroll,
  pendingTimesheetCount,
  unreadNotificationCount,
  onOpenNotifications,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = React.useState(false);

  const navLinks = [
    { id: 'overview', label: 'Overview' },
    { id: 'payroll', label: 'Payroll & Comp' },
    { id: 'projects', label: 'Projects & Delivery' },
    { id: 'performance', label: 'Performance & Talent' },
    { id: 'timesheets', label: 'Timesheets' },
  ];

  const roles: UserRole[] = [
    'CEO / Executive',
    'HR & Finance Director',
    'Engineering Lead',
    'Staff Member',
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex p-1.5 text-neutral-400 hover:text-white lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          
          <button 
            onClick={() => onTabChange('overview')}
            className="flex items-center gap-2 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-neutral-950">
              V
            </div>
            <span className="text-base font-semibold tracking-tight text-neutral-100">
              Vanguard <span className="font-normal text-neutral-400">Operations</span>
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onTabChange(link.id)}
                className={`relative py-1 transition-colors whitespace-nowrap text-xs font-medium uppercase tracking-wider ${
                  isActive
                    ? 'text-cyan-400'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {link.label}
                {link.id === 'timesheets' && pendingTimesheetCount > 0 && (
                  <span className="ml-1.5 text-[10px] font-mono text-amber-400">
                    ({pendingTimesheetCount})
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions & toolbars */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 rounded border border-neutral-800 bg-neutral-900/80 px-2.5 py-1.5 text-xs text-neutral-400 transition-colors hover:border-neutral-700 hover:text-neutral-200"
            title="Global Search (Press / or click)"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search portal</span>
            <kbd className="hidden rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 sm:inline">
              /
            </kbd>
          </button>

          {/* Quick Pay Run CTA (for Exec & Finance roles) */}
          {currentRole !== 'Staff Member' && (
            <button
              onClick={onOpenBatchPayroll}
              className="hidden sm:flex items-center gap-1.5 rounded bg-cyan-500 px-3 py-1.5 text-xs font-medium text-neutral-950 transition-colors hover:bg-cyan-400 whitespace-nowrap active:scale-[0.98]"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>Run Pay Cycle</span>
            </button>
          )}

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 rounded border border-neutral-800 bg-neutral-900/60 px-2.5 py-1.5 text-xs text-neutral-300 hover:border-neutral-700 hover:text-white"
              title="Change simulated role"
            >
              <Briefcase className="h-3 w-3 text-neutral-400" />
              <span className="hidden md:inline max-w-[120px] truncate">{currentRole}</span>
              <ChevronDown className="h-3 w-3 text-neutral-500" />
            </button>

            {roleDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setRoleDropdownOpen(false)} 
                />
                <div className="absolute right-0 mt-1.5 w-52 rounded border border-neutral-800 bg-neutral-900 py-1 shadow-2xl z-50">
                  <div className="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-neutral-500">
                    Switch Active Role
                  </div>
                  {roles.map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        onRoleChange(role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                        currentRole === role
                          ? 'bg-neutral-800/80 text-cyan-400 font-medium'
                          : 'text-neutral-300 hover:bg-neutral-800/50 hover:text-white'
                      }`}
                    >
                      <span>{role}</span>
                      {currentRole === role && (
                        <span className="text-cyan-400">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            className="relative flex h-8 w-8 items-center justify-center rounded border border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white hover:border-neutral-700"
            aria-label="View notifications"
          >
            <Bell className="h-3.5 w-3.5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-neutral-800 bg-neutral-950 px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    onTabChange(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between rounded px-3 py-2 text-xs font-medium uppercase tracking-wider text-left ${
                    isActive
                      ? 'bg-neutral-900 text-cyan-400'
                      : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.id === 'timesheets' && pendingTimesheetCount > 0 && (
                    <span className="font-mono text-amber-400">
                      {pendingTimesheetCount} pending
                    </span>
                  )}
                </button>
              );
            })}
            <div className="pt-2 border-t border-neutral-800/80">
              <button
                onClick={() => {
                  onOpenBatchPayroll();
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center justify-center gap-1.5 rounded bg-cyan-500 py-2 text-xs font-medium text-neutral-950"
              >
                <Play className="h-3 w-3 fill-current" />
                <span>Run October Payroll Cycle</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
