import type {
  User, Department, Faculty, Student, Course, CourseAllocation,
  TimetableSlot, AttendanceSession, AttendanceRecord, LearningResource,
  Assignment, Submission, Quiz, QuizQuestion, QuizAttempt,
  CodingExam, CodingProblem, TestCase, CodeSubmission,
  InternalMark, MarksEntry, PerformanceMetrics,
  CounselingSession, ChatMessage, SessionNote,
  Announcement, Notification,
} from '@eduverse/types';

// ============================================================
// Mock Users
// ============================================================

export const mockUsers: User[] = [
  { id: 'usr-admin-1', email: 'admin@eduverse.edu', name: 'Dr. Rajesh Kumar', role: 'admin', departmentId: undefined, phone: '9876543210', createdAt: '2024-01-01T00:00:00Z', isActive: true, avatar: undefined },
  { id: 'usr-hod-1', email: 'hod.cs@eduverse.edu', name: 'Dr. Priya Sharma', role: 'hod', departmentId: 'dept-1', departmentName: 'Computer Science', phone: '9876543211', createdAt: '2024-01-15T00:00:00Z', isActive: true },
  { id: 'usr-hod-2', email: 'hod.ece@eduverse.edu', name: 'Dr. Amit Patel', role: 'hod', departmentId: 'dept-2', departmentName: 'Electronics & Communication', phone: '9876543212', createdAt: '2024-01-15T00:00:00Z', isActive: true },
  { id: 'usr-fac-1', email: 'faculty1@eduverse.edu', name: 'Prof. Sunita Verma', role: 'faculty', departmentId: 'dept-1', departmentName: 'Computer Science', phone: '9876543213', createdAt: '2024-02-01T00:00:00Z', isActive: true },
  { id: 'usr-fac-2', email: 'faculty2@eduverse.edu', name: 'Prof. Vikram Singh', role: 'faculty', departmentId: 'dept-1', departmentName: 'Computer Science', phone: '9876543214', createdAt: '2024-02-01T00:00:00Z', isActive: true },
  { id: 'usr-fac-3', email: 'faculty3@eduverse.edu', name: 'Prof. Meera Nair', role: 'faculty', departmentId: 'dept-1', departmentName: 'Computer Science', phone: '9876543215', createdAt: '2024-02-15T00:00:00Z', isActive: true },
  { id: 'usr-fac-4', email: 'faculty4@eduverse.edu', name: 'Prof. Arjun Reddy', role: 'faculty', departmentId: 'dept-2', departmentName: 'Electronics & Communication', phone: '9876543216', createdAt: '2024-02-15T00:00:00Z', isActive: true },
  { id: 'usr-stu-1', email: 'student1@eduverse.edu', name: 'Arun Krishnan', role: 'student', departmentId: 'dept-1', departmentName: 'Computer Science', phone: '9876543220', createdAt: '2024-06-01T00:00:00Z', isActive: true },
  { id: 'usr-stu-2', email: 'student2@eduverse.edu', name: 'Divya Lakshmi', role: 'student', departmentId: 'dept-1', departmentName: 'Computer Science', phone: '9876543221', createdAt: '2024-06-01T00:00:00Z', isActive: true },
  { id: 'usr-stu-3', email: 'student3@eduverse.edu', name: 'Ravi Teja', role: 'student', departmentId: 'dept-1', departmentName: 'Computer Science', phone: '9876543222', createdAt: '2024-06-01T00:00:00Z', isActive: true },
  { id: 'usr-stu-4', email: 'student4@eduverse.edu', name: 'Sneha Gupta', role: 'student', departmentId: 'dept-1', departmentName: 'Computer Science', phone: '9876543223', createdAt: '2024-06-01T00:00:00Z', isActive: true },
  { id: 'usr-stu-5', email: 'student5@eduverse.edu', name: 'Mohammed Irfan', role: 'student', departmentId: 'dept-1', departmentName: 'Computer Science', phone: '9876543224', createdAt: '2024-06-01T00:00:00Z', isActive: true },
  { id: 'usr-stu-6', email: 'student6@eduverse.edu', name: 'Preethi Raj', role: 'student', departmentId: 'dept-1', departmentName: 'Computer Science', phone: '9876543225', createdAt: '2024-06-01T00:00:00Z', isActive: true },
  { id: 'usr-stu-7', email: 'student7@eduverse.edu', name: 'Karthik Menon', role: 'student', departmentId: 'dept-1', departmentName: 'Computer Science', phone: '9876543226', createdAt: '2024-06-01T00:00:00Z', isActive: true },
  { id: 'usr-stu-8', email: 'student8@eduverse.edu', name: 'Anjali Desai', role: 'student', departmentId: 'dept-1', departmentName: 'Computer Science', phone: '9876543227', createdAt: '2024-06-01T00:00:00Z', isActive: true },
];

// ============================================================
// Mock Departments
// ============================================================

export const mockDepartments: Department[] = [
  { id: 'dept-1', name: 'Computer Science', code: 'CSE', hodId: 'usr-hod-1', hodName: 'Dr. Priya Sharma', facultyCount: 3, studentCount: 8, courseCount: 6, createdAt: '2024-01-01T00:00:00Z', isActive: true },
  { id: 'dept-2', name: 'Electronics & Communication', code: 'ECE', hodId: 'usr-hod-2', hodName: 'Dr. Amit Patel', facultyCount: 1, studentCount: 0, courseCount: 4, createdAt: '2024-01-01T00:00:00Z', isActive: true },
  { id: 'dept-3', name: 'Mechanical Engineering', code: 'ME', hodId: undefined, hodName: undefined, facultyCount: 0, studentCount: 0, courseCount: 3, createdAt: '2024-01-01T00:00:00Z', isActive: true },
  { id: 'dept-4', name: 'Civil Engineering', code: 'CE', hodId: undefined, hodName: undefined, facultyCount: 0, studentCount: 0, courseCount: 2, createdAt: '2024-01-01T00:00:00Z', isActive: true },
];

