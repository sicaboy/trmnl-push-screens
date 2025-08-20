import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { markup, url, token } = body;

    if (!markup || !url) {
      return NextResponse.json(
        { error: 'Markup content and URL are required' },
        { status: 400 }
      );
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Bearer token is required' },
        { status: 400 }
      );
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    const response = await fetch(url, {
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