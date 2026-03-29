import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/banks/[id] - Get a single bank
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bank = await prisma.bank.findUnique({
      where: { id: params.id },
      include: {
        payments: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!bank) {
      return NextResponse.json(
        { error: 'Bank not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(bank);
  } catch (error) {
    console.error('Error fetching bank:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bank' },
      { status: 500 }
    );
  }
}

// PUT /api/banks/[id] - Update a bank
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const bank = await prisma.bank.update({
      where: { id: params.id },
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
        status: body.status,
      },
    });

    return NextResponse.json(bank);
  } catch (error) {
    console.error('Error updating bank:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Bank not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update bank' },
      { status: 500 }
    );
  }
}

// DELETE /api/banks/[id] - Delete a bank
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.bank.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Bank deleted successfully' });
  } catch (error) {
    console.error('Error deleting bank:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Bank not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete bank' },
      { status: 500 }
    );
  }
}