// ============================================================
// Mock Faculty
// ============================================================

export const mockFaculty: Faculty[] = [
  { id: 'fac-1', userId: 'usr-fac-1', name: 'Prof. Sunita Verma', email: 'faculty1@eduverse.edu', phone: '9876543213', departmentId: 'dept-1', departmentName: 'Computer Science', designation: 'Associate Professor', specialization: 'Data Structures & Algorithms', joiningDate: '2020-06-01', isActive: true, courseIds: ['course-1', 'course-2'], counselingStudentIds: ['usr-stu-1', 'usr-stu-2', 'usr-stu-3'] },
  { id: 'fac-2', userId: 'usr-fac-2', name: 'Prof. Vikram Singh', email: 'faculty2@eduverse.edu', phone: '9876543214', departmentId: 'dept-1', departmentName: 'Computer Science', designation: 'Assistant Professor', specialization: 'Machine Learning', joiningDate: '2021-01-15', isActive: true, courseIds: ['course-3', 'course-4'], counselingStudentIds: ['usr-stu-4', 'usr-stu-5'] },
  { id: 'fac-3', userId: 'usr-fac-3', name: 'Prof. Meera Nair', email: 'faculty3@eduverse.edu', phone: '9876543215', departmentId: 'dept-1', departmentName: 'Computer Science', designation: 'Professor', specialization: 'Database Systems', joiningDate: '2018-08-01', isActive: true, courseIds: ['course-5', 'course-6'], counselingStudentIds: ['usr-stu-6', 'usr-stu-7', 'usr-stu-8'] },
  { id: 'fac-4', userId: 'usr-fac-4', name: 'Prof. Arjun Reddy', email: 'faculty4@eduverse.edu', phone: '9876543216', departmentId: 'dept-2', departmentName: 'Electronics & Communication', designation: 'Associate Professor', specialization: 'VLSI Design', joiningDate: '2019-07-01', isActive: true, courseIds: [], counselingStudentIds: [] },
];

// ============================================================
// Mock Students
// ============================================================

export const mockStudents: Student[] = [
  { id: 'stu-1', userId: 'usr-stu-1', name: 'Arun Krishnan', email: 'student1@eduverse.edu', phone: '9876543220', rollNumber: 'CSE2024001', departmentId: 'dept-1', departmentName: 'Computer Science', batch: '2024', semester: 3, section: 'A', isActive: true, counselorId: 'fac-1', counselorName: 'Prof. Sunita Verma' },
  { id: 'stu-2', userId: 'usr-stu-2', name: 'Divya Lakshmi', email: 'student2@eduverse.edu', phone: '9876543221', rollNumber: 'CSE2024002', departmentId: 'dept-1', departmentName: 'Computer Science', batch: '2024', semester: 3, section: 'A', isActive: true, counselorId: 'fac-1', counselorName: 'Prof. Sunita Verma' },
  { id: 'stu-3', userId: 'usr-stu-3', name: 'Ravi Teja', email: 'student3@eduverse.edu', phone: '9876543222', rollNumber: 'CSE2024003', departmentId: 'dept-1', departmentName: 'Computer Science', batch: '2024', semester: 3, section: 'A', isActive: true, counselorId: 'fac-1', counselorName: 'Prof. Sunita Verma' },
  { id: 'stu-4', userId: 'usr-stu-4', name: 'Sneha Gupta', email: 'student4@eduverse.edu', phone: '9876543223', rollNumber: 'CSE2024004', departmentId: 'dept-1', departmentName: 'Computer Science', batch: '2024', semester: 3, section: 'A', isActive: true, counselorId: 'fac-2', counselorName: 'Prof. Vikram Singh' },
  { id: 'stu-5', userId: 'usr-stu-5', name: 'Mohammed Irfan', email: 'student5@eduverse.edu', phone: '9876543224', rollNumber: 'CSE2024005', departmentId: 'dept-1', departmentName: 'Computer Science', batch: '2024', semester: 3, section: 'B', isActive: true, counselorId: 'fac-2', counselorName: 'Prof. Vikram Singh' },
  { id: 'stu-6', userId: 'usr-stu-6', name: 'Preethi Raj', email: 'student6@eduverse.edu', phone: '9876543225', rollNumber: 'CSE2024006', departmentId: 'dept-1', departmentName: 'Computer Science', batch: '2024', semester: 3, section: 'B', isActive: true, counselorId: 'fac-3', counselorName: 'Prof. Meera Nair' },
  { id: 'stu-7', userId: 'usr-stu-7', name: 'Karthik Menon', email: 'student7@eduverse.edu', phone: '9876543226', rollNumber: 'CSE2024007', departmentId: 'dept-1', departmentName: 'Computer Science', batch: '2024', semester: 3, section: 'B', isActive: true, counselorId: 'fac-3', counselorName: 'Prof. Meera Nair' },
  { id: 'stu-8', userId: 'usr-stu-8', name: 'Anjali Desai', email: 'student8@eduverse.edu', phone: '9876543227', rollNumber: 'CSE2024008', departmentId: 'dept-1', departmentName: 'Computer Science', batch: '2024', semester: 3, section: 'B', isActive: true, counselorId: 'fac-3', counselorName: 'Prof. Meera Nair' },
];

// ============================================================
// Mock Courses
// ============================================================

