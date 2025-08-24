import { NextRequest, NextResponse } from 'next/server';
import { pushToTrmnl } from '../../../utils/trmnlPush';

// Force dynamic to prevent caching issues with cron jobs
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Log basic info for debugging
    console.log('Cron endpoint called:', {
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent')
    });

    // Import complete HTML generator
    const { generateEInkHTML } = await import('../../../utils/htmlGenerator');
    
    // Generate today's calendar with complete HTML structure
    const markup = generateEInkHTML('calendar', { title: 'calendar', data: {} });
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