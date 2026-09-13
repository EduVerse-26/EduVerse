'use client';

import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, UserPlus, Shield, User, GraduationCap, Users as UsersIcon, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  const { data: users, isLoading } = useQuery({ 
    queryKey: ['adminAllUsers'], 
    queryFn: () => getAllUsers() 
  });

  const filteredUsers = users?.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = selectedRole === 'all' || u.role === selectedRole;
    return matchesSearch && matchesRole;
  }) || [];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />;
      case 'hod': return <UsersIcon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case 'faculty': return <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      case 'student': return <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      default: return <User className="w-3.5 h-3.5" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20 capitalize">
            {getRoleIcon(role)}
            {role}
          </span>
        );
      case 'hod':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 capitalize">
            {getRoleIcon(role)}
            {role}
          </span>
        );
      case 'faculty':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 capitalize">
            {getRoleIcon(role)}
            {role}
          </span>
        );
      case 'student':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 capitalize">
            {getRoleIcon(role)}
            {role}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-muted text-muted-foreground border border-border capitalize">
            {getRoleIcon(role)}
            {role}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">User Directory</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage accounts, permissions, and institution profiles.</p>
        </div>
        <Button className="gap-2 rounded-xl text-sm font-medium shadow-xs">
          <UserPlus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      <Card className="rounded-2xl border-border/70 bg-card shadow-xs overflow-hidden">
        <CardHeader className="p-5 border-b border-border/60">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-base font-bold text-foreground">All Accounts</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} registered
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              {/* Role filter pills */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 border border-border/60 text-xs">
                {['all', 'admin', 'hod', 'faculty', 'student'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRole(r)}
                    className={`px-2.5 py-1 rounded-lg font-medium capitalize transition-all ${
                      selectedRole === r
                        ? 'bg-card text-foreground shadow-xs font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search users..." 
                  className="pl-9 h-9 rounded-xl border-border/70 text-sm shadow-xs"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-16 text-center text-sm text-muted-foreground">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 border-b border-border/60 hover:bg-muted/40">
                    <TableHead className="py-3 px-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">User Details</TableHead>
                    <TableHead className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</TableHead>
                    <TableHead className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Account Status</TableHead>
                    <TableHead className="py-3 px-5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                      <TableCell className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0 border border-primary/20">
                            {user.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-foreground truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5 px-4">
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell className="py-3.5 px-4">
                        <Badge variant="success" className="gap-1 text-[11px] font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3.5 px-5 text-right">
                        <Button variant="ghost" size="sm" className="rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground">
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {filteredUsers.length === 0 && (
                     <TableRow>
                       <TableCell colSpan={4} className="text-center py-12 text-sm text-muted-foreground">
                         No users found matching "{search}".
                       </TableCell>
                     </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
