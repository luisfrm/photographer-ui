"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Settings, Calendar, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Content", href: "/panel/dashboard/content", icon: FileText },
  { name: "Settings", href: "/panel/dashboard/settings", icon: Settings },
  { name: "Appointments", href: "/panel/dashboard/appointments", icon: Calendar },
];

export default function PanelBottomBar() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full px-2 py-1 text-xs font-medium transition-all duration-200",
                isActive
                  ? "text-primary scale-105"
                  : "text-gray-500 hover:text-primary"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all duration-200",
                isActive ? "bg-primary/10" : ""
              )}>
                <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "")} />
              </div>
              <span className={cn("mt-1", isActive ? "text-primary font-semibold" : "")}>
                {item.name}
              </span>
            </Link>
          );
        })}
        <button
          type="button"
          className="flex flex-col items-center justify-center flex-1 h-full px-2 py-1 text-xs font-medium text-gray-500 hover:text-red-500 transition-colors duration-200"
        >
          <LogOut className="h-5 w-5 mb-1" />
          Logout
        </button>
      </div>
    </nav>
  );
}