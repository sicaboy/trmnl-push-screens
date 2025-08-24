import { NextRequest, NextResponse } from 'next/server';
import { generateEInkHTML } from '../../../utils/htmlGenerator';

export async function GET(request: NextRequest) {
  try {
    const now = new Date();
    const timezone = process.env.CALENDAR_TIMEZONE || "Australia/Sydney";
    const localTime = new Date(now.toLocaleString("en-US", {timeZone: timezone}));
    
    const debugInfo = {
      serverTime: now.toString(),
      utcTime: now.toISOString(),
      configuredTimezone: timezone,
      localTime: localTime.toString(),
      localYear: localTime.getFullYear(),
      localMonth: localTime.getMonth() + 1,
      localDate: localTime.getDate(),
      timestamp: now.getTime()
    };
    
    // Generate the HTML
    const html = generateEInkHTML('calendar', { title: 'calendar', data: {} });
    
    // Extract date from HTML
    const dateMatch = html.match(/今天是(\d{4})年(\d+)月(\d+)日/);
    
    return NextResponse.json({
      debugInfo,
      extractedDate: dateMatch ? {
        fullMatch: dateMatch[0],
        year: dateMatch[1],
        month: dateMatch[2],
        day: dateMatch[3]
      } : null,
      htmlLength: html.length,
      fullHTML: html
    });
    
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { 
        error: 'Debug failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}