export const mockCourses: Course[] = [
  { id: 'course-1', name: 'Data Structures', code: 'CS301', departmentId: 'dept-1', departmentName: 'Computer Science', semester: 3, credits: 4, description: 'Fundamental data structures and algorithms', isActive: true },
  { id: 'course-2', name: 'Object Oriented Programming', code: 'CS302', departmentId: 'dept-1', departmentName: 'Computer Science', semester: 3, credits: 3, description: 'OOP concepts with Java', isActive: true },
  { id: 'course-3', name: 'Machine Learning', code: 'CS303', departmentId: 'dept-1', departmentName: 'Computer Science', semester: 3, credits: 4, description: 'Introduction to ML algorithms', isActive: true },
  { id: 'course-4', name: 'Computer Networks', code: 'CS304', departmentId: 'dept-1', departmentName: 'Computer Science', semester: 3, credits: 3, description: 'Networking fundamentals', isActive: true },
  { id: 'course-5', name: 'Database Management Systems', code: 'CS305', departmentId: 'dept-1', departmentName: 'Computer Science', semester: 3, credits: 4, description: 'RDBMS and SQL', isActive: true },
  { id: 'course-6', name: 'Operating Systems', code: 'CS306', departmentId: 'dept-1', departmentName: 'Computer Science', semester: 3, credits: 3, description: 'OS concepts and design', isActive: true },
];

export const mockCourseAllocations: CourseAllocation[] = [
  { id: 'alloc-1', courseId: 'course-1', courseName: 'Data Structures', courseCode: 'CS301', facultyId: 'fac-1', facultyName: 'Prof. Sunita Verma', batch: '2024', section: 'A', semester: 3, academicYear: '2024-25' },
  { id: 'alloc-2', courseId: 'course-2', courseName: 'Object Oriented Programming', courseCode: 'CS302', facultyId: 'fac-1', facultyName: 'Prof. Sunita Verma', batch: '2024', section: 'A', semester: 3, academicYear: '2024-25' },
  { id: 'alloc-3', courseId: 'course-3', courseName: 'Machine Learning', courseCode: 'CS303', facultyId: 'fac-2', facultyName: 'Prof. Vikram Singh', batch: '2024', section: 'A', semester: 3, academicYear: '2024-25' },
  { id: 'alloc-4', courseId: 'course-4', courseName: 'Computer Networks', courseCode: 'CS304', facultyId: 'fac-2', facultyName: 'Prof. Vikram Singh', batch: '2024', section: 'B', semester: 3, academicYear: '2024-25' },
  { id: 'alloc-5', courseId: 'course-5', courseName: 'Database Management Systems', courseCode: 'CS305', facultyId: 'fac-3', facultyName: 'Prof. Meera Nair', batch: '2024', section: 'A', semester: 3, academicYear: '2024-25' },
  { id: 'alloc-6', courseId: 'course-6', courseName: 'Operating Systems', courseCode: 'CS306', facultyId: 'fac-3', facultyName: 'Prof. Meera Nair', batch: '2024', section: 'B', semester: 3, academicYear: '2024-25' },
];

// ============================================================
// Mock Timetable
// ============================================================

