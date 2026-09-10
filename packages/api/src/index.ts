import type {
  User, AuthSession, LoginCredentials, UserRole,
  Department, CreateDepartmentInput, UpdateDepartmentInput,
  Faculty, CreateFacultyInput,
  Student, CreateStudentInput,
  Course, CourseAllocation, TimetableSlot, WeeklyTimetable,
  AttendanceSession, AttendanceStatus, StudentAttendanceSummary,
  LearningResource,
  Assignment, Submission, Evaluation,
  Quiz, QuizAttempt, QuizResult,
  CodingExam, CodeSubmission, ExecutionResult, ProgrammingLanguage,
  InternalMark, MarksEntry,
  PerformanceMetrics, ClassPerformance,
  CounselingSession, ChatMessage, SessionNote,
  Announcement,
  Notification,
  BulkUploadResult,
  PaginatedResponse,
  ApiResponse,
} from '@eduverse/types';
import { delay, generateId } from '@eduverse/utils';
import { API_DELAY_MS } from '@eduverse/config';
import {
  mockUsers, mockDepartments, mockFaculty, mockStudents,
  mockCourses, mockCourseAllocations, mockTimetableSlots,
  mockAttendanceSessions, mockResources, mockAssignments, mockSubmissions,
  mockQuizzes, mockCodingExams, mockInternalMarks,
  mockChatMessages, mockCounselingSessions,
  mockAnnouncements, mockNotifications, mockPerformanceData,
} from './mock-data';

// ============================================================
// Auth API
// ============================================================

let currentUser: User | null = null;

export async function login(credentials: LoginCredentials): Promise<ApiResponse<AuthSession>> {
  await delay(API_DELAY_MS);
  const user = mockUsers.find(u => u.email === credentials.email);
  if (!user) {
    return { data: null as unknown as AuthSession, success: false, error: 'Invalid email or password' };
  }
  currentUser = user;
  return {
    data: { user, token: `mock-token-${user.id}`, expiresAt: new Date(Date.now() + 86400000).toISOString() },
    success: true,
  };
}

export async function logout(): Promise<void> {
  await delay(200);
  currentUser = null;
}

export async function getCurrentUser(): Promise<User | null> {
  await delay(100);
  return currentUser;
}

export async function switchRole(role: UserRole): Promise<ApiResponse<AuthSession>> {
  await delay(API_DELAY_MS);
  const user = mockUsers.find(u => u.role === role);
  if (!user) {
    return { data: null as unknown as AuthSession, success: false, error: 'No user found for role' };
  }
  currentUser = user;
  return {
    data: { user, token: `mock-token-${user.id}`, expiresAt: new Date(Date.now() + 86400000).toISOString() },
    success: true,
  };
}

// ============================================================
// Department API
// ============================================================

export async function getDepartments(): Promise<Department[]> {
  await delay(API_DELAY_MS);
  return [...mockDepartments];
}

export async function getDepartment(id: string): Promise<Department | undefined> {
  await delay(API_DELAY_MS);
  return mockDepartments.find(d => d.id === id);
}

export async function createDepartment(input: CreateDepartmentInput): Promise<ApiResponse<Department>> {
  await delay(API_DELAY_MS);
  const dept: Department = {
    id: generateId(), name: input.name, code: input.code, hodId: input.hodId,
    facultyCount: 0, studentCount: 0, courseCount: 0, createdAt: new Date().toISOString(), isActive: true,
  };
  mockDepartments.push(dept);
  return { data: dept, success: true };
}

export async function updateDepartment(input: UpdateDepartmentInput): Promise<ApiResponse<Department>> {
  await delay(API_DELAY_MS);
  const idx = mockDepartments.findIndex(d => d.id === input.id);
  if (idx === -1) return { data: null as unknown as Department, success: false, error: 'Department not found' };
  mockDepartments[idx] = { ...mockDepartments[idx], ...input };
  return { data: mockDepartments[idx], success: true };
}

