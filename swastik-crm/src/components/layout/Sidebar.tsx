'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, Users, FileText, CreditCard, TrendingUp,
  FolderKanban, CheckSquare, UserPlus, FileCheck, FileSignature,
  RefreshCcw, Ticket, BookOpen, BarChart3, Settings, Menu, X,
  DollarSign, Megaphone, Star, ChevronDown, ChevronRight, Building2,
  Rss, Sliders, MailOpen, ClipboardList, Building
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  {
    label: 'Sales', icon: TrendingUp, children: [
      { href: '/leads', label: 'Leads', icon: UserPlus },
      { href: '/proposals', label: 'Proposals', icon: FileCheck },
      { href: '/estimates', label: 'Estimates', icon: FileSignature },
    ]
  },
  {
    label: 'Clients', icon: Building2, children: [
      { href: '/clients', label: 'All Clients', icon: Users },
      { href: '/subscriptions', label: 'Subscriptions', icon: RefreshCcw },
    ]
  },
  {
    label: 'Finance', icon: DollarSign, children: [
      { href: '/invoices', label: 'Invoices', icon: FileText },
      { href: '/payments', label: 'Payments', icon: CreditCard },
      { href: '/expenses', label: 'Expenses', icon: TrendingUp },
      { href: '/credit-notes', label: 'Credit Notes', icon: Star },
    ]
  },
  {
    label: 'Work', icon: FolderKanban, children: [
      { href: '/projects', label: 'Projects', icon: FolderKanban },
      { href: '/tasks', label: 'Tasks', icon: CheckSquare },
      { href: '/contracts', label: 'Contracts', icon: FileSignature },
      { href: '/todo', label: 'Todo & Goals', icon: ClipboardList },
    ]
  },
  {
    label: 'Support', icon: Ticket, children: [
      { href: '/tickets', label: 'Tickets', icon: Ticket },
      { href: '/knowledge-base', label: 'Knowledge Base', icon: BookOpen },
      { href: '/announcements', label: 'Announcements', icon: Megaphone },
    ]
  },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
  {
    label: 'Team', icon: Rss, children: [
      { href: '/newsfeed', label: 'Newsfeed', icon: Rss },
    ]
  },
  {
    label: 'Admin', icon: Settings, children: [
      { href: '/staff', label: 'Staff', icon: Users },
      { href: '/roles', label: 'Roles', icon: Star },
      { href: '/departments', label: 'Departments', icon: Building },
      { href: '/custom-fields', label: 'Custom Fields', icon: Sliders },
      { href: '/email-templates', label: 'Email Templates', icon: MailOpen },
      { href: '/settings', label: 'Settings', icon: Settings },
    ]
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>(['Sales', 'Finance', 'Work', 'Clients', 'Team', 'Support']);

  const toggleGroup = (label: string) => {
    setOpenGroups(prev =>
      prev.includes(label) ? prev.filter(g => g !== label) : [...prev, label]
    );
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        'flex flex-col bg-slate-900 text-white transition-all duration-300 shrink-0 overflow-hidden',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-slate-700 shrink-0">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="ml-3 overflow-hidden">
            <span className="font-bold text-white text-sm whitespace-nowrap">Swastik CRM</span>
            <p className="text-xs text-slate-400 whitespace-nowrap">Business Management</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700"
        >
          {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
        {navItems.map((item) => {
          if ('children' in item) {
            const isOpen = openGroups.includes(item.label);
            const Icon = item.icon;
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleGroup(item.label)}
                  className={cn(
                    'w-full flex items-center px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all text-sm',
                    collapsed && 'justify-center'
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="ml-3 flex-1 text-left font-medium">{item.label}</span>
                      {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </>
                  )}
                </button>
                {!collapsed && isOpen && (
                  <div className="ml-3 mt-0.5 space-y-0.5 border-l border-slate-700 pl-3">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      const active = isActive(child.href);
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            'flex items-center px-3 py-1.5 rounded-lg text-sm transition-all',
                            active
                              ? 'bg-blue-600/20 text-blue-400 font-medium'
                              : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                          )}
                        >
                          <ChildIcon className="w-3.5 h-3.5 mr-2" />
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const Icon = item.icon;
          const active = isActive(item.href!, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                'flex items-center px-3 py-2 rounded-lg text-sm transition-all',
                collapsed ? 'justify-center' : '',
                active
                  ? 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-600/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="ml-3">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-700">
          <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg px-3 py-2">
            <p className="text-xs text-blue-300 font-medium">Swastik CRM v1.0</p>
            <p className="text-xs text-slate-500">All systems operational</p>
          </div>
        </div>
      )}
    </aside>
  );
}
