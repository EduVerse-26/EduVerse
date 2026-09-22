'use server';

import { createAdminClient } from '@eduverse/api/src/supabase';

export async function updatePasswordAndClearFlag(userId: string, newPassword: string) {
  const supabase = createAdminClient();

  // 1. Update auth password
  const { error: authErr } = await supabase.auth.admin.updateUserById(userId, {
    password: newPassword,
  });

  if (authErr) {
    return { success: false, error: authErr.message };
  }

  // 2. Update profile flag
  const { error: profileErr } = await supabase
    .from('profiles')
    .update({ must_change_password: false })
    .eq('id', userId);

  if (profileErr) {
    return { success: false, error: profileErr.message };
  }

  return { success: true };
}
