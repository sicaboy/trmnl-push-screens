import { NextRequest, NextResponse } from 'next/server';
import { generateEInkHTML, type PluginData } from '@/utils/htmlGenerator';

export async function GET(request: NextRequest) {
  try {
    // 验证请求来源（可选的安全措施）
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 获取环境变量配置
    const baseUrl = process.env.TRMNL_BASE_URL || 'https://trmnl.slj.me/api/display/update';
    const bearerToken = process.env.TRMNL_BEARER_TOKEN;
    const deviceId = '1'; // 固定推送到设备ID 1

    if (!bearerToken) {
      return NextResponse.json(
        { error: 'Bearer token not configured. Please set TRMNL_BEARER_TOKEN environment variable.' },
        { status: 500 }
      );
    }

    // 生成日历HTML
    const pluginData: PluginData = {
      title: 'calendar',
      data: {},
    };
    const markup = generateEInkHTML('calendar', pluginData);

    // 推送到TRMNL API
    const fullUrl = `${baseUrl}?device_id=${deviceId}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bearerToken}`,
    };

    console.log('Cron Job: Pushing calendar to device', deviceId, 'at', new Date().toISOString(), '(daily update)');

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ markup }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cron Job: Failed to push to TRMNL API:', errorText);
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
    console.log('Cron Job: Successfully pushed calendar to device', deviceId, '(daily update)');
    
    return NextResponse.json({
      success: true,
      message: `Calendar pushed to device ${deviceId} successfully`,
      timestamp: new Date().toISOString(),
      response: result
    });

  } catch (error) {
    console.error('Cron Job Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error during cron job',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// 也支持POST请求（用于手动触发）
export async function POST(request: NextRequest) {
  return GET(request);
}