export const mockTimetableSlots: TimetableSlot[] = [
  { id: 'tt-1', day: 'monday', period: 1, startTime: '09:00', endTime: '09:50', courseId: 'course-1', courseName: 'Data Structures', courseCode: 'CS301', facultyId: 'fac-1', facultyName: 'Prof. Sunita Verma', room: 'CS-101', type: 'lecture' },
  { id: 'tt-2', day: 'monday', period: 2, startTime: '09:50', endTime: '10:40', courseId: 'course-3', courseName: 'Machine Learning', courseCode: 'CS303', facultyId: 'fac-2', facultyName: 'Prof. Vikram Singh', room: 'CS-102', type: 'lecture' },
  { id: 'tt-3', day: 'monday', period: 3, startTime: '10:50', endTime: '11:40', courseId: 'course-5', courseName: 'Database Management Systems', courseCode: 'CS305', facultyId: 'fac-3', facultyName: 'Prof. Meera Nair', room: 'CS-103', type: 'lecture' },
  { id: 'tt-4', day: 'monday', period: 4, startTime: '11:40', endTime: '12:30', courseId: undefined, courseName: undefined, courseCode: undefined, facultyId: undefined, facultyName: undefined, room: undefined, type: 'break' },
  { id: 'tt-5', day: 'monday', period: 5, startTime: '13:30', endTime: '14:20', courseId: 'course-2', courseName: 'Object Oriented Programming', courseCode: 'CS302', facultyId: 'fac-1', facultyName: 'Prof. Sunita Verma', room: 'Lab-1', type: 'lab' },
  { id: 'tt-6', day: 'monday', period: 6, startTime: '14:20', endTime: '15:10', courseId: 'course-2', courseName: 'Object Oriented Programming', courseCode: 'CS302', facultyId: 'fac-1', facultyName: 'Prof. Sunita Verma', room: 'Lab-1', type: 'lab' },
  { id: 'tt-7', day: 'tuesday', period: 1, startTime: '09:00', endTime: '09:50', courseId: 'course-3', courseName: 'Machine Learning', courseCode: 'CS303', facultyId: 'fac-2', facultyName: 'Prof. Vikram Singh', room: 'CS-102', type: 'lecture' },
  { id: 'tt-8', day: 'tuesday', period: 2, startTime: '09:50', endTime: '10:40', courseId: 'course-1', courseName: 'Data Structures', courseCode: 'CS301', facultyId: 'fac-1', facultyName: 'Prof. Sunita Verma', room: 'CS-101', type: 'lecture' },
  { id: 'tt-9', day: 'tuesday', period: 3, startTime: '10:50', endTime: '11:40', courseId: 'course-4', courseName: 'Computer Networks', courseCode: 'CS304', facultyId: 'fac-2', facultyName: 'Prof. Vikram Singh', room: 'CS-104', type: 'lecture' },
  { id: 'tt-10', day: 'tuesday', period: 5, startTime: '13:30', endTime: '14:20', courseId: 'course-6', courseName: 'Operating Systems', courseCode: 'CS306', facultyId: 'fac-3', facultyName: 'Prof. Meera Nair', room: 'CS-105', type: 'lecture' },
  { id: 'tt-11', day: 'wednesday', period: 1, startTime: '09:00', endTime: '09:50', courseId: 'course-5', courseName: 'Database Management Systems', courseCode: 'CS305', facultyId: 'fac-3', facultyName: 'Prof. Meera Nair', room: 'Lab-2', type: 'lab' },
  { id: 'tt-12', day: 'wednesday', period: 2, startTime: '09:50', endTime: '10:40', courseId: 'course-5', courseName: 'Database Management Systems', courseCode: 'CS305', facultyId: 'fac-3', facultyName: 'Prof. Meera Nair', room: 'Lab-2', type: 'lab' },
  { id: 'tt-13', day: 'wednesday', period: 3, startTime: '10:50', endTime: '11:40', courseId: 'course-1', courseName: 'Data Structures', courseCode: 'CS301', facultyId: 'fac-1', facultyName: 'Prof. Sunita Verma', room: 'CS-101', type: 'lecture' },
  { id: 'tt-14', day: 'thursday', period: 1, startTime: '09:00', endTime: '09:50', courseId: 'course-4', courseName: 'Computer Networks', courseCode: 'CS304', facultyId: 'fac-2', facultyName: 'Prof. Vikram Singh', room: 'CS-104', type: 'lecture' },
  { id: 'tt-15', day: 'thursday', period: 2, startTime: '09:50', endTime: '10:40', courseId: 'course-6', courseName: 'Operating Systems', courseCode: 'CS306', facultyId: 'fac-3', facultyName: 'Prof. Meera Nair', room: 'CS-105', type: 'lecture' },
  { id: 'tt-16', day: 'thursday', period: 3, startTime: '10:50', endTime: '11:40', courseId: 'course-3', courseName: 'Machine Learning', courseCode: 'CS303', facultyId: 'fac-2', facultyName: 'Prof. Vikram Singh', room: 'CS-102', type: 'lecture' },
  { id: 'tt-17', day: 'friday', period: 1, startTime: '09:00', endTime: '09:50', courseId: 'course-1', courseName: 'Data Structures', courseCode: 'CS301', facultyId: 'fac-1', facultyName: 'Prof. Sunita Verma', room: 'CS-101', type: 'tutorial' },
  { id: 'tt-18', day: 'friday', period: 2, startTime: '09:50', endTime: '10:40', courseId: 'course-2', courseName: 'Object Oriented Programming', courseCode: 'CS302', facultyId: 'fac-1', facultyName: 'Prof. Sunita Verma', room: 'CS-102', type: 'lecture' },
  { id: 'tt-19', day: 'friday', period: 3, startTime: '10:50', endTime: '11:40', courseId: 'course-6', courseName: 'Operating Systems', courseCode: 'CS306', facultyId: 'fac-3', facultyName: 'Prof. Meera Nair', room: 'CS-105', type: 'tutorial' },
];

// ============================================================
// Mock Assignments
// ============================================================

export const mockAssignments: Assignment[] = [
  { id: 'asg-1', title: 'Implement Binary Search Tree', description: 'Implement BST with insert, delete, and search operations. Include in-order, pre-order, and post-order traversals.', courseId: 'course-1', courseName: 'Data Structures', courseCode: 'CS301', facultyId: 'fac-1', facultyName: 'Prof. Sunita Verma', deadline: '2025-10-15T23:59:00Z', maxMarks: 20, createdAt: '2025-09-20T10:00:00Z', totalSubmissions: 6, evaluatedCount: 3, batch: '2024', section: 'A' },
  { id: 'asg-2', title: 'Design Patterns Report', description: 'Write a report on Factory, Singleton, and Observer design patterns with Java examples.', courseId: 'course-2', courseName: 'Object Oriented Programming', courseCode: 'CS302', facultyId: 'fac-1', facultyName: 'Prof. Sunita Verma', deadline: '2025-10-20T23:59:00Z', maxMarks: 15, createdAt: '2025-09-25T10:00:00Z', totalSubmissions: 4, evaluatedCount: 2, batch: '2024', section: 'A' },
  { id: 'asg-3', title: 'Linear Regression Analysis', description: 'Implement linear regression from scratch in Python. Use the provided dataset to train and evaluate your model.', courseId: 'course-3', courseName: 'Machine Learning', courseCode: 'CS303', facultyId: 'fac-2', facultyName: 'Prof. Vikram Singh', deadline: '2025-10-25T23:59:00Z', maxMarks: 25, createdAt: '2025-10-01T10:00:00Z', totalSubmissions: 2, evaluatedCount: 0, batch: '2024', section: 'A' },
  { id: 'asg-4', title: 'ER Diagram & Normalization', description: 'Design an ER diagram for a library management system and normalize it to 3NF.', courseId: 'course-5', courseName: 'Database Management Systems', courseCode: 'CS305', facultyId: 'fac-3', facultyName: 'Prof. Meera Nair', deadline: '2025-10-18T23:59:00Z', maxMarks: 20, createdAt: '2025-09-28T10:00:00Z', totalSubmissions: 7, evaluatedCount: 5, batch: '2024', section: 'A' },
];

// ============================================================
// Mock Submissions
// ============================================================

