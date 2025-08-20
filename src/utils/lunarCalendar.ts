// 农历计算工具类
export class LunarCalendar {
  // 农历年份的天数数据 (1900-2100)
  private static lunarInfo = [
    0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
    0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
    0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
    0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
    0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
    0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,
    0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
    0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,
    0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
    0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
    0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
    0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
    0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
    0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
    0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,
    0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0,
    0x0a2e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,
    0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,
    0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,
    0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252,
    0x0d520
  ];

  // 天干
  private static heavenlyStems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  
  // 地支
  private static earthlyBranches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  
  // 生肖
  private static zodiacAnimals = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
  
  // 农历月份
  private static lunarMonths = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"];
  
  // 农历日期
  private static lunarDays = [
    "初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
    "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
    "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"
  ];

  // 24节气
  private static solarTerms = [
    "立春", "雨水", "惊蛰", "春分", "清明", "谷雨",
    "立夏", "小满", "芒种", "夏至", "小暑", "大暑",
    "立秋", "处暑", "白露", "秋分", "寒露", "霜降",
    "立冬", "小雪", "大雪", "冬至", "小寒", "大寒"
  ];

  // 获取农历年天数
  private static getLunarYearDays(year: number): number {
    let i, sum = 348;
    for (i = 0x8000; i > 0x8; i >>= 1) {
      sum += (this.lunarInfo[year - 1900] & i) ? 1 : 0;
    }
    return sum + this.getLeapDays(year);
  }

  // 获取闰月天数
  private static getLeapDays(year: number): number {
    if (this.getLeapMonth(year)) {
      return (this.lunarInfo[year - 1900] & 0x10000) ? 30 : 29;
    }
    return 0;
  }

  // 获取闰月月份
  private static getLeapMonth(year: number): number {
    return this.lunarInfo[year - 1900] & 0xf;
  }

  // 获取农历月天数
  private static getLunarMonthDays(year: number, month: number): number {
    return (this.lunarInfo[year - 1900] & (0x10000 >> month)) ? 30 : 29;
  }

  // 公历转农历
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
    const baseDate = new Date(1900, 0, 31);
    let offset = Math.floor((date.getTime() - baseDate.getTime()) / 86400000);
    
    let temp = 0;
    let lunarYear = 1900;
    
    // 计算农历年
    while (lunarYear < 2100 && offset > 0) {
      temp = this.getLunarYearDays(lunarYear);
      if (offset - temp < 1) break;
      offset -= temp;
      lunarYear++;
    }

    const leap = this.getLeapMonth(lunarYear);
    let isLeap = false;
    
    // 计算农历月
    let lunarMonth = 1;
    for (let i = 1; i < 13 && offset > 0; i++) {
      // 闰月
      if (leap > 0 && i === (leap + 1) && !isLeap) {
        i--;
        isLeap = true;
        temp = this.getLeapDays(lunarYear);
      } else {
        temp = this.getLunarMonthDays(lunarYear, i);
      }

      // 解除闰月
      if (isLeap && i === (leap + 1)) {
        isLeap = false;
      }

      if (offset - temp < 1) break;
      offset -= temp;
      lunarMonth++;
    }

    const lunarDay = offset;
    
    // 生成年份名称（天干地支 + 生肖）
    const stemIndex = (lunarYear - 4) % 10;
    const branchIndex = (lunarYear - 4) % 12;
    const yearName = `${this.heavenlyStems[stemIndex]}${this.earthlyBranches[branchIndex]} ${this.zodiacAnimals[branchIndex]}年`;
    
    // 月份名称
    const monthName = isLeap ? `闰${this.lunarMonths[lunarMonth - 1]}月` : `${this.lunarMonths[lunarMonth - 1]}月`;
    
    // 日期名称
    const dayName = this.lunarDays[lunarDay - 1];

    return {
      year: lunarYear,
      month: lunarMonth,
      day: lunarDay,
      monthName,
      dayName,
      yearName,
      isLeap
    };
  }

  // 获取节气（简化版本，基于固定日期估算）
  static getSolarTerm(date: Date): string | undefined {
    const month = date.getMonth();
    const day = date.getDate();
    
    // 简化的节气日期映射 (实际应该根据精确算法计算)
    const termDates = [
      [2, 4], [2, 19], [3, 6], [3, 21], [4, 5], [4, 20], // 春
      [5, 6], [5, 21], [6, 6], [6, 21], [7, 7], [7, 23], // 夏
      [8, 7], [8, 23], [9, 8], [9, 23], [10, 8], [10, 23], // 秋
      [11, 7], [11, 22], [12, 7], [12, 22], [1, 6], [1, 20] // 冬
    ];

    for (let i = 0; i < termDates.length; i++) {
      const [termMonth, termDay] = termDates[i];
      if (month + 1 === termMonth && day === termDay) {
        return this.solarTerms[i];
      }
    }
    
    return undefined;
  }
}