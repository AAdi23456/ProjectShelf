'use client';

import { cn } from "@/lib/utils";

interface DashboardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string;
  subheading?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  heading,
  subheading,
  children,
  className,
  ...props
}: DashboardHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1 pb-6", className)} {...props}>
      <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
      {subheading && (
        <p className="text-muted-foreground">{subheading}</p>
      )}
      {children}
    </div>
  );
} 