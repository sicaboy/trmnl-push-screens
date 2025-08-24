import { NextRequest, NextResponse } from 'next/server';
import { generateEInkHTML, generateCalendarHTML } from '../../../utils/htmlGenerator';

export async function GET(request: NextRequest) {
  try {
    const now = new Date();
    
    // Method 1: Complete HTML (used by homepage)
    const completeHTML = generateEInkHTML('calendar', { title: 'calendar', data: {} });
    
    // Method 2: Calendar HTML only (old cron method)
    const calendarHTML = generateCalendarHTML();
    
    // Extract dates from both
    const completeDateMatch = completeHTML.match(/今天是(\d{4})年(\d+)月(\d+)日/);
    const calendarDateMatch = calendarHTML.match(/今天是(\d{4})年(\d+)月(\d+)日/);
    
    return NextResponse.json({
      serverTime: {
        toString: now.toString(),
        iso: now.toISOString(),
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        date: now.getDate()
      },
      completeHTML: {
        length: completeHTML.length,
        extractedDate: completeDateMatch ? completeDateMatch[0] : 'Not found',
        content: completeHTML
      },
      calendarHTML: {
        length: calendarHTML.length,
        extractedDate: calendarDateMatch ? calendarDateMatch[0] : 'Not found',
        content: calendarHTML
      },
      comparison: {
        sameDateExtracted: completeDateMatch?.[0] === calendarDateMatch?.[0],
        completeHasDoctype: completeHTML.includes('<!DOCTYPE html>'),
        calendarHasDoctype: calendarHTML.includes('<!DOCTYPE html>')
      }
    });
    
  } catch (error) {
    console.error('Compare error:', error);
    return NextResponse.json(
      { 
        error: 'Compare failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}