export async function deleteDepartment(id: string): Promise<ApiResponse<void>> {
  await delay(API_DELAY_MS);
  const idx = mockDepartments.findIndex(d => d.id === id);
  if (idx === -1) return { data: undefined as unknown as void, success: false, error: 'Department not found' };
  mockDepartments.splice(idx, 1);
  return { data: undefined as unknown as void, success: true };
}

// ============================================================
// Faculty API
// ============================================================

export async function getFacultyList(departmentId?: string): Promise<Faculty[]> {
  await delay(API_DELAY_MS);
  let list = [...mockFaculty];
  if (departmentId) list = list.filter(f => f.departmentId === departmentId);
  return list;
}

export async function getFacultyById(id: string): Promise<Faculty | undefined> {
  await delay(API_DELAY_MS);
  return mockFaculty.find(f => f.id === id);
}

export async function createFaculty(input: CreateFacultyInput): Promise<ApiResponse<Faculty>> {
  await delay(API_DELAY_MS);
  const faculty: Faculty = {
    id: generateId(), userId: generateId(), ...input,
    departmentName: mockDepartments.find(d => d.id === input.departmentId)?.name || '',
    isActive: true, courseIds: [], counselingStudentIds: [],
  };
  mockFaculty.push(faculty);
  return { data: faculty, success: true };
}

export async function bulkUploadFaculty(_file: unknown): Promise<ApiResponse<BulkUploadResult>> {
  await delay(1500);
  return {
    data: {
      totalRows: 5, validRows: 4, invalidRows: 1,
      columns: ['Name', 'Email', 'Phone', 'Designation', 'Specialization', 'Joining Date'],
      rows: [
        { rowNumber: 1, data: { Name: 'Dr. Anand Kumar', Email: 'anand@eduverse.edu', Phone: '9876543230', Designation: 'Associate Professor', Specialization: 'AI', 'Joining Date': '2024-01-01' }, errors: [], isValid: true },
        { rowNumber: 2, data: { Name: 'Prof. Sarah Khan', Email: 'sarah@eduverse.edu', Phone: '9876543231', Designation: 'Assistant Professor', Specialization: 'Networks', 'Joining Date': '2024-02-15' }, errors: [], isValid: true },
        { rowNumber: 3, data: { Name: 'Dr. Ramesh B', Email: 'ramesh@eduverse.edu', Phone: '9876543232', Designation: 'Professor', Specialization: 'Security', 'Joining Date': '2023-08-01' }, errors: [], isValid: true },
        { rowNumber: 4, data: { Name: '', Email: 'invalid', Phone: '123', Designation: '', Specialization: '', 'Joining Date': '' }, errors: [{ field: 'Name', message: 'Name is required' }, { field: 'Email', message: 'Invalid email format' }], isValid: false },
        { rowNumber: 5, data: { Name: 'Prof. Lisa Ray', Email: 'lisa@eduverse.edu', Phone: '9876543234', Designation: 'Assistant Professor', Specialization: 'Cloud Computing', 'Joining Date': '2024-03-01' }, errors: [], isValid: true },
      ],
    },
    success: true,
  };
}

// ============================================================
// Student API
// ============================================================

export async function getStudents(departmentId?: string, batch?: string, section?: string): Promise<Student[]> {
  await delay(API_DELAY_MS);
  let list = [...mockStudents];
  if (departmentId) list = list.filter(s => s.departmentId === departmentId);
  if (batch) list = list.filter(s => s.batch === batch);
  if (section) list = list.filter(s => s.section === section);
  return list;
}

export async function getStudentById(id: string): Promise<Student | undefined> {
  await delay(API_DELAY_MS);
  return mockStudents.find(s => s.id === id);
}

export async function createStudent(input: CreateStudentInput): Promise<ApiResponse<Student>> {
  await delay(API_DELAY_MS);
  const student: Student = {
    id: generateId(), userId: generateId(), ...input,
    departmentName: mockDepartments.find(d => d.id === input.departmentId)?.name || '',
    isActive: true,
  };
  mockStudents.push(student);
  return { data: student, success: true };
}

