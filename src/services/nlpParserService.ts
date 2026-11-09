import { ParsedDumpResult, Subject, TaskPriority } from '../models/types';

// Common college subjects dictionary for fuzzy matching
const COMMON_SUBJECTS: { [key: string]: string } = {
  dbms: 'DBMS',
  database: 'DBMS',
  sql: 'DBMS',
  java: 'Java',
  oop: 'Java',
  daa: 'DAA',
  algorithms: 'DAA',
  algo: 'DAA',
  'data structures': 'Data Structures',
  dsa: 'Data Structures',
  ds: 'Data Structures',
  os: 'Operating Systems',
  'operating systems': 'Operating Systems',
  cn: 'Computer Networks',
  networks: 'Computer Networks',
  ml: 'Machine Learning',
  'machine learning': 'Machine Learning',
  ai: 'Artificial Intelligence',
  web: 'Web Development',
  'web dev': 'Web Development',
  math: 'Mathematics',
  maths: 'Mathematics',
  discrete: 'Discrete Math',
  physics: 'Physics',
  se: 'Software Engineering',
};

// Common technical & syllabus keywords
const SYLLABUS_KEYWORDS = [
  'normalization', 'bcnf', '1nf', '2nf', '3nf', 'er diagram', 'acid', 'indexing', 'b+ tree', 'transaction',
  'backtracking', 'dynamic programming', 'greedy', 'divide and conquer', 'asymptotic', 'np-complete',
  'inheritance', 'polymorphism', 'multithreading', 'exception', 'collections', 'stream', 'lambda',
  'linked list', 'binary tree', 'bst', 'graph', 'dfs', 'bfs', 'stack', 'queue', 'heap', 'hashing',
  'semaphore', 'deadlock', 'scheduling', 'paging', 'virtual memory',
  'tcp', 'udp', 'ip', 'osi', 'routing', 'socket',
  'assignment', 'homework', 'lab', 'project', 'quiz', 'midterm', 'final exam', 'viva', 'presentation',
  'chapter', 'module', 'unit', 'notes', 'slides', 'practice', 'revision'
];

/**
 * Format a Date object to YYYY-MM-DD
 */
export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Parse natural language text locally without external APIs.
 */
