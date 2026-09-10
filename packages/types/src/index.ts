// ============================================================
// User & Auth Types
// ============================================================

export type UserRole = 'admin' | 'hod' | 'faculty' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  departmentId?: string;
  departmentName?: string;
  phone?: string;
  createdAt: string;
  isActive: boolean;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// ============================================================
// Department Types
// ============================================================

export interface Department {
  id: string;
  name: string;
  code: string;
  hodId?: string;
  hodName?: string;
  facultyCount: number;
  studentCount: number;
  courseCount: number;
  createdAt: string;
  isActive: boolean;
}

export interface CreateDepartmentInput {
  name: string;
  code: string;
  hodId?: string;
}

export interface UpdateDepartmentInput {
  id: string;
  name?: string;
  code?: string;
  hodId?: string;
  isActive?: boolean;
}

// ============================================================
// Faculty Types
// ============================================================

export interface Faculty {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  departmentId: string;
  departmentName: string;
  designation: string;
  specialization: string;
  joiningDate: string;
  avatar?: string;
  isActive: boolean;
  courseIds: string[];
  counselingStudentIds: string[];
}

export interface CreateFacultyInput {
  name: string;
  email: string;
  phone: string;
  departmentId: string;
  designation: string;
  specialization: string;
  joiningDate: string;
}

export interface UpdateFacultyInput {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  designation?: string;
  specialization?: string;
  isActive?: boolean;
}

// ============================================================
// Student Types
// ============================================================

export interface Student {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  rollNumber: string;
  departmentId: string;
  departmentName: string;
  batch: string;
  semester: number;
  section: string;
  avatar?: string;
  parentPhone?: string;
  address?: string;
  isActive: boolean;
  counselorId?: string;
  counselorName?: string;
}

export interface CreateStudentInput {
  name: string;
  email: string;
  phone: string;
  rollNumber: string;
  departmentId: string;
  batch: string;
  semester: number;
  section: string;
  parentPhone?: string;
  address?: string;
}

export interface UpdateStudentInput {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  semester?: number;
  section?: string;
  parentPhone?: string;
  address?: string;
  isActive?: boolean;
  counselorId?: string;
}

// ============================================================
// Course Types
// ============================================================

export interface Course {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  departmentName: string;
  semester: number;
  credits: number;
  description?: string;
  isActive: boolean;
}

export interface CourseAllocation {
  id: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  facultyId: string;
  facultyName: string;
  batch: string;
  section: string;
  semester: number;
  academicYear: string;
}

export interface TimetableSlot {
  id: string;
  day: DayOfWeek;
  period: number;
  startTime: string;
  endTime: string;
  courseId?: string;
  courseName?: string;
  courseCode?: string;
  facultyId?: string;
  facultyName?: string;
  room?: string;
  type: 'lecture' | 'lab' | 'tutorial' | 'break' | 'free';
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

export interface WeeklyTimetable {
  batch: string;
  section: string;
  semester: number;
  slots: TimetableSlot[];
}

// ============================================================
// Attendance Types
// ============================================================

export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  sessionId: string;
  status: AttendanceStatus;
  markedAt: string;
  markedBy: string;
}

export interface AttendanceSession {
  id: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  facultyId: string;
  facultyName: string;
  date: string;
  period: number;
  batch: string;
  section: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  records: AttendanceRecord[];
}

export interface StudentAttendanceSummary {
  courseId: string;
  courseName: string;
  courseCode: string;
  totalClasses: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
  status: 'safe' | 'warning' | 'critical';
}

// ============================================================
// Learning Resource Types
// ============================================================

export type ResourceType = 'pdf' | 'video' | 'document' | 'link' | 'image' | 'other';

export interface LearningResource {
  id: string;
  title: string;
  description?: string;
  courseId: string;
  courseName: string;
  type: ResourceType;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  uploadedBy: string;
  uploadedByName: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

// ============================================================
// Assignment Types
// ============================================================

export type SubmissionStatus = 'not_submitted' | 'submitted' | 'late' | 'evaluated';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  facultyId: string;
  facultyName: string;
  deadline: string;
  maxMarks: number;
  referenceFileUrl?: string;
  referenceFileName?: string;
  createdAt: string;
  totalSubmissions: number;
  evaluatedCount: number;
  batch: string;
  section: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  fileUrl?: string;
  fileName?: string;
  textContent?: string;
  submittedAt: string;
  status: SubmissionStatus;
  marks?: number;
  feedback?: string;
  evaluatedAt?: string;
  evaluatedBy?: string;
}

export interface Evaluation {
  submissionId: string;
  marks: number;
  feedback: string;
}

// ============================================================
// Quiz Types
// ============================================================

export type QuestionType = 'mcq' | 'true_false' | 'short_answer';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer: string;
  points: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  facultyId: string;
  facultyName: string;
  duration: number; // minutes
  startTime: string;
  endTime: string;
  questions: QuizQuestion[];
  totalPoints: number;
  batch: string;
  section: string;
  isPublished: boolean;
  attemptsCount: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  studentName: string;
  answers: Record<string, string>;
  startedAt: string;
  submittedAt?: string;
  score?: number;
  totalPoints: number;
  percentage?: number;
}

