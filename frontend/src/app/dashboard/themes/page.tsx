'use client';

import PortfolioThemeSelector from '@/components/dashboard/PortfolioThemeSelector';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default function ThemesPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Portfolio Themes"
        subheading="Select and preview different themes for your portfolio"
      />
      <div className="grid gap-8">
        <PortfolioThemeSelector />
      </div>
    </DashboardShell>
  );
} 