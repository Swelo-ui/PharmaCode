import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// ─── SECURITY CONSTANTS ────────────────────────────────────────────────────────
// The admin password requested by the user
const ADMIN_PASSWORD_PLAIN = 'swelo';
// Salt for HMAC signature
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'pharmacode-super-secure-secret-key-2026-v1';

// Rate limiting state (in-memory for active instances)
interface RateLimitEntry {
  attempts: number;
  lockedUntil?: number;
}
const failedAttemptsMap = new Map<string, RateLimitEntry>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export interface AdminNotification {
  id: string;
  title: string;
  body: string;
  category: 'exam' | 'notes' | 'tips' | 'announcement' | 'update';
  topic: string;
  deepLink?: string;
  priority: 'normal' | 'high' | 'urgent';
  timestamp: string;
  sentAt: number;
  deliveryStatus: 'Delivered' | 'Synced' | 'Queued';
}

export interface AdminPdf {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  semester: number;
  unit: string;
  category: 'Notes' | 'Question Paper' | 'Revision Sheet' | 'Lab Manual';
  url: string;
  fileSize: string;
  pages: number;
  uploadedAt: string;
  downloadsCount: number;
}

export interface AdminAnalytics {
  activeUsersToday: number;
  activeUsersWeekly: number;
  totalAppInstalls: number;
  totalNotesDownloads: number;
  totalNotificationsSent: number;
  appPlatformShare: { android: number; web: number };
  recentEvents: { id: string; action: string; platform: string; time: string }[];
}

// ─── STORAGE FILE PATHS ───────────────────────────────────────────────────────
const DATA_DIR = path.join(process.cwd(), '.data');
const NOTIFS_FILE = path.join(DATA_DIR, 'notifications.json');
const PDFS_FILE = path.join(DATA_DIR, 'pdfs.json');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (_) {}
  }
}

// ─── INITIAL SEED DATA ────────────────────────────────────────────────────────
const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'notif-seed-1',
    title: '🎓 GPAT 2027 Rapid Revision Strategy',
    body: 'Master high-yield SAR shortcuts and key mechanisms in Pharmacology. Boost your preparation now!',
    category: 'exam',
    topic: 'all_students',
    deepLink: '/notes',
    priority: 'urgent',
    timestamp: 'Just now',
    sentAt: Date.now() - 3600000,
    deliveryStatus: 'Delivered',
  },
  {
    id: 'notif-seed-2',
    title: '📚 New Semester 6 Notes Added: BP604T',
    body: 'AI Applications in Pharmaceutical Sciences unit-wise notes & diagrams are now live for free download.',
    category: 'notes',
    topic: 'all_students',
    deepLink: '/syllabus/semester-6/bp604t-ai-applications-in-pharmaceutical-sciences',
    priority: 'high',
    timestamp: 'Yesterday',
    sentAt: Date.now() - 86400000,
    deliveryStatus: 'Delivered',
  },
  {
    id: 'notif-seed-3',
    title: '💡 Daily PCI Study Tip',
    body: 'Environmental Sciences & Ethics are credit-bearing theory subjects under NEP 2020. Read Unit 1 notes today.',
    category: 'tips',
    topic: 'all_students',
    deepLink: '/syllabus',
    priority: 'normal',
    timestamp: '3 days ago',
    sentAt: Date.now() - 259200000,
    deliveryStatus: 'Delivered',
  },
];

