import { TIAN_GAN, DI_ZHI, NA_YIN } from '../utils/constants.js';
import { getLiChunYear, getMonthByJieQi } from '../calendar/jieqi.js';

// 根据阳历日期推算四柱天干地支

// 年柱（以立春为界）
export function getYearPillar(date) {
  const year = getLiChunYear(date);

  // 年干 = (year - 4) % 10  （公元4年为甲子年）
  const ganIndex = (year - 4) % 10;
  // 年支 = (year - 4) % 12
  const zhiIndex = (year - 4) % 12;

  const gan = TIAN_GAN[ganIndex >= 0 ? ganIndex : ganIndex + 10];
  const zhi = DI_ZHI[zhiIndex >= 0 ? zhiIndex : zhiIndex + 12];

  return { gan, zhi, ganZhi: gan + zhi, naYin: NA_YIN[gan + zhi] };
}

// 月柱（以节气为界）
export function getMonthPillar(date, yearGan) {
  const monthInfo = getMonthByJieQi(date);
  if (!monthInfo) return null;

  const monthZhiIndex = monthInfo.monthZhiIndex;
  const zhi = DI_ZHI[monthZhiIndex + 2 > 11 ? monthZhiIndex + 2 - 12 : monthZhiIndex + 2];

  // 月干由年干推算（五虎遁月）
  // 甲己之年丙作首（寅月天干为丙）
  // 乙庚之年戊为头
  // 丙辛之年庚为始
  // 丁壬壬寅顺水流
  // 戊癸甲寅定不移
  const yearGanIndex = TIAN_GAN.indexOf(yearGan);
  const monthGanBase = [2, 4, 6, 8, 0]; // 丙、戊、庚、壬、甲
  const baseGan = monthGanBase[yearGanIndex % 5];
  const ganIndex = (baseGan + monthZhiIndex) % 10;
  const gan = TIAN_GAN[ganIndex];

  // 实际地支
  const actualZhi = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'][monthZhiIndex];

  return {
    gan,
    zhi: actualZhi,
    ganZhi: gan + actualZhi,
    naYin: NA_YIN[gan + actualZhi],
    jie: monthInfo.jie
  };
}

// 日柱（查表法，基于已知的日柱基准）
export function getDayPillar(date) {
  // 基准日：1900年1月1日 = 甲戌日（干支序号10）
  // 使用更精确的基准：2000年1月1日 = 甲子日 ？
  // 实际上1900年1月1日为甲戌日，干支序号=10（甲=0,戌=10 -> 不对）
  // 六十甲子序号：甲子=0, 乙丑=1, ... 甲戌=10
  // 1900年1月1日 = 甲戌日 = 序号10

  // 更好的基准：2000年1月7日 = 甲子日
  const baseDate = new Date(2000, 0, 7); // 2000-01-07 甲子日
  const baseIndex = 0; // 甲子 = 0

  // 计算日期差（注意要考虑子时换日的问题）
  // 传统命理中，子时（23:00后）算次日
  let targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // 如果是23点之后（子时），算下一天
  if (date.getHours() >= 23) {
    targetDate = new Date(targetDate.getTime() + 86400000);
  }

  const diffDays = Math.round((targetDate.getTime() - baseDate.getTime()) / 86400000);
  let index = (baseIndex + diffDays) % 60;
  if (index < 0) index += 60;

  const ganIndex = index % 10;
  const zhiIndex = index % 12;

  const gan = TIAN_GAN[ganIndex];
  const zhi = DI_ZHI[zhiIndex];

  return { gan, zhi, ganZhi: gan + zhi, naYin: NA_YIN[gan + zhi] };
}

// 时柱
export function getHourPillar(hour, dayGan) {
  // 确定时辰地支
  let zhiIndex;
  if (hour >= 23 || hour < 1) zhiIndex = 0;      // 子
  else if (hour < 3) zhiIndex = 1;                 // 丑
  else if (hour < 5) zhiIndex = 2;                 // 寅
  else if (hour < 7) zhiIndex = 3;                 // 卯
  else if (hour < 9) zhiIndex = 4;                 // 辰
  else if (hour < 11) zhiIndex = 5;                // 巳
  else if (hour < 13) zhiIndex = 6;                // 午
  else if (hour < 15) zhiIndex = 7;                // 未
  else if (hour < 17) zhiIndex = 8;                // 申
  else if (hour < 19) zhiIndex = 9;                // 酉
  else if (hour < 21) zhiIndex = 10;               // 戌
  else zhiIndex = 11;                               // 亥

  const zhi = DI_ZHI[zhiIndex];

  // 时干由日干推算（五鼠遁时）
  // 甲己还加甲（子时天干为甲）
  // 乙庚丙作初
  // 丙辛从戊起
  // 丁壬庚子居
  // 戊癸壬子头
  const dayGanIndex = TIAN_GAN.indexOf(dayGan);
  const hourGanBase = [0, 2, 4, 6, 8]; // 甲、丙、戊、庚、壬
  const baseGan = hourGanBase[dayGanIndex % 5];
  const ganIndex = (baseGan + zhiIndex) % 10;
  const gan = TIAN_GAN[ganIndex];

  return { gan, zhi, ganZhi: gan + zhi, naYin: NA_YIN[gan + zhi] };
}

// 完整四柱
export function getFourPillars(date) {
  const yearPillar = getYearPillar(date);
  const monthPillar = getMonthPillar(date, yearPillar.gan);
  const dayPillar = getDayPillar(date);
  const hourPillar = getHourPillar(date.getHours(), dayPillar.gan);

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar
  };
}
