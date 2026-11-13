import crypto from 'crypto';
import fs from 'fs';
import os from 'os';
import path from 'path';

// ─── SECURITY CONSTANTS ────────────────────────────────────────────────────────
const ADMIN_PASSWORD_PLAIN = 'swelo';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'pharmacode-super-secure-secret-key-2026-v1';

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

// ─── STORAGE RESOLUTION (WORKS ON VERCEL SERVERLESS & LOCAL) ───────────────────
// /var/task is read-only on Vercel; os.tmpdir() (/tmp) is writable in serverless lambdas.
const DATA_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), 'pharmacode_store')
  : path.join(process.cwd(), '.data');

const NOTIFS_FILE = path.join(DATA_DIR, 'notifications.json');
const PDFS_FILE = path.join(DATA_DIR, 'pdfs.json');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

// In-memory singleton cache to guarantee 0ms latency across warm Lambda invocations
interface MemoryStore {
  notifications: AdminNotification[];
  pdfs: AdminPdf[];
  analytics: AdminAnalytics;
  activeIps: Map<string, number>; // IP/deviceId -> last seen timestamp
}

declare global {
  // eslint-disable-next-line no-var
  var __pharma_memory_store__: MemoryStore | undefined;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (_) {}
  }
}

// Baseline Initial Data
const BASELINE_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'notif-1',
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
    id: 'notif-2',
    title: '📚 New Semester 6 Notes Added: BP604T',
    body: 'AI Applications in Pharmaceutical Sciences unit-wise notes & diagrams are now live for free download.',
    category: 'notes',
    topic: 'all_students',
    deepLink: '/syllabus/semester-6/bp604t-ai-applications-in-pharmaceutical-sciences',
    priority: 'high',
    timestamp: 'Today',
    sentAt: Date.now() - 86400000,
    deliveryStatus: 'Delivered',
  },
  {
    id: 'notif-3',
    title: '💡 Daily PCI Study Tip',
    body: 'Environmental Sciences & Ethics are credit-bearing theory subjects under NEP 2020. Read Unit 1 notes today.',
    category: 'tips',
    topic: 'all_students',
    deepLink: '/syllabus',
    priority: 'normal',
    timestamp: 'Yesterday',
    sentAt: Date.now() - 172800000,
    deliveryStatus: 'Delivered',
  },
];

const BASELINE_PDFS: AdminPdf[] = [
  {
    id: 'pdf-1',
    title: 'Basics of Python for Pharmaceutical Sciences — Unit I & II Notes',
    subjectCode: 'BP101T',
    subjectName: 'Basics of Python Programming for Pharmaceutical Sciences',
    semester: 1,
    unit: 'Unit I & II',
    category: 'Notes',
    url: 'https://pharmacode.vercel.app/notes/',
    fileSize: '3.4 MB',
    pages: 38,
    uploadedAt: '2026-11-10',
    downloadsCount: 142,
  },
  {
    id: 'pdf-2',
    title: 'General Pharmacy — Complete Lecture Study Notes',
    subjectCode: 'BP102T',
    subjectName: 'General Pharmacy',
    semester: 1,
    unit: 'Complete (Units I-V)',
    category: 'Notes',
    url: 'https://pharmacode.vercel.app/notes/',
    fileSize: '5.8 MB',
    pages: 64,
    uploadedAt: '2026-11-08',
    downloadsCount: 289,
  },
  {
    id: 'pdf-3',
    title: 'AI Applications in Pharmaceutical Sciences — Official Unit Study Kit',
    subjectCode: 'BP604T',
    subjectName: 'AI Applications in Pharmaceutical Sciences',
    semester: 6,
    unit: 'Units I-V Complete',
    category: 'Notes',
    url: 'https://pharmacode.vercel.app/notes/',
    fileSize: '4.2 MB',
    pages: 52,
    uploadedAt: '2026-11-12',
    downloadsCount: 94,
  },
  {
    id: 'pdf-4',
    title: 'GPAT High-Yield Medicinal Chemistry SAR Sheet',
    subjectCode: 'BP501T',
    subjectName: 'Biomedicinal Chemistry',
    semester: 5,
    unit: 'Full Formula Kit',
    category: 'Revision Sheet',
    url: 'https://pharmacode.vercel.app/notes/',
    fileSize: '2.1 MB',
    pages: 24,
    uploadedAt: '2026-11-05',
    downloadsCount: 375,
  },
];

