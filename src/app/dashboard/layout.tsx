'use client'

import { Sidebar } from "@/components/features/sidebar"
import {Sheet, SheetContent, SheetTitle, SheetTrigger} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, Snowflake } from "lucide-react"
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#02040a] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-80 shrink-0">
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden border-b border-[#1e293b] bg-[#050b1a]/80 backdrop-blur-xl p-4 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <Snowflake className="w-6 h-6 text-[#00f3ff]" />
            <span className="text-xl font-bold text-[#00f3ff]">SUBZERO</span>
          </div>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-[#050b1a] border-[#1e293b] w-80">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <Sidebar onLinkClick={() => setIsMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}