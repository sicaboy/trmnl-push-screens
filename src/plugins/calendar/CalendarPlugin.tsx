'use client';

import React from 'react';
import { withEInkOptimization, type BasePluginProps } from '@/components/BasePlugin';
import { LunarCalendar } from '@/utils/lunarCalendar';

type CalendarPluginProps = BasePluginProps;

function CalendarPlugin({ className = '' }: CalendarPluginProps) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const today = now.getDate();

  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // 获取当前月份的农历信息
  const currentLunar = LunarCalendar.solarToLunar(now);

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className={`h-12 border-t border-l border-b-0 border-r-0 border-gray-400 bg-white ${i % 7 === 6 ? 'border-r' : ''}`}></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(currentYear, currentMonth, day);
      const lunar = LunarCalendar.solarToLunar(currentDate);
      const solarTerm = LunarCalendar.getSolarTerm(currentDate);
      const isToday = day === today;
      
      // 特殊日期判断
      const isSpecialDay = lunar.dayName === '初一' || solarTerm;
      
      days.push(
        <div
          key={day}
          className={`h-12 border-t border-l border-b-0 border-r-0 border-gray-400 flex flex-col items-center justify-center p-1 ${
            isToday ? 'bg-gray-800 text-white' : 'bg-white text-black'
          } ${(firstDayOfMonth + day - 1) % 7 === 6 ? 'border-r' : ''}`}
        >
          <div className="text-sm font-bold leading-none">{day}</div>
          <div className={`text-xs leading-none mt-1 text-center ${
            isToday ? 'text-gray-200' : 
            isSpecialDay ? 'text-red-600 font-medium' : 'text-gray-600'
          }`}>
            {solarTerm || lunar.dayName}
          </div>
        </div>
      );
    }

    // Fill remaining cells to complete the grid (6 rows total)
    const totalCells = 42; // 6 rows × 7 days
    const currentCells = firstDayOfMonth + daysInMonth;
    for (let i = currentCells; i < totalCells; i++) {
      days.push(
        <div key={`trailing-${i}`} className={`h-12 border-t border-l border-b-0 border-r-0 border-gray-400 bg-white ${(i) % 7 === 6 ? 'border-r' : ''}`}></div>
      );
    }

    return days;
  };

  return (
    <div className={`p-3 h-full flex flex-col ${className}`}>
      <div className="text-center mb-3">
        <h1 className="text-lg font-bold text-black mb-1">
          {currentYear}年 {monthNames[currentMonth]}
        </h1>
        <div className="text-xs text-gray-600">
          {currentLunar.yearName} {currentLunar.monthName}
        </div>
      </div>
      
      <div className="flex flex-col">
        <div className="grid grid-cols-7 gap-0">
          {weekDays.map((day, index) => (
            <div key={day} className={`h-8 w-full border-t border-l border-b-0 border-r-0 border-gray-400 bg-gray-200 flex items-center justify-center text-xs font-bold text-black ${
              index === 0 || index === 6 ? 'text-red-600' : ''
            } ${index === 6 ? 'border-r' : ''}`}>
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-0 border-b border-gray-400">
          {renderCalendarDays()}
        </div>
      </div>
    </div>
  );
}

export default withEInkOptimization(CalendarPlugin);