function getMemoryStore(): MemoryStore {
  if (!globalThis.__pharma_memory_store__) {
    ensureDataDir();

    let notifs = BASELINE_NOTIFICATIONS;
    let pdfs = BASELINE_PDFS;

    try {
      if (fs.existsSync(NOTIFS_FILE)) {
        notifs = JSON.parse(fs.readFileSync(NOTIFS_FILE, 'utf8'));
      }
    } catch (_) {}

    try {
      if (fs.existsSync(PDFS_FILE)) {
        pdfs = JSON.parse(fs.readFileSync(PDFS_FILE, 'utf8'));
      }
    } catch (_) {}

    const totalDownloads = pdfs.reduce((sum, p) => sum + (p.downloadsCount || 0), 0);

    globalThis.__pharma_memory_store__ = {
      notifications: notifs,
      pdfs: pdfs,
      analytics: {
        activeUsersToday: 1,
        activeUsersWeekly: 4,
        totalAppInstalls: 12,
        totalNotesDownloads: totalDownloads,
        totalNotificationsSent: notifs.length,
        appPlatformShare: { android: 80, web: 20 },
        recentEvents: [
          { id: 'ev-init', action: 'Admin Console Live', platform: 'System', time: 'Just now' },
        ],
      },
      activeIps: new Map<string, number>([['127.0.0.1', Date.now()]]),
    };
  }
  return globalThis.__pharma_memory_store__;
}

// ─── AUTHENTICATION HELPERS ───────────────────────────────────────────────────

export function verifyAdminPassword(password: string): boolean {
  if (!password || typeof password !== 'string') return false;

  const expected = ADMIN_PASSWORD_PLAIN;
  const passwordBuffer = Buffer.from(password);
  const expectedBuffer = Buffer.from(expected);

  if (passwordBuffer.length !== expectedBuffer.length) {
    crypto.timingSafeEqual(expectedBuffer, expectedBuffer);
    return false;
  }

  return crypto.timingSafeEqual(passwordBuffer, expectedBuffer);
}

