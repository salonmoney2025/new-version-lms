import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, validateRole } from '@/lib/api-middleware';

// GET /api/payments - Get all payments (requires authentication)
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { user, error } = getAuthUser();
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};

    // If user is a student, only show their payments
    if (user.role === 'STUDENT') {
      where.studentId = user.userId;
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { receiptNo: { contains: search } },
        { studentId: { contains: search } },
        { studentName: { contains: search } },
        { transactionRef: { contains: search } },
      ];
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        bank: true,
      },
      orderBy: { paymentDate: 'desc' },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

// POST /api/payments - Create a new payment (ADMIN, FINANCE, and STAFF only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { user, error: authError } = getAuthUser();
    if (authError) return authError;

    // Check role permissions
    const { error: roleError } = validateRole(user, ['ADMIN', 'FINANCE', 'STAFF']);
    if (roleError) return roleError;

    const body = await request.json();

    // Generate receipt number
    const count = await prisma.payment.count();
    const receiptNo = `RCT-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const payment = await prisma.payment.create({
      data: {
        receiptNo,
        studentId: body.studentId,
        studentName: body.studentName,
        paymentType: body.paymentType,
        amount: parseFloat(body.amount),
        paymentMethod: body.paymentMethod,
        paymentDate: new Date(body.paymentDate),
        transactionRef: body.transactionRef,
        academicYear: body.academicYear,
        semester: body.semester,
        description: body.description,
        status: body.status || 'completed',
        bankId: body.bankId,
      },
      include: {
        bank: true,
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
