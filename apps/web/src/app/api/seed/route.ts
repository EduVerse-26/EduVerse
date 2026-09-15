import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { mockDepartments, mockUsers } from '@eduverse/api/src/mock-data';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes('your-project-ref')) {
    return NextResponse.json({ error: 'Please configure Supabase credentials in .env.local first.' }, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  try {
    // 1. Create Admin Auth User
    const { data: adminAuth, error: adminAuthErr } = await supabase.auth.admin.createUser({
      email: 'admin@gmail.com',
      password: 'Admin@234',
      email_confirm: true,
    });
    
    // Ignore error if user already exists
    if (adminAuthErr && !adminAuthErr.message.includes('already been registered') && !adminAuthErr.message.includes('already exists')) {
      throw adminAuthErr;
    }

    const adminId = adminAuth?.user?.id || (await supabase.auth.admin.listUsers()).data.users.find(u => u.email === 'admin@gmail.com')?.id;

    if (!adminId) throw new Error("Could not create or find admin user");

    // 2. Insert Admin Profile
    await supabase.from('profiles').upsert({
      id: adminId,
      full_name: 'Dr. Rajesh Kumar',
      email: 'admin@gmail.com',
      role: 'admin',
      status: 'active'
    });

    // 3. Insert Departments
    for (const dept of mockDepartments) {
      await supabase.from('departments').upsert({
        id: dept.id,
        name: dept.name,
        code: dept.id.toUpperCase(), // basic code generation
      });
    }

    // 4. Insert Mock Profiles (Faculty, HOD, Student)
    // We create dummy auth users for them so they can be referenced in the profiles table
    for (const user of mockUsers.filter(u => u.role !== 'admin')) {
      const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
        email: user.email,
        password: 'password', // default mock password
        email_confirm: true,
      });

      let userId = authData?.user?.id;
      if (!userId && authErr?.message.includes('already been registered') || authErr?.message.includes('already exists')) {
         userId = (await supabase.auth.admin.listUsers()).data.users.find(u => u.email === user.email)?.id;
      }
      
      if (userId) {
        await supabase.from('profiles').upsert({
          id: userId,
          full_name: user.name,
          email: user.email,
          role: user.role,
          department_id: user.departmentId || null,
          status: 'active'
        });
      }
    }

    // 5. Update Department HODs
    for (const dept of mockDepartments) {
      if (dept.hodId) {
        // Find the new auth ID for this mock HOD
        const mockHod = mockUsers.find(u => u.id === dept.hodId);
        if (mockHod) {
           const realHodId = (await supabase.auth.admin.listUsers()).data.users.find(u => u.email === mockHod.email)?.id;
           if (realHodId) {
             await supabase.from('departments').update({ hod_id: realHodId }).eq('id', dept.id);
           }
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Database seeded successfully!' });
  } catch (error: any) {
    console.error('Seeding error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
