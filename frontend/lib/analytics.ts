import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AnalyticsData {
  payments: {
    total: number;
    thisMonth: number;
    thisWeek: number;
    today: number;
    totalRevenue: number;
    monthlyRevenue: number;
    weeklyRevenue: number;
    dailyRevenue: number;
    byType: Array<{ type: string; count: number; revenue: number }>;
    byMonth: Array<{ month: string; count: number; revenue: number }>;
  };
  users: {
    total: number;
    byRole: Array<{ role: string; count: number }>;
    activeThisMonth: number;
  };
  tickets: {
    total: number;
    open: number;
    pending: number;
    closed: number;
    byCategory: Array<{ category: string; count: number }>;
  };
  documents: {
    total: number;
    totalSize: number;
    byCategory: Array<{ category: string; count: number }>;
    mostDownloaded: Array<{ fileName: string; downloads: number }>;
  };
  activity: {
    recentActions: Array<{
      action: string;
      count: number;
    }>;
    topUsers: Array<{
      userName: string;
      activityCount: number;
    }>;
  };
}

/**
 * Get comprehensive analytics data
 */
export async function getAnalytics(
  startDate?: Date,
  endDate?: Date
): Promise<AnalyticsData> {
  const now = new Date();
  const start = startDate || new Date(now.getFullYear(), now.getMonth(), 1); // Default: start of current month
  const end = endDate || now;

  try {
    // Fetch all data in parallel
    const [
      allPayments,
      users,
      tickets,
      documents,
      activityLogs,
    ] = await Promise.all([
      prisma.payment.findMany({
        orderBy: { paymentDate: 'desc' },
      }),
      prisma.user.findMany(),
      prisma.ticket.findMany(),
      prisma.document.findMany({
        orderBy: { downloadCount: 'desc' },
        take: 10,
      }),
      prisma.activityLog.findMany({
        where: {
          createdAt: {
            gte: start,
            lte: end,
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 1000,
      }),
    ]);

    // Calculate payment analytics
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const monthPayments = allPayments.filter(p => new Date(p.paymentDate) >= monthStart);
    const weekPayments = allPayments.filter(p => new Date(p.paymentDate) >= weekStart);
    const dayPayments = allPayments.filter(p => new Date(p.paymentDate) >= dayStart);

    const totalRevenue = allPayments.reduce((sum, p) => sum + p.amount, 0);
    const monthlyRevenue = monthPayments.reduce((sum, p) => sum + p.amount, 0);
    const weeklyRevenue = weekPayments.reduce((sum, p) => sum + p.amount, 0);
    const dailyRevenue = dayPayments.reduce((sum, p) => sum + p.amount, 0);

    // Payment by type
    const paymentsByType = allPayments.reduce((acc: Record<string, unknown>, p) => {
      if (!acc[p.paymentType]) {
        acc[p.paymentType] = { count: 0, revenue: 0 };
      }
      acc[p.paymentType].count++;
      acc[p.paymentType].revenue += p.amount;
      return acc;
    }, {});

    const byType = Object.entries(paymentsByType).map(([type, data]: [string, { count: number; revenue: number }]) => ({
      type,
      count: data.count,
      revenue: data.revenue,
    }));

    // Payment by month (last 6 months)
    const monthlyData: Record<string, { count: number; revenue: number }> = {};
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyData[monthKey] = { count: 0, revenue: 0 };
    }

    allPayments.forEach((p) => {
      const date = new Date(p.paymentDate);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].count++;
        monthlyData[monthKey].revenue += p.amount;
      }
    });

    const byMonth = Object.entries(monthlyData).map(([month, data]: [string, { count: number; revenue: number }]) => ({
      month,
      count: data.count,
      revenue: data.revenue,
    }));

    // User analytics
    const usersByRole = users.reduce((acc: Record<string, unknown>, u) => {
      acc[u.role] = (acc[u.role] || 0) + 1;
      return acc;
    }, {});

    const roleData = Object.entries(usersByRole).map(([role, count]) => ({
      role,
      count: count as number,
    }));

    const activeThisMonth = users.filter(u =>
      u.lastLogin && new Date(u.lastLogin) >= monthStart
    ).length;

    // Ticket analytics
    const ticketsByCategory = tickets.reduce((acc: Record<string, unknown>, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {});

    const categoryData = Object.entries(ticketsByCategory).map(([category, count]) => ({
      category,
      count: count as number,
    }));

    // Document analytics
    const docsByCategory = documents.reduce((acc: Record<string, unknown>, d) => {
      acc[d.category] = (acc[d.category] || 0) + 1;
      return acc;
    }, {});

    const docCategoryData = Object.entries(docsByCategory).map(([category, count]) => ({
      category,
      count: count as number,
    }));

    const totalSize = documents.reduce((sum, d) => sum + d.fileSize, 0);

    const mostDownloaded = documents.slice(0, 5).map(d => ({
      fileName: d.originalName,
      downloads: d.downloadCount,
    }));

    // Activity analytics
    const actionCounts = activityLogs.reduce((acc: Record<string, unknown>, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {});

    const recentActions = Object.entries(actionCounts)
      .map(([action, count]) => ({ action, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const userActivity = activityLogs.reduce((acc: Record<string, unknown>, log) => {
      acc[log.userName] = (acc[log.userName] || 0) + 1;
      return acc;
    }, {});

    const topUsers = Object.entries(userActivity)
      .map(([userName, activityCount]) => ({ userName, activityCount: activityCount as number }))
      .sort((a, b) => b.activityCount - a.activityCount)
      .slice(0, 10);

    return {
      payments: {
        total: allPayments.length,
        thisMonth: monthPayments.length,
        thisWeek: weekPayments.length,
        today: dayPayments.length,
        totalRevenue,
        monthlyRevenue,
        weeklyRevenue,
        dailyRevenue,
        byType,
        byMonth,
      },
      users: {
        total: users.length,
        byRole: roleData,
        activeThisMonth,
      },
      tickets: {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        pending: tickets.filter(t => t.status === 'pending').length,
        closed: tickets.filter(t => t.status === 'closed').length,
        byCategory: categoryData,
      },
      documents: {
        total: documents.length,
        totalSize,
        byCategory: docCategoryData,
        mostDownloaded,
      },
      activity: {
        recentActions,
        topUsers,
      },
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
}
