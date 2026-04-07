'use client';

import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Auto-initialize database on first load
    fetch('/api/init').catch(console.error);
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
