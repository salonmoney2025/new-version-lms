import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';
import { logDocumentUpload } from '@/lib/activity-logger';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure upload directory exists
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// GET /api/documents - Get all documents
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

    // Get query params
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const myDocuments = searchParams.get('myDocuments') === 'true';

    // Build where clause
    const where: Record<string, unknown> = {};

    // Non-admin users can only see their own documents or public documents
    if (user.role !== 'ADMIN') {
      where.OR = [
        { userId: user.userId },
        { isPublic: true },
      ];
    }

    // If filtering by category
    if (category) {
      where.category = category;
    }

    // If filtering for user's own documents
    if (myDocuments) {
      where.userId = user.userId;
    }

    // Fetch documents
    const documents = await prisma.document.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

// POST /api/documents - Upload a document
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

    // Ensure upload directory exists
    await ensureUploadDir();

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const isPublic = formData.get('isPublic') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Create document record in database
    const document = await prisma.document.create({
      data: {
        userId: user.userId,
        fileName,
        originalName: file.name,
        fileType: file.type,
        fileSize: file.size,
        filePath: `/uploads/${fileName}`,
        category,
        description,
        isPublic,
      },
    });

    // Log activity
    await logDocumentUpload(user.userId, user.name, document.id, file.name);

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}
