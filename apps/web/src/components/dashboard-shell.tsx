'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard, Building2, UserCog, Users, GraduationCap, BookOpen,
  Calendar, BarChart3, Megaphone, ClipboardCheck, FolderOpen, FileText,
  HelpCircle, Code2, ClipboardList, MessageCircle, TrendingUp, Bell,
  Settings, LogOut, Moon, Sun, ChevronLeft, Menu, Search,
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
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "w-[68px]" : "w-[260px]"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg gradient-primary">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight">EduVerse</span>
              <span className="text-[10px] text-sidebar-foreground/50 uppercase tracking-widest">Campus Platform</span>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== `/${user?.role}` && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'sidebar-link',
                  isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'
                )}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <NavIcon name={item.icon} className="w-5 h-5 shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
                {item.badge && !sidebarCollapsed && (
                  <Badge variant="destructive" className="ml-auto h-5 min-w-[20px] px-1.5">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex items-center justify-center w-full h-8 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            <ChevronLeft className={cn("w-4 h-4 transition-transform", sidebarCollapsed && "rotate-180")} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between h-16 px-6 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold">{title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50 text-sm text-muted-foreground min-w-[200px]">
              <Search className="w-4 h-4" />
              <span>Search...</span>
              <kbd className="ml-auto text-[10px] bg-background px-1.5 py-0.5 rounded border">⌘K</kbd>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full animate-pulse-glow" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 pl-3 pr-1 py-1 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{roleLabel?.label}</p>
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {user?.name ? getInitials(user.name) : '?'}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
