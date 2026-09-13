'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard, Building2, UserCog, Users, GraduationCap, BookOpen,
  Calendar, BarChart3, Megaphone, ClipboardCheck, FolderOpen, FileText,
  HelpCircle, Code2, ClipboardList, MessageCircle, TrendingUp, Bell,
  Settings, LogOut, Moon, Sun, ChevronLeft, Menu, Search, Check,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { getInitials } from '@eduverse/utils';
import type { NavItem } from '@eduverse/config';
import { ADMIN_NAV, HOD_NAV, FACULTY_NAV, STUDENT_NAV, ROLES } from '@eduverse/config';
import { useState } from 'react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Building2, UserCog, Users, GraduationCap, BookOpen,
  Calendar, BarChart3, Megaphone, ClipboardCheck, FolderOpen, FileText,
  HelpCircle, Code2, ClipboardList, MessageCircle, TrendingUp, Bell, Settings,
};

function NavIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name] || LayoutDashboard;
  return <Icon className={className} />;
}

interface DashboardShellProps {
  children: React.ReactNode;
  title: string;
}

export function DashboardShell({ children, title }: DashboardShellProps) {
  const { user, logout, switchRole } = useAuth();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: NavItem[] = (() => {
    switch (user?.role) {
      case 'admin': return ADMIN_NAV;
      case 'hod': return HOD_NAV;
      case 'faculty': return FACULTY_NAV;
      case 'student': return STUDENT_NAV;
      default: return [];
    }
  })();

  const roleLabel = ROLES.find(r => r.value === user?.role);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Persistent Left Sidebar - Uizard SaaS PM Style */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-in-out lg:static lg:z-auto",
          sidebarCollapsed ? "w-[72px]" : "w-[260px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-primary-foreground shadow-xs shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight truncate">EduVerse</span>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground uppercase tracking-wider">
                  SaaS
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground truncate">Campus Management</span>
            </div>
          )}
        </div>

        {/* Navigation List with Generous Whitespace */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== `/${user?.role}` && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'sidebar-link group',
                  isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'
                )}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <NavIcon
                  name={item.icon}
                  className={cn(
                    "w-4 h-4 shrink-0 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                {item.badge && !sidebarCollapsed && (
                  <span className="ml-auto flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer: User / Theme / Collapse */}
        <div className="p-3 border-t border-sidebar-border flex flex-col gap-2">
          {!sidebarCollapsed && (
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Theme
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-foreground"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                title="Toggle Theme"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </div>
          )}

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex items-center justify-center w-full h-8 rounded-lg hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition-colors"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className={cn("w-4 h-4 transition-transform duration-200", sidebarCollapsed && "rotate-180")} />
            {!sidebarCollapsed && <span className="text-xs ml-2">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Modern Top Header Bar */}
        <header className="flex items-center justify-between h-16 px-6 border-b border-border/70 bg-background/80 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground">{title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50 border border-border/70 text-sm text-muted-foreground min-w-[220px]">
              <Search className="w-3.5 h-3.5" />
              <span className="text-xs">Search projects, courses...</span>
              <kbd className="ml-auto text-[10px] bg-background px-1.5 py-0.5 rounded border border-border font-mono">⌘K</kbd>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative rounded-xl h-9 w-9 text-muted-foreground hover:text-foreground">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full" />
            </Button>

            {/* Theme Toggle Button in Header */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl h-9 w-9 text-muted-foreground hover:text-foreground"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* User Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2.5 pl-2 pr-1.5 py-1 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/60">
                  <div className="hidden sm:block text-right">
                    <p className="text-xs font-semibold leading-none text-foreground">{user?.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{roleLabel?.label}</p>
                  </div>
                  <Avatar className="h-8 w-8 rounded-xl border border-border/70">
                    <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                      {user?.name ? getInitials(user.name) : '?'}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-card border-border/80">
                <DropdownMenuLabel className="p-2">
                  <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  <div className="mt-1.5 inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {roleLabel?.label}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Switch Role</p>
                  <div className="grid grid-cols-2 gap-1">
                    {ROLES.map((r) => (
                      <button
                        key={r.value}
                        onClick={() => switchRole(r.value)}
                        className={cn(
                          "flex items-center justify-between px-2 py-1 rounded-lg text-xs transition-colors",
                          user?.role === r.value ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <span>{r.label}</span>
                        {user?.role === r.value && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer rounded-xl p-2 focus:bg-destructive/10">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-background">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
