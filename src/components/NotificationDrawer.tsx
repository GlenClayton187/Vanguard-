import React from 'react';
import { X, Bell, Check, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'action' | 'warning' | 'info';
  read: boolean;
  tabTarget: string;
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  notifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md border-l border-neutral-800 bg-neutral-900 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-cyan-400" />
              <h2 className="text-sm font-semibold text-neutral-100">
                Operations Notifications
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onMarkAllRead}
                className="text-[11px] text-neutral-400 hover:text-white transition-colors"
              >
                Mark all read
              </button>
              <button
                onClick={onClose}
                className="rounded p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-800/80 p-2">
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onNavigateTab(item.tabTarget);
                  onClose();
                }}
                className={`p-3 rounded transition-colors cursor-pointer hover:bg-neutral-800/50 ${
                  !item.read ? 'bg-neutral-800/20' : ''
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {item.type === 'action' ? (
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                  ) : item.type === 'warning' ? (
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                  ) : (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  )}
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-200">{item.title}</span>
                      <span className="text-[10px] font-mono text-neutral-500">{item.time}</span>
                    </div>
                    <p className="mt-0.5 text-neutral-400 text-[11px] leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-800 p-3 text-center text-[11px] text-neutral-500 font-mono">
            Synced with Vanguard Core Ledger Engine
          </div>

        </div>
      </div>
    </div>
  );
};
