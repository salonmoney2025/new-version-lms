import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, validateRole } from '@/lib/api-middleware';
import { hashPassword } from '@/lib/auth';

// GET /api/users/[id] - Get single user (ADMIN only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const { user, error: authError } = getAuthUser();
    if (authError) return authError;

    // Check role permissions (ADMIN only)
    const { error: roleError } = validateRole(user, ['ADMIN']);
    if (roleError) return roleError;

    const foundUser = await prisma.user.findUnique({
      where: { id: params.id },
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
      },
    });

    if (!foundUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(foundUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update user (ADMIN only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const { user, error: authError } = getAuthUser();
    if (authError) return authError;

    // Check role permissions (ADMIN only)
    const { error: roleError } = validateRole(user, ['ADMIN']);
    if (roleError) return roleError;

    const body = await request.json();
    const { email, name, role, studentId, staffId, department, status, password } = body;

    const data: Record<string, unknown> = {};

    if (email) data.email = email.toLowerCase();
    if (name) data.name = name;
    if (role) data.role = role;
    if (studentId !== undefined) data.studentId = studentId || null;
    if (staffId !== undefined) data.staffId = staffId || null;
    if (department !== undefined) data.department = department || null;
    if (status) data.status = status;

    // If password is provided, hash it
    if (password) {
      if (password.length < 8) {
        return NextResponse.json(
          { error: 'Password must be at least 8 characters long' },
          { status: 400 }
        );
      }
      data.password = await hashPassword(password);
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data,
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
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email, student ID, or staff ID already in use' },
        { status: 400 }
      );
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete user (ADMIN only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const { user, error: authError } = getAuthUser();
    if (authError) return authError;

    // Check role permissions (ADMIN only)
    const { error: roleError } = validateRole(user, ['ADMIN']);
    if (roleError) return roleError;

    // Prevent self-deletion
    if (user.userId === params.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
