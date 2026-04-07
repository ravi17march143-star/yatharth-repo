import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Portal - Swastik CRM',
  description: 'Access your invoices, projects, and support tickets',
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
