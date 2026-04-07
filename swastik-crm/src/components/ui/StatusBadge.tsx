import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: number | string;
  type?: 'invoice' | 'estimate' | 'project' | 'task' | 'lead' | 'ticket' | 'contract' | 'generic';
  className?: string;
}

const invoiceStatuses: Record<number, { label: string; cls: string }> = {
  1: { label: 'Unpaid', cls: 'bg-red-100 text-red-700 ring-red-600/20' },
  2: { label: 'Paid', cls: 'bg-green-100 text-green-700 ring-green-600/20' },
  3: { label: 'Partially Paid', cls: 'bg-yellow-100 text-yellow-700 ring-yellow-600/20' },
  4: { label: 'Overdue', cls: 'bg-orange-100 text-orange-700 ring-orange-600/20' },
  5: { label: 'Cancelled', cls: 'bg-gray-100 text-gray-600 ring-gray-500/20' },
  6: { label: 'Draft', cls: 'bg-slate-100 text-slate-600 ring-slate-500/20' },
};

const estimateStatuses: Record<number, { label: string; cls: string }> = {
  1: { label: 'Draft', cls: 'bg-slate-100 text-slate-600' },
  2: { label: 'Sent', cls: 'bg-blue-100 text-blue-700' },
  3: { label: 'Declined', cls: 'bg-red-100 text-red-700' },
  4: { label: 'Accepted', cls: 'bg-green-100 text-green-700' },
  5: { label: 'Expired', cls: 'bg-gray-100 text-gray-600' },
};

const projectStatuses: Record<number, { label: string; cls: string }> = {
  1: { label: 'In Progress', cls: 'bg-blue-100 text-blue-700' },
  2: { label: 'On Hold', cls: 'bg-yellow-100 text-yellow-700' },
  3: { label: 'Cancelled', cls: 'bg-red-100 text-red-700' },
  4: { label: 'Finished', cls: 'bg-green-100 text-green-700' },
};

const taskStatuses: Record<number, { label: string; cls: string }> = {
  1: { label: 'Not Started', cls: 'bg-gray-100 text-gray-600' },
  2: { label: 'In Progress', cls: 'bg-blue-100 text-blue-700' },
  3: { label: 'Testing', cls: 'bg-purple-100 text-purple-700' },
  4: { label: 'Awaiting Feedback', cls: 'bg-yellow-100 text-yellow-700' },
  5: { label: 'Complete', cls: 'bg-green-100 text-green-700' },
};

const priorityMap: Record<number, { label: string; cls: string }> = {
  1: { label: 'Low', cls: 'bg-gray-100 text-gray-600' },
  2: { label: 'Medium', cls: 'bg-blue-100 text-blue-700' },
  3: { label: 'High', cls: 'bg-orange-100 text-orange-700' },
  4: { label: 'Urgent', cls: 'bg-red-100 text-red-700' },
};

export function InvoiceStatusBadge({ status }: { status: number }) {
  const s = invoiceStatuses[status] || { label: 'Unknown', cls: 'bg-gray-100 text-gray-600' };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}

export function EstimateStatusBadge({ status }: { status: number }) {
  const s = estimateStatuses[status] || { label: 'Unknown', cls: 'bg-gray-100 text-gray-600' };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}

export function ProjectStatusBadge({ status }: { status: number }) {
  const s = projectStatuses[status] || { label: 'Unknown', cls: 'bg-gray-100 text-gray-600' };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}

export function TaskStatusBadge({ status }: { status: number }) {
  const s = taskStatuses[status] || { label: 'Unknown', cls: 'bg-gray-100 text-gray-600' };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}

export function PriorityBadge({ priority }: { priority: number }) {
  const s = priorityMap[priority] || { label: 'Normal', cls: 'bg-gray-100 text-gray-600' };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}

export function ActiveBadge({ active }: { active: number | boolean }) {
  const isActive = active === 1 || active === true;
  return (
    <span className={`badge ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
}

export default function StatusBadge({ status, type = 'generic', className }: StatusBadgeProps) {
  let label = String(status);
  let cls = 'bg-gray-100 text-gray-600';

  if (type === 'invoice' && typeof status === 'number') {
    const s = invoiceStatuses[status];
    if (s) { label = s.label; cls = s.cls; }
  } else if (type === 'project' && typeof status === 'number') {
    const s = projectStatuses[status];
    if (s) { label = s.label; cls = s.cls; }
  } else if (type === 'task' && typeof status === 'number') {
    const s = taskStatuses[status];
    if (s) { label = s.label; cls = s.cls; }
  }

  return <span className={cn('badge', cls, className)}>{label}</span>;
}
