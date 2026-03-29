import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, validateRole } from '@/lib/api-middleware';
import { hashPassword } from '@/lib/auth';

// GET /api/users - Get all users (ADMIN only)
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { user, error: authError } = getAuthUser();
    if (authError) return authError;

    // Check role permissions (ADMIN only)
    const { error: roleError } = validateRole(user, ['ADMIN']);
    if (roleError) return roleError;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (role && role !== 'all') {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { studentId: { contains: search } },
        { staffId: { contains: search } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        studentId: true,
        staffId: true,
        department: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create new user (ADMIN only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { user, error: authError } = getAuthUser();
    if (authError) return authError;

    // Check role permissions (ADMIN only)
    const { error: roleError } = validateRole(user, ['ADMIN']);
    if (roleError) return roleError;

    const body = await request.json();
    const { email, password, name, role, studentId, staffId, department, status } = body;

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        role: role || 'STUDENT',
        studentId: studentId || null,
        staffId: staffId || null,
        department: department || null,
        status: status || 'active',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        studentId: true,
        staffId: true,
        department: true,
        createdAt: true,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'User with this email, student ID, or staff ID already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
