import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/tickets - Get all tickets
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (priority && priority !== 'all') {
      where.priority = priority;
    }

    if (search) {
      where.OR = [
        { ticketNo: { contains: search } },
        { subject: { contains: search } },
        { category: { contains: search } },
      ];
    }

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        responses: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

// POST /api/tickets - Create a new ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Generate ticket number
    const count = await prisma.ticket.count();
    const ticketNo = `TKT-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    const ticket = await prisma.ticket.create({
      data: {
        ticketNo,
        subject: body.subject,
        description: body.description,
        category: body.category,
        priority: body.priority || 'medium',
        status: 'open',
        email: body.email,
        phone: body.phone,
        assignedTo: body.assignedTo,
      },
      include: {
        responses: true,
      },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}
