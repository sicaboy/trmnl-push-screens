import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { markup, deviceId } = body;
    
    // Get configuration from environment variables
    const baseUrl = process.env.TRMNL_BASE_URL || 'https://trmnl.slj.me/api/display/update';
    const bearerToken = process.env.TRMNL_BEARER_TOKEN;
    
    // Debug logging
    console.log('Push API Request:', {
      deviceId,
      baseUrl,
      hasToken: !!bearerToken,
      markupLength: markup?.length || 0
    });

    if (!markup) {
      return NextResponse.json(
        { error: 'Markup content is required' },
        { status: 400 }
      );
    }

    if (!deviceId) {
      return NextResponse.json(
        { error: 'Device ID is required' },
        { status: 400 }
      );
    }

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
    };

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ markup }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { 
          error: 'Failed to push markup to TRMNL API',
          status: response.status,
          details: errorText
        },
        { status: 500 }
      );
    }

    const result = await response.text();
    
    return NextResponse.json({
      success: true,
      message: 'Markup pushed to TRMNL successfully',
      response: result
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}