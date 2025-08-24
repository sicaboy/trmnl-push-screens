import { NextRequest, NextResponse } from 'next/server';
import { generateEInkHTML } from '../../../utils/htmlGenerator';

export async function GET(request: NextRequest) {
  try {
    const now = new Date();
    
    const debugInfo = {
      serverTime: now.toString(),
      utcTime: now.toISOString(),
      localTime: now.toLocaleString(),
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      date: now.getDate(),
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