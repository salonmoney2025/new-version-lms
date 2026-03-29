import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/activity-logs - Get activity logs (admin only)
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

    // Only ADMIN and FINANCE roles can view activity logs
    if (user.role !== 'ADMIN' && user.role !== 'FINANCE') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const entity = searchParams.get('entity');
    const action = searchParams.get('action');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: Record<string, string> = {};
    if (userId) where.userId = userId;
    if (entity) where.entity = entity;
    if (action) where.action = action;

    // Fetch activity logs
    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      prisma.activityLog.count({ where }),
    ]);

    return NextResponse.json({
      logs,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity logs' },
      { status: 500 }
    );
  }
}

// POST /api/activity-logs - Create activity log (internal use)
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const {
      action,
      entity,
      entityId,
      description,
      metadata,
    } = body;

    // Validate required fields
    if (!action || !entity || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get IP and user agent from headers
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create activity log
    const log = await prisma.activityLog.create({
      data: {
        userId: user.userId,
        userName: user.name,
        action,
        entity,
        entityId,
        description,
        ipAddress,
        userAgent,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error('Error creating activity log:', error);
    return NextResponse.json(
      { error: 'Failed to create activity log' },
      { status: 500 }
    );
  }
}