export const mockSubmissions: Submission[] = [
  { id: 'sub-1', assignmentId: 'asg-1', studentId: 'stu-1', studentName: 'Arun Krishnan', rollNumber: 'CSE2024001', submittedAt: '2025-10-10T14:30:00Z', status: 'evaluated', marks: 18, feedback: 'Excellent implementation! Well-structured code with proper error handling.', evaluatedAt: '2025-10-12T10:00:00Z', evaluatedBy: 'fac-1' },
  { id: 'sub-2', assignmentId: 'asg-1', studentId: 'stu-2', studentName: 'Divya Lakshmi', rollNumber: 'CSE2024002', submittedAt: '2025-10-12T20:00:00Z', status: 'evaluated', marks: 16, feedback: 'Good work. Minor issue with delete operation for nodes with two children.', evaluatedAt: '2025-10-13T10:00:00Z', evaluatedBy: 'fac-1' },
  { id: 'sub-3', assignmentId: 'asg-1', studentId: 'stu-3', studentName: 'Ravi Teja', rollNumber: 'CSE2024003', submittedAt: '2025-10-14T18:00:00Z', status: 'evaluated', marks: 14, feedback: 'Traversals work correctly but delete function has bugs.', evaluatedAt: '2025-10-15T10:00:00Z', evaluatedBy: 'fac-1' },
  { id: 'sub-4', assignmentId: 'asg-1', studentId: 'stu-4', studentName: 'Sneha Gupta', rollNumber: 'CSE2024004', submittedAt: '2025-10-13T16:00:00Z', status: 'submitted', marks: undefined, feedback: undefined },
  { id: 'sub-5', assignmentId: 'asg-1', studentId: 'stu-5', studentName: 'Mohammed Irfan', rollNumber: 'CSE2024005', submittedAt: '2025-10-16T01:00:00Z', status: 'late', marks: undefined, feedback: undefined },
  { id: 'sub-6', assignmentId: 'asg-1', studentId: 'stu-6', studentName: 'Preethi Raj', rollNumber: 'CSE2024006', submittedAt: '2025-10-11T09:00:00Z', status: 'submitted', marks: undefined, feedback: undefined },
];

// ============================================================
// Mock Quizzes
// ============================================================

export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-1', title: 'Data Structures - Mid Semester Quiz', courseId: 'course-1', courseName: 'Data Structures', courseCode: 'CS301',
    facultyId: 'fac-1', facultyName: 'Prof. Sunita Verma', duration: 30, startTime: '2025-10-10T09:00:00Z', endTime: '2025-10-10T10:00:00Z',
    totalPoints: 20, batch: '2024', section: 'A', isPublished: true, attemptsCount: 6,
    questions: [
      { id: 'q-1', type: 'mcq', text: 'What is the time complexity of searching in a balanced BST?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correctAnswer: 'O(log n)', points: 2 },
      { id: 'q-2', type: 'mcq', text: 'Which data structure uses LIFO principle?', options: ['Queue', 'Stack', 'Array', 'Linked List'], correctAnswer: 'Stack', points: 2 },
      { id: 'q-3', type: 'true_false', text: 'A binary tree with n nodes has n-1 edges.', options: ['True', 'False'], correctAnswer: 'True', points: 2 },
      { id: 'q-4', type: 'mcq', text: 'What is the worst-case time complexity of quicksort?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], correctAnswer: 'O(n²)', points: 2 },
      { id: 'q-5', type: 'short_answer', text: 'Name the tree traversal that visits nodes in left-root-right order.', correctAnswer: 'Inorder', points: 2 },
      { id: 'q-6', type: 'mcq', text: 'Which operation is NOT O(1) in a hash table (average case)?', options: ['Insert', 'Delete', 'Search', 'Sort'], correctAnswer: 'Sort', points: 2 },
      { id: 'q-7', type: 'true_false', text: 'A min-heap has the smallest element at the root.', options: ['True', 'False'], correctAnswer: 'True', points: 2 },
      { id: 'q-8', type: 'mcq', text: 'What data structure is used for BFS?', options: ['Stack', 'Queue', 'Priority Queue', 'Deque'], correctAnswer: 'Queue', points: 2 },
      { id: 'q-9', type: 'short_answer', text: 'What is the maximum number of children a node can have in a binary tree?', correctAnswer: '2', points: 2 },
      { id: 'q-10', type: 'mcq', text: 'Which sorting algorithm is stable?', options: ['Quick Sort', 'Heap Sort', 'Merge Sort', 'Selection Sort'], correctAnswer: 'Merge Sort', points: 2 },
    ],
  },
];

// ============================================================
// Mock Coding Exams
// ============================================================