export function parseStudyDumpLocally(
  text: string,
  existingSubjects: Subject[] = []
): ParsedDumpResult {
  const cleanInput = text.trim();
  if (!cleanInput) {
    return {
      task: '',
      priority: 'medium',
      keywords: [],
    };
  }

  const lowerText = cleanInput.toLowerCase();
  const now = new Date();

  // 1. SUBJECT DETECTION
  let matchedSubjectName: string | undefined;
  let matchedSubjectId: string | undefined;

  // First check existing user subjects
  for (const sub of existingSubjects) {
    const subNamePattern = new RegExp(`\\b${escapeRegExp(sub.name)}\\b`, 'i');
    const subCodePattern = sub.code ? new RegExp(`\\b${escapeRegExp(sub.code)}\\b`, 'i') : null;

    if (subNamePattern.test(cleanInput) || (subCodePattern && subCodePattern.test(cleanInput))) {
      matchedSubjectName = sub.name;
      matchedSubjectId = sub.id;
      break;
    }
  }

  // Fallback to common college subjects
  if (!matchedSubjectName) {
    for (const [key, normalized] of Object.entries(COMMON_SUBJECTS)) {
      const pattern = new RegExp(`\\b${escapeRegExp(key)}\\b`, 'i');
      if (pattern.test(cleanInput)) {
        matchedSubjectName = normalized;
        // See if user has a subject with this normalized name
        const found = existingSubjects.find(s => s.name.toLowerCase() === normalized.toLowerCase());
        if (found) {
          matchedSubjectId = found.id;
        }
        break;
      }
    }
  }

  // 2. PRIORITY DETECTION
  let priority: TaskPriority = 'medium';
  const highPriorityWords = ['urgent', 'asap', 'high priority', 'critical', 'crucial', 'must', 'immediately', 'important', 'p1', 'emergency'];
  const lowPriorityWords = ['low priority', 'optional', 'whenever', 'chill', 'easy', 'minor', 'if possible', 'p3'];

  if (highPriorityWords.some(w => lowerText.includes(w))) {
    priority = 'high';
  } else if (lowPriorityWords.some(w => lowerText.includes(w))) {
    priority = 'low';
  } else if (lowerText.includes('medium') || lowerText.includes('normal') || lowerText.includes('p2')) {
    priority = 'medium';
  }

  // 3. DEADLINE DETECTION
  let deadlineDate: Date | null = null;
  let deadlineLabel = '';

  const dayOfWeekNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  if (/\b(today|tonight)\b/i.test(lowerText)) {
    deadlineDate = new Date(now);
    deadlineLabel = 'Today';
  } else if (/\b(tomorrow|tmrw)\b/i.test(lowerText)) {
    const d = new Date(now);
    d.setDate(d.getDate() + 1);
    deadlineDate = d;
    deadlineLabel = 'Tomorrow';
  } else if (/\bday after tomorrow\b/i.test(lowerText)) {
    const d = new Date(now);
    d.setDate(d.getDate() + 2);
    deadlineDate = d;
    deadlineLabel = 'In 2 days';
  } else {
    // Check "in X days"
    const inXDaysMatch = lowerText.match(/\bin (\d+) days?\b/i);
    if (inXDaysMatch) {
      const days = parseInt(inXDaysMatch[1], 10);
      const d = new Date(now);
      d.setDate(d.getDate() + days);
      deadlineDate = d;
      deadlineLabel = `In ${days} days`;
    } else {
      // Check day of week (e.g., "next monday", "on friday", "by wednesday")
      for (let i = 0; i < dayOfWeekNames.length; i++) {
        const dayName = dayOfWeekNames[i];
        const dayPattern = new RegExp(`\\b(next|on|by|this)?\\s*${dayName}\\b`, 'i');
        if (dayPattern.test(lowerText)) {
          const currentDay = now.getDay();
          let diff = i - currentDay;
          if (diff <= 0) {
            diff += 7; // next week
          }
          if (lowerText.includes(`next ${dayName}`) && diff < 7) {
            diff += 7;
          }
          const d = new Date(now);
          d.setDate(d.getDate() + diff);
          deadlineDate = d;
          const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
          deadlineLabel = `${capitalizedDay}`;
          break;
        }
      }
    }
  }

  // Fallback deadline: defaults to tomorrow if not specified, but labeled as "Not specified (defaulting to tomorrow)"
  let formattedDeadlineStr: string | undefined;
  if (deadlineDate) {
    formattedDeadlineStr = formatDateISO(deadlineDate);
  } else {
    // Default to tomorrow for student convenience
    const d = new Date(now);
    d.setDate(d.getDate() + 1);
    formattedDeadlineStr = formatDateISO(d);
    deadlineLabel = 'Tomorrow';
  }

  // 4. KEYWORDS EXTRACTION
  const detectedKeywords: string[] = [];
  for (const kw of SYLLABUS_KEYWORDS) {
    const kwPattern = new RegExp(`\\b${escapeRegExp(kw)}\\b`, 'i');
    if (kwPattern.test(lowerText)) {
      detectedKeywords.push(kw);
    }
  }

  // 5. CLEAN TASK EXTRACTION
  // Strip out boilerplate prefixes like "I need to", "I have to", "Please", "Remember to"
  let cleanTask = cleanInput;
  cleanTask = cleanTask.replace(/^(i need to|i have to|i must|please|remember to|don't forget to|gotta|plan to|want to)\s+/i, '');

  // Strip deadline strings from title to keep task title clean
  cleanTask = cleanTask.replace(/\b(tomorrow|tmrw|today|tonight|day after tomorrow)\b/gi, '');
  cleanTask = cleanTask.replace(/\b(next|on|by|this)\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/gi, '');
  cleanTask = cleanTask.replace(/\bin \d+ days?\b/gi, '');
  cleanTask = cleanTask.replace(/\b(asap|urgent|high priority|low priority|p1|p2|p3|immediately)\b/gi, '');
  cleanTask = cleanTask.replace(/\s{2,}/g, ' ').trim();

  // Capitalize first letter of task
  if (cleanTask.length > 0) {
    cleanTask = cleanTask.charAt(0).toUpperCase() + cleanTask.slice(1);
  } else {
    cleanTask = cleanInput;
  }

  return {
    task: cleanTask,
    subjectName: matchedSubjectName,
    subjectId: matchedSubjectId,
    priority,
    deadline: deadlineLabel,
    formattedDate: formattedDeadlineStr,
    keywords: detectedKeywords,
  };
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
