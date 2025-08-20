import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Optional cron secret verification (skip for Vercel cron jobs)
    const userAgent = request.headers.get('User-Agent') || '';
    const isVercelCron = userAgent.includes('vercel') || userAgent.includes('Vercel');
    
    if (!isVercelCron) {
      const cronSecret = process.env.CRON_SECRET;
      if (cronSecret) {
        const authHeader = request.headers.get('Authorization');
        const providedSecret = authHeader?.replace('Bearer ', '');
        
        if (providedSecret !== cronSecret) {
          console.log('Cron job unauthorized - invalid secret');
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
          );
        }
      }
    }

    // Import calendar HTML generator
    const { generateCalendarHTML } = await import('../../../utils/htmlGenerator');
    
    // Generate today's calendar
    const markup = generateCalendarHTML();
    
    // Get configuration from environment variables
    const baseUrl = process.env.TRMNL_BASE_URL || 'https://trmnl.slj.me/api/display/update';
    const bearerToken = process.env.TRMNL_BEARER_TOKEN;
    const deviceId = 1; // Default device ID for cron
    
    console.log('Cron job starting:', {
      deviceId,
      baseUrl,
      hasToken: !!bearerToken,
      markupLength: markup.length,
      timestamp: new Date().toISOString()
    });

    if (!bearerToken) {
      return NextResponse.json(
        { error: 'Bearer token not configured. Please set TRMNL_BEARER_TOKEN environment variable.' },
        { status: 500 }
      );
    }

    const fullUrl = `${baseUrl}?device_id=${deviceId}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bearerToken}`,
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'application/json, */*',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
    };

    // Retry logic to handle Cloudflare blocking
    let response;
    let lastError;
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Cron push attempt ${attempt}/3 to ${fullUrl}`);
        
        if (attempt > 1) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt - 1) * 1000));
        }
        
        response = await fetch(fullUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({ markup }),
        });
        
        if (response.ok) {
          break; // Success, exit retry loop
        } else if (response.status === 403 && attempt < 3) {
          console.log(`Got 403 on attempt ${attempt}, retrying...`);
          lastError = await response.text();
          continue;
        } else {
          break; // Other error or last attempt
        }
      } catch (error) {
        console.log(`Network error on attempt ${attempt}:`, error);
        lastError = error instanceof Error ? error.message : 'Network error';
        if (attempt === 3) {
          throw error;
        }
      }
    }

    if (!response || !response.ok) {
      const errorText = response ? await response.text() : lastError || 'No response received';
      return NextResponse.json(
        { 
          error: 'Failed to push markup to TRMNL API',
          status: response?.status || 500,
          details: errorText,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    const result = await response.text();
    
    console.log('Cron job completed successfully:', {
      responseStatus: response.status,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({
      success: true,
      message: 'Daily calendar update pushed to TRMNL successfully',
      deviceId,
      timestamp: new Date().toISOString(),
      response: result
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