export async function bulkUploadStudents(_file: unknown): Promise<ApiResponse<BulkUploadResult>> {
  await delay(1500);
  return {
    data: {
      totalRows: 4, validRows: 3, invalidRows: 1,
      columns: ['Name', 'Email', 'Phone', 'Roll Number', 'Batch', 'Semester', 'Section'],
      rows: [
        { rowNumber: 1, data: { Name: 'Rahul Das', Email: 'rahul@eduverse.edu', Phone: '9876543240', 'Roll Number': 'CSE2024009', Batch: '2024', Semester: '3', Section: 'A' }, errors: [], isValid: true },
        { rowNumber: 2, data: { Name: 'Neha Sharma', Email: 'neha@eduverse.edu', Phone: '9876543241', 'Roll Number': 'CSE2024010', Batch: '2024', Semester: '3', Section: 'A' }, errors: [], isValid: true },
        { rowNumber: 3, data: { Name: '', Email: '', Phone: '', 'Roll Number': '', Batch: '', Semester: '', Section: '' }, errors: [{ field: 'Name', message: 'Name is required' }, { field: 'Email', message: 'Email is required' }], isValid: false },
        { rowNumber: 4, data: { Name: 'Pooja Patel', Email: 'pooja@eduverse.edu', Phone: '9876543243', 'Roll Number': 'CSE2024012', Batch: '2024', Semester: '3', Section: 'B' }, errors: [], isValid: true },
      ],
    },
    success: true,
  };
}

// ============================================================
// Course API
// ============================================================

export async function getCourses(departmentId?: string): Promise<Course[]> {
  await delay(API_DELAY_MS);
  let list = [...mockCourses];
  if (departmentId) list = list.filter(c => c.departmentId === departmentId);
  return list;
}

export async function getCourseAllocations(departmentId?: string): Promise<CourseAllocation[]> {
  await delay(API_DELAY_MS);
  return [...mockCourseAllocations];
}

// ============================================================
// Timetable API
// ============================================================

export async function getTimetable(batch?: string, section?: string): Promise<WeeklyTimetable> {
  await delay(API_DELAY_MS);
  return { batch: batch || '2024', section: section || 'A', semester: 3, slots: [...mockTimetableSlots] };
}

export async function getFacultyTimetable(facultyId: string): Promise<TimetableSlot[]> {
  await delay(API_DELAY_MS);
  return mockTimetableSlots.filter(s => s.facultyId === facultyId);
}

export async function updateTimetableSlot(slotId: string, updates: Partial<TimetableSlot>): Promise<ApiResponse<TimetableSlot>> {
  await delay(API_DELAY_MS);
  const idx = mockTimetableSlots.findIndex(s => s.id === slotId);
  if (idx === -1) return { data: null as unknown as TimetableSlot, success: false, error: 'Slot not found' };
  mockTimetableSlots[idx] = { ...mockTimetableSlots[idx], ...updates };
  return { data: mockTimetableSlots[idx], success: true };
}

// ============================================================
// Attendance API
// ============================================================

export async function getAttendanceSessions(courseId?: string, facultyId?: string): Promise<AttendanceSession[]> {
  await delay(API_DELAY_MS);
  let list = [...mockAttendanceSessions];
  if (courseId) list = list.filter(s => s.courseId === courseId);
  if (facultyId) list = list.filter(s => s.facultyId === facultyId);
  return list;
}

export async function markAttendance(sessionId: string, records: { studentId: string; status: AttendanceStatus }[]): Promise<ApiResponse<AttendanceSession>> {
  await delay(API_DELAY_MS);
  const session = mockAttendanceSessions.find(s => s.id === sessionId);
  if (!session) return { data: null as unknown as AttendanceSession, success: false, error: 'Session not found' };
  records.forEach(r => {
    const rec = session.records.find(ar => ar.studentId === r.studentId);
    if (rec) rec.status = r.status;
  });
  session.presentCount = session.records.filter(r => r.status === 'present').length;
  session.absentCount = session.records.filter(r => r.status === 'absent').length;
  session.lateCount = session.records.filter(r => r.status === 'late').length;
  return { data: session, success: true };
}