export interface QuizResult {
  attemptId: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  answers: {
    questionId: string;
    questionText: string;
    studentAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    points: number;
    earnedPoints: number;
  }[];
}

// ============================================================
// Coding Exam Types
// ============================================================

export type ProgrammingLanguage = 'python' | 'java' | 'cpp' | 'javascript' | 'c';

export type Verdict = 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'runtime_error' | 'compilation_error' | 'memory_limit_exceeded' | 'pending';

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  points: number;
}

export interface CodingProblem {
  id: string;
  examId: string;
  title: string;
  statement: string; // markdown
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  sampleTestCases: TestCase[];
  hiddenTestCases: TestCase[];
  timeLimit: number; // seconds
  memoryLimit: number; // MB
  maxPoints: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface CodingExam {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  facultyId: string;
  facultyName: string;
  duration: number; // minutes
  startTime: string;
  endTime: string;
  problems: CodingProblem[];
  totalPoints: number;
  batch: string;
  section: string;
  isPublished: boolean;
  allowedLanguages: ProgrammingLanguage[];
}

export interface CodeSubmission {
  id: string;
  problemId: string;
  examId: string;
  studentId: string;
  studentName: string;
  language: ProgrammingLanguage;
  code: string;
  submittedAt: string;
  verdict: Verdict;
  score: number;
  maxScore: number;
  executionTime?: number;
  memoryUsed?: number;
  testCaseResults: TestCaseResult[];
}

export interface TestCaseResult {
  testCaseId: string;
  passed: boolean;
  verdict: Verdict;
  actualOutput?: string;
  expectedOutput?: string;
  executionTime?: number;
  memoryUsed?: number;
  isHidden: boolean;
}

export interface ExecutionResult {
  output: string;
  error?: string;
  exitCode: number;
  executionTime: number;
  memoryUsed: number;
}

// ============================================================
// Marks & Performance Types
// ============================================================

export type AssessmentType = 'assignment' | 'quiz' | 'coding_exam' | 'internal' | 'midterm' | 'final';

export interface MarksEntry {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  courseId: string;
  courseName: string;
  assessmentType: AssessmentType;
  assessmentId?: string;
  assessmentTitle?: string;
  marks: number;
  maxMarks: number;
  percentage: number;
}

export interface InternalMark {
  studentId: string;
  studentName: string;
  rollNumber: string;
  courseId: string;
  assessments: {
    type: AssessmentType;
    title: string;
    marks: number;
    maxMarks: number;
  }[];
  totalMarks: number;
  totalMaxMarks: number;
  isPublished: boolean;
}

export interface PerformanceMetrics {
  studentId: string;
  studentName: string;
  overallAttendance: number;
  overallMarks: number;
  subjectWise: {
    courseId: string;
    courseName: string;
    attendance: number;
    assignmentAvg: number;
    quizAvg: number;
    codingAvg: number;
    internalMarks: number;
  }[];
  trend: 'improving' | 'stable' | 'declining';
  attendanceTrend: { month: string; percentage: number }[];
  marksTrend: { month: string; percentage: number }[];
}

export interface ClassPerformance {
  batch: string;
  section: string;
  averageAttendance: number;
  averageMarks: number;
  topPerformers: { studentId: string; studentName: string; percentage: number }[];
  lowPerformers: { studentId: string; studentName: string; percentage: number; flagged: boolean }[];
  subjectDistribution: {
    courseId: string;
    courseName: string;
    averageMarks: number;
    passPercentage: number;
  }[];
}

// ============================================================
// Counseling Types
// ============================================================

export interface CounselingSession {
  id: string;
  studentId: string;
  studentName: string;
  counselorId: string;
  counselorName: string;
  date: string;
  topic: string;
  concern: string;
  observation: string;
  followUp?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'file' | 'system';
  fileUrl?: string;
  fileName?: string;
}

export interface SessionNote {
  id: string;
  sessionId: string;
  date: string;
  topic: string;
  concern: string;
  observation: string;
  followUp?: string;
  createdBy: string;
  createdAt: string;
}

// ============================================================
// Announcement Types
// ============================================================

export type AnnouncementScope = 'institution' | 'department' | 'course' | 'batch';

export interface TargetAudience {
  scope: AnnouncementScope;
  departmentId?: string;
  courseId?: string;
  batch?: string;
  section?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  scope: AnnouncementScope;
  target: TargetAudience;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  isActive: boolean;
  attachmentUrl?: string;
  attachmentName?: string;
}

// ============================================================
// Notification Types
// ============================================================

export type NotificationCategory = 'assignment' | 'quiz' | 'coding_exam' | 'marks' | 'announcement' | 'counseling' | 'attendance' | 'system';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  category: NotificationCategory;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

// ============================================================
// Bulk Upload Types
// ============================================================

export interface BulkUploadRow {
  rowNumber: number;
  data: Record<string, string>;
  errors: { field: string; message: string }[];
  isValid: boolean;
}

export interface BulkUploadResult {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  rows: BulkUploadRow[];
  columns: string[];
}

// ============================================================
// Common / Pagination Types
// ============================================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface FilterParams {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: unknown;
}
