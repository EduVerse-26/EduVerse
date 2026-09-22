export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          role: string
          avatar_url: string | null
          status: string
          department_id: string | null
          created_at: string
          must_change_password: boolean
        }
        Insert: {
          id: string
          full_name: string
          email: string
          role: string
          avatar_url?: string | null
          status?: string
          department_id?: string | null
          created_at?: string
          must_change_password?: boolean
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          role?: string
          avatar_url?: string | null
          status?: string
          department_id?: string | null
          created_at?: string
          must_change_password?: boolean
        }
      }
      departments: {
        Row: {
          id: string
          name: string
          code: string
          hod_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          hod_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          hod_id?: string | null
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          department_id: string | null
          name: string
          code: string
          faculty_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          department_id?: string | null
          name: string
          code: string
          faculty_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          department_id?: string | null
          name?: string
          code?: string
          faculty_id?: string | null
          created_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          institution_name: string | null
          academic_year: string | null
          contact_email: string | null
          contact_phone: string | null
          address: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          institution_name?: string | null
          academic_year?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          address?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          institution_name?: string | null
          academic_year?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          address?: string | null
          updated_at?: string
        }
      }
    }
    Views: {
      department_stats_view: {
        Row: {
          department_id: string
          department_name: string
          faculty_count: number
          student_count: number
          course_count: number
        }
      }
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