const INITIAL_PDFS: AdminPdf[] = [
  {
    id: 'pdf-seed-1',
    title: 'Basics of Python for Pharma — Unit I & II Complete Notes',
    subjectCode: 'BP101T',
    subjectName: 'Basics of Python Programming for Pharmaceutical Sciences',
    semester: 1,
    unit: 'Unit I & II',
    category: 'Notes',
    url: 'https://pharmacode.vercel.app/notes/bp101t-unit-1-2.pdf',
    fileSize: '3.4 MB',
    pages: 38,
    uploadedAt: '2026-11-10',
    downloadsCount: 1420,
  },
  {
    id: 'pdf-seed-2',
    title: 'General Pharmacy — Complete All Units Lecture Notes',
    subjectCode: 'BP102T',
    subjectName: 'General Pharmacy',
    semester: 1,
    unit: 'Complete (Units I-V)',
    category: 'Notes',
    url: 'https://pharmacode.vercel.app/notes/bp102t-complete.pdf',
    fileSize: '5.8 MB',
    pages: 64,
    uploadedAt: '2026-11-08',
    downloadsCount: 2890,
  },
  {
    id: 'pdf-seed-3',
    title: 'AI Applications in Pharmaceutical Sciences — Official Study Kit',
    subjectCode: 'BP604T',
    subjectName: 'AI Applications in Pharmaceutical Sciences',
    semester: 6,
    unit: 'Units I-V Complete',
    category: 'Notes',
    url: 'https://pharmacode.vercel.app/notes/bp604t-ai-notes.pdf',
    fileSize: '4.2 MB',
    pages: 52,
    uploadedAt: '2026-11-12',
    downloadsCount: 940,
  },
  {
    id: 'pdf-seed-4',
    title: 'GPAT High-Yield Medicinal Chemistry SAR Sheet',
    subjectCode: 'BP501T',
    subjectName: 'Biomedicinal Chemistry',
    semester: 5,
    unit: 'Full Formula Kit',
    category: 'Revision Sheet',
    url: 'https://pharmacode.vercel.app/notes/gpat-medchem-sar.pdf',
    fileSize: '2.1 MB',
    pages: 24,
    uploadedAt: '2026-11-05',
    downloadsCount: 3750,
  },
];

const INITIAL_ANALYTICS: AdminAnalytics = {
  activeUsersToday: 486,
  activeUsersWeekly: 2940,
  totalAppInstalls: 5820,
  totalNotesDownloads: 14890,
  totalNotificationsSent: 28,
  appPlatformShare: { android: 86, web: 14 },
  recentEvents: [
    { id: 'ev-1', action: 'App Opened (Active Session)', platform: 'Android App', time: '1 min ago' },
    { id: 'ev-2', action: 'Downloaded BP102T Notes', platform: 'Android App', time: '3 mins ago' },
    { id: 'ev-3', action: 'Syllabus Search: BP604T AI', platform: 'Android App', time: '7 mins ago' },
    { id: 'ev-4', action: 'Notification Received: GPAT Strategy', platform: 'Android App', time: '12 mins ago' },
    { id: 'ev-5', action: 'Web Visitor: Semester 1 Syllabus', platform: 'Web Browser', time: '15 mins ago' },
  ],
};

// ─── AUTHENTICATION HELPERS ───────────────────────────────────────────────────

/**
 * Check if the given client IP is currently rate-limited
 */
export function checkRateLimit(clientIp: string): { allowed: boolean; remainingMs?: number } {
  const entry = failedAttemptsMap.get(clientIp);
  if (!entry) return { allowed: true };

  const now = Date.now();
  if (entry.lockedUntil && entry.lockedUntil > now) {
    return { allowed: false, remainingMs: entry.lockedUntil - now };
  }

  // If lockout expired, reset
  if (entry.lockedUntil && entry.lockedUntil <= now) {
    failedAttemptsMap.delete(clientIp);
  }

  return { allowed: true };
}

/**
 * Record a failed login attempt for brute-force protection
 */
export function recordFailedAttempt(clientIp: string): { locked: boolean; attemptsLeft: number } {
  const entry = failedAttemptsMap.get(clientIp) || { attempts: 0 };
  entry.attempts += 1;

  if (entry.attempts >= MAX_ATTEMPTS) {
    entry.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
    failedAttemptsMap.set(clientIp, entry);
    return { locked: true, attemptsLeft: 0 };
  }

  failedAttemptsMap.set(clientIp, entry);
  return { locked: false, attemptsLeft: MAX_ATTEMPTS - entry.attempts };
}

/**
 * Reset rate limit counter upon successful authentication
 */
export function resetRateLimit(clientIp: string): void {
  failedAttemptsMap.delete(clientIp);
}

/**
 * Timing-safe comparison to prevent timing attacks
 */
export function verifyAdminPassword(password: string): boolean {
  if (!password || typeof password !== 'string') return false;

  const expected = ADMIN_PASSWORD_PLAIN;
  const passwordBuffer = Buffer.from(password);
  const expectedBuffer = Buffer.from(expected);

  if (passwordBuffer.length !== expectedBuffer.length) {
    // Constant-time dummy comparison to prevent length timing leaks
    crypto.timingSafeEqual(expectedBuffer, expectedBuffer);
    return false;
  }

  return crypto.timingSafeEqual(passwordBuffer, expectedBuffer);
}

/**
 * Generate a cryptographically signed session token
 */
