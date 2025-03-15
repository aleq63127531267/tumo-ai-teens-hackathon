'use client';

import { usePathname } from 'next/navigation';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMainPage = pathname === '/';

  return (
    <main className={isMainPage ? 'pb-32' : ''}>
      {children}
    </main>
  );
} 