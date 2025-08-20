import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test environment variables without exposing sensitive data
    const baseUrl = process.env.TRMNL_BASE_URL;
    const hasToken = !!process.env.TRMNL_BEARER_TOKEN;
    const cronSecret = process.env.CRON_SECRET;

    return NextResponse.json({
      success: true,
      environment: {
        TRMNL_BASE_URL: baseUrl || 'Not set',
        TRMNL_BEARER_TOKEN: hasToken ? 'Set (hidden)' : 'Not set',
        CRON_SECRET: cronSecret ? 'Set (hidden)' : 'Not set',
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to check environment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}