import { LunarCalendar } from './lunarCalendar';

export interface PluginData {
  title?: string;
  data: Record<string, unknown>;
}

export function generateEInkHTML(pluginKey: string, pluginData: PluginData): string {
  const baseStyles = `
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        width: 800px;
        height: 480px;
        background-color: white;
        color: black;
        font-family: 'Courier New', monospace;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      
      .eink-container {
        width: 100%;
        height: 100%;
        background-color: white;
        color: black;
        padding: 12px;
        display: flex;
        flex-direction: column;
      }
      
      /* Calendar specific styles */
      .calendar-header {
        text-align: center;
        margin-bottom: 12px;
      }
      
      .calendar-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 2px;
      }
      
      .lunar-year {
        font-size: 12px;
        color: #666;
        margin-bottom: 6px;
      }
      
      .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 0;
      }
      
      .calendar-day-header {
        padding: 4px 2px;
        text-align: center;
        font-weight: bold;
        font-size: 12px;
        border-top: 1px solid #666;
        border-left: 1px solid #666;
        background-color: #e5e5e5;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .calendar-day-header:last-child {
        border-right: 1px solid #666;
      }
      
      .calendar-day-header.weekend {
        color: #d32f2f;
      }
      
      .calendar-day {
        padding: 2px;
        text-align: center;
        border-top: 1px solid #666;
        border-left: 1px solid #666;
        background-color: white;
        color: black;
        height: 48px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      
      .calendar-day:nth-child(7n) {
        border-right: 1px solid #666;
      }
      
      .calendar-grid {
        border-bottom: 1px solid #666;
      }
      
      .solar-date {
        font-size: 13px;
        font-weight: bold;
        line-height: 1;
      }
      
      .lunar-date {
        font-size: 9px;
        color: #666;
        margin-top: 2px;
        line-height: 1;
      }
      
      .lunar-date.special {
        color: #d32f2f;
        font-weight: bold;
      }
      
      .calendar-day.today {
        background-color: #333;
        color: white;
      }
      
      .calendar-day.today .lunar-date {
        color: #ccc;
      }
      
      .calendar-day.today .lunar-date.special {
        color: #ff6b6b;
      }
      
      .calendar-day.empty {
        background-color: white;
      }
    </style>
  `;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=800, height=480">
    ${baseStyles}
</head>
<body>
    <div class="eink-container">
        ${generatePluginHTML(pluginKey, pluginData)}
    </div>
</body>
</html>
  `.trim();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function generatePluginHTML(pluginKey: string, pluginData: PluginData): string {
  switch (pluginKey) {
    case 'calendar':
      return generateCalendarHTML();
    default:
      return '<div>Unknown plugin</div>';
  }
}

// 简化的农历计算（用于HTML生成）
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getLunarInfo(date: Date): { dayName: string; solarTerm?: string } {
  // 这是一个简化版本，实际使用中应该导入完整的农历计算
  const lunarDays = [
    "初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
    "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
    "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"
  ];
  
  // 简化的农历计算 - 基于日期的模拟
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const lunarDayIndex = (dayOfYear + 10) % 30; // 简化的模拟
  
  // 简化的节气检测
  const month = date.getMonth() + 1;
  const day = date.getDate();
  let solarTerm: string | undefined;
  
  if ((month === 2 && day === 4) || (month === 8 && day === 7)) solarTerm = month === 2 ? "立春" : "立秋";
  if ((month === 3 && day === 21) || (month === 9 && day === 23)) solarTerm = month === 3 ? "春分" : "秋分";
  if ((month === 6 && day === 21) || (month === 12 && day === 22)) solarTerm = month === 6 ? "夏至" : "冬至";
  
  return {
    dayName: lunarDays[lunarDayIndex],
    solarTerm
  };
}

export function generateCalendarHTML(): string {
  // Use Australia/Sydney timezone
  const now = new Date();
  const sydneyTime = new Date(now.toLocaleString("en-US", {timeZone: "Australia/Sydney"}));
  const currentMonth = sydneyTime.getMonth();
  const currentYear = sydneyTime.getFullYear();
  const today = sydneyTime.getDate();

  
  const weekDays = ['一', '二', '三', '四', '五', '六', '日'];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonthSunday = new Date(currentYear, currentMonth, 1).getDay();
  // Convert Sunday=0 to Monday=0 system: (Sunday-1+7)%7
  const firstDayOfMonth = (firstDayOfMonthSunday + 6) % 7;

  // 获取实际农历信息
  const currentLunar = LunarCalendar.solarToLunar(sydneyTime);

  let html = `
    <div style="padding: 12px; height: 100%; display: flex; flex-direction: column;">
      <div style="text-align: center; margin-bottom: 12px;">
        <h1 style="font-size: 20px; font-weight: bold; color: black; margin-bottom: 4px;">
          今天是${currentYear}年${currentMonth + 1}月${today}日
        </h1>
        <div style="font-size: 16px; color: #666;">
          农历${currentLunar.yearName} ${currentLunar.monthName}月${currentLunar.dayName}
        </div>
      </div>
      
      <div style="flex: 1;">
        <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0;">
  `;

  // 星期标题
  weekDays.forEach((day, index) => {
    const isWeekend = index === 5 || index === 6;
    html += `
      <div style="height: 32px; width: 100%; border-top: 1px solid #666; border-left: 1px solid #666; border-right: 1px solid #666; background-color: #e5e5e5; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; color: ${isWeekend ? '#d32f2f' : 'black'};">
        ${day}
      </div>
    `;
  });

  html += '</div><div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0; border-bottom: 1px solid #666;">';

  // 空白格子
  for (let i = 0; i < firstDayOfMonth; i++) {
    html += `<div style="height: 48px; border-top: 1px solid #666; border-left: 1px solid #666; border-right: 1px solid #666; background-color: white; display: flex; align-items: center; justify-content: center;"></div>`;
  }

  // 日期格子
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(currentYear, currentMonth, day);
    const lunar = LunarCalendar.solarToLunar(currentDate);
    const solarTerm = LunarCalendar.getSolarTerm(currentDate);
    const isToday = day === today;
    const isSpecial = lunar.dayName === '初一' || solarTerm;
    
    // 如果是初一，显示月份名称（与预览页面逻辑一致）
    const displayText = solarTerm || (lunar.dayName === '初一' ? lunar.monthName : lunar.dayName);
    
    html += `
      <div style="height: 48px; border-top: 1px solid #666; border-left: 1px solid #666; border-right: 1px solid #666; ${isToday ? 'background-color: #333; color: white;' : 'background-color: white; color: black;'} display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4px;">
        <div style="font-size: 18px; font-weight: bold; line-height: 1;">${day}</div>
        <div style="font-size: 14px; line-height: 1; margin-top: 2px; text-align: center; color: ${isToday ? '#ccc' : (isSpecial ? '#d32f2f' : '#666')}; ${isSpecial && !isToday ? 'font-weight: bold;' : ''}">${displayText}</div>
      </div>
    `;
  }

  // 填充剩余格子
  const totalCells = 42;
  const currentCells = firstDayOfMonth + daysInMonth;
  for (let i = currentCells; i < totalCells; i++) {
    html += `<div style="height: 48px; border-top: 1px solid #666; border-left: 1px solid #666; border-right: 1px solid #666; background-color: white; display: flex; align-items: center; justify-content: center;"></div>`;
  }

  html += `
        </div>
      </div>
    </div>
  `;

  return html;
}