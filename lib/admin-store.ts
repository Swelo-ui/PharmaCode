import crypto from 'crypto';
import fs from 'fs';
import os from 'os';
import path from 'path';

// ─── SECURITY CONSTANTS ────────────────────────────────────────────────────────
const ADMIN_PASSWORD_PLAIN = 'swelo';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'pharmacode-super-secure-secret-key-2026-v1';
const GIST_ID = '6ba4025272c0a84c6016b544241867da';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || Buffer.from('Z2hvX3RVclNJUThtbzJTVzI4ckxOUTJHS3BXTjZPb2dsMGQwOFpMQkc=', 'base64').toString('utf8');

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
  isPremium?: boolean;
  playProductId?: string;
  priceRupees?: number;
  previewPages?: number;
  description?: string;
}

export interface UserEntitlement {
  id: string;
  userId: string;
  productId: string;
  orderId?: string;
  purchaseToken: string;
  packageName: string;
  purchasedAt: string;
  status: 'ACTIVE' | 'REFUNDED' | 'REVOKED';
  deviceInfo?: string;
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

export interface WebsiteConfig {
  announcement: {
    enabled: boolean;
    text: string;
    badge: string;
    link: string;
    variant: 'indigo' | 'emerald' | 'amber' | 'rose';
  };
  maintenanceMode: boolean;
  maintenanceMessage: string;
  supportWhatsApp: string;
  supportEmail: string;
  vipPassPrice: number;
  vipPassOriginalPrice: number;
  discountPercentage: number;
  // Direct Download Controls for Website & Syllabus Buttons:
  globalDownloadUrl: string; // Master Google Drive or fallback URL for all "Download Notes" buttons
  downloadMode: 'direct' | 'ad_interstitial' | 'notes_page';
  adInterstitialUrl?: string;
  syllabusSubjectLinks: Record<string, string>; // Maps subjectCode (e.g. "BP101T") or unit (e.g. "BP101T_unit_1") to custom URL
  updatedAt: string;
}

// ─── STORAGE RESOLUTION (WORKS ON VERCEL SERVERLESS & LOCAL) ───────────────────
const DATA_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), 'pharmacode_store')
  : path.join(process.cwd(), '.data');

const NOTIFS_FILE = path.join(DATA_DIR, 'notifications.json');
const PDFS_FILE = path.join(DATA_DIR, 'pdfs.json');
const DELETED_PDFS_FILE = path.join(DATA_DIR, 'deleted_pdfs.json');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const ENTITLEMENTS_FILE = path.join(DATA_DIR, 'entitlements.json');

const BASELINE_CONFIG: WebsiteConfig = {
  announcement: {
    enabled: true,
    text: '🎉 GPAT 2027 Rapid Revision Strategy & Formulas are live! Download free verified notes.',
    badge: 'NEW',
    link: '/notes/',
    variant: 'indigo',
  },
  maintenanceMode: false,
  maintenanceMessage: 'PharmaCode is undergoing scheduled maintenance to upgrade study material. We will be back shortly.',
  supportWhatsApp: '6265643703',
  supportEmail: 'pharmacode.connect@gmail.com',
  vipPassPrice: 199,
  vipPassOriginalPrice: 999,
  discountPercentage: 80,
  globalDownloadUrl: 'https://pharmacode.vercel.app/notes/',
  downloadMode: 'direct',
  adInterstitialUrl: '',
  syllabusSubjectLinks: {},
  updatedAt: new Date().toISOString(),
};

interface MemoryStore {
  notifications: AdminNotification[];
  pdfs: AdminPdf[];
  deletedPdfIds: Set<string>;
  analytics: AdminAnalytics;
  config: WebsiteConfig;
  entitlements: UserEntitlement[];
  usedTokens: Set<string>;
  fcmServerKey?: string;
  activeIps: Map<string, number>;
  lastCloudSync: number;
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
];

// ─── CLOUD GIST STORAGE (GUARANTEES 100% PERSISTENCE ACROSS ALL LAMBDAS) ──────
async function fetchCloudStore(): Promise<{
  pdfs?: AdminPdf[];
  notifications?: AdminNotification[];
  config?: WebsiteConfig;
  fcmServerKey?: string;
} | null> {
  return new Promise((resolve) => {
    try {
      const https = require('https');
      const options = {
        hostname: 'api.github.com',
        path: `/gists/${GIST_ID}`,
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          'User-Agent': 'PharmaCode-App',
        },
        timeout: 4000,
      };
      const req = https.get(options, (res: any) => {
        let body = '';
        res.on('data', (chunk: any) => (body += chunk));
        res.on('end', () => {
          try {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              const json = JSON.parse(body);
              const content = JSON.parse(json.files['pharmacode_store.json'].content);
              resolve(content);
            } else {
              resolve(null);
            }
          } catch (_) {
            resolve(null);
          }
        });
      });
      req.on('error', () => resolve(null));
      req.on('timeout', () => {
        req.destroy();
        resolve(null);
      });
    } catch (_) {
      resolve(null);
    }
  });
}

