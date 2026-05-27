import { TIAN_GAN, DI_ZHI } from '../utils/constants.js';

// 节气数据：从1900年小寒开始，每个节气用分钟数（相对于1900-01-06 02:05 小寒）编码
// 使用天文算法计算精确节气时间

// 每年24节气的近似计算（基于天文算法）
// 返回某年某节气的精确时间（Date对象）
function calcJieQiDate(year, index) {
  // index: 0=小寒, 1=大寒, 2=立春, 3=雨水, ... 23=大雪
  // 使用VSOP87简化算法
  const jqMap = [
    285.0,  // 小寒 - 太阳黄经285°
    300.0,  // 大寒 - 300°
    315.0,  // 立春 - 315°
    330.0,  // 雨水 - 330°
    345.0,  // 惊蛰 - 345°
    0.0,    // 春分 - 0°
    15.0,   // 清明 - 15°
    30.0,   // 谷雨 - 30°
    45.0,   // 立夏 - 45°
    60.0,   // 小满 - 60°
    75.0,   // 芒种 - 75°
    90.0,   // 夏至 - 90°
    105.0,  // 小暑 - 105°
    120.0,  // 大暑 - 120°
    135.0,  // 立秋 - 135°
    150.0,  // 处暑 - 150°
    165.0,  // 白露 - 165°
    180.0,  // 秋分 - 180°
    195.0,  // 寒露 - 195°
    210.0,  // 霜降 - 210°
    225.0,  // 立冬 - 225°
    240.0,  // 小雪 - 240°
    255.0,  // 大雪 - 255°
    270.0   // 冬至 - 270°
  ];

  const targetLon = jqMap[index];
  return calcSunLongitudeDate(year, targetLon, index);
}

function calcSunLongitudeDate(year, targetLon, jqIndex) {
  // 先估算大致日期
  const baseMonth = getApproxMonth(jqIndex);
  const baseDay = getApproxDay(jqIndex);

  let estimate = new Date(Date.UTC(year, baseMonth, baseDay));

  // 用牛顿迭代法精确化
  for (let i = 0; i < 50; i++) {
    const jd = dateToJD(estimate);
    const lon = sunLongitude(jd);
    let diff = targetLon - lon;

    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    if (Math.abs(diff) < 0.0001) break;

    const correction = diff / 360 * 365.2422;
    estimate = new Date(estimate.getTime() + correction * 86400000);
  }

  return estimate;
}

function getApproxMonth(jqIndex) {
  const months = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11];
  return months[jqIndex];
}

function getApproxDay(jqIndex) {
  const days = [6, 20, 4, 19, 6, 21, 5, 20, 6, 21, 6, 21, 7, 23, 7, 23, 8, 23, 8, 23, 7, 22, 7, 22];
  return days[jqIndex];
}

// 日期转儒略日
function dateToJD(date) {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate() + (date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600) / 24;

  let Y = y, M = m;
  if (M <= 2) { Y -= 1; M += 12; }

  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);

  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + d + B - 1524.5;
}

// 计算太阳黄经（简化VSOP87）
function sunLongitude(jd) {
  const T = (jd - 2451545.0) / 36525.0;

  // 太阳平黄经
  const L0 = mod360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  // 太阳平近点角
  const M = mod360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const Mrad = M * Math.PI / 180;

  // 太阳方程式
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad)
    + 0.000289 * Math.sin(3 * Mrad);

  // 太阳真黄经
  const sunLon = L0 + C;

  // 章动修正
  const omega = 125.04 - 1934.136 * T;
  const omegaRad = omega * Math.PI / 180;
  const apparent = sunLon - 0.00569 - 0.00478 * Math.sin(omegaRad);

  return mod360(apparent);
}

function mod360(v) {
  let r = v % 360;
  if (r < 0) r += 360;
  return r;
}

// 获取某年所有24节气的精确时间（北京时间 UTC+8）
export function getYearJieQi(year) {
  const jqNames = [
    '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
    '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
    '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
    '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'
  ];

  const result = [];
  for (let i = 0; i < 24; i++) {
    const utcDate = calcJieQiDate(year, i);
    // 转北京时间
    const bjDate = new Date(utcDate.getTime() + 8 * 3600000);
    result.push({
      name: jqNames[i],
      date: bjDate,
      isJie: i % 2 === 0  // 节（用于定月柱）
    });
  }
  return result;
}

