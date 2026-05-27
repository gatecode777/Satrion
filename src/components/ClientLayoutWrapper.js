"use client";

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();
  const hideHeaderFooter = pathname?.startsWith('/admin') || pathname === '/login' || pathname === '/signup';

  if (hideHeaderFooter) {
    return <>{children}</>;
  }

  return (
    <div className="app">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
