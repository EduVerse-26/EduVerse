'use client';

import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from '@eduverse/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, UserPlus, Shield, User, GraduationCap, Users as UsersIcon } from 'lucide-react';
import { useState } from 'react';

export default function UsersPage() {
  const [search, setSearch] = useState('');

  const { data: users, isLoading } = useQuery({ 
    queryKey: ['adminAllUsers'], 
    queryFn: () => getAllUsers() 
  });

  const filteredUsers = users?.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4 text-purple-500" />;
      case 'hod': return <UsersIcon className="w-4 h-4 text-amber-500" />;
      case 'faculty': return <User className="w-4 h-4 text-blue-500" />;
      case 'student': return <GraduationCap className="w-4 h-4 text-emerald-500" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-500/10 text-purple-600 border-purple-200';
      case 'hod': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'faculty': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'student': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Directory</h1>
          <p className="text-muted-foreground mt-2">Manage all system users across the platform.</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle>All Users</CardTitle>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search users..." 
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-16 text-center text-muted-foreground">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>User Details</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Account Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`capitalize flex w-fit items-center gap-1.5 ${getRoleColor(user.role)}`}>
                          {getRoleIcon(user.role)}
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Manage</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {filteredUsers.length === 0 && (
                     <TableRow>
                       <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
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
