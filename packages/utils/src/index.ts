import { ATTENDANCE_THRESHOLDS } from '@eduverse/config';

// ============================================================
// ID Generation
// ============================================================

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// ============================================================
// Date & Time Utilities
// ============================================================

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

export function getTimeRemaining(deadline: string): { text: string; isOverdue: boolean; urgency: 'none' | 'low' | 'medium' | 'high' } {
  const now = new Date();
  const end = new Date(deadline);
  const diffMs = end.getTime() - now.getTime();

  if (diffMs < 0) {
    return { text: 'Overdue', isOverdue: true, urgency: 'high' };
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 7) return { text: `${days} days left`, isOverdue: false, urgency: 'none' };
  if (days > 2) return { text: `${days} days left`, isOverdue: false, urgency: 'low' };
  if (days > 0) return { text: `${days}d ${hours % 24}h left`, isOverdue: false, urgency: 'medium' };
  if (hours > 0) return { text: `${hours}h left`, isOverdue: false, urgency: 'high' };
  return { text: 'Less than 1 hour', isOverdue: false, urgency: 'high' };
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`;
}

export function formatCountdown(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// ============================================================
// File Utilities
// ============================================================

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function getFileIcon(filename: string): string {
  const ext = getFileExtension(filename);
  switch (ext) {
    case 'pdf': return '📄';
    case 'doc': case 'docx': return '📝';
    case 'ppt': case 'pptx': return '📊';
    case 'xls': case 'xlsx': case 'csv': return '📈';
    case 'jpg': case 'jpeg': case 'png': case 'gif': return '🖼️';
    case 'mp4': case 'avi': case 'mov': return '🎬';
    case 'zip': case 'rar': return '📦';
    default: return '📁';
  }
}

// ============================================================
// Grade & Performance Utilities
// ============================================================

export function calculatePercentage(obtained: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((obtained / total) * 100 * 100) / 100;
}

export function getGrade(percentage: number): string {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
}

export function getAttendanceStatus(percentage: number): 'safe' | 'warning' | 'critical' {
  if (percentage >= ATTENDANCE_THRESHOLDS.safe) return 'safe';
  if (percentage >= ATTENDANCE_THRESHOLDS.warning) return 'warning';
  return 'critical';
}

export function getPerformanceTrend(data: number[]): 'improving' | 'stable' | 'declining' {
  if (data.length < 2) return 'stable';
  const recent = data.slice(-3);
  const earlier = data.slice(-6, -3);
  if (earlier.length === 0) return 'stable';
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
  const diff = recentAvg - earlierAvg;
  if (diff > 5) return 'improving';
  if (diff < -5) return 'declining';
  return 'stable';
}

// ============================================================
// String Utilities
// ============================================================

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ============================================================
// Verdict Utilities
// ============================================================

export function getVerdictLabel(verdict: string): string {
  switch (verdict) {
    case 'accepted': return 'Accepted';
    case 'wrong_answer': return 'Wrong Answer';
    case 'time_limit_exceeded': return 'Time Limit Exceeded';
    case 'runtime_error': return 'Runtime Error';
    case 'compilation_error': return 'Compilation Error';
    case 'memory_limit_exceeded': return 'Memory Limit Exceeded';
    case 'pending': return 'Pending';
    default: return verdict;
  }
}

export function getVerdictColor(verdict: string): string {
  switch (verdict) {
    case 'accepted': return '#10b981';
    case 'wrong_answer': return '#ef4444';
    case 'time_limit_exceeded': return '#f59e0b';
    case 'runtime_error': return '#f97316';
    case 'compilation_error': return '#ef4444';
    case 'memory_limit_exceeded': return '#f59e0b';
    case 'pending': return '#64748b';
    default: return '#64748b';
  }
}

// ============================================================
// Delay / Simulation
// ============================================================

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
