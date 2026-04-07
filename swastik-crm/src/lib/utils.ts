import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function formatDate(date: Date | string, format: string = 'dd/MM/yyyy'): string {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function generateInvoiceNumber(prefix: string = 'INV', lastNumber: number = 0): string {
  const num = String(lastNumber + 1).padStart(5, '0');
  return `${prefix}-${num}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export function truncate(text: string, length: number = 100): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function calculateTax(amount: number, taxRate: number): number {
  return (amount * taxRate) / 100;
}

export function calculateDiscount(amount: number, discount: number, discountType: 'percent' | 'fixed' = 'percent'): number {
  if (discountType === 'percent') {
    return (amount * discount) / 100;
  }
  return discount;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    unpaid: 'bg-red-100 text-red-800',
    overdue: 'bg-red-100 text-red-800',
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-green-100 text-green-800',
    'in progress': 'bg-blue-100 text-blue-800',
    open: 'bg-blue-100 text-blue-800',
    closed: 'bg-gray-100 text-gray-800',
    resolved: 'bg-green-100 text-green-800',
    won: 'bg-green-100 text-green-800',
    lost: 'bg-red-100 text-red-800',
    new: 'bg-blue-100 text-blue-800',
  };
  return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
}

export function apiResponse(data: unknown, message: string = 'Success', status: number = 200) {
  return Response.json({ success: true, message, data }, { status });
}

export function apiError(message: string, status: number = 500) {
  return Response.json({ success: false, message }, { status });
}
