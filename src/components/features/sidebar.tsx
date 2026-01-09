"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Snowflake, Plus, TrendingUp, SettingsIcon, Shield, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react";
import {api} from "@/app/_providers/trpc-provider";
import {AsyncView} from "@/components/features/async-view";
import {ProfileBadgeSkeleton} from "@/components/skeletons/profile-badge-skeleton";
import {AppRoutes} from "@/routes";

interface SidebarProps {
  onLinkClick?: () => void
}

export function Sidebar({ onLinkClick }: SidebarProps) {
  const pathname = usePathname()

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserLoadingError,
    error: userLoadingError
  } = api.user.getMe.useQuery()

  const logout = async () => {
    await signOut()
  }

  const navItems = [
    { href: AppRoutes.dashboard(), label: "Dashboard", icon: TrendingUp },
    { href: AppRoutes.addSubscription(), label: "Add Subscription", icon: Plus },
    { href: AppRoutes.settings(), label: "Settings", icon: SettingsIcon },
  ]

  return (
    <div className="flex flex-col h-full bg-[#050b1a]/80 backdrop-blur-xl border-r border-[#1e293b]">
      <div className="p-6 border-b border-[#1e293b]">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Snowflake className="w-8 h-8 text-[#00f3ff]" />
          <span className="text-2xl font-bold tracking-wide text-[#00f3ff] neon-text">SUBZERO</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} onClick={onLinkClick}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start transition-all",
                  isActive
                    ? "text-[#00f3ff] bg-[#00f3ff]/10 border border-[#00f3ff]/20"
                    : "text-slate-400 hover:text-white hover:bg-[#0a0f1e]"
                )}
              >
                <item.icon className={cn("w-5 h-5 mr-3", isActive && "text-[#00f3ff]")} />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>
      <AsyncView
        isLoading={isUserLoading}
        isError={isUserLoadingError}
        errorMsg={userLoadingError?.message}
        loader={ <ProfileBadgeSkeleton /> }
      >
        {
          user &&
          <div className="p-4 border-t border-[#1e293b]">
            <div className="glass-card border border-[#00f3ff]/20 p-4 rounded-lg">
              <Link href={AppRoutes.settings()} className="flex items-center gap-3 mb-3 hover:underline cursor-pointer" onClick={onLinkClick}>
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-r from-[#00f3ff] to-[#0ea5e9] text-[#02040a] font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        }
      </AsyncView>

    </div>
  )
}