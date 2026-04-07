export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/clients/:path*',
    '/invoices/:path*',
    '/payments/:path*',
    '/expenses/:path*',
    '/projects/:path*',
    '/tasks/:path*',
    '/leads/:path*',
    '/estimates/:path*',
    '/proposals/:path*',
    '/contracts/:path*',
    '/subscriptions/:path*',
    '/tickets/:path*',
    '/knowledge-base/:path*',
    '/reports/:path*',
    '/staff/:path*',
    '/roles/:path*',
    '/settings/:path*',
    '/announcements/:path*',
    '/credit-notes/:path*',
  ],
};
