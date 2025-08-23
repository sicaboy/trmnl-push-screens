import { NextRequest, NextResponse } from 'next/server';
import { pushToTrmnl } from '../../../utils/trmnlPush';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { markup, deviceId } = body;
    
    const result = await pushToTrmnl({ markup, deviceId });
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { 
          error: result.error,
          details: result.details
        },
        { status: result.status || 500 }
      );
    }

  } catch (error) {
    console.error('Push API Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}