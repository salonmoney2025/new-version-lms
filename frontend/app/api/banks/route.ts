import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, validateRole } from '@/lib/api-middleware';

// GET /api/banks - Get all banks (requires authentication)
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { error } = getAuthUser();
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { bankName: { contains: search } },
        { bankCode: { contains: search } },
        { branch: { contains: search } },
        { city: { contains: search } },
      ];
    }

    const banks = await prisma.bank.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(banks);
  } catch (error) {
    console.error('Error fetching banks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banks' },
      { status: 500 }
    );
  }
}

// POST /api/banks - Create a new bank (ADMIN and FINANCE only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { user, error: authError } = getAuthUser();
    if (authError) return authError;

    // Check role permissions
    const { error: roleError } = validateRole(user, ['ADMIN', 'FINANCE']);
    if (roleError) return roleError;

    const body = await request.json();

    const bank = await prisma.bank.create({
      data: {
        bankName: body.bankName,
        bankCode: body.bankCode,
        swiftCode: body.swiftCode,
        sortCode: body.sortCode,
        branch: body.branch,
        address: body.address,
        city: body.city,
        phone: body.phone,
        email: body.email,
        accountNumber: body.accountNumber,
        accountName: body.accountName,
        status: body.status || 'active',
      },
    });

    return NextResponse.json(bank, { status: 201 });
  } catch (error) {
    console.error('Error creating bank:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Bank code already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create bank' },
      { status: 500 }
    );
  }
}
