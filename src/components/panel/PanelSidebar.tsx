"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FileText, Settings, Calendar, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/common/Logo";
import { useUser } from "@/hooks/useUser";
import { signOutAction } from "@/app/panel/actions";

const navigationItems = [
  { name: "Content", href: "/panel/dashboard/content", icon: FileText },
  { name: "Settings", href: "/panel/dashboard/settings", icon: Settings },
  { name: "Appointments", href: "/panel/dashboard/appointments", icon: Calendar },
];

export default function PanelSidebar() {
  const pathname = usePathname();
  const { user, loading } = useUser();

  const handleSignOut = async () => {
    await signOutAction();
  };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 shadow-sm">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-transparent">
        <Link href="/panel/dashboard" className="flex items-center hover:scale-105 transition-transform">
          <Logo width={40} height={40} />
          <span className="ml-3 text-lg font-semibold text-gray-900">
            Panel
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-gray-600 hover:bg-primary/10 hover:text-primary"
              )}
            >
              <item.icon className={cn("h-5 w-5 mr-3", isActive ? "text-primary-foreground" : "text-gray-400")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t border-gray-100 p-4 bg-gradient-to-t from-primary/5 to-transparent">
        <div className="flex items-center mb-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 border-2 border-primary/20 overflow-hidden">
            {user?.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.name}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-primary" />
            )}
          </div>
          <div className="ml-3 overflow-hidden">
            {loading ? (
              <>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-28 bg-gray-100 rounded animate-pulse mt-1" />
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
}