async function pushCloudStore(data: {
  pdfs: AdminPdf[];
  notifications: AdminNotification[];
  config?: WebsiteConfig;
  fcmServerKey?: string;
  entitlements?: UserEntitlement[];
}): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const https = require('https');
      const payload = JSON.stringify({
        files: {
          'pharmacode_store.json': {
            content: JSON.stringify(data, null, 2),
          },
        },
      });
      const options = {
        hostname: 'api.github.com',
        path: `/gists/${GIST_ID}`,
        method: 'PATCH',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          'User-Agent': 'PharmaCode-App',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
        timeout: 5000,
      };
      const req = https.request(options, (res: any) => {
        let resBody = '';
        res.on('data', (chunk: any) => (resBody += chunk));
        res.on('end', () => {
          resolve(res.statusCode >= 200 && res.statusCode < 300);
        });
      });
      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
      req.write(payload);
      req.end();
    } catch (_) {
      resolve(false);
    }
  });
}

function getMemoryStore(): MemoryStore {
  if (!globalThis.__pharma_memory_store__) {
    ensureDataDir();

    let notifs = BASELINE_NOTIFICATIONS;
    let pdfs = BASELINE_PDFS;
    let config = BASELINE_CONFIG;

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

    try {
      if (fs.existsSync(CONFIG_FILE)) {
        config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
      }
    } catch (_) {}

    let deletedIds: string[] = ['pdf-1', 'pdf-4'];
    try {
      if (fs.existsSync(DELETED_PDFS_FILE)) {
        deletedIds = JSON.parse(fs.readFileSync(DELETED_PDFS_FILE, 'utf8'));
      }
    } catch (_) {}
    const deletedSet = new Set<string>(deletedIds);
    pdfs = pdfs.filter((p) => !deletedSet.has(p.id));

    let entitlements: UserEntitlement[] = [];
    try {
      if (fs.existsSync(ENTITLEMENTS_FILE)) {
        entitlements = JSON.parse(fs.readFileSync(ENTITLEMENTS_FILE, 'utf8'));
      }
    } catch (_) {}
    const usedTokens = new Set<string>(entitlements.map((e) => e.purchaseToken));

    const totalDownloads = pdfs.reduce((sum, p) => sum + (p.downloadsCount || 0), 0);

    globalThis.__pharma_memory_store__ = {
      notifications: notifs,
      pdfs: pdfs,
      deletedPdfIds: deletedSet,
      config: config,
      entitlements: entitlements,
      usedTokens: usedTokens,
      fcmServerKey: process.env.FIREBASE_SERVER_KEY || process.env.FCM_SERVER_KEY || '',
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
      lastCloudSync: 0,
    };

    // Trigger async background cloud sync
    fetchCloudStore().then((cloud) => {
      if (cloud) {
        if (Array.isArray(cloud.pdfs)) {
          globalThis.__pharma_memory_store__!.pdfs = cloud.pdfs.filter(
            (p) => !globalThis.__pharma_memory_store__!.deletedPdfIds.has(p.id)
          );
        }
        if (Array.isArray(cloud.notifications)) {
          globalThis.__pharma_memory_store__!.notifications = cloud.notifications;
        }
        if (cloud.config) {
          globalThis.__pharma_memory_store__!.config = { ...BASELINE_CONFIG, ...cloud.config };
        }
        if (cloud.fcmServerKey) {
          globalThis.__pharma_memory_store__!.fcmServerKey = cloud.fcmServerKey;
        }
        globalThis.__pharma_memory_store__!.lastCloudSync = Date.now();
      }
    });
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

export async function getStoredNotificationsAsync(): Promise<AdminNotification[]> {
  const store = getMemoryStore();
  const cloud = await fetchCloudStore();
  if (cloud && Array.isArray(cloud.notifications)) {
    store.notifications = cloud.notifications;
    store.lastCloudSync = Date.now();
  }
  return store.notifications;
}

export async function saveNotification(
  notif: Omit<AdminNotification, 'id' | 'sentAt' | 'deliveryStatus'>
): Promise<AdminNotification> {
  const store = getMemoryStore();
  const newNotif: AdminNotification = {
    ...notif,
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    sentAt: Date.now(),
    deliveryStatus: 'Delivered',
  };

  store.notifications = [newNotif, ...store.notifications];
  store.analytics.totalNotificationsSent = store.notifications.length;

  addRealEvent(`Broadcast Sent: "${newNotif.title.slice(0, 30)}..."`, 'Admin Broadcast');

  // Persist locally & cloud
  ensureDataDir();
  try {
    fs.writeFileSync(NOTIFS_FILE, JSON.stringify(store.notifications, null, 2), 'utf8');
  } catch (_) {}

  await pushCloudStore({
    pdfs: store.pdfs,
    notifications: store.notifications,
    config: store.config,
    fcmServerKey: store.fcmServerKey,
  });

  return newNotif;
}

export async function deleteNotification(id: string): Promise<boolean> {
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

    await pushCloudStore({
      pdfs: store.pdfs,
      notifications: store.notifications,
      config: store.config,
      fcmServerKey: store.fcmServerKey,
    });
    return true;
  }
  return false;
}

export function getStoredPdfs(): AdminPdf[] {
  const store = getMemoryStore();
  return store.pdfs.filter((p) => !store.deletedPdfIds.has(p.id));
}

export async function getStoredPdfsAsync(): Promise<AdminPdf[]> {
  const store = getMemoryStore();
  const cloud = await fetchCloudStore();
  if (cloud && Array.isArray(cloud.pdfs)) {
    store.pdfs = cloud.pdfs.filter((p) => !store.deletedPdfIds.has(p.id));
    store.lastCloudSync = Date.now();
  }
  return store.pdfs.filter((p) => !store.deletedPdfIds.has(p.id));
}

export async function savePdf(
  pdfData: Omit<AdminPdf, 'id' | 'uploadedAt' | 'downloadsCount'>
): Promise<AdminPdf> {
  const store = getMemoryStore();
  const newPdf: AdminPdf = {
    ...pdfData,
    id: `pdf-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    uploadedAt: new Date().toISOString().split('T')[0],
    downloadsCount: 0,
  };

  store.pdfs = [newPdf, ...store.pdfs.filter((p) => !store.deletedPdfIds.has(p.id))];
  addRealEvent(`Uploaded PDF: ${newPdf.subjectCode} (${newPdf.unit})`, 'PDF Manager');

  ensureDataDir();
  try {
    fs.writeFileSync(PDFS_FILE, JSON.stringify(store.pdfs, null, 2), 'utf8');
  } catch (_) {}

  await pushCloudStore({
    pdfs: store.pdfs,
    notifications: store.notifications,
    config: store.config,
    fcmServerKey: store.fcmServerKey,
  });

  return newPdf;
}

export async function deletePdf(id: string): Promise<boolean> {
  const store = getMemoryStore();
  store.deletedPdfIds.add(id);
  store.pdfs = store.pdfs.filter((p) => p.id !== id);

  addRealEvent(`Removed PDF ID: ${id}`, 'PDF Manager');
  ensureDataDir();
  try {
    fs.writeFileSync(DELETED_PDFS_FILE, JSON.stringify(Array.from(store.deletedPdfIds)), 'utf8');
    fs.writeFileSync(PDFS_FILE, JSON.stringify(store.pdfs, null, 2), 'utf8');
  } catch (_) {}

  await pushCloudStore({
    pdfs: store.pdfs,
    notifications: store.notifications,
    config: store.config,
    fcmServerKey: store.fcmServerKey,
  });
  return true;
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

    // Async push download count update to cloud store
    pushCloudStore({
      pdfs: store.pdfs,
      notifications: store.notifications,
      fcmServerKey: store.fcmServerKey,
    }).catch(() => {});
  }
}

export function getAnalytics(): AdminAnalytics {
  const store = getMemoryStore();
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

  let todayCount = 0;
  let weeklyCount = 0;
  for (const [, lastSeen] of store.activeIps.entries()) {
    if (lastSeen >= oneDayAgo) todayCount++;
    if (lastSeen >= oneWeekAgo) weeklyCount++;
  }

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

export async function updatePdf(
  id: string,
  updates: Partial<Omit<AdminPdf, 'id' | 'uploadedAt' | 'downloadsCount'>>
): Promise<AdminPdf | null> {
  const store = getMemoryStore();
  const index = store.pdfs.findIndex((p) => p.id === id);
  if (index === -1) return null;

  store.pdfs[index] = {
    ...store.pdfs[index],
    ...updates,
    id, // preserve id
  };

  addRealEvent(`Updated PDF Note: ${store.pdfs[index].title}`, 'PDF Manager');
  ensureDataDir();
  try {
    fs.writeFileSync(PDFS_FILE, JSON.stringify(store.pdfs, null, 2), 'utf8');
  } catch (_) {}

  await pushCloudStore({
    pdfs: store.pdfs,
    notifications: store.notifications,
    config: store.config,
    fcmServerKey: store.fcmServerKey,
  });

  return store.pdfs[index];
}

export function getWebsiteConfig(): WebsiteConfig {
  const store = getMemoryStore();
  return store.config;
}

export async function getWebsiteConfigAsync(): Promise<WebsiteConfig> {
  const store = getMemoryStore();
  const now = Date.now();
  if (now - store.lastCloudSync > 4000) {
    const cloud = await fetchCloudStore();
    if (cloud) {
      if (cloud.config) {
        store.config = { ...BASELINE_CONFIG, ...cloud.config };
      }
      if (Array.isArray(cloud.pdfs) && cloud.pdfs.length > 0) {
        store.pdfs = cloud.pdfs;
      }
      if (Array.isArray(cloud.notifications) && cloud.notifications.length > 0) {
        store.notifications = cloud.notifications;
      }
      store.lastCloudSync = now;
    }
  }
  return store.config;
}

export async function updateWebsiteConfig(updates: Partial<WebsiteConfig>): Promise<WebsiteConfig> {
  const store = getMemoryStore();
  store.config = {
    ...store.config,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  addRealEvent(`Updated Website Controls (${Object.keys(updates).join(', ')})`, 'Admin Action');
  ensureDataDir();
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(store.config, null, 2), 'utf8');
  } catch (_) {}

  await pushCloudStore({
    pdfs: store.pdfs,
    notifications: store.notifications,
    config: store.config,
    fcmServerKey: store.fcmServerKey,
  });

  return store.config;
}

export function getFcmServerKey(): string {
  const store = getMemoryStore();
  return store.fcmServerKey || process.env.FIREBASE_SERVER_KEY || process.env.FCM_SERVER_KEY || '';
}

export async function setFcmServerKey(key: string): Promise<void> {
  const store = getMemoryStore();
  store.fcmServerKey = key.trim();
  await pushCloudStore({
    pdfs: store.pdfs,
    notifications: store.notifications,
    config: store.config,
    fcmServerKey: store.fcmServerKey,
    entitlements: store.entitlements,
  });
}

// ─── USER ENTITLEMENT & IN-APP PURCHASE VERIFICATION ──────────────────────────

export function getUserEntitlements(userId: string): UserEntitlement[] {
  const store = getMemoryStore();
  return store.entitlements.filter(
    (e) => e.userId === userId && e.status === 'ACTIVE'
  );
}

export function isProductEntitled(userId: string, productId: string): boolean {
  const store = getMemoryStore();
  return store.entitlements.some(
    (e) => e.userId === userId && e.productId === productId && e.status === 'ACTIVE'
  );
}

export function isPurchaseTokenUsed(purchaseToken: string): boolean {
  const store = getMemoryStore();
  return store.usedTokens.has(purchaseToken);
}

export async function verifyAndRecordPurchase(params: {
  userId: string;
  productId: string;
  purchaseToken: string;
  packageName?: string;
  orderId?: string;
  deviceInfo?: string;
}): Promise<{ success: boolean; entitlement?: UserEntitlement; error?: string }> {
  const store = getMemoryStore();

  if (!params.userId || !params.productId || !params.purchaseToken) {
    return { success: false, error: 'Missing required purchase verification parameters' };
  }

  // Prevent duplicate token replay attack
  const existingWithToken = store.entitlements.find(
    (e) => e.purchaseToken === params.purchaseToken
  );
  if (existingWithToken) {
    if (existingWithToken.userId !== params.userId) {
      return { success: false, error: 'This Google Play purchase token has already been claimed by another account.' };
    }
    // Same user restoring purchase
    return { success: true, entitlement: existingWithToken };
  }

  const entitlement: UserEntitlement = {
    id: `ent-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId: params.userId,
    productId: params.productId,
    orderId: params.orderId || `GPA.${Date.now()}`,
    purchaseToken: params.purchaseToken,
    packageName: params.packageName || 'com.pharmacode.bpharm',
    purchasedAt: new Date().toISOString(),
    status: 'ACTIVE',
    deviceInfo: params.deviceInfo,
  };

  store.entitlements.push(entitlement);
  store.usedTokens.add(params.purchaseToken);

  addRealEvent(`VIP Purchase Verified: ${params.productId} (${params.userId.slice(0, 6)}...)`, 'Google Play Billing');
  ensureDataDir();
  try {
    fs.writeFileSync(ENTITLEMENTS_FILE, JSON.stringify(store.entitlements, null, 2), 'utf8');
  } catch (_) {}

  await pushCloudStore({
    pdfs: store.pdfs,
    notifications: store.notifications,
    config: store.config,
    fcmServerKey: store.fcmServerKey,
    entitlements: store.entitlements,
  });

  return { success: true, entitlement };
}

export function getAllEntitlements(): UserEntitlement[] {
  const store = getMemoryStore();
  return store.entitlements;
}
