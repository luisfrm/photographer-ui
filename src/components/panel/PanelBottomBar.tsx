"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Settings, Calendar, MoreHorizontal, ArrowLeft, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/app/panel/actions";

const navigationItems = [
  { name: "Content", href: "/panel/dashboard/content", icon: FileText },
  { name: "Settings", href: "/panel/dashboard/settings", icon: Settings },
  { name: "Appointments", href: "/panel/dashboard/appointments", icon: Calendar },
];

export default function PanelBottomBar() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOutAction();
  };

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
        {/* More menu with Back and Logout */}
        <div className="flex flex-col items-center justify-center flex-1 h-full px-2 py-1">
          <div className="relative group">
            <button
              type="button"
              className="flex flex-col items-center justify-center text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <div className="p-1.5 rounded-xl">
                <MoreHorizontal className="h-5 w-5" />
              </div>
              <span className="mt-1">More</span>
            </button>
            {/* Dropdown menu */}
            <div className="absolute bottom-full right-0 mb-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <Link
                href="/"
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to site
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}