declare module 'lunar-javascript' {
  export class Solar {
    static fromYmd(year: number, month: number, day: number): Solar;
    
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getLunar(): Lunar;
    isLeapYear(): boolean;
    toFullString(): string;
  }

  export class Lunar {
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getMonthInChinese(): string;
    getDayInChinese(): string;
    getYearInGanZhi(): string;
    getYearShengXiao(): string;
    getCurrentJieQi(): JieQi | null;
    toFullString(): string;
  }

  export class JieQi {
    getName(): string;
    getSolar(): Solar;
  }
}