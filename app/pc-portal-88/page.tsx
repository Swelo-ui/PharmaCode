'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  FileText,
  Users,
  Shield,
  Send,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Smartphone,
  Lock,
  Unlock,
  Sparkles,
  RefreshCw,
  LogOut,
  Download,
  BookOpen,
  Layers,
  Radio,
  Zap,
  Globe,
  Sliders,
  Edit2,
  Search,
  Filter,
  Check,
  Eye,
  X,
  Phone,
  Mail,
  CreditCard,
  Flame,
} from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  category: string;
  topic: string;
  deepLink?: string;
  priority: string;
  timestamp: string;
  sentAt: number;
  deliveryStatus: string;
}

interface PdfItem {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  semester: number;
  unit: string;
  category: string;
  url: string;
  fileSize: string;
  pages: number;
  uploadedAt: string;
  downloadsCount: number;
}

interface WebsiteConfig {
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
  updatedAt: string;
}

interface AnalyticsData {
  activeUsersToday: number;
  activeUsersWeekly: number;
  totalAppInstalls: number;
  totalNotesDownloads: number;
  totalNotificationsSent: number;
  appPlatformShare: { android: number; web: number };
  recentEvents: { id: string; action: string; platform: string; time: string }[];
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Active Tab: 'notifications' | 'pdfs' | 'website' | 'analytics' | 'security'
  const [activeTab, setActiveTab] = useState<'notifications' | 'pdfs' | 'website' | 'analytics' | 'security'>('notifications');

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isSendingNotif, setIsSendingNotif] = useState(false);
  const [notifSuccessMsg, setNotifSuccessMsg] = useState('');
  const [notifForm, setNotifForm] = useState({
    title: '',
    body: '',
    category: 'announcement',
    topic: 'all_students',
    deepLink: '/notes',
    priority: 'high',
  });

  // PDFs State
  const [pdfs, setPdfs] = useState<PdfItem[]>([]);
  const [isAddingPdf, setIsAddingPdf] = useState(false);
  const [pdfSuccessMsg, setPdfSuccessMsg] = useState('');
  const [editingPdf, setEditingPdf] = useState<PdfItem | null>(null);
  const [isUpdatingPdf, setIsUpdatingPdf] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSemester, setFilterSemester] = useState<number | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const [pdfForm, setPdfForm] = useState({
    title: '',
    subjectCode: 'BP101T',
    subjectName: 'Basics of Python Programming for Pharmaceutical Sciences',
    semester: 1,
    unit: 'Unit I & II',
    category: 'Notes',
    url: '',
    fileSize: '3.5 MB',
    pages: 35,
  });

  // Website Live Config State
  const [websiteConfig, setWebsiteConfig] = useState<WebsiteConfig>({
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
    updatedAt: '',
  });
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [configSuccessMsg, setConfigSuccessMsg] = useState('');

  // Analytics State
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // 1. Check Authentication on Mount
  useEffect(() => {
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkSession() {
    try {
      const res = await fetch('/api/admin/session');
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        loadAllData();
      } else {
        setIsAuthenticated(false);
      }
    } catch (_) {
      setIsAuthenticated(false);
    }
  }

  // 2. Load all admin dashboard data
  async function loadAllData() {
    setIsLoadingData(true);
    try {
      const [notifsRes, pdfsRes, analyticsRes, configRes] = await Promise.all([
        fetch('/api/admin/notifications'),
        fetch('/api/admin/pdfs'),
        fetch('/api/admin/analytics'),
        fetch('/api/admin/config'),
      ]);

      if (notifsRes.ok) {
        const notifsData = await notifsRes.json();
        setNotifications(notifsData.notifications || []);
      }
      if (pdfsRes.ok) {
        const pdfsData = await pdfsRes.json();
        setPdfs(pdfsData.pdfs || []);
      }
      if (analyticsRes.ok) {
        const aData = await analyticsRes.json();
        setAnalytics(aData.analytics || null);
      }
      if (configRes.ok) {
        const cData = await configRes.json();
        if (cData.config) {
          setWebsiteConfig(cData.config);
        }
      }
    } catch (e) {
      console.error('Error fetching admin data:', e);
    } finally {
      setIsLoadingData(false);
    }
  }

  // 3. Handle Admin Login
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    setIsSubmittingLogin(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setPassword('');
        loadAllData();
      } else {
        setLoginError(data.error || 'Authentication failed. Please verify password.');
      }
    } catch (err: any) {
      setLoginError('Network error connecting to Admin API.');
    } finally {
      setIsSubmittingLogin(false);
    }
  }

  // 4. Handle Logout
  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    setIsAuthenticated(false);
  }

  // 5. Send Notification
  async function handleSendNotification(e: React.FormEvent) {
    e.preventDefault();
    if (!notifForm.title.trim() || !notifForm.body.trim()) return;

    setIsSendingNotif(true);
    setNotifSuccessMsg('');

    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notifForm),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNotifSuccessMsg('🚀 Notification Broadcast Sent to All Android APK Devices & Web Users!');
        setNotifications((prev) => [data.notification, ...prev]);
        setNotifForm({
          title: '',
          body: '',
          category: 'announcement',
          topic: 'all_students',
          deepLink: '/notes',
          priority: 'high',
        });
        setTimeout(() => setNotifSuccessMsg(''), 5000);
      } else {
        alert(data.error || 'Failed to send notification');
      }
    } catch (err) {
      alert('Error broadcasting notification');
    } finally {
      setIsSendingNotif(false);
    }
  }

  // Quick Templates for Push Notifications
  const quickTemplates = [
    {
      title: '🎓 GPAT 2027 Rapid Revision Strategy Released',
      body: 'Master high-yield SAR tables, Pharmacology mechanisms & Solved Previous Years Questions now.',
      category: 'exam',
      deepLink: '/notes',
      priority: 'urgent',
    },
    {
      title: '📚 New PCI NEP 2020 Notes Uploaded',
      body: 'Unit-wise verified handwritten & typed notes for this semester are now live for instant offline download.',
      category: 'notes',
      deepLink: '/syllabus',
      priority: 'high',
    },
    {
      title: '💡 Daily Medicinal Chemistry SAR Shortcut',
      body: 'Quick mnemonic to memorize adrenergic receptor agonists and SAR rules in under 2 minutes.',
      category: 'tips',
      deepLink: '/syllabus/semester-5/bp501t-biomedicinal-chemistry',
      priority: 'normal',
    },
    {
      title: '📢 PCI Academic Calendar & Model Question Papers',
      body: 'Check the updated B.Pharm credit guidelines & sample semester end-term papers.',
      category: 'announcement',
      deepLink: '/syllabus',
      priority: 'high',
    },
  ];

  function applyTemplate(tpl: typeof quickTemplates[0]) {
    setNotifForm((prev) => ({
      ...prev,
      title: tpl.title,
      body: tpl.body,
      category: tpl.category,
      deepLink: tpl.deepLink,
      priority: tpl.priority,
    }));
  }

  // Delete Notification
  async function handleDeleteNotification(id: string) {
    if (!confirm('Are you sure you want to remove this notification?')) return;
    const res = await fetch(`/api/admin/notifications?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }
  }

  // Add PDF
  async function handleAddPdf(e: React.FormEvent) {
    e.preventDefault();
    if (!pdfForm.title.trim() || !pdfForm.url.trim()) return;

    setIsAddingPdf(true);
    setPdfSuccessMsg('');

    try {
      const res = await fetch('/api/admin/pdfs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pdfForm),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPdfSuccessMsg('✅ Study PDF added and published to App & Website!');
        setPdfs((prev) => [data.pdf, ...prev]);
        setPdfForm({
          title: '',
          subjectCode: 'BP101T',
          subjectName: 'Basics of Python Programming for Pharmaceutical Sciences',
          semester: 1,
          unit: 'Unit I & II',
          category: 'Notes',
          url: '',
          fileSize: '3.5 MB',
          pages: 35,
        });
        setTimeout(() => setPdfSuccessMsg(''), 5000);
      } else {
        alert(data.error || 'Failed to add PDF');
      }
    } catch (_) {
      alert('Error saving PDF');
    } finally {
      setIsAddingPdf(false);
    }
  }

  // Update PDF
  async function handleUpdatePdf(e: React.FormEvent) {
    e.preventDefault();
    if (!editingPdf) return;

    setIsUpdatingPdf(true);
    try {
      const res = await fetch('/api/admin/pdfs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPdf),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPdfs((prev) => prev.map((p) => (p.id === data.pdf.id ? data.pdf : p)));
        setEditingPdf(null);
      } else {
        alert(data.error || 'Failed to update PDF');
      }
    } catch (_) {
      alert('Error updating PDF');
    } finally {
      setIsUpdatingPdf(false);
    }
  }

  // Delete PDF
  async function handleDeletePdf(id: string) {
    if (!confirm('Remove this PDF from the library?')) return;
    const res = await fetch(`/api/admin/pdfs?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setPdfs((prev) => prev.filter((p) => p.id !== id));
    }
  }

  // Save Website Live Config
  async function handleSaveWebsiteConfig(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingConfig(true);
    setConfigSuccessMsg('');

    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(websiteConfig),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setConfigSuccessMsg('🎉 Website Controls Saved! Changes are active immediately on the live website.');
        setWebsiteConfig(data.config);
        setTimeout(() => setConfigSuccessMsg(''), 5000);
      } else {
        alert(data.error || 'Failed to save configuration');
      }
    } catch (_) {
      alert('Error connecting to config API');
    } finally {
      setIsSavingConfig(false);
    }
  }

  // Filtered PDFs
  const filteredPdfs = pdfs.filter((p) => {
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.unit.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSem = filterSemester === 'all' || p.semester === filterSemester;
    const matchesCat = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesSem && matchesCat;
  });

  // ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 mb-4 shadow-inner">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">PharmaCode Admin</h1>
            <p className="text-sm text-slate-400 mt-1">
              Secure Central Command for Android App &amp; Web Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Access Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  required
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmittingLogin}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 active:scale-[0.98] text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmittingLogin ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Authenticate &amp; Enter Console</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              FCM Cloud Gateway Active
            </span>
            <span>PCI NEP 2020 Protected</span>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-indigo-500" />
          <span className="text-sm font-medium text-slate-300">Loading PharmaCode Admin Hub...</span>
        </div>
      </div>
    );
  }

  // ─── AUTHENTICATED DASHBOARD ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-white text-base tracking-tight">PharmaCode Admin Hub</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold tracking-wide uppercase">
                Real-Time Cloud Connected
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Control APK &amp; Website in Real-Time</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllData}
            title="Refresh Data"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Website</span>
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Students Today</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {analytics?.activeUsersToday ?? 0}
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <span>{analytics ? `${analytics.activeUsersWeekly} active this week` : 'Live session tracking'}</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Push Notifications</span>
              <Radio className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {notifications.length} Sent
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-indigo-400 font-medium">
              <span>FCM Topic: all_students</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Study PDFs</span>
              <FileText className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {pdfs.length} Published
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
              <span>{(analytics?.totalNotesDownloads ?? pdfs.reduce((sum, p) => sum + (p.downloadsCount || 0), 0)).toLocaleString()} Total Downloads</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Live Top Banner</span>
              <Globe className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              {websiteConfig.announcement.enabled ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Active on Web
                </span>
              ) : (
                <span className="text-slate-500">Disabled</span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
              <span>VIP Pass: ₹{websiteConfig.vipPassPrice}</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'notifications'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Push Notifications Broadcast</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-900/60 text-[10px]">
              {notifications.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pdfs')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'pdfs'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>PDF Notes Manager</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-900/60 text-[10px]">
              {pdfs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('website')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'website'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Website &amp; Live Controls</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Active Users &amp; Live Feed</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Security &amp; Console Status</span>
          </button>
        </div>

        {/* ─── TAB 1: NOTIFICATIONS ────────────────────────────────────────────── */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            {/* Quick Templates Row */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">1-Click High-Engagement Templates</h3>
                <span className="text-xs text-slate-400">(Click any card to auto-fill the composer)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {quickTemplates.map((tpl, idx) => (
                  <div
                    key={idx}
                    onClick={() => applyTemplate(tpl)}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-950/20 cursor-pointer transition-all group"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-indigo-300 line-clamp-1 mb-1">
                      {tpl.title}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-2">{tpl.body}</div>
                    <div className="mt-2.5 flex items-center justify-between text-[10px] text-indigo-400 font-semibold">
                      <span>Click to use</span>
                      <Send className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Composer */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-indigo-400" />
                  <h2 className="text-base font-bold text-white">Broadcast Real-Time Push Notification</h2>
                </div>
                <span className="text-xs text-slate-400">Offline &amp; Online Instant Sync</span>
              </div>

              <form onSubmit={handleSendNotification} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Notification Title <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={notifForm.title}
                    onChange={(e) => setNotifForm({ ...notifForm, title: e.target.value })}
                    placeholder="e.g. 🎓 GPAT 2027 Rapid Revision Strategy"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Notification Message / Body <span className="text-indigo-400">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={notifForm.body}
                    onChange={(e) => setNotifForm({ ...notifForm, body: e.target.value })}
                    placeholder="Detailed update or advice for pharmacy students..."
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
                    <select
                      value={notifForm.category}
                      onChange={(e) => setNotifForm({ ...notifForm, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="exam">Exam &amp; GPAT</option>
                      <option value="notes">New Notes &amp; Syllabus</option>
                      <option value="tips">Study Tips</option>
                      <option value="announcement">Announcement</option>
                      <option value="update">App / Portal Update</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Priority</label>
                    <select
                      value={notifForm.priority}
                      onChange={(e) => setNotifForm({ ...notifForm, priority: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="urgent">Urgent (Immediate Banner + Sound)</option>
                      <option value="high">High</option>
                      <option value="normal">Normal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Deep Link / Route</label>
                    <input
                      type="text"
                      value={notifForm.deepLink}
                      onChange={(e) => setNotifForm({ ...notifForm, deepLink: e.target.value })}
                      placeholder="/notes or /syllabus"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                    </input>
                  </div>
                </div>

                {notifSuccessMsg && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{notifSuccessMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSendingNotif}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 active:scale-[0.98] text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                >
                  {isSendingNotif ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Broadcasting across devices...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Realtime Broadcast Now</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Broadcast History */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">Broadcast History &amp; Delivery Log ({notifications.length})</h3>
                <span className="text-xs text-slate-400">Delivered via FCM &amp; In-App History</span>
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">No broadcasts recorded yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-3">Title &amp; Message</th>
                        <th className="py-3 px-3">Category</th>
                        <th className="py-3 px-3">Target Topic</th>
                        <th className="py-3 px-3">Sent Time</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {notifications.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-3">
                            <div className="font-bold text-white line-clamp-1">{item.title}</div>
                            <div className="text-slate-400 text-[11px] line-clamp-1">{item.body}</div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] uppercase font-semibold">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-[11px] text-indigo-300">{item.topic}</td>
                          <td className="py-3 px-3 text-slate-400">{item.timestamp}</td>
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                              <CheckCircle2 className="w-3 h-3" />
                              {item.deliveryStatus}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => handleDeleteNotification(item.id)}
                              title="Delete"
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 2: PDFS & NOTES ──────────────────────────────────────────────── */}
        {activeTab === 'pdfs' && (
          <div className="space-y-6">
            {/* Add PDF Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-indigo-400" />
                  <h2 className="text-base font-bold text-white">Add New Study Material &amp; PDF Note</h2>
                </div>
                <span className="text-xs text-slate-400">Available to both Website &amp; APK</span>
              </div>

              <form onSubmit={handleAddPdf} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      PDF Document Title <span className="text-indigo-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={pdfForm.title}
                      onChange={(e) => setPdfForm({ ...pdfForm, title: e.target.value })}
                      placeholder="e.g. Basics of Python — Unit 1 Detailed Notes"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      PDF File Download URL <span className="text-indigo-400">*</span>
                    </label>
                    <input
                      type="url"
                      value={pdfForm.url}
                      onChange={(e) => setPdfForm({ ...pdfForm, url: e.target.value })}
                      placeholder="https://drive.google.com/... or direct link"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subject Code</label>
                    <input
                      type="text"
                      value={pdfForm.subjectCode}
                      onChange={(e) => setPdfForm({ ...pdfForm, subjectCode: e.target.value })}
                      placeholder="BP101T"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Semester</label>
                    <select
                      value={pdfForm.semester}
                      onChange={(e) => setPdfForm({ ...pdfForm, semester: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s}>
                          Semester {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Unit</label>
                    <input
                      type="text"
                      value={pdfForm.unit}
                      onChange={(e) => setPdfForm({ ...pdfForm, unit: e.target.value })}
                      placeholder="Unit I / Complete"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
                    <select
                      value={pdfForm.category}
                      onChange={(e) => setPdfForm({ ...pdfForm, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Notes">Theory Notes</option>
                      <option value="Question Paper">Previous Question Paper</option>
                      <option value="Revision Sheet">Rapid Revision Sheet</option>
                      <option value="Lab Manual">Practical Lab Manual</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Estimated File Size</label>
                    <input
                      type="text"
                      value={pdfForm.fileSize}
                      onChange={(e) => setPdfForm({ ...pdfForm, fileSize: e.target.value })}
                      placeholder="3.5 MB"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Total Pages</label>
                    <input
                      type="number"
                      value={pdfForm.pages}
                      onChange={(e) => setPdfForm({ ...pdfForm, pages: Number(e.target.value) })}
                      placeholder="35"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {pdfSuccessMsg && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{pdfSuccessMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isAddingPdf}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                >
                  {isAddingPdf ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Publishing PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Publish Study PDF to App &amp; Web</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Published PDFs Table + Search & Filter */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Managed Study PDFs ({filteredPdfs.length} / {pdfs.length})</h3>
                  <p className="text-xs text-slate-400">Synchronized with website /notes/ page and mobile APK</p>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-48">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search PDF..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <select
                    value={filterSemester}
                    onChange={(e) => setFilterSemester(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="all">All Semesters</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Sem {s}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="all">All Types</option>
                    <option value="Notes">Notes</option>
                    <option value="Question Paper">Question Paper</option>
                    <option value="Revision Sheet">Revision Sheet</option>
                    <option value="Lab Manual">Lab Manual</option>
                  </select>
                </div>
              </div>

              {filteredPdfs.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">No matching PDFs found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-3">Title</th>
                        <th className="py-3 px-3">Subject / Sem</th>
                        <th className="py-3 px-3">Unit</th>
                        <th className="py-3 px-3">Size &amp; Pages</th>
                        <th className="py-3 px-3">Downloads</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredPdfs.map((pdf) => (
                        <tr key={pdf.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-3 font-semibold text-white">
                            <div className="line-clamp-1">{pdf.title}</div>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-900/40 text-indigo-300 font-normal">
                              {pdf.category}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-mono text-indigo-300">{pdf.subjectCode}</div>
                            <div className="text-[11px] text-slate-400">Sem {pdf.semester}</div>
                          </td>
                          <td className="py-3 px-3 text-slate-300">{pdf.unit}</td>
                          <td className="py-3 px-3 text-slate-400">
                            {pdf.fileSize} · {pdf.pages}p
                          </td>
                          <td className="py-3 px-3 font-medium text-emerald-400">
                            {pdf.downloadsCount.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => setEditingPdf(pdf)}
                              title="Edit Details"
                              className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition-colors inline-block"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <a
                              href={pdf.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-block p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                              title="Download / Test Link"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => handleDeletePdf(pdf.id)}
                              title="Delete"
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Edit PDF Modal */}
            {editingPdf && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="font-bold text-white text-base">Edit Study PDF Details</h3>
                    <button
                      onClick={() => setEditingPdf(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleUpdatePdf} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                      <input
                        type="text"
                        value={editingPdf.title}
                        onChange={(e) => setEditingPdf({ ...editingPdf, title: e.target.value })}
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Code</label>
                        <input
                          type="text"
                          value={editingPdf.subjectCode}
                          onChange={(e) => setEditingPdf({ ...editingPdf, subjectCode: e.target.value.toUpperCase() })}
                          required
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Semester</label>
                        <select
                          value={editingPdf.semester}
                          onChange={(e) => setEditingPdf({ ...editingPdf, semester: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                            <option key={s} value={s}>
                              Semester {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Unit</label>
                        <input
                          type="text"
                          value={editingPdf.unit}
                          onChange={(e) => setEditingPdf({ ...editingPdf, unit: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                        <select
                          value={editingPdf.category}
                          onChange={(e) => setEditingPdf({ ...editingPdf, category: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        >
                          <option value="Notes">Notes</option>
                          <option value="Question Paper">Question Paper</option>
                          <option value="Revision Sheet">Revision Sheet</option>
                          <option value="Lab Manual">Lab Manual</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Download URL</label>
                      <input
                        type="url"
                        value={editingPdf.url}
                        onChange={(e) => setEditingPdf({ ...editingPdf, url: e.target.value })}
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">File Size</label>
                        <input
                          type="text"
                          value={editingPdf.fileSize}
                          onChange={(e) => setEditingPdf({ ...editingPdf, fileSize: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Total Pages</label>
                        <input
                          type="number"
                          value={editingPdf.pages}
                          onChange={(e) => setEditingPdf({ ...editingPdf, pages: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setEditingPdf(null)}
                        className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isUpdatingPdf}
                        className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs text-white shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
                      >
                        {isUpdatingPdf ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 3: WEBSITE & LIVE CONTROLS ───────────────────────────────────── */}
        {activeTab === 'website' && (
          <div className="space-y-6">
            <form onSubmit={handleSaveWebsiteConfig} className="space-y-6">
              {/* 1. Global Announcement Banner */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h2 className="text-base font-bold text-white">Live Top Announcement Banner (Website Header)</h2>
                      <p className="text-xs text-slate-400">Displays at the very top of all website pages in real-time</p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={websiteConfig.announcement.enabled}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          announcement: { ...websiteConfig.announcement, enabled: e.target.checked },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Badge Text</label>
                    <input
                      type="text"
                      value={websiteConfig.announcement.badge}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          announcement: { ...websiteConfig.announcement, badge: e.target.value.toUpperCase() },
                        })
                      }
                      placeholder="NEW / ALERT / UPDATE"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Banner Message</label>
                    <input
                      type="text"
                      value={websiteConfig.announcement.text}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          announcement: { ...websiteConfig.announcement, text: e.target.value },
                        })
                      }
                      placeholder="Announcement shown to all students..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Color Theme</label>
                    <select
                      value={websiteConfig.announcement.variant}
                      onChange={(e) =>
                        setWebsiteConfig({
                          ...websiteConfig,
                          announcement: {
                            ...websiteConfig.announcement,
                            variant: e.target.value as any,
                          },
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="indigo">Indigo / Royal Blue</option>
                      <option value="emerald">Emerald Green</option>
                      <option value="amber">Amber Gold</option>
                      <option value="rose">Rose Red</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Button Destination Link</label>
                  <input
                    type="text"
                    value={websiteConfig.announcement.link}
                    onChange={(e) =>
                      setWebsiteConfig({
                        ...websiteConfig,
                        announcement: { ...websiteConfig.announcement, link: e.target.value },
                      })
                    }
                    placeholder="/notes/ or /syllabus/"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                {/* Banner Live Preview */}
                <div className="mt-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <div className="text-[11px] text-slate-400 font-semibold mb-2">Live Website Preview:</div>
                  <div className={`p-2 rounded-lg text-xs flex items-center justify-center gap-2 ${
                    websiteConfig.announcement.variant === 'emerald'
                      ? 'bg-emerald-950 text-emerald-200 border border-emerald-800'
                      : websiteConfig.announcement.variant === 'amber'
                      ? 'bg-amber-950 text-amber-200 border border-amber-800'
                      : websiteConfig.announcement.variant === 'rose'
                      ? 'bg-rose-950 text-rose-200 border border-rose-800'
                      : 'bg-indigo-950 text-indigo-200 border border-indigo-800'
                  }`}>
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/20">
                      {websiteConfig.announcement.badge || 'NEW'}
                    </span>
                    <span>{websiteConfig.announcement.text || 'Preview text'}</span>
                    <span className="underline font-bold text-[11px]">Explore &rarr;</span>
                  </div>
                </div>
              </div>

              {/* 2. Official Helpdesk & Support Contacts */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <Phone className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h2 className="text-base font-bold text-white">Student Helpline &amp; Mentor Support Contacts</h2>
                    <p className="text-xs text-slate-400">Used for WhatsApp doubt solver &amp; email queries across app &amp; site</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp Mentor Mobile Number</span>
                    </label>
                    <input
                      type="text"
                      value={websiteConfig.supportWhatsApp}
                      onChange={(e) => setWebsiteConfig({ ...websiteConfig, supportWhatsApp: e.target.value })}
                      placeholder="6265643703"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-400" />
                      <span>Official Support Email Address</span>
                    </label>
                    <input
                      type="email"
                      value={websiteConfig.supportEmail}
                      onChange={(e) => setWebsiteConfig({ ...websiteConfig, supportEmail: e.target.value })}
                      placeholder="pharmacode.connect@gmail.com"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 3. VIP Pre-Booking Study Pass Pricing */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  <div>
                    <h2 className="text-base font-bold text-white">VIP Pre-Booking Study Pass Settings</h2>
                    <p className="text-xs text-slate-400">Controls VIP Pass pricing displayed in Settings &amp; Notes screen</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">VIP Pass Offer Price (₹)</label>
                    <input
                      type="number"
                      value={websiteConfig.vipPassPrice}
                      onChange={(e) => setWebsiteConfig({ ...websiteConfig, vipPassPrice: Number(e.target.value) })}
                      placeholder="199"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Original Price (₹)</label>
                    <input
                      type="number"
                      value={websiteConfig.vipPassOriginalPrice}
                      onChange={(e) => setWebsiteConfig({ ...websiteConfig, vipPassOriginalPrice: Number(e.target.value) })}
                      placeholder="999"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Discount Percentage (%)</label>
                    <input
                      type="number"
                      value={websiteConfig.discountPercentage}
                      onChange={(e) => setWebsiteConfig({ ...websiteConfig, discountPercentage: Number(e.target.value) })}
                      placeholder="80"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Maintenance Mode */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-rose-400" />
                    <div>
                      <h2 className="text-base font-bold text-white">Emergency Maintenance Mode</h2>
                      <p className="text-xs text-slate-400">Temporarily displays maintenance message to users during major upgrades</p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={websiteConfig.maintenanceMode}
                      onChange={(e) => setWebsiteConfig({ ...websiteConfig, maintenanceMode: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                  </label>
                </div>

                {websiteConfig.maintenanceMode && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Maintenance Notice Message</label>
                    <textarea
                      rows={2}
                      value={websiteConfig.maintenanceMessage}
                      onChange={(e) => setWebsiteConfig({ ...websiteConfig, maintenanceMessage: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                )}
              </div>

              {configSuccessMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{configSuccessMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSavingConfig}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-3.5 px-4 rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
              >
                {isSavingConfig ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Pushing updates to cloud...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save &amp; Publish Website Controls</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ─── TAB 4: ACTIVE USERS & ANALYTICS ─────────────────────────────────── */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Platform Share */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-4">Platform Distribution</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                        Android APK App
                      </span>
                      <span className="font-bold text-white">{analytics?.appPlatformShare?.android ?? 80}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${analytics?.appPlatformShare?.android ?? 80}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                        Web Portal (Vercel)
                      </span>
                      <span className="font-bold text-white">{analytics?.appPlatformShare?.web ?? 20}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: `${analytics?.appPlatformShare?.web ?? 20}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:col-span-2">
                <h3 className="text-sm font-bold text-white mb-4">Student Engagement Summary</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <div className="text-[11px] text-slate-400 font-medium">Weekly Active Students</div>
                    <div className="text-xl font-bold text-white mt-1">
                      {(analytics?.activeUsersWeekly ?? 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <div className="text-[11px] text-slate-400 font-medium">Total Notes Downloads</div>
                    <div className="text-xl font-bold text-white mt-1">
                      {(analytics?.totalNotesDownloads ?? pdfs.reduce((sum, p) => sum + (p.downloadsCount || 0), 0)).toLocaleString()}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <div className="text-[11px] text-slate-400 font-medium">Total Broadcasts</div>
                    <div className="text-xl font-bold text-white mt-1">{notifications.length}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Event Stream */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <h3 className="text-base font-bold text-white">Live Student Activity Stream</h3>
                </div>
                <span className="text-xs text-slate-400">Anonymous heartbeat logs</span>
              </div>

              <div className="space-y-2.5">
                {(analytics?.recentEvents || []).map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800/60 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                      <span className="font-medium text-slate-200">{ev.action}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400">
                        {ev.platform}
                      </span>
                    </div>
                    <span className="text-slate-500 font-mono text-[11px]">{ev.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 5: SECURITY & GOOGLE PLAY POLICIES ─────────────────────────── */}
        {activeTab === 'security' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-base font-bold text-white mb-2">Admin Security &amp; Policy Compliance</h2>
              <p className="text-xs text-slate-400">
                This admin console is engineered with bank-grade defenses to prevent unauthorized intrusion,
                scraping, and brute-force guessing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
                  <Shield className="w-4 h-4" />
                  <span>Brute-Force &amp; Timing Attack Defense</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Authentication uses constant-time byte comparisons (<code className="text-indigo-300">crypto.timingSafeEqual</code>)
                  and automated IP lockout after 5 invalid attempts for 15 minutes. Plaintext password is never sent to client JS.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Google Play Developer Policy Compliant</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Strictly conforms to Play Console Notification and Malicious Download policies. No remote executable code is distributed.
                  Students retain complete opt-in/opt-out control in their settings.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-1">
              <div className="font-bold text-slate-200">Session Information:</div>
              <div className="text-slate-400">
                Logged in as Master Administrator · Session cookie: <code className="text-indigo-400">SameSite=Strict, HttpOnly</code> · Expires in 24 hours
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
        PharmaCode Master Control Console · PCI NEP 2020 · All rights reserved.
      </footer>
    </div>
  );
}