export const mockCodingExams: CodingExam[] = [
  {
    id: 'code-exam-1', title: 'Data Structures Coding Challenge', courseId: 'course-1', courseName: 'Data Structures', courseCode: 'CS301',
    facultyId: 'fac-1', facultyName: 'Prof. Sunita Verma', duration: 120, startTime: '2025-10-20T09:00:00Z', endTime: '2025-10-20T11:00:00Z',
    totalPoints: 100, batch: '2024', section: 'A', isPublished: true, allowedLanguages: ['python', 'java', 'cpp'],
    problems: [
      {
        id: 'prob-1', examId: 'code-exam-1', title: 'Two Sum', statement: '## Two Sum\n\nGiven an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\n### Example\n```\nInput: nums = [2, 7, 11, 15], target = 9\nOutput: 0 1\n```\n\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].',
        inputFormat: 'First line: n (size of array)\nSecond line: n space-separated integers\nThird line: target integer',
        outputFormat: 'Two space-separated indices',
        constraints: '2 ≤ n ≤ 10^4\n-10^9 ≤ nums[i] ≤ 10^9',
        timeLimit: 2, memoryLimit: 256, maxPoints: 30, difficulty: 'easy',
        sampleTestCases: [
          { id: 'tc-1', input: '4\n2 7 11 15\n9', expectedOutput: '0 1', isHidden: false, points: 0 },
          { id: 'tc-2', input: '3\n3 2 4\n6', expectedOutput: '1 2', isHidden: false, points: 0 },
        ],
        hiddenTestCases: [
          { id: 'tc-3', input: '5\n1 5 3 7 2\n8', expectedOutput: '1 2', isHidden: true, points: 10 },
          { id: 'tc-4', input: '2\n-1 1\n0', expectedOutput: '0 1', isHidden: true, points: 10 },
          { id: 'tc-5', input: '4\n0 4 3 0\n0', expectedOutput: '0 3', isHidden: true, points: 10 },
        ],
      },
      {
        id: 'prob-2', examId: 'code-exam-1', title: 'Balanced Parentheses', statement: '## Balanced Parentheses\n\nGiven a string `s` containing only the characters `(`, `)`, `{`, `}`, `[`, `]`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets are closed by the same type of brackets.\n2. Open brackets are closed in the correct order.\n\n### Example\n```\nInput: ()[]{}\nOutput: YES\n\nInput: ([)]\nOutput: NO\n```',
        inputFormat: 'A single string containing brackets',
        outputFormat: 'YES or NO',
        constraints: '1 ≤ |s| ≤ 10^4',
        timeLimit: 1, memoryLimit: 128, maxPoints: 30, difficulty: 'easy',
        sampleTestCases: [
          { id: 'tc-6', input: '()[]{}', expectedOutput: 'YES', isHidden: false, points: 0 },
          { id: 'tc-7', input: '([)]', expectedOutput: 'NO', isHidden: false, points: 0 },
        ],
        hiddenTestCases: [
          { id: 'tc-8', input: '{[()]}', expectedOutput: 'YES', isHidden: true, points: 10 },
          { id: 'tc-9', input: '((((', expectedOutput: 'NO', isHidden: true, points: 10 },
          { id: 'tc-10', input: '', expectedOutput: 'YES', isHidden: true, points: 10 },
        ],
      },
      {
        id: 'prob-3', examId: 'code-exam-1', title: 'Longest Increasing Subsequence', statement: '## Longest Increasing Subsequence\n\nGiven an integer array `nums`, return the length of the longest strictly increasing subsequence.\n\n### Example\n```\nInput: 10 9 2 5 3 7 101 18\nOutput: 4\n```\n\nExplanation: The LIS is [2, 3, 7, 101], length 4.',
        inputFormat: 'First line: n\nSecond line: n space-separated integers',
        outputFormat: 'A single integer - length of LIS',
        constraints: '1 ≤ n ≤ 2500\n-10^4 ≤ nums[i] ≤ 10^4',
        timeLimit: 3, memoryLimit: 256, maxPoints: 40, difficulty: 'medium',
        sampleTestCases: [
          { id: 'tc-11', input: '8\n10 9 2 5 3 7 101 18', expectedOutput: '4', isHidden: false, points: 0 },
          { id: 'tc-12', input: '6\n0 1 0 3 2 3', expectedOutput: '4', isHidden: false, points: 0 },
        ],
        hiddenTestCases: [
          { id: 'tc-13', input: '1\n7', expectedOutput: '1', isHidden: true, points: 10 },
          { id: 'tc-14', input: '5\n7 7 7 7 7', expectedOutput: '1', isHidden: true, points: 15 },
          { id: 'tc-15', input: '10\n1 2 3 4 5 6 7 8 9 10', expectedOutput: '10', isHidden: true, points: 15 },
        ],
      },
    ],
  },
];

// ============================================================
// Mock Attendance Sessions
// ============================================================

export const mockAttendanceSessions: AttendanceSession[] = [
  {
    id: 'att-sess-1', courseId: 'course-1', courseName: 'Data Structures', courseCode: 'CS301', facultyId: 'fac-1', facultyName: 'Prof. Sunita Verma',
    date: '2025-10-06', period: 1, batch: '2024', section: 'A', totalStudents: 4, presentCount: 3, absentCount: 1, lateCount: 0,
    records: [
      { id: 'att-1', studentId: 'stu-1', studentName: 'Arun Krishnan', rollNumber: 'CSE2024001', sessionId: 'att-sess-1', status: 'present', markedAt: '2025-10-06T09:05:00Z', markedBy: 'fac-1' },
      { id: 'att-2', studentId: 'stu-2', studentName: 'Divya Lakshmi', rollNumber: 'CSE2024002', sessionId: 'att-sess-1', status: 'present', markedAt: '2025-10-06T09:05:00Z', markedBy: 'fac-1' },
      { id: 'att-3', studentId: 'stu-3', studentName: 'Ravi Teja', rollNumber: 'CSE2024003', sessionId: 'att-sess-1', status: 'absent', markedAt: '2025-10-06T09:05:00Z', markedBy: 'fac-1' },
      { id: 'att-4', studentId: 'stu-4', studentName: 'Sneha Gupta', rollNumber: 'CSE2024004', sessionId: 'att-sess-1', status: 'present', markedAt: '2025-10-06T09:05:00Z', markedBy: 'fac-1' },
    ],
  },
];

// ============================================================
// Mock Resources
// ============================================================

