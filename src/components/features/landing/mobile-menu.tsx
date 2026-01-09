"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Menu, ChevronRight } from "lucide-react"

import Link from "next/link"
import { AppRoutes } from "@/routes";
import { cn } from "@/lib/utils"


interface MobileMenuProps {
  links?: Array<{ href: string; label: string }>
}

export function MobileMenu({ links }: MobileMenuProps) {

  // HOOKS & STATE
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 text-white hover:bg-[#00f3ff]/10 border border-transparent hover:border-[#00f3ff]/30 transition-all"
          >
            <Menu className="w-6 h-6 text-[#00f3ff]" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-[300px] bg-[#020617]/95 backdrop-blur-xl border-l-[#1e293b] text-white flex flex-col p-6"
        >
          <SheetHeader className="text-left pb-6 border-b border-[#1e293b]/50">
            <SheetTitle className="text-[#00f3ff] text-2xl font-black tracking-tighter uppercase">
              Menu.
            </SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col gap-2 mt-8 flex-grow">
            {links?.map((link, index) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  style={{ transitionDelay: `${index * 50}ms` }}
                  className={cn(
                    "group flex items-center justify-between p-4 rounded-xl transition-all duration-300",
                    "hover:bg-[#00f3ff]/5 border border-transparent",
                    isActive
                      ? "text-[#00f3ff] bg-[#00f3ff]/10 border-[#00f3ff]/20"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  <span className="text-lg font-medium tracking-wide">
                    {link.label}
                  </span>
                  <ChevronRight className={cn(
                    "w-4 h-4 transition-transform duration-300",
                    "group-hover:translate-x-1",
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )} />
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-[#1e293b]/50">
            <Link href={AppRoutes.dashboard()} onClick={() => setOpen(false)}>
              <Button className="w-full h-14 bg-[#00f3ff] hover:bg-[#00d8e6] text-[#02040a] font-bold text-lg shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all active:scale-[0.98]">
                Get Started
              </Button>
            </Link>
            <p className="text-center text-[10px] text-slate-500 mt-4 uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} SubZero
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}