import { Solar } from 'lunar-javascript';

// 农历计算工具类 - 使用lunar-javascript库提供完整功能
export class LunarCalendar {

  // 公历转农历 - 直接使用library的完整功能
  static solarToLunar(date: Date): {
    year: number;
    month: number;
    day: number;
    monthName: string;
    dayName: string;
    yearName: string;
    isLeap: boolean;
    solarTerm?: string;
  } {
    const solar = Solar.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
    const lunar = solar.getLunar();
    
    return {
      year: lunar.getYear(),
      month: Math.abs(lunar.getMonth()),
      day: lunar.getDay(),
      monthName: lunar.getMonthInChinese(),
      dayName: lunar.getDayInChinese(),
      yearName: lunar.getYearInGanZhi() + ' ' + lunar.getYearShengXiao() + '年',
      isLeap: lunar.getMonth() < 0  // 负数表示闰月
    };
  }

  // 获取节气 - 使用library的节气功能
  static getSolarTerm(date: Date): string | undefined {
    const solar = Solar.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
    const lunar = solar.getLunar();
    
    // 获取当前日期的节气
    const jieQi = lunar.getCurrentJieQi();
    if (jieQi) {
      const jieQiSolar = jieQi.getSolar();
      // 检查是否是当天的节气
      if (jieQiSolar.getYear() === date.getFullYear() && 
          jieQiSolar.getMonth() === date.getMonth() + 1 && 
          jieQiSolar.getDay() === date.getDate()) {
        return jieQi.getName();
      }
    }
    return undefined;
  }

  // 判断是否为闰年 - 使用library的方法
  static isLeapYear(year: number): boolean {
    const solar = Solar.fromYmd(year, 1, 1);
    return solar.isLeapYear();
  }
}