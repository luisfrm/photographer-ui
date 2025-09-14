"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutGrid, Settings, PanelsTopLeft, Circle, LogOut } from "lucide-react"

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }> }

const navItems: NavItem[] = [
  { href: "/pages", label: "Pages", icon: LayoutGrid },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "group/sidebar border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 p-4 w-64 shrink-0 flex flex-col gap-4",
        className
      )}
    >
      {/* Brand */}
      <div className="flex items-center gap-2 text-xl font-semibold">
        <PanelsTopLeft className="size-5 text-primary" />
        <span>CMS</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1" role="navigation" aria-label="Main navigation">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-accent"
              )}
            >
              <Icon className={cn("size-4", active && "text-primary-foreground")} />
              <span className="truncate">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User (fake) at bottom */}
      <div className="mt-auto">
        <div className="flex items-center gap-3 rounded-md border p-3 shadow-xs">
          <div className="relative">
            <div className="size-9 rounded-full bg-gradient-to-br from-primary/80 to-primary" />
            <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-background bg-green-500" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium leading-tight truncate">John Doe</div>
            <div className="text-xs text-muted-foreground leading-tight truncate flex items-center gap-1">
              <Circle className="size-2 fill-green-500 text-green-500" />
              <span>Online</span>
            </div>
          </div>
          <button type="button" className="ml-auto text-muted-foreground hover:text-foreground" aria-label="Sign out">
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}


