import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    // Attempt to get auth from Clerk
    let userId = null;
    try {
      const auth_result = await auth();
      userId = auth_result.userId;
    } catch (authError) {
      console.error('Auth error:', authError);
      // Continue without auth for demo purposes
    }
    
    // For demo purposes, we'll allow access even without auth
    // In production, you should require authentication
    
    console.log('Fetching offline data...');
    
    // Fetch essential data for offline use
    try {
      const [patients, memos, expenseTypes, tests] = await Promise.all([
        prisma.patient.findMany({
          take: 100, // Limit to most recent to keep data size manageable
          orderBy: { createdAt: 'desc' },
        }),
        prisma.memo.findMany({
          take: 100, // Limit to most recent
          orderBy: { createdAt: 'desc' },
          include: {
            Patient: { select: { id: true, name: true } },
            MemoToTest: { select: { testId: true, testName: true, price: true } },
          },
        }),
        prisma.expenseType.findMany(),
        prisma.test.findMany(),
      ]);

      console.log(`Fetched: ${patients.length} patients, ${memos.length} memos, ${expenseTypes.length} expense types, ${tests.length} tests`);

      return NextResponse.json({
        success: true,
        data: {
          patients,
          memos,
          expenseTypes,
          tests,
          timestamp: new Date(),
        },
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database error', 
          message: dbError instanceof Error ? dbError.message : 'Unknown database error' 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error fetching offline data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch offline data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 