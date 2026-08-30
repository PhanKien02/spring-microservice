import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(en|vi)/:path*', '/((?!api|_next|_vercel|[\\w-]+\\.\\w+).*)']
};
// Note: If you add Next.js middleware hooks, you can combine them here.

