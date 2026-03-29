import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/notifications/unread-count - Get count of unread notifications
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Count unread notifications
    const count = await prisma.notification.count({
      where: {
        userId: user.userId,
        read: false,
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error counting unread notifications:', error);
    return NextResponse.json(
      { error: 'Failed to count unread notifications' },
      { status: 500 }
    );
  }
}
