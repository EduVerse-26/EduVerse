'use server';

import { createAdminClient } from '@eduverse/api/src/supabase';
import { UserRole } from '@eduverse/types';

export async function createAdminUserAction(input: {
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  phone?: string;
  departmentId?: string;
}) {
  const supabase = createAdminClient();

  // 1. Create auth user
  const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
    email: input.email,
    password: input.password || 'password', // Default password if not provided
    email_confirm: true,
  });

  if (authErr && !authErr.message.includes('already exists') && !authErr.message.includes('already been registered')) {
    return { success: false, error: authErr.message };
  }

  let userId = authData?.user?.id;
  if (!userId && (authErr?.message.includes('already exists') || authErr?.message.includes('already been registered'))) {
    userId = (await supabase.auth.admin.listUsers()).data.users.find((u: any) => u.email === input.email)?.id;
  }

  if (!userId) {
    return { success: false, error: 'Could not create or find auth user.' };
  }

  // 2. Create profile
  const { error: profileErr } = await supabase.from('profiles').upsert({
    id: userId,
    full_name: input.name,
    email: input.email,
    role: input.role,
    department_id: input.departmentId || null,
    status: 'active',
    must_change_password: input.role === 'hod' ? true : false,
  });

  if (profileErr) {
    return { success: false, error: profileErr.message };
  }

  return { success: true };
}
