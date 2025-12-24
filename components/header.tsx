import Link from 'next/link'
import { Laptop } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table } from 'lucide-react';


export const Header = () => {
  return (
    // <header className="sticky top-0 z-50 w-full border-b bg-white">
    <header className="h-16 bg-sheets text-white flex items-center px-6">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-sheets-pale p-1.5 rounded-md transition-colors group-hover:bg-white">
                <Table className="h-5 w-5 text-sheets" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
                スプレッドシート勉強用サイト
            </span>
        </Link>
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/features" className="text-white text-muted-foreground hover:text-primary transition-colors ">
              機能
            </Link>
            <Link href="/pricing" className="text-white text-muted-foreground hover:text-primary transition-colors">
              料金
            </Link>
          </nav>
          <div className="flex items-center space-x-2">
            {/* shadcnのButton: variant="ghost" で背景なしのボタン */}
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">ログイン</Link>
            </Button>
            
            {/* shadcnのButton: デフォルト（青系）のボタン */}
            <Button size="sm" asChild>
              <Link href="/signup">はじめる</Link>
            </Button>
          </div>
        </div>

      </div>
    </header>
  )
}