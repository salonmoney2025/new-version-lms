import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface LogActivityParams {
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId?: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Log an activity to the database
 */
export async function logActivity(params: LogActivityParams) {
  try {
    const log = await prisma.activityLog.create({
      data: {
        userId: params.userId,
        userName: params.userName,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        description: params.description,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        metadata: params.metadata ? JSON.stringify(params.metadata) : null,
      },
    });

    return log;
  } catch (error) {
    console.error('Failed to log activity:', error);
    // Don't throw - logging failures shouldn't break the application
    return null;
  }
}

// Predefined activity loggers for common actions

export async function logLogin(userId: string, userName: string, ipAddress?: string, userAgent?: string) {
  return logActivity({
    userId,
    userName,
    action: 'LOGIN',
    entity: 'AUTH',
    description: `${userName} logged in`,
    ipAddress,
    userAgent,
  });
}

export async function logLogout(userId: string, userName: string, ipAddress?: string) {
  return logActivity({
    userId,
    userName,
    action: 'LOGOUT',
    entity: 'AUTH',
    description: `${userName} logged out`,
    ipAddress,
  });
}

export async function logPaymentCreated(userId: string, userName: string, paymentId: string, amount: number) {
  return logActivity({
    userId,
    userName,
    action: 'CREATE',
    entity: 'PAYMENT',
    entityId: paymentId,
    description: `${userName} created a payment of SLE ${amount.toFixed(2)}`,
    metadata: { amount },
  });
}

export async function logPaymentVerified(userId: string, userName: string, paymentId: string, receiptNo: string) {
  return logActivity({
    userId,
    userName,
    action: 'VERIFY',
    entity: 'PAYMENT',
    entityId: paymentId,
    description: `${userName} verified payment ${receiptNo}`,
    metadata: { receiptNo },
  });
}

export async function logDocumentUpload(userId: string, userName: string, documentId: string, fileName: string) {
  return logActivity({
    userId,
    userName,
    action: 'UPLOAD',
    entity: 'DOCUMENT',
    entityId: documentId,
    description: `${userName} uploaded document: ${fileName}`,
    metadata: { fileName },
  });
}

export async function logDocumentDownload(userId: string, userName: string, documentId: string, fileName: string) {
  return logActivity({
    userId,
    userName,
    action: 'DOWNLOAD',
    entity: 'DOCUMENT',
    entityId: documentId,
    description: `${userName} downloaded document: ${fileName}`,
    metadata: { fileName },
  });
}

export async function logDocumentDelete(userId: string, userName: string, documentId: string, fileName: string) {
  return logActivity({
    userId,
    userName,
    action: 'DELETE',
    entity: 'DOCUMENT',
    entityId: documentId,
    description: `${userName} deleted document: ${fileName}`,
    metadata: { fileName },
  });
}

export async function logTicketCreated(userId: string, userName: string, ticketId: string, subject: string) {
  return logActivity({
    userId,
    userName,
    action: 'CREATE',
    entity: 'TICKET',
    entityId: ticketId,
    description: `${userName} created ticket: ${subject}`,
    metadata: { subject },
  });
}

export async function logTicketResponse(userId: string, userName: string, ticketId: string, ticketNo: string) {
  return logActivity({
    userId,
    userName,
    action: 'RESPOND',
    entity: 'TICKET',
    entityId: ticketId,
    description: `${userName} responded to ticket ${ticketNo}`,
    metadata: { ticketNo },
  });
}

export async function logUserCreated(userId: string, userName: string, newUserId: string, newUserName: string, role: string) {
  return logActivity({
    userId,
    userName,
    action: 'CREATE',
    entity: 'USER',
    entityId: newUserId,
    description: `${userName} created user: ${newUserName} (${role})`,
    metadata: { newUserName, role },
  });
}

export async function logUserUpdated(userId: string, userName: string, targetUserId: string, targetUserName: string) {
  return logActivity({
    userId,
    userName,
    action: 'UPDATE',
    entity: 'USER',
    entityId: targetUserId,
    description: `${userName} updated user: ${targetUserName}`,
    metadata: { targetUserName },
  });
}

export async function logSettingChanged(userId: string, userName: string, settingName: string, oldValue: unknown, newValue: unknown) {
  return logActivity({
    userId,
    userName,
    action: 'UPDATE',
    entity: 'SETTING',
    description: `${userName} changed ${settingName}`,
    metadata: { settingName, oldValue, newValue },
  });
}