export function createSessionToken(): string {
  const payload = JSON.stringify({
    role: 'admin',
    exp: Date.now() + 24 * 60 * 60 * 1000,
    nonce: crypto.randomBytes(16).toString('hex'),
  });
  const encodedPayload = Buffer.from(payload).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

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

// Rate limiting state
const failedAttemptsMap = new Map<string, { attempts: number; lockedUntil?: number }>();

export function checkRateLimit(clientIp: string): { allowed: boolean; remainingMs?: number } {
  const entry = failedAttemptsMap.get(clientIp);
  if (!entry) return { allowed: true };

  const now = Date.now();
  if (entry.lockedUntil && entry.lockedUntil > now) {
    return { allowed: false, remainingMs: entry.lockedUntil - now };
  }

  if (entry.lockedUntil && entry.lockedUntil <= now) {
    failedAttemptsMap.delete(clientIp);
  }

  return { allowed: true };
}

export function recordFailedAttempt(clientIp: string): { locked: boolean; attemptsLeft: number } {
  const entry = failedAttemptsMap.get(clientIp) || { attempts: 0 };
  entry.attempts += 1;

  if (entry.attempts >= 5) {
    entry.lockedUntil = Date.now() + 15 * 60 * 1000;
    failedAttemptsMap.set(clientIp, entry);
    return { locked: true, attemptsLeft: 0 };
  }

  failedAttemptsMap.set(clientIp, entry);
  return { locked: false, attemptsLeft: 5 - entry.attempts };
}

export function resetRateLimit(clientIp: string): void {
  failedAttemptsMap.delete(clientIp);
}

// ─── DATA ACCESS & DYNAMIC SYNCHRONIZATION ────────────────────────────────────

export function getStoredNotifications(): AdminNotification[] {
  const store = getMemoryStore();
  return store.notifications;
}

export function saveNotification(
  notif: Omit<AdminNotification, 'id' | 'sentAt' | 'deliveryStatus'>
): AdminNotification {
  const store = getMemoryStore();
  const newNotif: AdminNotification = {
    ...notif,
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    sentAt: Date.now(),
    deliveryStatus: 'Delivered',
  };

  store.notifications = [newNotif, ...store.notifications];
  store.analytics.totalNotificationsSent = store.notifications.length;

  // Add real event
  addRealEvent(`Broadcast Sent: "${newNotif.title.slice(0, 30)}..."`, 'Admin Broadcast');

  // Try saving to disk
  ensureDataDir();
  try {
    fs.writeFileSync(NOTIFS_FILE, JSON.stringify(store.notifications, null, 2), 'utf8');
  } catch (_) {}

  return newNotif;
}

export function deleteNotification(id: string): boolean {
  const store = getMemoryStore();
  const prevCount = store.notifications.length;
  store.notifications = store.notifications.filter((n) => n.id !== id);

  if (store.notifications.length !== prevCount) {
    store.analytics.totalNotificationsSent = store.notifications.length;
    addRealEvent(`Deleted Notification ID: ${id}`, 'Admin Action');
    ensureDataDir();
    try {
      fs.writeFileSync(NOTIFS_FILE, JSON.stringify(store.notifications, null, 2), 'utf8');
    } catch (_) {}
    return true;
  }
  return false;
}

export function getStoredPdfs(): AdminPdf[] {
  const store = getMemoryStore();
  return store.pdfs;
}

export function savePdf(
  pdfData: Omit<AdminPdf, 'id' | 'uploadedAt' | 'downloadsCount'>
): AdminPdf {
  const store = getMemoryStore();
  const newPdf: AdminPdf = {
    ...pdfData,
    id: `pdf-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    uploadedAt: new Date().toISOString().split('T')[0],
    downloadsCount: 0,
  };

  store.pdfs = [newPdf, ...store.pdfs];
  addRealEvent(`Uploaded PDF: ${newPdf.subjectCode} (${newPdf.unit})`, 'PDF Manager');

  ensureDataDir();
  try {
    fs.writeFileSync(PDFS_FILE, JSON.stringify(store.pdfs, null, 2), 'utf8');
  } catch (_) {}

  return newPdf;
}

export function deletePdf(id: string): boolean {
  const store = getMemoryStore();
  const prevCount = store.pdfs.length;
  store.pdfs = store.pdfs.filter((p) => p.id !== id);

  if (store.pdfs.length !== prevCount) {
    addRealEvent(`Removed PDF ID: ${id}`, 'PDF Manager');
    ensureDataDir();
    try {
      fs.writeFileSync(PDFS_FILE, JSON.stringify(store.pdfs, null, 2), 'utf8');
    } catch (_) {}
    return true;
  }
  return false;
}

export function incrementPdfDownload(id: string): void {
  const store = getMemoryStore();
  const target = store.pdfs.find((p) => p.id === id);
  if (target) {
    target.downloadsCount = (target.downloadsCount || 0) + 1;
    store.analytics.totalNotesDownloads += 1;
    addRealEvent(`Note Downloaded: ${target.subjectCode}`, 'Student Action');
    ensureDataDir();
    try {
      fs.writeFileSync(PDFS_FILE, JSON.stringify(store.pdfs, null, 2), 'utf8');
    } catch (_) {}
  }
}

export function getAnalytics(): AdminAnalytics {
  const store = getMemoryStore();
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

  // Real dynamic active user count based on active IPs/sessions
  let todayCount = 0;
  let weeklyCount = 0;
  for (const [, lastSeen] of store.activeIps.entries()) {
    if (lastSeen >= oneDayAgo) todayCount++;
    if (lastSeen >= oneWeekAgo) weeklyCount++;
  }

  // Ensure minimum baseline if just started
  store.analytics.activeUsersToday = Math.max(todayCount, 1);
  store.analytics.activeUsersWeekly = Math.max(weeklyCount, 1);
  store.analytics.totalNotificationsSent = store.notifications.length;
  store.analytics.totalNotesDownloads = store.pdfs.reduce(
    (sum, p) => sum + (p.downloadsCount || 0),
    0
  );

  return store.analytics;
}

export function recordAppHeartbeat(clientIp: string, platform: string = 'Android App'): void {
  const store = getMemoryStore();
  const ipKey = clientIp || `dev-${Math.floor(Math.random() * 1000)}`;
  store.activeIps.set(ipKey, Date.now());

  const isAndroid = platform.includes('Android');
  const currentShare = store.analytics.appPlatformShare;
  if (isAndroid) {
    currentShare.android = Math.min(currentShare.android + 1, 95);
    currentShare.web = Math.max(100 - currentShare.android, 5);
  } else {
    currentShare.web = Math.min(currentShare.web + 1, 95);
    currentShare.android = Math.max(100 - currentShare.web, 5);
  }

  addRealEvent(
    `Heartbeat Ping: Active Session (${isAndroid ? 'Android APK' : 'Web'})`,
    isAndroid ? 'Android App' : 'Web Browser'
  );
}

function addRealEvent(action: string, platform: string): void {
  const store = getMemoryStore();
  const newEvent = {
    id: `ev-${Date.now()}-${Math.floor(Math.random() * 100)}`,
    action,
    platform,
    time: 'Just now',
  };
  store.analytics.recentEvents = [newEvent, ...store.analytics.recentEvents.slice(0, 14)];
}