export const mockResources: LearningResource[] = [
  { id: 'res-1', title: 'Introduction to Trees', description: 'Comprehensive notes on tree data structures', courseId: 'course-1', courseName: 'Data Structures', type: 'pdf', fileName: 'trees_intro.pdf', fileSize: 2400000, uploadedBy: 'fac-1', uploadedByName: 'Prof. Sunita Verma', createdAt: '2025-09-15T10:00:00Z', updatedAt: '2025-09-15T10:00:00Z' },
  { id: 'res-2', title: 'Sorting Algorithms Visualization', description: 'Video lecture on sorting algorithms', courseId: 'course-1', courseName: 'Data Structures', type: 'video', fileName: 'sorting_viz.mp4', fileSize: 85000000, uploadedBy: 'fac-1', uploadedByName: 'Prof. Sunita Verma', createdAt: '2025-09-20T10:00:00Z', updatedAt: '2025-09-20T10:00:00Z' },
  { id: 'res-3', title: 'Java Design Patterns', description: 'Reference document for OOP patterns', courseId: 'course-2', courseName: 'Object Oriented Programming', type: 'pdf', fileName: 'design_patterns.pdf', fileSize: 5200000, uploadedBy: 'fac-1', uploadedByName: 'Prof. Sunita Verma', createdAt: '2025-09-18T10:00:00Z', updatedAt: '2025-09-18T10:00:00Z' },
  { id: 'res-4', title: 'ML Algorithms Cheat Sheet', description: 'Quick reference for common ML algorithms', courseId: 'course-3', courseName: 'Machine Learning', type: 'pdf', fileName: 'ml_cheatsheet.pdf', fileSize: 1800000, uploadedBy: 'fac-2', uploadedByName: 'Prof. Vikram Singh', createdAt: '2025-09-22T10:00:00Z', updatedAt: '2025-09-22T10:00:00Z' },
  { id: 'res-5', title: 'SQL Tutorial', description: 'Step-by-step SQL guide', courseId: 'course-5', courseName: 'Database Management Systems', type: 'document', fileName: 'sql_tutorial.docx', fileSize: 3100000, uploadedBy: 'fac-3', uploadedByName: 'Prof. Meera Nair', createdAt: '2025-09-25T10:00:00Z', updatedAt: '2025-09-25T10:00:00Z' },
];

// ============================================================
// Mock Internal Marks
// ============================================================

export const mockInternalMarks: InternalMark[] = mockStudents.slice(0, 4).map(s => ({
  studentId: s.id, studentName: s.name, rollNumber: s.rollNumber, courseId: 'course-1',
  assessments: [
    { type: 'assignment' as const, title: 'Assignment 1', marks: Math.floor(Math.random() * 6) + 14, maxMarks: 20 },
    { type: 'quiz' as const, title: 'Quiz 1', marks: Math.floor(Math.random() * 6) + 14, maxMarks: 20 },
    { type: 'coding_exam' as const, title: 'Coding Exam 1', marks: Math.floor(Math.random() * 30) + 60, maxMarks: 100 },
    { type: 'internal' as const, title: 'Internal Test 1', marks: Math.floor(Math.random() * 10) + 15, maxMarks: 25 },
  ],
  totalMarks: 0, totalMaxMarks: 165, isPublished: true,
})).map(m => ({ ...m, totalMarks: m.assessments.reduce((a, b) => a + b.marks, 0) }));

// ============================================================
// Mock Counseling
// ============================================================

export const mockChatMessages: ChatMessage[] = [
  { id: 'msg-1', senderId: 'usr-stu-1', senderName: 'Arun Krishnan', senderRole: 'student', receiverId: 'usr-fac-1', content: 'Good morning ma\'am. I wanted to discuss my attendance situation.', timestamp: '2025-10-05T09:00:00Z', isRead: true, type: 'text' },
  { id: 'msg-2', senderId: 'usr-fac-1', senderName: 'Prof. Sunita Verma', senderRole: 'faculty', receiverId: 'usr-stu-1', content: 'Good morning Arun. Yes, I noticed your attendance has been below 75% in Data Structures. Is everything okay?', timestamp: '2025-10-05T09:05:00Z', isRead: true, type: 'text' },
  { id: 'msg-3', senderId: 'usr-stu-1', senderName: 'Arun Krishnan', senderRole: 'student', receiverId: 'usr-fac-1', content: 'I\'ve been having some health issues. I have medical certificates for the days I missed.', timestamp: '2025-10-05T09:10:00Z', isRead: true, type: 'text' },
  { id: 'msg-4', senderId: 'usr-fac-1', senderName: 'Prof. Sunita Verma', senderRole: 'faculty', receiverId: 'usr-stu-1', content: 'I understand. Please submit the medical certificates to the department office. We can arrange extra classes if needed. Let\'s meet during office hours to plan your catch-up.', timestamp: '2025-10-05T09:15:00Z', isRead: true, type: 'text' },
  { id: 'msg-5', senderId: 'usr-stu-1', senderName: 'Arun Krishnan', senderRole: 'student', receiverId: 'usr-fac-1', content: 'Thank you ma\'am! I\'ll submit them tomorrow. When are your office hours this week?', timestamp: '2025-10-05T09:20:00Z', isRead: false, type: 'text' },
];

export const mockCounselingSessions: CounselingSession[] = [
  { id: 'counsel-1', studentId: 'stu-1', studentName: 'Arun Krishnan', counselorId: 'fac-1', counselorName: 'Prof. Sunita Verma', date: '2025-10-07', topic: 'Attendance Improvement', concern: 'Low attendance due to health issues', observation: 'Student is genuine, has medical certificates. Academic performance is still strong.', followUp: 'Review attendance after 2 weeks', status: 'completed' },
  { id: 'counsel-2', studentId: 'stu-2', studentName: 'Divya Lakshmi', counselorId: 'fac-1', counselorName: 'Prof. Sunita Verma', date: '2025-10-08', topic: 'Career Guidance', concern: 'Confused between higher studies and placement', observation: 'Strong academic record. Interested in ML research.', followUp: 'Connect with alumni in research roles', status: 'completed' },
  { id: 'counsel-3', studentId: 'stu-4', studentName: 'Sneha Gupta', counselorId: 'fac-2', counselorName: 'Prof. Vikram Singh', date: '2025-10-12', topic: 'Performance Review', concern: 'Declining grades in coding exams', observation: 'Needs more practice with competitive programming', followUp: 'Recommended practice platforms and study group', status: 'scheduled' },
];

