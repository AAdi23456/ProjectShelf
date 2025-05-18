'use client';

import { cn } from "@/lib/utils";

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function DashboardShell({
  children,
  className,
  ...props
}: DashboardShellProps) {
  return (
    <div className="flex-1 items-start md:grid md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]">
      <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
        <div className="py-6 pr-2 pl-6 lg:pl-8">
          <nav className="flex flex-col space-y-2">
            <a
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-primary"
            >
              <span>Dashboard</span>
            </a>
            <a
              href="/dashboard/projects"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-primary"
            >
              <span>Projects</span>
            </a>
            <a
              href="/dashboard/themes"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-primary font-medium"
            >
              <span>Themes</span>
            </a>
            <a
              href="/dashboard/settings"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-primary"
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