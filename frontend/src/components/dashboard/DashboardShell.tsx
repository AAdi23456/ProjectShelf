'use client';

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function DashboardShell({
  children,
  className,
  ...props
}: DashboardShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex-1 items-start md:grid md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]">
      <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
        <div className="py-6 pr-2 pl-6 lg:pl-8">
          <nav className="flex flex-col space-y-2">
            <a
              href="/dashboard"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:text-primary",
                pathname === "/dashboard" 
                  ? "text-primary font-medium" 
                  : "text-muted-foreground"
              )}
            >
              <span>Dashboard</span>
            </a>
            <a
              href="/dashboard/projects"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:text-primary",
                pathname === "/dashboard/projects" || pathname.startsWith("/dashboard/projects/") 
                  ? "text-primary font-medium" 
                  : "text-muted-foreground"
              )}
            >
              <span>Projects</span>
            </a>
            <a
              href="/dashboard/analytics"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:text-primary",
                pathname === "/dashboard/analytics" 
                  ? "text-primary font-medium" 
                  : "text-muted-foreground"
              )}
            >
              <span>Analytics</span>
            </a>
            <a
              href="/dashboard/themes"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:text-primary",
                pathname === "/dashboard/themes" 
                  ? "text-primary font-medium" 
                  : "text-muted-foreground"
              )}
            >
              <span>Themes</span>
            </a>
            <a
              href="/dashboard/settings"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:text-primary",
                pathname === "/dashboard/settings" 
                  ? "text-primary font-medium" 
                  : "text-muted-foreground"
              )}
            >
              <span>Settings</span>
            </a>
          </nav>
        </div>
      </aside>
      <main
        className={cn(
          "flex w-full flex-col overflow-hidden p-4 md:px-8 md:py-6 lg:px-10",
          className
        )}
        {...props}
      >
        {children}
      </main>
    </div>
  );
} 