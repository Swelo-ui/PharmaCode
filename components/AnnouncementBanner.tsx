'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Sparkles, ChevronRight } from 'lucide-react';

interface AnnouncementData {
  enabled: boolean;
  text: string;
  badge: string;
  link: string;
  variant: 'indigo' | 'emerald' | 'amber' | 'rose';
}

export function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<AnnouncementData | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    async function loadBanner() {
      try {
        const res = await fetch('/api/website/config/', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data?.config?.announcement?.enabled) {
            const ann = data.config.announcement;
            const dismissedKey = sessionStorage.getItem('pharmacode_dismissed_banner');
            if (dismissedKey !== ann.text) {
              setAnnouncement(ann);
            }
          }
        }
      } catch (_) {}
    }
    loadBanner();
  }, []);

  function handleDismiss() {
    if (announcement) {
      sessionStorage.setItem('pharmacode_dismissed_banner', announcement.text);
    }
    setIsDismissed(true);
  }

  if (!announcement || isDismissed) return null;

  const bgStyles = {
    indigo: 'bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-950 text-indigo-100 border-indigo-700/50',
    emerald: 'bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 text-emerald-100 border-emerald-700/50',
    amber: 'bg-gradient-to-r from-amber-950 via-amber-900 to-orange-950 text-amber-100 border-amber-700/50',
    rose: 'bg-gradient-to-r from-rose-950 via-pink-900 to-rose-950 text-rose-100 border-rose-700/50',
  }[announcement.variant || 'indigo'];

  const badgeBg = {
    indigo: 'bg-indigo-500/30 text-indigo-200 border-indigo-400/40',
    emerald: 'bg-emerald-500/30 text-emerald-200 border-emerald-400/40',
    amber: 'bg-amber-500/30 text-amber-200 border-amber-400/40',
    rose: 'bg-rose-500/30 text-rose-200 border-rose-400/40',
  }[announcement.variant || 'indigo'];

  return (
    <div className={`relative z-50 border-b py-2 px-3 sm:px-6 transition-all duration-300 text-xs ${bgStyles}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex-1 flex items-center justify-center gap-2 text-center flex-wrap">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border ${badgeBg}`}>
            <Sparkles className="w-2.5 h-2.5" />
            {announcement.badge || 'UPDATE'}
          </span>
          <span className="font-medium text-slate-100 leading-snug">
            {announcement.text}
          </span>
          {announcement.link && (
            <Link
              href={announcement.link}
              className="inline-flex items-center gap-0.5 font-bold underline hover:opacity-90 ml-1 text-white"
            >
              <span>Explore</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        <button
          onClick={handleDismiss}
          title="Dismiss notification"
          className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
