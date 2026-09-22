import { createClientBrowser, createAdminClient } from './supabase';
import { Department, User } from '@eduverse/types';
import { ApiResponse } from '@eduverse/types';

// Browser client for client-side queries
const supabase = createClientBrowser();

export async function getAdminDepartments(): Promise<Department[]> {
  const { data, error } = await supabase.from('department_stats_view').select('*');
  if (error) {
    console.error('Supabase error:', error);
    return [];
  }
  
  // Also get hod info from departments to map it properly
  const { data: depts } = await supabase.from('departments').select('id, code, hod_id, profiles(full_name)');
  
  return data.map((d: any) => {
    const rawDept = depts?.find(x => x.id === d.department_id);
    return {
      id: d.department_id,
      name: d.department_name,
      code: rawDept?.code || d.department_name.substring(0, 3).toUpperCase(),
      hodId: rawDept?.hod_id,
      hodName: rawDept?.profiles?.full_name,
      facultyCount: d.faculty_count || 0,
      studentCount: d.student_count || 0,
    } as Department;
  });
}

export async function getAdminUsers(): Promise<User[]> {
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) {
    console.error('Supabase error:', error);
    return [];
  }
  return data.map((p: any) => ({
    id: p.id,
    name: p.full_name,
    email: p.email,
    role: p.role,
    departmentId: p.department_id,
    isActive: p.status === 'active',
    createdAt: p.created_at,
  } as User));
}

export async function createAdminDepartment(input: Partial<Department>): Promise<ApiResponse<Department>> {
  const { data, error } = await supabase.from('departments').insert({
    name: input.name!,
    code: input.code!
  }).select().single();
  
  if (error) return { data: null as any, success: false, error: error.message };
  
  return { data: { id: data.id, name: data.name, code: data.code } as Department, success: true };
}

export async function updateAdminDepartment(id: string, input: Partial<Department>): Promise<ApiResponse<Department>> {
  const { data, error } = await supabase.from('departments').update({
    name: input.name,
    code: input.code,
    hod_id: input.hodId,
  }).eq('id', id).select().single();
  
  if (error) return { data: null as any, success: false, error: error.message };
  
  return { data: { id: data.id, name: data.name, code: data.code, hodId: data.hod_id } as Department, success: true };
}

export async function deleteAdminDepartment(id: string): Promise<ApiResponse<void>> {
  const { error } = await supabase.from('departments').delete().eq('id', id);
  if (error) return { data: undefined as any, success: false, error: error.message };
  return { data: undefined as any, success: true };
}

// User mutations
export async function updateAdminUser(id: string, input: Partial<User>): Promise<ApiResponse<User>> {
  const { data, error } = await supabase.from('profiles').update({
    full_name: input.name,
    email: input.email,
    role: input.role,
    status: input.isActive ? 'active' : 'inactive'
  }).eq('id', id).select().single();
  
  if (error) return { data: null as any, success: false, error: error.message };
  
  return { data: { id: data.id, name: data.full_name, email: data.email, role: data.role } as User, success: true };
}

export async function deleteAdminUser(id: string): Promise<ApiResponse<void>> {
  // We only delete from profiles here. In a real app, an edge function or server action
  // using service role key would also delete from auth.users.
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  if (error) return { data: undefined as any, success: false, error: error.message };
  return { data: undefined as any, success: true };
}

export async function getAdminSettings() {
  const { data, error } = await supabase.from('settings').select('*').single();
  if (error) return null;
  return data;
}

export async function updateAdminSettings(id: string, updates: any) {
  const { data, error } = await supabase.from('settings').update(updates).eq('id', id).select().single();
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}
