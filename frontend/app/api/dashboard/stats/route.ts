import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, validateRole } from '@/lib/api-middleware';

export async function GET() {
  try {
    // Check authentication
    const { user, error: authError } = getAuthUser();
    if (authError) return authError;

    // Check role permissions (ADMIN and FINANCE can view dashboard stats)
    const { error: roleError } = validateRole(user, ['ADMIN', 'FINANCE']);
    if (roleError) return roleError;

    // Get current year and month
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // Get statistics in parallel
    const [
      totalStudents,
      totalPayments,
      totalRevenue,
      monthlyPayments,
      monthlyRevenue,
      totalBanks,
      activeBanks,
      totalTickets,
      openTickets,
      recentPayments,
      paymentsByType,
      paymentsByMonth,
    ] = await Promise.all([
      // Total students (unique student IDs in payments)
      prisma.payment.findMany({
        select: { studentId: true },
        distinct: ['studentId'],
      }),

      // Total payments
      prisma.payment.count(),

      // Total revenue
      prisma.payment.aggregate({
        _sum: { amount: true },
      }),

      // Monthly payments count
      prisma.payment.count({
        where: {
          paymentDate: {
            gte: firstDayOfMonth,
            lte: lastDayOfMonth,
          },
        },
      }),

      // Monthly revenue
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          paymentDate: {
            gte: firstDayOfMonth,
            lte: lastDayOfMonth,
          },
        },
      }),

      // Total banks
      prisma.bank.count(),

      // Active banks
      prisma.bank.count({
        where: { status: 'active' },
      }),

      // Total tickets
      prisma.ticket.count(),

      // Open tickets
      prisma.ticket.count({
        where: { status: 'open' },
      }),

      // Recent payments (last 10)
      prisma.payment.findMany({
        take: 10,
        orderBy: { paymentDate: 'desc' },
        include: {
          bank: true,
        },
      }),

      // Payments by type
      prisma.payment.groupBy({
        by: ['paymentType'],
        _count: true,
        _sum: { amount: true },
      }),

      // Payments by month (last 6 months)
      prisma.payment.findMany({
        where: {
          paymentDate: {
            gte: new Date(currentYear, currentMonth - 5, 1),
          },
        },
        select: {
          paymentDate: true,
          amount: true,
        },
      }),
    ]);

    // Process monthly data
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const monthDate = new Date(currentYear, currentMonth - (5 - i), 1);
      const monthName = monthDate.toLocaleString('default', { month: 'short' });
      const monthPayments = paymentsByMonth.filter(
        (p) => p.paymentDate.getMonth() === monthDate.getMonth()
      );

      return {
        month: monthName,
        payments: monthPayments.length,
        revenue: monthPayments.reduce((sum, p) => sum + p.amount, 0),
      };
    });

    const stats = {
      overview: {
        totalStudents: totalStudents.length,
        totalPayments,
        totalRevenue: totalRevenue._sum.amount || 0,
        monthlyPayments,
        monthlyRevenue: monthlyRevenue._sum.amount || 0,
      },
      banks: {
        total: totalBanks,
        active: activeBanks,
        inactive: totalBanks - activeBanks,
      },
      tickets: {
        total: totalTickets,
        open: openTickets,
        closed: totalTickets - openTickets,
      },
      recentPayments,
      paymentsByType: paymentsByType.map((item) => ({
        type: item.paymentType,
        count: item._count,
        amount: item._sum.amount || 0,
      })),
      monthlyData,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