// 获取某个日期所在的月份节气区间
// 返回该日期属于哪个"节"之后（用于确定月柱）
export function getMonthByJieQi(date) {
  const year = date.getFullYear();

  // 需要检查前一年的大雪、小寒和当年以及下一年的节
  const prevJieQi = getYearJieQi(year - 1);
  const currJieQi = getYearJieQi(year);
  const nextJieQi = getYearJieQi(year + 1);

  // 只取"节"（非"气"），用于月份分界
  const jieList = [];

  // 前一年的大雪(index 22)和小寒来不需要，但需要前一年的部分节
  for (const jq of prevJieQi) {
    if (jq.isJie) jieList.push(jq);
  }
  for (const jq of currJieQi) {
    if (jq.isJie) jieList.push(jq);
  }
  for (const jq of nextJieQi) {
    if (jq.isJie) jieList.push(jq);
  }

  // 节对应的月份地支索引:
  // 小寒->子月(index 10), 立春->寅月(index 0), 惊蛰->卯月(index 1), ...
  const jieToMonthZhi = {
    '小寒': 11, // 丑月
    '立春': 0,  // 寅月
    '惊蛰': 1,  // 卯月
    '清明': 2,  // 辰月
    '立夏': 3,  // 巳月
    '芒种': 4,  // 午月
    '小暑': 5,  // 未月
    '立秋': 6,  // 申月
    '白露': 7,  // 酉月
    '寒露': 8,  // 戌月
    '立冬': 9,  // 亥月
    '大雪': 10  // 子月
  };

  const dateTime = date.getTime();
  let result = null;

  for (let i = jieList.length - 1; i >= 0; i--) {
    if (dateTime >= jieList[i].date.getTime()) {
      result = {
        jie: jieList[i].name,
        monthZhiIndex: jieToMonthZhi[jieList[i].name],
        jieDate: jieList[i].date,
        year: jieList[i].date.getFullYear()
      };
      break;
    }
  }

  return result;
}

// 获取某日期所属的农历年（以立春为界）
export function getLiChunYear(date) {
  const year = date.getFullYear();
  const currJieQi = getYearJieQi(year);

  // 找到立春
  const liChun = currJieQi.find(jq => jq.name === '立春');

  if (date.getTime() < liChun.date.getTime()) {
    return year - 1;
  }
  return year;
}

// 计算从立春到出生日期的天数（用于计算起运）
export function getDaysFromJie(birthDate) {
  const year = birthDate.getFullYear();
  const currJieQi = getYearJieQi(year);
  const prevJieQi = getYearJieQi(year - 1);
  const nextJieQi = getYearJieQi(year + 1);

  // 收集所有节
  const allJie = [];
  for (const jq of prevJieQi) { if (jq.isJie) allJie.push(jq); }
  for (const jq of currJieQi) { if (jq.isJie) allJie.push(jq); }
  for (const jq of nextJieQi) { if (jq.isJie) allJie.push(jq); }

  allJie.sort((a, b) => a.date.getTime() - b.date.getTime());

  const birthTime = birthDate.getTime();

  // 找到出生日期前后的两个节
  let prevJie = null, nextJie = null;
  for (let i = 0; i < allJie.length - 1; i++) {
    if (birthTime >= allJie[i].date.getTime() && birthTime < allJie[i + 1].date.getTime()) {
      prevJie = allJie[i];
      nextJie = allJie[i + 1];
      break;
    }
  }

  if (!prevJie || !nextJie) return null;

  const daysToPrev = (birthTime - prevJie.date.getTime()) / 86400000;
  const daysToNext = (nextJie.date.getTime() - birthTime) / 86400000;

  return {
    prevJie: prevJie.name,
    prevJieDate: prevJie.date,
    nextJie: nextJie.name,
    nextJieDate: nextJie.date,
    daysToPrev: Math.round(daysToPrev * 100) / 100,
    daysToNext: Math.round(daysToNext * 100) / 100
  };
}
