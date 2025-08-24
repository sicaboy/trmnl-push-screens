import { NextRequest, NextResponse } from 'next/server';
import { pushToTrmnl } from '../../../utils/trmnlPush';

// Force dynamic to prevent caching issues with cron jobs
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Verify CRON_SECRET as recommended by Vercel
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.log('Cron job unauthorized - invalid secret');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Import calendar HTML generator
    const { generateCalendarHTML } = await import('../../../utils/htmlGenerator');
    
    // Generate today's calendar
    const markup = generateCalendarHTML();
    const deviceId = '1'; // Default device ID for cron
    
    console.log('Cron job starting:', {
      deviceId,
      markupLength: markup.length,
      timestamp: new Date().toISOString()
    });

    // Use shared TRMNL push function
    const pushResult = await pushToTrmnl({ markup, deviceId });

    if (!pushResult.success) {
      return NextResponse.json(
        { 
          error: 'Failed to push markup to TRMNL',
          details: pushResult.details || pushResult.error,
          timestamp: new Date().toISOString()
        },
        { status: pushResult.status || 500 }
      );
    }
    
    console.log('Cron job completed successfully:', {
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({
      success: true,
      message: 'Daily calendar update pushed to TRMNL successfully',
      deviceId,
      timestamp: new Date().toISOString(),
      trmnlResponse: pushResult.response
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}