// ============================================================
// Mock Announcements
// ============================================================

export const mockAnnouncements: Announcement[] = [
  { id: 'ann-1', title: 'Mid-Semester Examination Schedule', content: 'The mid-semester examinations for all departments will commence from October 25th. Please check the detailed schedule on the notice board.', authorId: 'usr-admin-1', authorName: 'Dr. Rajesh Kumar', authorRole: 'admin', scope: 'institution', target: { scope: 'institution' }, priority: 'high', createdAt: '2025-10-01T10:00:00Z', updatedAt: '2025-10-01T10:00:00Z', isActive: true },
  { id: 'ann-2', title: 'Hackathon Registration Open', content: 'Annual hackathon "CodeStorm 2025" registrations are now open. Teams of 2-4 members can register at the department office.', authorId: 'usr-hod-1', authorName: 'Dr. Priya Sharma', authorRole: 'hod', scope: 'department', target: { scope: 'department', departmentId: 'dept-1' }, priority: 'normal', createdAt: '2025-10-03T10:00:00Z', updatedAt: '2025-10-03T10:00:00Z', isActive: true },
  { id: 'ann-3', title: 'Assignment 1 Deadline Extended', content: 'The deadline for BST implementation assignment has been extended by 2 days due to festival holidays.', authorId: 'usr-fac-1', authorName: 'Prof. Sunita Verma', authorRole: 'faculty', scope: 'course', target: { scope: 'course', courseId: 'course-1' }, priority: 'normal', createdAt: '2025-10-05T10:00:00Z', updatedAt: '2025-10-05T10:00:00Z', isActive: true },
  { id: 'ann-4', title: 'Lab Maintenance - Saturday', content: 'CS Lab 1 and Lab 2 will be closed on Saturday for maintenance. Plan accordingly.', authorId: 'usr-hod-1', authorName: 'Dr. Priya Sharma', authorRole: 'hod', scope: 'department', target: { scope: 'department', departmentId: 'dept-1' }, priority: 'urgent', createdAt: '2025-10-08T10:00:00Z', updatedAt: '2025-10-08T10:00:00Z', isActive: true },
];

// ============================================================
// Mock Notifications
// ============================================================

export const mockNotifications: Notification[] = [
  { id: 'notif-1', userId: 'usr-stu-1', title: 'Assignment Evaluated', message: 'Your BST assignment has been evaluated. Score: 18/20', category: 'assignment', isRead: false, createdAt: '2025-10-12T10:00:00Z', actionUrl: '/student/assignments/asg-1' },
  { id: 'notif-2', userId: 'usr-stu-1', title: 'New Quiz Available', message: 'Data Structures Mid Semester Quiz is now live', category: 'quiz', isRead: false, createdAt: '2025-10-10T09:00:00Z', actionUrl: '/student/quizzes/quiz-1' },
  { id: 'notif-3', userId: 'usr-stu-1', title: 'Coding Exam Scheduled', message: 'DS Coding Challenge scheduled for Oct 20, 9:00 AM', category: 'coding_exam', isRead: true, createdAt: '2025-10-08T10:00:00Z', actionUrl: '/student/coding-exams/code-exam-1' },
  { id: 'notif-4', userId: 'usr-stu-1', title: 'Attendance Warning', message: 'Your attendance in CS301 is below 75%', category: 'attendance', isRead: true, createdAt: '2025-10-06T10:00:00Z', actionUrl: '/student/attendance' },
  { id: 'notif-5', userId: 'usr-stu-1', title: 'New Announcement', message: 'Mid-Semester Examination Schedule published', category: 'announcement', isRead: true, createdAt: '2025-10-01T10:00:00Z', actionUrl: '/student/announcements' },
];

// ============================================================
// Mock Performance
// ============================================================

export const mockPerformanceData: PerformanceMetrics = {
  studentId: 'stu-1', studentName: 'Arun Krishnan', overallAttendance: 78, overallMarks: 82,
  subjectWise: [
    { courseId: 'course-1', courseName: 'Data Structures', attendance: 72, assignmentAvg: 90, quizAvg: 80, codingAvg: 85, internalMarks: 82 },
    { courseId: 'course-2', courseName: 'OOP', attendance: 85, assignmentAvg: 78, quizAvg: 75, codingAvg: 70, internalMarks: 76 },
    { courseId: 'course-3', courseName: 'Machine Learning', attendance: 80, assignmentAvg: 85, quizAvg: 88, codingAvg: 82, internalMarks: 84 },
    { courseId: 'course-5', courseName: 'DBMS', attendance: 90, assignmentAvg: 92, quizAvg: 85, codingAvg: 88, internalMarks: 89 },
    { courseId: 'course-6', courseName: 'Operating Systems', attendance: 68, assignmentAvg: 72, quizAvg: 70, codingAvg: 65, internalMarks: 70 },
  ],
  trend: 'improving',
  attendanceTrend: [
    { month: 'Jul', percentage: 85 }, { month: 'Aug', percentage: 80 }, { month: 'Sep', percentage: 75 },
    { month: 'Oct', percentage: 78 }, { month: 'Nov', percentage: 82 },
  ],
  marksTrend: [
    { month: 'Jul', percentage: 70 }, { month: 'Aug', percentage: 75 }, { month: 'Sep', percentage: 80 },
    { month: 'Oct', percentage: 82 }, { month: 'Nov', percentage: 85 },
  ],
};
