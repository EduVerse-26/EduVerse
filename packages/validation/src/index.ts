import { z } from 'zod';

// ============================================================
// Auth Schemas
// ============================================================

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ============================================================
// Department Schemas
// ============================================================

export const createDepartmentSchema = z.object({
  name: z.string().min(2, 'Department name must be at least 2 characters').max(100),
  code: z.string().min(2, 'Department code must be at least 2 characters').max(10).toUpperCase(),
  hodId: z.string().optional(),
});

export const updateDepartmentSchema = createDepartmentSchema.partial().extend({
  id: z.string(),
  isActive: z.boolean().optional(),
});

export type CreateDepartmentFormData = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentFormData = z.infer<typeof updateDepartmentSchema>;

// ============================================================
// Faculty Schemas
// ============================================================

export const createFacultySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15),
  departmentId: z.string().min(1, 'Please select a department'),
  designation: z.string().min(2, 'Designation is required'),
  specialization: z.string().min(2, 'Specialization is required'),
  joiningDate: z.string().min(1, 'Joining date is required'),
});

export const updateFacultySchema = createFacultySchema.partial().extend({
  id: z.string(),
  isActive: z.boolean().optional(),
});

export type CreateFacultyFormData = z.infer<typeof createFacultySchema>;
export type UpdateFacultyFormData = z.infer<typeof updateFacultySchema>;

// ============================================================
// Student Schemas
// ============================================================

export const createStudentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15),
  rollNumber: z.string().min(1, 'Roll number is required'),
  departmentId: z.string().min(1, 'Please select a department'),
  batch: z.string().min(4, 'Batch is required (e.g., 2024)'),
  semester: z.number().min(1).max(8),
  section: z.string().min(1, 'Section is required').max(5),
  parentPhone: z.string().optional(),
  address: z.string().optional(),
});

export const updateStudentSchema = createStudentSchema.partial().extend({
  id: z.string(),
  isActive: z.boolean().optional(),
  counselorId: z.string().optional(),
});

export type CreateStudentFormData = z.infer<typeof createStudentSchema>;
export type UpdateStudentFormData = z.infer<typeof updateStudentSchema>;

// ============================================================
// Assignment Schemas
// ============================================================

export const createAssignmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  courseId: z.string().min(1, 'Please select a course'),
  deadline: z.string().min(1, 'Deadline is required'),
  maxMarks: z.number().min(1, 'Max marks must be at least 1').max(100),
  batch: z.string().min(1, 'Batch is required'),
  section: z.string().min(1, 'Section is required'),
});

export const evaluationSchema = z.object({
  submissionId: z.string(),
  marks: z.number().min(0, 'Marks cannot be negative'),
  feedback: z.string().min(1, 'Please provide feedback'),
});

export type CreateAssignmentFormData = z.infer<typeof createAssignmentSchema>;
export type EvaluationFormData = z.infer<typeof evaluationSchema>;

// ============================================================
// Quiz Schemas
// ============================================================

const questionSchema = z.object({
  type: z.enum(['mcq', 'true_false', 'short_answer']),
  text: z.string().min(5, 'Question text must be at least 5 characters'),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().min(1, 'Correct answer is required'),
  points: z.number().min(1, 'Points must be at least 1'),
  explanation: z.string().optional(),
});

export const createQuizSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  courseId: z.string().min(1, 'Please select a course'),
  duration: z.number().min(5, 'Duration must be at least 5 minutes').max(180),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  questions: z.array(questionSchema).min(1, 'At least one question is required'),
  batch: z.string().min(1, 'Batch is required'),
  section: z.string().min(1, 'Section is required'),
});

export type CreateQuizFormData = z.infer<typeof createQuizSchema>;
export type QuestionFormData = z.infer<typeof questionSchema>;

// ============================================================
// Coding Exam Schemas
// ============================================================

const testCaseSchema = z.object({
  input: z.string().min(0),
  expectedOutput: z.string().min(1, 'Expected output is required'),
  isHidden: z.boolean(),
  points: z.number().min(0),
});

const codingProblemSchema = z.object({
  title: z.string().min(3, 'Problem title must be at least 3 characters'),
  statement: z.string().min(20, 'Problem statement must be at least 20 characters'),
  inputFormat: z.string().min(5, 'Input format is required'),
  outputFormat: z.string().min(5, 'Output format is required'),
  constraints: z.string().min(5, 'Constraints are required'),
  sampleTestCases: z.array(testCaseSchema).min(1, 'At least one sample test case is required'),
  hiddenTestCases: z.array(testCaseSchema).min(1, 'At least one hidden test case is required'),
  timeLimit: z.number().min(1, 'Time limit must be at least 1 second').max(30),
  memoryLimit: z.number().min(16, 'Memory limit must be at least 16MB').max(512),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

export const createCodingExamSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  courseId: z.string().min(1, 'Please select a course'),
  duration: z.number().min(15, 'Duration must be at least 15 minutes').max(300),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  problems: z.array(codingProblemSchema).min(1, 'At least one problem is required'),
  batch: z.string().min(1, 'Batch is required'),
  section: z.string().min(1, 'Section is required'),
  allowedLanguages: z.array(z.enum(['python', 'java', 'cpp', 'javascript', 'c'])).min(1, 'Select at least one language'),
});

export type CreateCodingExamFormData = z.infer<typeof createCodingExamSchema>;
export type CodingProblemFormData = z.infer<typeof codingProblemSchema>;
export type TestCaseFormData = z.infer<typeof testCaseSchema>;

// ============================================================
// Marks Schemas
// ============================================================

export const marksEntrySchema = z.object({
  studentId: z.string(),
  courseId: z.string(),
  assessmentType: z.enum(['assignment', 'quiz', 'coding_exam', 'internal', 'midterm', 'final']),
  marks: z.number().min(0, 'Marks cannot be negative'),
  maxMarks: z.number().min(1),
});

export type MarksEntryFormData = z.infer<typeof marksEntrySchema>;

// ============================================================
// Counseling Schemas
// ============================================================

export const sessionNoteSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  topic: z.string().min(3, 'Topic must be at least 3 characters'),
  concern: z.string().min(10, 'Concern must be at least 10 characters'),
  observation: z.string().min(10, 'Observation must be at least 10 characters'),
  followUp: z.string().optional(),
});

export const chatMessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(2000),
  receiverId: z.string(),
});

export type SessionNoteFormData = z.infer<typeof sessionNoteSchema>;
export type ChatMessageFormData = z.infer<typeof chatMessageSchema>;

// ============================================================
// Announcement Schemas
// ============================================================

export const createAnnouncementSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  scope: z.enum(['institution', 'department', 'course', 'batch']),
  priority: z.enum(['low', 'normal', 'high', 'urgent']),
  departmentId: z.string().optional(),
  courseId: z.string().optional(),
  batch: z.string().optional(),
  section: z.string().optional(),
  expiresAt: z.string().optional(),
});

export type CreateAnnouncementFormData = z.infer<typeof createAnnouncementSchema>;
