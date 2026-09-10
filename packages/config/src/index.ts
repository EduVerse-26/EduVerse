import type { UserRole, ProgrammingLanguage, DayOfWeek } from '@eduverse/types';

// ============================================================
// Role Configuration
// ============================================================

export const ROLES: { value: UserRole; label: string; description: string; icon: string }[] = [
  { value: 'admin', label: 'Admin', description: 'Institution-level management', icon: '🏛️' },
  { value: 'hod', label: 'HOD', description: 'Department-level management', icon: '📋' },
  { value: 'faculty', label: 'Faculty', description: 'Teaching & assessment', icon: '👨‍🏫' },
  { value: 'student', label: 'Student', description: 'Learning & performance', icon: '🎓' },
];

export const ROLE_DASHBOARD_PATHS: Record<UserRole, string> = {
  admin: '/admin',
  hod: '/hod',
  faculty: '/faculty',
  student: '/student',
};

// ============================================================
// Navigation Configuration
// ============================================================

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

export const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
  { label: 'Departments', href: '/admin/departments', icon: 'Building2' },
  { label: 'HOD Management', href: '/admin/hods', icon: 'UserCog' },
  { label: 'All Users', href: '/admin/users', icon: 'Users' },
  { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
];

export const HOD_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/hod', icon: 'LayoutDashboard' },
  { label: 'Faculty', href: '/hod/faculty', icon: 'UserCog' },
  { label: 'Students', href: '/hod/students', icon: 'GraduationCap' },
  { label: 'Courses', href: '/hod/courses', icon: 'BookOpen' },
  { label: 'Timetable', href: '/hod/timetable', icon: 'Calendar' },
  { label: 'Performance', href: '/hod/performance', icon: 'BarChart3' },
  { label: 'Announcements', href: '/hod/announcements', icon: 'Megaphone' },
];

export const FACULTY_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/faculty', icon: 'LayoutDashboard' },
  { label: 'Timetable', href: '/faculty/timetable', icon: 'Calendar' },
  { label: 'Attendance', href: '/faculty/attendance', icon: 'ClipboardCheck' },
  { label: 'Resources', href: '/faculty/resources', icon: 'FolderOpen' },
  { label: 'Assignments', href: '/faculty/assignments', icon: 'FileText' },
  { label: 'Quizzes', href: '/faculty/quizzes', icon: 'HelpCircle' },
  { label: 'Coding Exams', href: '/faculty/coding-exams', icon: 'Code2' },
  { label: 'Marks', href: '/faculty/marks', icon: 'ClipboardList' },
  { label: 'Counseling', href: '/faculty/counseling', icon: 'MessageCircle' },
  { label: 'Announcements', href: '/faculty/announcements', icon: 'Megaphone' },
];

export const STUDENT_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/student', icon: 'LayoutDashboard' },
  { label: 'Attendance', href: '/student/attendance', icon: 'ClipboardCheck' },
  { label: 'Timetable', href: '/student/timetable', icon: 'Calendar' },
  { label: 'Resources', href: '/student/resources', icon: 'FolderOpen' },
  { label: 'Assignments', href: '/student/assignments', icon: 'FileText' },
  { label: 'Quizzes', href: '/student/quizzes', icon: 'HelpCircle' },
  { label: 'Coding Exams', href: '/student/coding-exams', icon: 'Code2' },
  { label: 'Performance', href: '/student/performance', icon: 'TrendingUp' },
  { label: 'Counseling', href: '/student/counseling', icon: 'MessageCircle' },
  { label: 'Announcements', href: '/student/announcements', icon: 'Bell' },
];

// ============================================================
// Programming Languages
// ============================================================

export const PROGRAMMING_LANGUAGES: { value: ProgrammingLanguage; label: string; monacoId: string; extension: string }[] = [
  { value: 'python', label: 'Python', monacoId: 'python', extension: '.py' },
  { value: 'java', label: 'Java', monacoId: 'java', extension: '.java' },
  { value: 'cpp', label: 'C++', monacoId: 'cpp', extension: '.cpp' },
  { value: 'javascript', label: 'JavaScript', monacoId: 'javascript', extension: '.js' },
  { value: 'c', label: 'C', monacoId: 'c', extension: '.c' },
];

export const DEFAULT_CODE_TEMPLATES: Record<ProgrammingLanguage, string> = {
  python: '# Write your solution here\n\ndef solve():\n    # Read input\n    n = int(input())\n    # Your code here\n    pass\n\nsolve()\n',
  java: 'import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Your code here\n    }\n}\n',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    \n    return 0;\n}\n',
  javascript: '// Write your solution here\nconst readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\n\nrl.on("line", (line) => {\n    // Your code here\n});\n',
  c: '#include <stdio.h>\n\nint main() {\n    // Your code here\n    \n    return 0;\n}\n',
};

// ============================================================
// Days & Time
// ============================================================

export const DAYS_OF_WEEK: { value: DayOfWeek; label: string; short: string }[] = [
  { value: 'monday', label: 'Monday', short: 'Mon' },
  { value: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { value: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { value: 'thursday', label: 'Thursday', short: 'Thu' },
  { value: 'friday', label: 'Friday', short: 'Fri' },
  { value: 'saturday', label: 'Saturday', short: 'Sat' },
];

export const PERIODS = [
  { period: 1, start: '09:00', end: '09:50' },
  { period: 2, start: '09:50', end: '10:40' },
  { period: 3, start: '10:50', end: '11:40' },
  { period: 4, start: '11:40', end: '12:30' },
  { period: 5, start: '13:30', end: '14:20' },
  { period: 6, start: '14:20', end: '15:10' },
  { period: 7, start: '15:20', end: '16:10' },
  { period: 8, start: '16:10', end: '17:00' },
];

// ============================================================
// Attendance Thresholds
// ============================================================

export const ATTENDANCE_THRESHOLDS = {
  safe: 75,
  warning: 65,
  critical: 0,
};

export const ATTENDANCE_STATUS_COLORS = {
  safe: { bg: '#10b981', text: '#ffffff' },
  warning: { bg: '#f59e0b', text: '#ffffff' },
  critical: { bg: '#ef4444', text: '#ffffff' },
};

// ============================================================
// App Constants
// ============================================================

export const APP_NAME = 'EduVerse';
export const APP_DESCRIPTION = 'Integrated Campus Management & Academic Platform';
export const APP_VERSION = '1.0.0';
export const API_DELAY_MS = 500; // simulated API latency
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'csv', 'jpg', 'jpeg', 'png', 'mp4', 'zip'];

// ============================================================
// Theme Colors (shared design tokens)
// ============================================================

export const THEME_COLORS = {
  primary: { light: '#6366f1', dark: '#818cf8' },
  secondary: { light: '#8b5cf6', dark: '#a78bfa' },
  accent: { light: '#06b6d4', dark: '#22d3ee' },
  success: { light: '#10b981', dark: '#34d399' },
  warning: { light: '#f59e0b', dark: '#fbbf24' },
  error: { light: '#ef4444', dark: '#f87171' },
  background: { light: '#f8fafc', dark: '#0f172a' },
  surface: { light: '#ffffff', dark: '#1e293b' },
  surfaceHover: { light: '#f1f5f9', dark: '#334155' },
  border: { light: '#e2e8f0', dark: '#334155' },
  text: { light: '#0f172a', dark: '#f8fafc' },
  textMuted: { light: '#64748b', dark: '#94a3b8' },
};
