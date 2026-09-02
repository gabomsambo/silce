import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Locale-aware wrappers around Next.js navigation. `Link` adds the locale
// prefix on every href, and `usePathname` returns the path with the locale
// segment stripped, so path comparisons can be written against `/rooms/...`
// rather than `/en/rooms/...`.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
