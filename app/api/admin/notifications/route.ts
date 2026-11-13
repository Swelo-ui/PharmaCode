import { NextRequest, NextResponse } from 'next/server';
import {
  verifySessionToken,
  getStoredNotificationsAsync,
  saveNotification,
  deleteNotification,
} from '@/lib/admin-store';
import { broadcastFcmNotification } from '@/lib/fcm-sender';

export async function GET() {
  const notifications = await getStoredNotificationsAsync();
  return NextResponse.json({
    success: true,
    notifications,
    total: notifications.length,
  });
}

export async function POST(req: NextRequest) {
  // Check Admin Authorization
  const sessionCookie = req.cookies.get('pharmacode_admin_session')?.value;
  if (!verifySessionToken(sessionCookie)) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, body: msgBody, category, topic, deepLink, priority } = body;

    if (!title || !msgBody) {
      return NextResponse.json({ error: 'Title and Message Body are required.' }, { status: 400 });
    }

    // 1. Save to cloud feed & persistent store
    const saved = await saveNotification({
      title: title.trim(),
      body: msgBody.trim(),
      category: category || 'announcement',
      topic: topic || 'all_students',
      deepLink: deepLink ? deepLink.trim() : undefined,
      priority: priority || 'high',
      timestamp: 'Just now',
    });

    // 2. Broadcast via Firebase Cloud Messaging
    const fcmResult = await broadcastFcmNotification({
      title: saved.title,
      body: saved.body,
      topic: saved.topic,
      deepLink: saved.deepLink,
      category: saved.category,
      priority: saved.priority,
    });

    return NextResponse.json({
      success: true,
      message: 'Notification published successfully to all apps and web users!',
      notification: saved,
      fcm: fcmResult,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const sessionCookie = req.cookies.get('pharmacode_admin_session')?.value;
  if (!verifySessionToken(sessionCookie)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID parameter required.' }, { status: 400 });
  }

  const deleted = await deleteNotification(id);
  return NextResponse.json({ success: deleted });
}