export async function getStudentAttendance(studentId: string): Promise<StudentAttendanceSummary[]> {
  await delay(API_DELAY_MS);
  return mockCourses.slice(0, 5).map(c => {
    const total = Math.floor(Math.random() * 20) + 30;
    const present = Math.floor(total * (0.6 + Math.random() * 0.35));
    const late = Math.floor(Math.random() * 5);
    const absent = total - present - late;
    const pct = Math.round((present / total) * 100);
    return {
      courseId: c.id, courseName: c.name, courseCode: c.code,
      totalClasses: total, present, absent, late, percentage: pct,
      status: pct >= 75 ? 'safe' as const : pct >= 65 ? 'warning' as const : 'critical' as const,
    };
  });
}

// ============================================================
// Resources API
// ============================================================

export async function getResources(courseId?: string): Promise<LearningResource[]> {
  await delay(API_DELAY_MS);
  let list = [...mockResources];
  if (courseId) list = list.filter(r => r.courseId === courseId);
  return list;
}

export async function uploadResource(data: Partial<LearningResource>): Promise<ApiResponse<LearningResource>> {
  await delay(1500);
  const resource: LearningResource = {
    id: generateId(), title: data.title || 'Untitled', description: data.description,
    courseId: data.courseId || '', courseName: data.courseName || '',
    type: data.type || 'document', fileName: data.fileName, fileSize: data.fileSize,
    uploadedBy: currentUser?.id || '', uploadedByName: currentUser?.name || '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  };
  mockResources.push(resource);
  return { data: resource, success: true };
}

export async function deleteResource(id: string): Promise<ApiResponse<void>> {
  await delay(API_DELAY_MS);
  const idx = mockResources.findIndex(r => r.id === id);
  if (idx !== -1) mockResources.splice(idx, 1);
  return { data: undefined as unknown as void, success: true };
}

// ============================================================
// Assignment API
// ============================================================

export async function getAssignments(courseId?: string, facultyId?: string): Promise<Assignment[]> {
  await delay(API_DELAY_MS);
  let list = [...mockAssignments];
  if (courseId) list = list.filter(a => a.courseId === courseId);
  if (facultyId) list = list.filter(a => a.facultyId === facultyId);
  return list;
}

export async function getAssignment(id: string): Promise<Assignment | undefined> {
  await delay(API_DELAY_MS);
  return mockAssignments.find(a => a.id === id);
}

export async function createAssignment(data: Partial<Assignment>): Promise<ApiResponse<Assignment>> {
  await delay(API_DELAY_MS);
  const assignment: Assignment = {
    id: generateId(), title: data.title || '', description: data.description || '',
    courseId: data.courseId || '', courseName: data.courseName || '', courseCode: data.courseCode || '',
    facultyId: currentUser?.id || '', facultyName: currentUser?.name || '',
    deadline: data.deadline || '', maxMarks: data.maxMarks || 100,
    createdAt: new Date().toISOString(), totalSubmissions: 0, evaluatedCount: 0,
    batch: data.batch || '', section: data.section || '',
  };
  mockAssignments.push(assignment);
  return { data: assignment, success: true };
}

export async function getSubmissions(assignmentId: string): Promise<Submission[]> {
  await delay(API_DELAY_MS);
  return mockSubmissions.filter(s => s.assignmentId === assignmentId);
}

export async function submitAssignment(assignmentId: string, _file: unknown): Promise<ApiResponse<Submission>> {
  await delay(1000);
  const sub: Submission = {
    id: generateId(), assignmentId, studentId: currentUser?.id || '',
    studentName: currentUser?.name || '', rollNumber: 'CSE2024001',
    submittedAt: new Date().toISOString(), status: 'submitted',
  };
  mockSubmissions.push(sub);
  return { data: sub, success: true };
}

export async function evaluateSubmission(evaluation: Evaluation): Promise<ApiResponse<Submission>> {
  await delay(API_DELAY_MS);
  const sub = mockSubmissions.find(s => s.id === evaluation.submissionId);
  if (!sub) return { data: null as unknown as Submission, success: false, error: 'Submission not found' };
  sub.marks = evaluation.marks;
  sub.feedback = evaluation.feedback;
  sub.status = 'evaluated';
  sub.evaluatedAt = new Date().toISOString();
  sub.evaluatedBy = currentUser?.id;
  return { data: sub, success: true };
}

// ============================================================
// Quiz API
// ============================================================

export async function getQuizzes(courseId?: string, facultyId?: string): Promise<Quiz[]> {
  await delay(API_DELAY_MS);
  let list = [...mockQuizzes];
  if (courseId) list = list.filter(q => q.courseId === courseId);
  if (facultyId) list = list.filter(q => q.facultyId === facultyId);
  return list;
}

export async function getQuiz(id: string): Promise<Quiz | undefined> {
  await delay(API_DELAY_MS);
  return mockQuizzes.find(q => q.id === id);
}

export async function createQuiz(data: Partial<Quiz>): Promise<ApiResponse<Quiz>> {
  await delay(API_DELAY_MS);
  const quiz: Quiz = {
    id: generateId(), title: data.title || '', courseId: data.courseId || '',
    courseName: data.courseName || '', courseCode: data.courseCode || '',
    facultyId: currentUser?.id || '', facultyName: currentUser?.name || '',
    duration: data.duration || 30, startTime: data.startTime || '', endTime: data.endTime || '',
    questions: data.questions || [], totalPoints: data.questions?.reduce((a, q) => a + q.points, 0) || 0,
    batch: data.batch || '', section: data.section || '', isPublished: false, attemptsCount: 0,
  };
  mockQuizzes.push(quiz);
  return { data: quiz, success: true };
}

export async function attemptQuiz(quizId: string, answers: Record<string, string>): Promise<ApiResponse<QuizResult>> {
  await delay(API_DELAY_MS);
  const quiz = mockQuizzes.find(q => q.id === quizId);
  if (!quiz) return { data: null as unknown as QuizResult, success: false, error: 'Quiz not found' };

  let score = 0;
  const results = quiz.questions.map(q => {
    const isCorrect = answers[q.id]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
    const earned = isCorrect ? q.points : 0;
    score += earned;
    return { questionId: q.id, questionText: q.text, studentAnswer: answers[q.id] || '', correctAnswer: q.correctAnswer, isCorrect, points: q.points, earnedPoints: earned };
  });

  return {
    data: {
      attemptId: generateId(), quizId, quizTitle: quiz.title,
      studentId: currentUser?.id || '', score, totalPoints: quiz.totalPoints,
      percentage: Math.round((score / quiz.totalPoints) * 100), answers: results,
    },
    success: true,
  };
}

// ============================================================
// Coding Exam API
// ============================================================

export async function getCodingExams(courseId?: string): Promise<CodingExam[]> {
  await delay(API_DELAY_MS);
  let list = [...mockCodingExams];
  if (courseId) list = list.filter(e => e.courseId === courseId);
  return list;
}

export async function getCodingExam(id: string): Promise<CodingExam | undefined> {
  await delay(API_DELAY_MS);
  return mockCodingExams.find(e => e.id === id);
}

export async function createCodingExam(data: Partial<CodingExam>): Promise<ApiResponse<CodingExam>> {
  await delay(API_DELAY_MS);
  const exam: CodingExam = {
    id: generateId(), title: data.title || '', courseId: data.courseId || '',
    courseName: data.courseName || '', courseCode: data.courseCode || '',
    facultyId: currentUser?.id || '', facultyName: currentUser?.name || '',
    duration: data.duration || 120, startTime: data.startTime || '', endTime: data.endTime || '',
    problems: data.problems || [], totalPoints: data.problems?.reduce((a, p) => a + p.maxPoints, 0) || 0,
    batch: data.batch || '', section: data.section || '', isPublished: false,
    allowedLanguages: data.allowedLanguages || ['python', 'java', 'cpp'],
  };
  mockCodingExams.push(exam);
  return { data: exam, success: true };
}

export async function runCode(code: string, language: ProgrammingLanguage, input: string): Promise<ApiResponse<ExecutionResult>> {
  await delay(1500);
  // Simulate code execution
  return {
    data: {
      output: '0 1\n', error: undefined, exitCode: 0,
      executionTime: Math.random() * 0.5 + 0.1, memoryUsed: Math.random() * 10 + 5,
    },
    success: true,
  };
}

export async function submitCode(problemId: string, examId: string, code: string, language: ProgrammingLanguage): Promise<ApiResponse<CodeSubmission>> {
  await delay(2000);
  const exam = mockCodingExams.find(e => e.id === examId);
  const problem = exam?.problems.find(p => p.id === problemId);
  if (!problem) return { data: null as unknown as CodeSubmission, success: false, error: 'Problem not found' };

  const results = [...problem.sampleTestCases, ...problem.hiddenTestCases].map(tc => ({
    testCaseId: tc.id, passed: Math.random() > 0.3,
    verdict: (Math.random() > 0.3 ? 'accepted' : 'wrong_answer') as 'accepted' | 'wrong_answer',
    actualOutput: tc.expectedOutput, expectedOutput: tc.expectedOutput,
    executionTime: Math.random() * 0.5, memoryUsed: Math.random() * 10, isHidden: tc.isHidden,
  }));

  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  const score = Math.round((passed / total) * problem.maxPoints);

  return {
    data: {
      id: generateId(), problemId, examId, studentId: currentUser?.id || '',
      studentName: currentUser?.name || '', language, code, submittedAt: new Date().toISOString(),
      verdict: passed === total ? 'accepted' : 'wrong_answer', score, maxScore: problem.maxPoints,
      executionTime: Math.random() * 0.5, memoryUsed: Math.random() * 10, testCaseResults: results,
    },
    success: true,
  };
}

// ============================================================
// Marks API
// ============================================================

export async function getInternalMarks(courseId: string): Promise<InternalMark[]> {
  await delay(API_DELAY_MS);
  return [...mockInternalMarks];
}

export async function updateMarks(studentId: string, courseId: string, marks: number): Promise<ApiResponse<void>> {
  await delay(API_DELAY_MS);
  return { data: undefined as unknown as void, success: true };
}

export async function publishMarks(courseId: string, isPublished: boolean): Promise<ApiResponse<void>> {
  await delay(API_DELAY_MS);
  return { data: undefined as unknown as void, success: true };
}

// ============================================================
// Performance API
// ============================================================

export async function getStudentPerformance(studentId: string): Promise<PerformanceMetrics> {
  await delay(API_DELAY_MS);
  return { ...mockPerformanceData, studentId };
}

export async function getClassPerformance(batch: string, section: string): Promise<ClassPerformance> {
  await delay(API_DELAY_MS);
  return {
    batch, section, averageAttendance: 78, averageMarks: 72,
    topPerformers: [
      { studentId: 'stu-1', studentName: 'Arun Krishnan', percentage: 90 },
      { studentId: 'stu-2', studentName: 'Divya Lakshmi', percentage: 88 },
      { studentId: 'stu-8', studentName: 'Anjali Desai', percentage: 85 },
    ],
    lowPerformers: [
      { studentId: 'stu-5', studentName: 'Mohammed Irfan', percentage: 45, flagged: true },
      { studentId: 'stu-7', studentName: 'Karthik Menon', percentage: 52, flagged: true },
    ],
    subjectDistribution: mockCourses.map(c => ({
      courseId: c.id, courseName: c.name,
      averageMarks: Math.floor(Math.random() * 30) + 55,
      passPercentage: Math.floor(Math.random() * 20) + 70,
    })),
  };
}

// ============================================================
// Counseling API
// ============================================================

export async function getCounselingSessions(facultyId?: string, studentId?: string): Promise<CounselingSession[]> {
  await delay(API_DELAY_MS);
  let list = [...mockCounselingSessions];
  if (facultyId) list = list.filter(s => s.counselorId === facultyId);
  if (studentId) list = list.filter(s => s.studentId === studentId);
  return list;
}

export async function getChatMessages(userId1: string, userId2: string): Promise<ChatMessage[]> {
  await delay(API_DELAY_MS);
  return mockChatMessages.filter(m =>
    (m.senderId === userId1 && m.receiverId === userId2) ||
    (m.senderId === userId2 && m.receiverId === userId1)
  );
}

export async function sendMessage(receiverId: string, content: string): Promise<ApiResponse<ChatMessage>> {
  await delay(300);
  const msg: ChatMessage = {
    id: generateId(), senderId: currentUser?.id || '', senderName: currentUser?.name || '',
    senderRole: currentUser?.role || 'student', receiverId, content,
    timestamp: new Date().toISOString(), isRead: false, type: 'text',
  };
  mockChatMessages.push(msg);
  return { data: msg, success: true };
}

export async function createSessionNote(data: Partial<SessionNote>): Promise<ApiResponse<SessionNote>> {
  await delay(API_DELAY_MS);
  const note: SessionNote = {
    id: generateId(), sessionId: data.sessionId || '',
    date: data.date || '', topic: data.topic || '', concern: data.concern || '',
    observation: data.observation || '', followUp: data.followUp,
    createdBy: currentUser?.id || '', createdAt: new Date().toISOString(),
  };
  return { data: note, success: true };
}

// ============================================================
// Announcements API
// ============================================================

export async function getAnnouncements(scope?: string): Promise<Announcement[]> {
  await delay(API_DELAY_MS);
  let list = [...mockAnnouncements];
  if (scope) list = list.filter(a => a.scope === scope);
  return list;
}

export async function createAnnouncement(data: Partial<Announcement>): Promise<ApiResponse<Announcement>> {
  await delay(API_DELAY_MS);
  const announcement: Announcement = {
    id: generateId(), title: data.title || '', content: data.content || '',
    authorId: currentUser?.id || '', authorName: currentUser?.name || '',
    authorRole: currentUser?.role || 'admin', scope: data.scope || 'institution',
    target: data.target || { scope: 'institution' },
    priority: data.priority || 'normal',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isActive: true,
  };
  mockAnnouncements.push(announcement);
  return { data: announcement, success: true };
}

export async function deleteAnnouncement(id: string): Promise<ApiResponse<void>> {
  await delay(API_DELAY_MS);
  const idx = mockAnnouncements.findIndex(a => a.id === id);
  if (idx !== -1) mockAnnouncements.splice(idx, 1);
  return { data: undefined as unknown as void, success: true };
}

// ============================================================
// Notifications API
// ============================================================

export async function getNotifications(userId?: string): Promise<Notification[]> {
  await delay(API_DELAY_MS);
  if (userId) return mockNotifications.filter(n => n.userId === userId);
  return [...mockNotifications];
}

export async function markNotificationAsRead(id: string): Promise<ApiResponse<void>> {
  await delay(200);
  const notif = mockNotifications.find(n => n.id === id);
  if (notif) notif.isRead = true;
  return { data: undefined as unknown as void, success: true };
}

export async function getUnreadCount(userId: string): Promise<number> {
  await delay(100);
  return mockNotifications.filter(n => n.userId === userId && !n.isRead).length;
}

// ============================================================
// Users API (Admin)
// ============================================================

export async function getAllUsers(): Promise<User[]> {
  await delay(API_DELAY_MS);
  return [...mockUsers];
}
