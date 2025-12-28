'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Table } from 'lucide-react';
import { AuthButton } from '@/components/auth-button';

export const HeaderLoggedIn = () => {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  const headerBgColor = isAdminPage ? 'bg-gray-700' : 'bg-sheets';

  return (
    <header className={`h-16 ${headerBgColor} text-white flex items-center px-6`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/lessons" className="flex items-center space-x-2 group">
          <div className="bg-sheets-pale p-1.5 rounded-md transition-colors group-hover:bg-white">
            <Table className="h-5 w-5 text-sheets" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            スプレッドシート勉強用サイト
          </span>
        </Link>
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link 
              href="/lessons" 
              className={`transition-colors ${
                pathname === '/lessons' || pathname?.startsWith('/lessons/')
                  ? 'text-white font-semibold' 
                  : 'text-white/80 hover:text-white'
              }`}
            >
              講座一覧
            </Link>
          </nav>
          <AuthButton />
        </div>
      </div>
    </header>
  );
};