export function createSessionToken(): string {
  const payload = JSON.stringify({
    role: 'admin',
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    nonce: crypto.randomBytes(16).toString('hex'),
  });
  const encodedPayload = Buffer.from(payload).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

/**
 * Verify session token validity and expiration
 */
export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token || typeof token !== 'string') return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [encodedPayload, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  try {
    const isSigValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
    if (!isSigValid) return false;

    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (!payload.exp || typeof payload.exp !== 'number') return false;
    if (Date.now() > payload.exp) return false;

    return payload.role === 'admin';
  } catch (_) {
    return false;
  }
}

// ─── DATA ACCESS METHODS ──────────────────────────────────────────────────────

export function getStoredNotifications(): AdminNotification[] {
  ensureDataDir();
  try {
    if (fs.existsSync(NOTIFS_FILE)) {
      const data = fs.readFileSync(NOTIFS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (_) {}
  return INITIAL_NOTIFICATIONS;
}

export function saveNotification(notif: Omit<AdminNotification, 'id' | 'sentAt' | 'deliveryStatus'>): AdminNotification {
  ensureDataDir();
  const current = getStoredNotifications();
  const newNotif: AdminNotification = {
    ...notif,
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    sentAt: Date.now(),
    deliveryStatus: 'Delivered',
  };

  const updated = [newNotif, ...current];
  try {
    fs.writeFileSync(NOTIFS_FILE, JSON.stringify(updated, null, 2), 'utf8');
  } catch (_) {}

  // Update analytics counter
  recordNotificationEvent(newNotif.title);

  return newNotif;
}

export function deleteNotification(id: string): boolean {
  ensureDataDir();
  const current = getStoredNotifications();
  const filtered = current.filter((n) => n.id !== id);
  if (filtered.length !== current.length) {
    try {
      fs.writeFileSync(NOTIFS_FILE, JSON.stringify(filtered, null, 2), 'utf8');
      return true;
    } catch (_) {}
  }
  return false;
}

export function getStoredPdfs(): AdminPdf[] {
  ensureDataDir();
  try {
    if (fs.existsSync(PDFS_FILE)) {
      const data = fs.readFileSync(PDFS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (_) {}
  return INITIAL_PDFS;
}

export function savePdf(pdfData: Omit<AdminPdf, 'id' | 'uploadedAt' | 'downloadsCount'>): AdminPdf {
  ensureDataDir();
  const current = getStoredPdfs();
  const newPdf: AdminPdf = {
    ...pdfData,
    id: `pdf-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    uploadedAt: new Date().toISOString().split('T')[0],
    downloadsCount: 0,
  };

  const updated = [newPdf, ...current];
  try {
    fs.writeFileSync(PDFS_FILE, JSON.stringify(updated, null, 2), 'utf8');
  } catch (_) {}

  return newPdf;
}

export function deletePdf(id: string): boolean {
  ensureDataDir();
  const current = getStoredPdfs();
  const filtered = current.filter((p) => p.id !== id);
  if (filtered.length !== current.length) {
    try {
      fs.writeFileSync(PDFS_FILE, JSON.stringify(filtered, null, 2), 'utf8');
      return true;
    } catch (_) {}
  }
  return false;
}

export function getAnalytics(): AdminAnalytics {
  ensureDataDir();
  try {
    if (fs.existsSync(ANALYTICS_FILE)) {
      const data = fs.readFileSync(ANALYTICS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (_) {}
  return INITIAL_ANALYTICS;
}

export function recordAppHeartbeat(platform: string = 'Android App'): void {
  ensureDataDir();
  const current = getAnalytics();
  current.activeUsersToday += 1;
  const newEvent = {
    id: `ev-${Date.now()}`,
    action: 'App Active Ping',
    platform: platform.includes('Web') ? 'Web Browser' : 'Android App',
    time: 'Just now',
  };
  current.recentEvents = [newEvent, ...current.recentEvents.slice(0, 19)];
  try {
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(current, null, 2), 'utf8');
  } catch (_) {}
}

function recordNotificationEvent(title: string): void {
  const current = getAnalytics();
  current.totalNotificationsSent += 1;
  current.recentEvents = [
    {
      id: `ev-${Date.now()}`,
      action: `Broadcast: ${title.slice(0, 28)}...`,
      platform: 'Admin Broadcast',
      time: 'Just now',
    },
    ...current.recentEvents.slice(0, 19),
  ];
  try {
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(current, null, 2), 'utf8');
  } catch (_) {}
}
