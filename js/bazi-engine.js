var BaziEngine = (function() {

// === src/utils/constants.js ===
// 天干
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 地支
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 五行
const WU_XING = ['木', '火', '土', '金', '水'];

// 天干对应五行
const GAN_WU_XING = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水'
};

// 天干阴阳
const GAN_YIN_YANG = {
  '甲': '阳', '乙': '阴',
  '丙': '阳', '丁': '阴',
  '戊': '阳', '己': '阴',
  '庚': '阳', '辛': '阴',
  '壬': '阳', '癸': '阴'
};

// 地支对应五行
const ZHI_WU_XING = {
  '子': '水', '丑': '土',
  '寅': '木', '卯': '木',
  '辰': '土', '巳': '火',
  '午': '火', '未': '土',
  '申': '金', '酉': '金',
  '戌': '土', '亥': '水'
};

// 地支阴阳
const ZHI_YIN_YANG = {
  '子': '阳', '丑': '阴',
  '寅': '阳', '卯': '阴',
  '辰': '阳', '巳': '阴',
  '午': '阳', '未': '阴',
  '申': '阳', '酉': '阴',
  '戌': '阳', '亥': '阴'
};

// 地支藏干
const ZHI_CANG_GAN = {
  '子': ['癸'],
  '丑': ['己', '癸', '辛'],
  '寅': ['甲', '丙', '戊'],
  '卯': ['乙'],
  '辰': ['戊', '乙', '癸'],
  '巳': ['丙', '庚', '戊'],
  '午': ['丁', '己'],
  '未': ['己', '丁', '乙'],
  '申': ['庚', '壬', '戊'],
  '酉': ['辛'],
  '戌': ['戊', '辛', '丁'],
  '亥': ['壬', '甲']
};

// 十神关系表：以日干为主，查其他天干的十神
// key: 日干五行+日干阴阳, value: { 他干五行+他干阴阳: 十神 }
const SHI_SHEN_MAP = {
  '同五行同阴阳': '比肩',
  '同五行异阴阳': '劫财',
  '我生同阴阳': '食神',
  '我生异阴阳': '伤官',
  '我克同阴阳': '偏财',
  '我克异阴阳': '正财',
  '克我同阴阳': '偏官',
  '克我异阴阳': '正官',
  '生我同阴阳': '偏印',
  '生我异阴阳': '正印'
};

// 五行生克关系
const WU_XING_SHENG = {
  '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
};

const WU_XING_KE = {
  '木': '土', '火': '金', '土': '水', '金': '木', '水': '火'
};

// 反查：被什么生
const WU_XING_BEI_SHENG = {
  '木': '水', '火': '木', '土': '火', '金': '土', '水': '金'
};

// 反查：被什么克
const WU_XING_BEI_KE = {
  '木': '金', '火': '水', '土': '木', '金': '火', '水': '土'
};

// 地支六合
const LIU_HE = [
  ['子', '丑'], ['寅', '亥'], ['卯', '戌'],
  ['辰', '酉'], ['巳', '申'], ['午', '未']
];

// 地支三合局
const SAN_HE = [
  { zhi: ['申', '子', '辰'], xing: '水' },
  { zhi: ['寅', '午', '戌'], xing: '火' },
  { zhi: ['巳', '酉', '丑'], xing: '金' },
  { zhi: ['亥', '卯', '未'], xing: '木' }
];

// 地支三会局
const SAN_HUI = [
  { zhi: ['寅', '卯', '辰'], xing: '木' },
  { zhi: ['巳', '午', '未'], xing: '火' },
  { zhi: ['申', '酉', '戌'], xing: '金' },
  { zhi: ['亥', '子', '丑'], xing: '水' }
];

// 地支六冲
const LIU_CHONG = [
  ['子', '午'], ['丑', '未'], ['寅', '申'],
  ['卯', '酉'], ['辰', '戌'], ['巳', '亥']
];

// 地支六害（穿）
const LIU_HAI = [
  ['子', '未'], ['丑', '午'], ['寅', '巳'],
  ['卯', '辰'], ['申', '亥'], ['酉', '戌']
];

// 地支相刑
const XING = [
  { type: '无恩之刑', zhi: ['寅', '巳', '申'] },
  { type: '恃势之刑', zhi: ['丑', '未', '戌'] },
  { type: '无礼之刑', zhi: ['子', '卯'] },
  { type: '自刑', zhi: ['辰', '辰'] },
  { type: '自刑', zhi: ['午', '午'] },
  { type: '自刑', zhi: ['酉', '酉'] },
  { type: '自刑', zhi: ['亥', '亥'] }
];

// 天干五合
const TIAN_GAN_HE = [
  { gan: ['甲', '己'], hua: '土' },
  { gan: ['乙', '庚'], hua: '金' },
  { gan: ['丙', '辛'], hua: '水' },
  { gan: ['丁', '壬'], hua: '木' },
  { gan: ['戊', '癸'], hua: '火' }
];

// 天干相冲（对冲）
const TIAN_GAN_CHONG = [
  ['甲', '庚'], ['乙', '辛'], ['丙', '壬'], ['丁', '癸']
];

// 十二长生
const SHI_ER_CHANG_SHENG = ['长生', '沐浴', '冠带', '临官', '帝旺', '衰', '病', '死', '墓', '绝', '胎', '养'];

// 各天干的长生起始地支（阳干顺行，阴干逆行）
const CHANG_SHENG_QI = {
  '甲': '亥', '丙': '寅', '戊': '寅', '庚': '巳', '壬': '申',
  '乙': '午', '丁': '酉', '己': '酉', '辛': '子', '癸': '卯'
};

// 月令对应地支（以节气分月）
// 寅月(立春-惊蛰)、卯月(惊蛰-清明)、辰月(清明-立夏)...
const YUE_LING_ZHI = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];

// 节气名称（24节气，奇数为节，偶数为气，月份以节为分界）
const JIE_QI = [
  '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
  '立夏', '小满', '芒种', '夏至', '小暑', '大暑',
  '立秋', '处暑', '白露', '秋分', '寒露', '霜降',
  '立冬', '小雪', '大雪', '冬至', '小寒', '大寒'
];

// 月份分界节气（每月以节为界，非气）
const YUE_JIE = ['立春', '惊蛰', '清明', '立夏', '芒种', '小暑', '立秋', '白露', '寒露', '立冬', '大雪', '小寒'];

// 时辰对应地支
const SHI_CHEN = {
  '子': [23, 1],   // 23:00-00:59
  '丑': [1, 3],    // 01:00-02:59
  '寅': [3, 5],    // 03:00-04:59
  '卯': [5, 7],    // 05:00-06:59
  '辰': [7, 9],    // 07:00-08:59
  '巳': [9, 11],   // 09:00-10:59
  '午': [11, 13],  // 11:00-12:59
  '未': [13, 15],  // 13:00-14:59
  '申': [15, 17],  // 15:00-16:59
  '酉': [17, 19],  // 17:00-18:59
  '戌': [19, 21],  // 19:00-20:59
  '亥': [21, 23]   // 21:00-22:59
};

// 纳音表
const NA_YIN = {
  '甲子': '海中金', '乙丑': '海中金', '丙寅': '炉中火', '丁卯': '炉中火',
  '戊辰': '大林木', '己巳': '大林木', '庚午': '路旁土', '辛未': '路旁土',
  '壬申': '剑锋金', '癸酉': '剑锋金', '甲戌': '山头火', '乙亥': '山头火',
  '丙子': '涧下水', '丁丑': '涧下水', '戊寅': '城头土', '己卯': '城头土',
  '庚辰': '白蜡金', '辛巳': '白蜡金', '壬午': '杨柳木', '癸未': '杨柳木',
  '甲申': '泉中水', '乙酉': '泉中水', '丙戌': '屋上土', '丁亥': '屋上土',
  '戊子': '霹雳火', '己丑': '霹雳火', '庚寅': '松柏木', '辛卯': '松柏木',
  '壬辰': '长流水', '癸巳': '长流水', '甲午': '砂石金', '乙未': '砂石金',
  '丙申': '山下火', '丁酉': '山下火', '戊戌': '平地木', '己亥': '平地木',
  '庚子': '壁上土', '辛丑': '壁上土', '壬寅': '金箔金', '癸卯': '金箔金',
  '甲辰': '覆灯火', '乙巳': '覆灯火', '丙午': '天河水', '丁未': '天河水',
  '戊申': '大驿土', '己酉': '大驿土', '庚戌': '钗钏金', '辛亥': '钗钏金',
  '壬子': '桑柘木', '癸丑': '桑柘木', '甲寅': '大溪水', '乙卯': '大溪水',
  '丙辰': '砂中土', '丁巳': '砂中土', '戊午': '天上火', '己未': '天上火',
  '庚申': '石榴木', '辛酉': '石榴木', '壬戌': '大海水', '癸亥': '大海水'
};


// === src/calendar/jieqi.js ===

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
function getYearJieQi(year) {
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
function getMonthByJieQi(date) {
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
function getLiChunYear(date) {
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
function getDaysFromJie(birthDate) {
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


// === src/pillars/fourPillars.js ===


// 根据阳历日期推算四柱天干地支

// 年柱（以立春为界）
function getYearPillar(date) {
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
function getMonthPillar(date, yearGan) {
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
function getDayPillar(date) {
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
function getHourPillar(hour, dayGan) {
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
function getFourPillars(date) {
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


// === src/pillars/shiShen.js ===

// 计算某天干相对于日干的十神
function getShiShen(dayGan, targetGan) {
  if (dayGan === targetGan) return '比肩';

  const dayWx = GAN_WU_XING[dayGan];
  const dayYy = GAN_YIN_YANG[dayGan];
  const targetWx = GAN_WU_XING[targetGan];
  const targetYy = GAN_YIN_YANG[targetGan];

  const sameYy = dayYy === targetYy;

  if (dayWx === targetWx) {
    return sameYy ? '比肩' : '劫财';
  }
  if (WU_XING_SHENG[dayWx] === targetWx) {
    return sameYy ? '食神' : '伤官';
  }
  if (WU_XING_KE[dayWx] === targetWx) {
    return sameYy ? '偏财' : '正财';
  }
  if (WU_XING_BEI_KE[dayWx] === targetWx) {
    return sameYy ? '偏官' : '正官';
  }
  if (WU_XING_BEI_SHENG[dayWx] === targetWx) {
    return sameYy ? '偏印' : '正印';
  }

  return '未知';
}

// 计算四柱所有位置的十神
function calcAllShiShen(fourPillars) {
  const dayGan = fourPillars.day.gan;

  return {
    year: {
      gan: getShiShen(dayGan, fourPillars.year.gan),
      zhi: getZhiShiShen(dayGan, fourPillars.year.zhi)
    },
    month: {
      gan: getShiShen(dayGan, fourPillars.month.gan),
      zhi: getZhiShiShen(dayGan, fourPillars.month.zhi)
    },
    day: {
      gan: '日主',
      zhi: getZhiShiShen(dayGan, fourPillars.day.zhi)
    },
    hour: {
      gan: getShiShen(dayGan, fourPillars.hour.gan),
      zhi: getZhiShiShen(dayGan, fourPillars.hour.zhi)
    }
  };
}

// 地支的十神（取藏干本气）
function getZhiShiShen(dayGan, zhi) {
  const cangGan = ZHI_CANG_GAN[zhi];
  return cangGan.map(g => ({
    gan: g,
    shiShen: getShiShen(dayGan, g),
    wx: GAN_WU_XING[g]
  }));
}

// 统计五行数量（天干+地支藏干）
function countWuXing(fourPillars) {
  const count = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
  const detail = { '木': [], '火': [], '土': [], '金': [], '水': [] };

  // 四个天干
  const positions = ['year', 'month', 'day', 'hour'];
  const posNames = ['年干', '月干', '日干', '时干'];
  positions.forEach((pos, i) => {
    const gan = fourPillars[pos].gan;
    const wx = GAN_WU_XING[gan];
    count[wx]++;
    detail[wx].push(`${posNames[i]}${gan}`);
  });

  // 四个地支
  const zhiNames = ['年支', '月支', '日支', '时支'];
  positions.forEach((pos, i) => {
    const zhi = fourPillars[pos].zhi;
    const wx = ZHI_WU_XING[zhi];
    count[wx]++;
    detail[wx].push(`${zhiNames[i]}${zhi}`);
  });

  return { count, detail };
}

// 统计五行（含藏干加权）
function countWuXingWithCangGan(fourPillars) {
  const weight = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };

  // 天干权重：各1分
  const positions = ['year', 'month', 'day', 'hour'];
  positions.forEach(pos => {
    const wx = GAN_WU_XING[fourPillars[pos].gan];
    weight[wx] += 1;
  });

  // 地支藏干权重：本气0.6，中气0.3，余气0.1
  const cangGanWeights = [0.6, 0.3, 0.1];
  positions.forEach(pos => {
    const zhi = fourPillars[pos].zhi;
    const cangGan = ZHI_CANG_GAN[zhi];
    cangGan.forEach((g, i) => {
      const wx = GAN_WU_XING[g];
      weight[wx] += cangGanWeights[i] || 0.1;
    });
  });

  // 四舍五入到两位小数
  for (const k of WU_XING) {
    weight[k] = Math.round(weight[k] * 100) / 100;
  }

  return weight;
}

// 计算十二长生状态
function getChangSheng(gan, zhi) {
  const startZhi = CHANG_SHENG_QI[gan];
  if (!startZhi) return '未知';

  const startIndex = DI_ZHI.indexOf(startZhi);
  const zhiIndex = DI_ZHI.indexOf(zhi);
  const yy = GAN_YIN_YANG[gan];

  let offset;
  if (yy === '阳') {
    offset = (zhiIndex - startIndex + 12) % 12;
  } else {
    offset = (startIndex - zhiIndex + 12) % 12;
  }

  return SHI_ER_CHANG_SHENG[offset];
}

// 判断日主强弱（简化版）
function judgeDayStrength(fourPillars) {
  const dayGan = fourPillars.day.gan;
  const dayWx = GAN_WU_XING[dayGan];
  const monthZhi = fourPillars.month.zhi;

  // 月令得失
  const monthZhiWx = ZHI_WU_XING[monthZhi];
  const monthCangGan = ZHI_CANG_GAN[monthZhi];
  const monthBenQi = monthCangGan[0];
  const monthBenQiWx = GAN_WU_XING[monthBenQi];

  let score = 0;
  let analysis = [];

  // 1. 月令判断（权重最大）
  if (monthBenQiWx === dayWx) {
    score += 3;
    analysis.push(`月令${monthZhi}（${monthBenQiWx}）与日主同类，得令`);
  } else if (WU_XING_BEI_SHENG[dayWx] === monthBenQiWx) {
    score += 2;
    analysis.push(`月令${monthZhi}（${monthBenQiWx}）生日主，得令`);
  } else if (WU_XING_KE[monthBenQiWx] === dayWx) {
    score -= 2;
    analysis.push(`月令${monthZhi}（${monthBenQiWx}）克日主，失令`);
  } else if (WU_XING_SHENG[dayWx] === monthBenQiWx) {
    score -= 1;
    analysis.push(`月令${monthZhi}（${monthBenQiWx}）泄日主，不得令`);
  } else {
    score -= 1;
    analysis.push(`月令${monthZhi}（${monthBenQiWx}）耗日主，不得令`);
  }

  // 2. 通根检查
  const positions = ['year', 'month', 'day', 'hour'];
  positions.forEach(pos => {
    const zhi = fourPillars[pos].zhi;
    const cangGan = ZHI_CANG_GAN[zhi];
    for (const g of cangGan) {
      if (GAN_WU_XING[g] === dayWx) {
        score += (g === cangGan[0]) ? 1 : 0.5;
        analysis.push(`${pos === 'year' ? '年' : pos === 'month' ? '月' : pos === 'day' ? '日' : '时'}支${zhi}中${g}（${GAN_WU_XING[g]}）为日主通根`);
        break;
      }
    }
  });

  // 3. 天干生扶
  positions.forEach(pos => {
    if (pos === 'day') return;
    const gan = fourPillars[pos].gan;
    const ganWx = GAN_WU_XING[gan];
    if (ganWx === dayWx) {
      score += 0.8;
      analysis.push(`${pos === 'year' ? '年' : pos === 'month' ? '月' : '时'}干${gan}与日主同类`);
    } else if (WU_XING_SHENG[ganWx] === dayWx) {
      score += 0.6;
      analysis.push(`${pos === 'year' ? '年' : pos === 'month' ? '月' : '时'}干${gan}（${ganWx}）生日主`);
    }
  });

  let strength;
  if (score >= 4) strength = '身强';
  else if (score >= 2) strength = '偏强';
  else if (score >= 0) strength = '中和';
  else if (score >= -2) strength = '偏弱';
  else strength = '身弱';

  return {
    score: Math.round(score * 100) / 100,
    strength,
    analysis,
    dayGan,
    dayWx
  };
}


// === src/fate/dayun.js ===



// 大运排列
function calcDaYun(fourPillars, gender, birthDate) {
  const yearGan = fourPillars.year.gan;
  const monthGan = fourPillars.month.gan;
  const monthZhi = fourPillars.month.zhi;

  // 确定顺逆：阳年男/阴年女顺排，阴年男/阳年女逆排
  const yearYinYang = GAN_YIN_YANG[yearGan];
  const isShun = (yearYinYang === '阳' && gender === '男') ||
                 (yearYinYang === '阴' && gender === '女');

  // 计算起运岁数
  const jieInfo = getDaysFromJie(birthDate);
  let qiYunAge;
  if (jieInfo) {
    const days = isShun ? jieInfo.daysToNext : jieInfo.daysToPrev;
    // 三天折一年
    qiYunAge = Math.round((days / 3) * 10) / 10;
    if (qiYunAge < 0.1) qiYunAge = 0.1;
  } else {
    qiYunAge = 1;
  }

  // 排大运干支
  const monthGanIndex = TIAN_GAN.indexOf(monthGan);
  const monthZhiIndex = DI_ZHI.indexOf(monthZhi);
  const step = isShun ? 1 : -1;

  const daYunList = [];
  const birthYear = birthDate.getFullYear();

  for (let i = 1; i <= 10; i++) {
    let ganIdx = (monthGanIndex + step * i) % 10;
    let zhiIdx = (monthZhiIndex + step * i) % 12;
    if (ganIdx < 0) ganIdx += 10;
    if (zhiIdx < 0) zhiIdx += 12;

    const gan = TIAN_GAN[ganIdx];
    const zhi = DI_ZHI[zhiIdx];
    const ganZhi = gan + zhi;

    const startAge = Math.floor(qiYunAge) + (i - 1) * 10;
    const endAge = startAge + 9;
    const startYear = birthYear + startAge;
    const endYear = birthYear + endAge;

    daYunList.push({
      index: i,
      gan,
      zhi,
      ganZhi,
      naYin: NA_YIN[ganZhi],
      startAge,
      endAge,
      startYear,
      endYear,
      liuNian: calcLiuNian(startYear, endYear)
    });
  }

  return {
    direction: isShun ? '顺行' : '逆行',
    qiYunAge: Math.round(qiYunAge * 10) / 10,
    qiYunYear: birthYear + Math.floor(qiYunAge),
    jieInfo,
    daYunList
  };
}

// 计算某年范围内的流年
function calcLiuNian(startYear, endYear) {
  const liuNianList = [];
  for (let year = startYear; year <= endYear; year++) {
    const ganIndex = (year - 4) % 10;
    const zhiIndex = (year - 4) % 12;
    const gan = TIAN_GAN[ganIndex >= 0 ? ganIndex : ganIndex + 10];
    const zhi = DI_ZHI[zhiIndex >= 0 ? zhiIndex : zhiIndex + 12];
    const ganZhi = gan + zhi;
    liuNianList.push({
      year,
      gan,
      zhi,
      ganZhi,
      naYin: NA_YIN[ganZhi]
    });
  }
  return liuNianList;
}

// 计算小运
function calcXiaoYun(fourPillars, gender, birthDate, qiYunAge) {
  const yearGan = fourPillars.year.gan;
  const hourGan = fourPillars.hour.gan;
  const hourZhi = fourPillars.hour.zhi;

  const yearYinYang = GAN_YIN_YANG[yearGan];
  const isShun = (yearYinYang === '阳' && gender === '男') ||
                 (yearYinYang === '阴' && gender === '女');

  const hourGanIndex = TIAN_GAN.indexOf(hourGan);
  const hourZhiIndex = DI_ZHI.indexOf(hourZhi);
  const step = isShun ? 1 : -1;

  const xiaoYunList = [];
  const maxAge = Math.floor(qiYunAge);
  const birthYear = birthDate.getFullYear();

  for (let age = 1; age <= maxAge; age++) {
    let ganIdx = (hourGanIndex + step * age) % 10;
    let zhiIdx = (hourZhiIndex + step * age) % 12;
    if (ganIdx < 0) ganIdx += 10;
    if (zhiIdx < 0) zhiIdx += 12;

    const gan = TIAN_GAN[ganIdx];
    const zhi = DI_ZHI[zhiIdx];

    xiaoYunList.push({
      age,
      year: birthYear + age,
      gan,
      zhi,
      ganZhi: gan + zhi
    });
  }

  return xiaoYunList;
}


// === src/spirits/shensha.js ===

// ========== 神煞 ==========

// 天乙贵人
const TIAN_YI_GUI_REN = {
  '甲': ['丑', '未'], '戊': ['丑', '未'],
  '乙': ['子', '申'], '己': ['子', '申'],
  '丙': ['亥', '酉'], '丁': ['亥', '酉'],
  '庚': ['丑', '未'], '辛': ['寅', '午'],
  '壬': ['卯', '巳'], '癸': ['卯', '巳']
};

// 文昌贵人（以日干查）
const WEN_CHANG = {
  '甲': '巳', '乙': '午', '丙': '申', '丁': '酉',
  '戊': '申', '己': '酉', '庚': '亥', '辛': '子',
  '壬': '寅', '癸': '卯'
};

// 驿马（以日支或年支查）
const YI_MA = {
  '寅': '申', '午': '申', '戌': '申',
  '申': '寅', '子': '寅', '辰': '寅',
  '巳': '亥', '酉': '亥', '丑': '亥',
  '亥': '巳', '卯': '巳', '未': '巳'
};

// 桃花（咸池，以日支或年支查）
const TAO_HUA = {
  '寅': '卯', '午': '卯', '戌': '卯',
  '申': '酉', '子': '酉', '辰': '酉',
  '巳': '午', '酉': '午', '丑': '午',
  '亥': '子', '卯': '子', '未': '子'
};

// 华盖（以日支或年支查）
const HUA_GAI = {
  '寅': '戌', '午': '戌', '戌': '戌',
  '申': '辰', '子': '辰', '辰': '辰',
  '巳': '丑', '酉': '丑', '丑': '丑',
  '亥': '未', '卯': '未', '未': '未'
};

// 禄神（以日干查）
const LU_SHEN = {
  '甲': '寅', '乙': '卯', '丙': '巳', '丁': '午',
  '戊': '巳', '己': '午', '庚': '申', '辛': '酉',
  '壬': '亥', '癸': '子'
};

// 羊刃（以日干查）
const YANG_REN = {
  '甲': '卯', '乙': '寅', '丙': '午', '丁': '巳',
  '戊': '午', '己': '巳', '庚': '酉', '辛': '申',
  '壬': '子', '癸': '亥'
};

// 将星
const JIANG_XING = {
  '寅': '午', '午': '午', '戌': '午',
  '申': '子', '子': '子', '辰': '子',
  '巳': '酉', '酉': '酉', '丑': '酉',
  '亥': '卯', '卯': '卯', '未': '卯'
};

// 天德贵人（以月支查）
const TIAN_DE = {
  '寅': '丁', '卯': '申', '辰': '壬', '巳': '辛',
  '午': '亥', '未': '甲', '申': '癸', '酉': '寅',
  '戌': '丙', '亥': '乙', '子': '巳', '丑': '庚'
};

// 月德贵人（以月支查）
const YUE_DE = {
  '寅': '丙', '午': '丙', '戌': '丙',
  '申': '壬', '子': '壬', '辰': '壬',
  '巳': '庚', '酉': '庚', '丑': '庚',
  '亥': '甲', '卯': '甲', '未': '甲'
};

// 红鸾（以日支查）
const HONG_LUAN = {
  '子': '卯', '丑': '寅', '寅': '丑', '卯': '子',
  '辰': '亥', '巳': '戌', '午': '酉', '未': '申',
  '申': '未', '酉': '午', '戌': '巳', '亥': '辰'
};

// 天喜（以日支查）
const TIAN_XI = {
  '子': '酉', '丑': '申', '寅': '未', '卯': '午',
  '辰': '巳', '巳': '辰', '午': '卯', '未': '寅',
  '申': '丑', '酉': '子', '戌': '亥', '亥': '戌'
};

// 孤辰（以年支查）
const GU_CHEN = {
  '寅': '巳', '卯': '巳', '辰': '巳',
  '巳': '申', '午': '申', '未': '申',
  '申': '亥', '酉': '亥', '戌': '亥',
  '亥': '寅', '子': '寅', '丑': '寅'
};

// 寡宿（以年支查）
const GUA_SU = {
  '寅': '丑', '卯': '丑', '辰': '丑',
  '巳': '辰', '午': '辰', '未': '辰',
  '申': '未', '酉': '未', '戌': '未',
  '亥': '戌', '子': '戌', '丑': '戌'
};

// 金舆（以日干查）
const JIN_YU = {
  '甲': '辰', '乙': '巳', '丙': '未', '丁': '申',
  '戊': '未', '己': '申', '庚': '戌', '辛': '亥',
  '壬': '丑', '癸': '寅'
};

// 学堂（以日干查，长生位）
const XUE_TANG = {
  '甲': '亥', '乙': '午', '丙': '寅', '丁': '酉',
  '戊': '寅', '己': '酉', '庚': '巳', '辛': '子',
  '壬': '申', '癸': '卯'
};

// 词馆（以日干查，临官位）
const CI_GUAN = {
  '甲': '寅', '乙': '申', '丙': '巳', '丁': '亥',
  '戊': '巳', '己': '亥', '庚': '申', '辛': '寅',
  '壬': '亥', '癸': '巳'
};

// 太极贵人（以日干查）
const TAI_JI_GUI_REN = {
  '甲': ['子', '午'], '乙': ['子', '午'],
  '丙': ['卯', '酉'], '丁': ['卯', '酉'],
  '戊': ['辰', '戌', '丑', '未'], '己': ['辰', '戌', '丑', '未'],
  '庚': ['寅', '亥'], '辛': ['寅', '亥'],
  '壬': ['巳', '申'], '癸': ['巳', '申']
};

// 福星贵人（以日干查）
const FU_XING_GUI_REN = {
  '甲': ['寅', '丑'], '乙': ['丑', '卯'],
  '丙': ['寅', '巳'], '丁': ['巳', '申'],
  '戊': ['申', '丑'], '己': ['申', '亥'],
  '庚': ['巳', '午'], '辛': ['卯', '申'],
  '壬': ['亥', '子'], '癸': ['亥', '卯']
};

// 国印贵人（以日干查）
const GUO_YIN_GUI_REN = {
  '甲': '戌', '乙': '亥', '丙': '丑', '丁': '寅',
  '戊': '丑', '己': '寅', '庚': '辰', '辛': '巳',
  '壬': '未', '癸': '申'
};

// 天厨贵人（以日干查）
const TIAN_CHU_GUI_REN = {
  '甲': '巳', '乙': '午', '丙': '子', '丁': '巳',
  '戊': '午', '己': '申', '庚': '寅', '辛': '午',
  '壬': '酉', '癸': '亥'
};

// 亡神（以年支查）
const WANG_SHEN = {
  '寅': '巳', '午': '巳', '戌': '巳',
  '申': '亥', '子': '亥', '辰': '亥',
  '巳': '申', '酉': '申', '丑': '申',
  '亥': '寅', '卯': '寅', '未': '寅'
};

// 劫煞（以年支查）
const JIE_SHA = {
  '寅': '亥', '午': '亥', '戌': '亥',
  '申': '巳', '子': '巳', '辰': '巳',
  '巳': '寅', '酉': '寅', '丑': '寅',
  '亥': '申', '卯': '申', '未': '申'
};

// 丧门（以年支查）
const SANG_MEN = {
  '子': '寅', '丑': '卯', '寅': '辰', '卯': '巳',
  '辰': '午', '巳': '未', '午': '申', '未': '酉',
  '申': '戌', '酉': '亥', '戌': '子', '亥': '丑'
};

// 吊客（以年支查）
const DIAO_KE = {
  '子': '辰', '丑': '巳', '寅': '午', '卯': '未',
  '辰': '申', '巳': '酉', '午': '戌', '未': '亥',
  '申': '子', '酉': '丑', '戌': '寅', '亥': '卯'
};

function calcShenSha(fourPillars) {
  const dayGan = fourPillars.day.gan;
  const dayZhi = fourPillars.day.zhi;
  const yearZhi = fourPillars.year.zhi;
  const monthZhi = fourPillars.month.zhi;

  const allZhi = [
    { pos: '年支', zhi: fourPillars.year.zhi },
    { pos: '月支', zhi: fourPillars.month.zhi },
    { pos: '日支', zhi: fourPillars.day.zhi },
    { pos: '时支', zhi: fourPillars.hour.zhi }
  ];

  const allGan = [
    { pos: '年干', gan: fourPillars.year.gan },
    { pos: '月干', gan: fourPillars.month.gan },
    { pos: '日干', gan: fourPillars.day.gan },
    { pos: '时干', gan: fourPillars.hour.gan }
  ];

  const result = [];

  // 天乙贵人
  const tygrZhi = TIAN_YI_GUI_REN[dayGan] || [];
  for (const z of allZhi) {
    if (tygrZhi.includes(z.zhi)) {
      result.push({ name: '天乙贵人', position: z.pos, description: '逢凶化吉，贵人相助' });
    }
  }

  // 文昌贵人
  const wcZhi = WEN_CHANG[dayGan];
  for (const z of allZhi) {
    if (z.zhi === wcZhi) {
      result.push({ name: '文昌贵人', position: z.pos, description: '聪明好学，利文事考试' });
    }
  }

  // 驿马
  const ymZhi = YI_MA[yearZhi];
  for (const z of allZhi) {
    if (z.zhi === ymZhi && z.pos !== '年支') {
      result.push({ name: '驿马', position: z.pos, description: '主奔波、变动、出行' });
    }
  }
  const ymZhi2 = YI_MA[dayZhi];
  for (const z of allZhi) {
    if (z.zhi === ymZhi2 && z.pos !== '日支') {
      result.push({ name: '驿马', position: z.pos, description: '主奔波、变动、出行' });
    }
  }

  // 桃花
  const thZhi = TAO_HUA[yearZhi];
  for (const z of allZhi) {
    if (z.zhi === thZhi && z.pos !== '年支') {
      result.push({ name: '桃花', position: z.pos, description: '主人缘、异性缘、艺术才华' });
    }
  }
  const thZhi2 = TAO_HUA[dayZhi];
  for (const z of allZhi) {
    if (z.zhi === thZhi2 && z.pos !== '日支') {
      result.push({ name: '桃花', position: z.pos, description: '主人缘、异性缘、艺术才华' });
    }
  }

  // 华盖
  const hgZhi = HUA_GAI[yearZhi];
  for (const z of allZhi) {
    if (z.zhi === hgZhi && z.pos !== '年支') {
      result.push({ name: '华盖', position: z.pos, description: '主孤高、艺术、宗教、玄学' });
    }
  }

  // 禄神
  const lsZhi = LU_SHEN[dayGan];
  for (const z of allZhi) {
    if (z.zhi === lsZhi) {
      result.push({ name: '禄神', position: z.pos, description: '主衣食无忧、自力更生' });
    }
  }

  // 羊刃
  const yrZhi = YANG_REN[dayGan];
  for (const z of allZhi) {
    if (z.zhi === yrZhi) {
      result.push({ name: '羊刃', position: z.pos, description: '主刚强、果决，身强则吉、身弱亦可用' });
    }
  }

  // 将星
  const jxZhi = JIANG_XING[yearZhi];
  for (const z of allZhi) {
    if (z.zhi === jxZhi && z.pos !== '年支') {
      result.push({ name: '将星', position: z.pos, description: '主权威、领导力' });
    }
  }

  // 天德贵人
  const tdGan = TIAN_DE[monthZhi];
  if (tdGan) {
    for (const g of allGan) {
      if (g.gan === tdGan) {
        result.push({ name: '天德贵人', position: g.pos, description: '主逢凶化吉，一生少灾' });
      }
    }
  }

  // 月德贵人
  const ydGan = YUE_DE[monthZhi];
  if (ydGan) {
    for (const g of allGan) {
      if (g.gan === ydGan) {
        result.push({ name: '月德贵人', position: g.pos, description: '主贵人扶助，做事顺遂' });
      }
    }
  }

  // 红鸾（以日支查）
  const hlZhi = HONG_LUAN[dayZhi];
  for (const z of allZhi) {
    if (z.zhi === hlZhi && z.pos !== '日支') {
      result.push({ name: '红鸾', position: z.pos, description: '主婚喜、恋爱、添丁之喜' });
    }
  }

  // 天喜（以日支查）
  const txZhi = TIAN_XI[dayZhi];
  for (const z of allZhi) {
    if (z.zhi === txZhi && z.pos !== '日支') {
      result.push({ name: '天喜', position: z.pos, description: '主喜事临门、好事成双' });
    }
  }

  // 孤辰（以年支查）
  const gcZhi = GU_CHEN[yearZhi];
  for (const z of allZhi) {
    if (z.zhi === gcZhi && z.pos !== '年支') {
      result.push({ name: '孤辰', position: z.pos, description: '主孤独感强，六亲缘薄' });
    }
  }

  // 寡宿（以年支查）
  const gsZhi = GUA_SU[yearZhi];
  for (const z of allZhi) {
    if (z.zhi === gsZhi && z.pos !== '年支') {
      result.push({ name: '寡宿', position: z.pos, description: '主清心寡欲，独来独往' });
    }
  }

  // 金舆（以日干查）
  const jyZhi = JIN_YU[dayGan];
  for (const z of allZhi) {
    if (z.zhi === jyZhi) {
      result.push({ name: '金舆', position: z.pos, description: '主有车马之福，出行得贵人助' });
    }
  }

  // 学堂（以日干查）
  const xtZhi = XUE_TANG[dayGan];
  for (const z of allZhi) {
    if (z.zhi === xtZhi) {
      result.push({ name: '学堂', position: z.pos, description: '主学业优秀，聪慧过人，利考试' });
    }
  }

  // 词馆（以日干查）
  const cgZhi2 = CI_GUAN[dayGan];
  for (const z of allZhi) {
    if (z.zhi === cgZhi2) {
      result.push({ name: '词馆', position: z.pos, description: '主文采出众，口才好，擅长表达' });
    }
  }

  // 太极贵人（以日干查）
  const tjgrZhi = TAI_JI_GUI_REN[dayGan] || [];
  for (const z of allZhi) {
    if (tjgrZhi.includes(z.zhi)) {
      result.push({ name: '太极贵人', position: z.pos, description: '主聪明好学，喜钻研玄学命理' });
    }
  }

  // 福星贵人（以日干查）
  const fxgrZhi = FU_XING_GUI_REN[dayGan] || [];
  for (const z of allZhi) {
    if (fxgrZhi.includes(z.zhi)) {
      result.push({ name: '福星贵人', position: z.pos, description: '主福气深厚，一生衣食无忧' });
    }
  }

  // 国印贵人（以日干查）
  const gygrZhi = GUO_YIN_GUI_REN[dayGan];
  for (const z of allZhi) {
    if (z.zhi === gygrZhi) {
      result.push({ name: '国印贵人', position: z.pos, description: '主有权柄之象，利公职仕途' });
    }
  }

  // 天厨贵人（以日干查）
  const tccZhi = TIAN_CHU_GUI_REN[dayGan];
  for (const z of allZhi) {
    if (z.zhi === tccZhi) {
      result.push({ name: '天厨贵人', position: z.pos, description: '主口福好，有美食之缘，生活安逸' });
    }
  }

  // 亡神（以年支查）
  const wsZhi = WANG_SHEN[yearZhi];
  for (const z of allZhi) {
    if (z.zhi === wsZhi && z.pos !== '年支') {
      result.push({ name: '亡神', position: z.pos, description: '主心神不定，易有波折变动' });
    }
  }

  // 劫煞（以年支查）
  const jsZhi = JIE_SHA[yearZhi];
  for (const z of allZhi) {
    if (z.zhi === jsZhi && z.pos !== '年支') {
      result.push({ name: '劫煞', position: z.pos, description: '主意外之事，提防是非破财' });
    }
  }

  // 丧门（以年支查）
  const smZhi = SANG_MEN[yearZhi];
  for (const z of allZhi) {
    if (z.zhi === smZhi && z.pos !== '年支') {
      result.push({ name: '丧门', position: z.pos, description: '主孝服之事，注意家人健康' });
    }
  }

  // 吊客（以年支查）
  const dkZhi = DIAO_KE[yearZhi];
  for (const z of allZhi) {
    if (z.zhi === dkZhi && z.pos !== '年支') {
      result.push({ name: '吊客', position: z.pos, description: '主白事探问，宜多关心长者' });
    }
  }

  // 去重
  const seen = new Set();
  return result.filter(r => {
    const key = `${r.name}-${r.position}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ========== 刑冲合害 ==========

function calcXingChongHeHai(fourPillars) {
  const zhiList = [
    { pos: '年支', zhi: fourPillars.year.zhi },
    { pos: '月支', zhi: fourPillars.month.zhi },
    { pos: '日支', zhi: fourPillars.day.zhi },
    { pos: '时支', zhi: fourPillars.hour.zhi }
  ];

  const ganList = [
    { pos: '年干', gan: fourPillars.year.gan },
    { pos: '月干', gan: fourPillars.month.gan },
    { pos: '日干', gan: fourPillars.day.gan },
    { pos: '时干', gan: fourPillars.hour.gan }
  ];

  const result = {
    tianGanHe: [],
    tianGanChong: [],
    diZhiHe: [],
    diZhiChong: [],
    diZhiHai: [],
    diZhiXing: [],
    sanHe: [],
    sanHui: []
  };

  // 天干五合
  for (let i = 0; i < ganList.length; i++) {
    for (let j = i + 1; j < ganList.length; j++) {
      for (const he of TIAN_GAN_HE) {
        if ((ganList[i].gan === he.gan[0] && ganList[j].gan === he.gan[1]) ||
            (ganList[i].gan === he.gan[1] && ganList[j].gan === he.gan[0])) {
          result.tianGanHe.push({
            positions: [ganList[i].pos, ganList[j].pos],
            gans: [ganList[i].gan, ganList[j].gan],
            hua: he.hua,
            description: `${ganList[i].gan}${ganList[j].gan}合化${he.hua}`
          });
        }
      }
    }
  }

  // 天干相冲
  for (let i = 0; i < ganList.length; i++) {
    for (let j = i + 1; j < ganList.length; j++) {
      for (const chong of TIAN_GAN_CHONG) {
        if ((ganList[i].gan === chong[0] && ganList[j].gan === chong[1]) ||
            (ganList[i].gan === chong[1] && ganList[j].gan === chong[0])) {
          result.tianGanChong.push({
            positions: [ganList[i].pos, ganList[j].pos],
            gans: [ganList[i].gan, ganList[j].gan],
            description: `${ganList[i].gan}${ganList[j].gan}冲`
          });
        }
      }
    }
  }

  // 地支六合
  for (let i = 0; i < zhiList.length; i++) {
    for (let j = i + 1; j < zhiList.length; j++) {
      for (const he of LIU_HE) {
        if ((zhiList[i].zhi === he[0] && zhiList[j].zhi === he[1]) ||
            (zhiList[i].zhi === he[1] && zhiList[j].zhi === he[0])) {
          result.diZhiHe.push({
            positions: [zhiList[i].pos, zhiList[j].pos],
            zhis: [zhiList[i].zhi, zhiList[j].zhi],
            description: `${zhiList[i].zhi}${zhiList[j].zhi}合`
          });
        }
      }
    }
  }

  // 地支六冲
  for (let i = 0; i < zhiList.length; i++) {
    for (let j = i + 1; j < zhiList.length; j++) {
      for (const chong of LIU_CHONG) {
        if ((zhiList[i].zhi === chong[0] && zhiList[j].zhi === chong[1]) ||
            (zhiList[i].zhi === chong[1] && zhiList[j].zhi === chong[0])) {
          result.diZhiChong.push({
            positions: [zhiList[i].pos, zhiList[j].pos],
            zhis: [zhiList[i].zhi, zhiList[j].zhi],
            description: `${zhiList[i].zhi}${zhiList[j].zhi}冲`
          });
        }
      }
    }
  }

  // 地支六害
  for (let i = 0; i < zhiList.length; i++) {
    for (let j = i + 1; j < zhiList.length; j++) {
      for (const hai of LIU_HAI) {
        if ((zhiList[i].zhi === hai[0] && zhiList[j].zhi === hai[1]) ||
            (zhiList[i].zhi === hai[1] && zhiList[j].zhi === hai[0])) {
          result.diZhiHai.push({
            positions: [zhiList[i].pos, zhiList[j].pos],
            zhis: [zhiList[i].zhi, zhiList[j].zhi],
            description: `${zhiList[i].zhi}${zhiList[j].zhi}害`
          });
        }
      }
    }
  }

  // 地支相刑
  const zhiSet = zhiList.map(z => z.zhi);
  for (const xing of XING) {
    if (xing.type === '自刑') {
      const target = xing.zhi[0];
      const count = zhiSet.filter(z => z === target).length;
      if (count >= 2) {
        const positions = zhiList.filter(z => z.zhi === target).map(z => z.pos);
        result.diZhiXing.push({
          type: xing.type,
          positions,
          zhis: [target, target],
          description: `${target}${target}自刑`
        });
      }
    } else {
      // 检查是否有两个以上匹配
      const matched = zhiList.filter(z => xing.zhi.includes(z.zhi));
      if (matched.length >= 2) {
        result.diZhiXing.push({
          type: xing.type,
          positions: matched.map(m => m.pos),
          zhis: matched.map(m => m.zhi),
          description: `${matched.map(m => m.zhi).join('')}${xing.type}`
        });
      }
    }
  }

  // 三合局
  for (const sh of SAN_HE) {
    const matched = zhiList.filter(z => sh.zhi.includes(z.zhi));
    const matchedZhi = new Set(matched.map(m => m.zhi));
    if (matchedZhi.size === 3) {
      result.sanHe.push({
        positions: matched.map(m => m.pos),
        zhis: matched.map(m => m.zhi),
        xing: sh.xing,
        description: `${matched.map(m => m.zhi).join('')}三合${sh.xing}局`
      });
    }
  }

  // 三会局
  for (const sh of SAN_HUI) {
    const matched = zhiList.filter(z => sh.zhi.includes(z.zhi));
    const matchedZhi = new Set(matched.map(m => m.zhi));
    if (matchedZhi.size === 3) {
      result.sanHui.push({
        positions: matched.map(m => m.pos),
        zhis: matched.map(m => m.zhi),
        xing: sh.xing,
        description: `${matched.map(m => m.zhi).join('')}三会${sh.xing}局`
      });
    }
  }

  return result;
}


// === src/analysis/geju.js ===

// 调候用神表（穷通宝鉴）：十天干生于十二月所需调候天干
// 格式：TIAO_HOU[日干][月支] = { main: '主用神', aux: '辅助' }
const TIAO_HOU = {
  '甲': {
    '寅': { main: '丙', aux: '癸', desc: '初春尚有余寒，丙火照暖为急，癸水润根为辅。丙火为主，癸水为佐' },
    '卯': { main: '庚', aux: '丙丁', desc: '阳刃当令，木气旺盛，非庚金不能修剪。庚金为主，辅以丙丁火暖局' },
    '辰': { main: '庚', aux: '丁', desc: '暮春木气犹盛，庚金制木为先，丁火配合制庚之寒' },
    '巳': { main: '癸', aux: '庚丁', desc: '调和气候，癸水为主。原局气润，庚丁为用' },
    '午': { main: '癸', aux: '庚丁', desc: '盛夏火烈，甲木焦枯，非癸水不能解炎。癸水为主，庚金发源，丁火暗藏' },
    '未': { main: '癸', aux: '庚丁', desc: '季夏土燥木枯，癸水润泽为急，庚丁佐之' },
    '申': { main: '庚', aux: '丁', desc: '秋金当令，庚金雕木成器，丁火推助炼金。庚为主，丁为辅' },
    '酉': { main: '庚', aux: '丁丙', desc: '秋深金锐，官星当旺，庚金修剪甲木，丁火暖局解金寒' },
    '戌': { main: '庚', aux: '甲丁', desc: '戌土燥重，庚金制木为先，甲木疏通，丁火温润。庚为主，丁甲为用' },
    '亥': { main: '庚', aux: '丁丙', desc: '水旺木浮，庚金制水生木，丁火温暖为急。庚为主，丙丁暖局' },
    '子': { main: '丁', aux: '庚丙', desc: '仲冬水冷木寒，丁火暖局为第一要务，庚金为佐。丁为主，庚为用' },
    '丑': { main: '丁', aux: '庚丙', desc: '季冬寒重，丁火暖身解冻为先，庚金修剪残枝。丁为主，庚为辅' }
  },
  '乙': {
    '寅': { main: '丙', aux: '癸', desc: '初春尚寒，乙木柔嫩，丙火照暖催发为先，癸水润根。丙为主，癸为佐' },
    '卯': { main: '癸', aux: '丙', desc: '建禄之地，木气方盛，癸水润木养根为主，丙火照暖为辅' },
    '辰': { main: '癸', aux: '丙', desc: '春末土重，癸水润木疏通为先，丙火照暖次之' },
    '巳': { main: '癸', aux: '丙', desc: '夏火初炎，乙木易枯，非癸水不能调候。癸为主，丙为助' },
    '午': { main: '癸', aux: '丙丁', desc: '盛夏火炎木枯，癸水解炎救急为主，丙丁火暗藏为辅' },
    '未': { main: '癸', aux: '丙', desc: '季夏土燥，木根干涸，癸水润培为急，丙火温暖为辅' },
    '申': { main: '丙', aux: '癸', desc: '秋金克木，丙火制金护木为主，癸水润根。丙为主，癸为佐' },
    '酉': { main: '丙', aux: '癸', desc: '秋深金旺杀重，丙火制杀护身为急，癸水化金生木' },
    '戌': { main: '癸', aux: '丙', desc: '戌土燥重，木气受困，癸水润燥通根为主，丙火温养为辅' },
    '亥': { main: '丙', aux: '戊', desc: '冬水寒木，非丙火不能发荣。丙为主，戊土制水为佐' },
    '子': { main: '丙', aux: '', desc: '水冷木寒，丙火为第一要务，无丙则木不发' },
    '丑': { main: '丙', aux: '', desc: '季冬寒重，丙火暖身解冻为先，无丙则生机不显' }
  },
  '丙': {
    '寅': { main: '壬', aux: '庚', desc: '春初火相未旺，壬水制炎为急，庚金为水源。壬为主，庚为辅' },
    '卯': { main: '壬', aux: '', desc: '木旺火相，壬水调济为急，不可缺水' },
    '辰': { main: '壬', aux: '甲', desc: '土重晦光，壬水解燥为先，甲木疏土。壬为主，甲为用' },
    '巳': { main: '壬', aux: '癸庚', desc: '火临禄旺之地，烈焰腾空，非壬水不能解炎。壬为主，庚金发源' },
    '午': { main: '壬', aux: '庚', desc: '阳刃当令，火势冲天，壬水救局急用。壬为主，庚金为水源' },
    '未': { main: '壬', aux: '庚', desc: '火土相炎，壬水解燥救急，庚金发源。壬为主，庚为用' },
    '申': { main: '壬', aux: '戊', desc: '秋金生水，壬水通源为用。壬为主，戊土防壬泛滥' },
    '酉': { main: '壬', aux: '', desc: '秋深金旺，财星当令，壬水为用调候。壬水不可少' },
    '戌': { main: '甲', aux: '壬', desc: '火库燥土，甲木疏土为先，壬水解燥。甲为主，壬为辅' },
    '亥': { main: '甲', aux: '壬戊庚', desc: '水旺火绝，甲木生火为第一要务。甲为主，戊土制水为辅' },
    '子': { main: '壬', aux: '戊', desc: '正官当令，水旺火熄，壬戊并用取平衡。壬戊为主' },
    '丑': { main: '壬', aux: '甲', desc: '寒土晦火，壬水解冻为先，甲木疏土。壬为主，甲为用' }
  },
  '丁': {
    '寅': { main: '甲', aux: '庚', desc: '春木生火，甲木为丁火之源，庚金劈甲引火。甲为主，庚为佐' },
    '卯': { main: '庚', aux: '甲', desc: '木多火塞，庚金劈木引丁为急。庚为主，甲为佐' },
    '辰': { main: '甲', aux: '庚', desc: '土重晦光，甲木疏土引火为先，庚金劈甲。甲为主，庚为用' },
    '巳': { main: '甲', aux: '庚', desc: '帝旺之地，火势炎炎，甲木为源，庚金劈甲引丁。甲为主，庚为辅' },
    '午': { main: '壬', aux: '庚癸', desc: '建禄火炎，壬水解炎救急为主，庚金发源为佐' },
    '未': { main: '甲', aux: '庚壬', desc: '火退气渐衰，甲木扶助为先，庚壬配合为用' },
    '申': { main: '甲', aux: '庚丙', desc: '金旺晦火，甲木生扶为要，庚金劈甲引丁。甲为主，丙为辅' },
    '酉': { main: '甲', aux: '庚丙', desc: '金多火熄，偏财当令，甲木扶身为急。甲为主，丙暖为辅' },
    '戌': { main: '甲', aux: '庚戊', desc: '火库被晦，甲木疏通为先，庚戊配合为用' },
    '亥': { main: '甲', aux: '庚', desc: '官星当令，水旺火绝，甲木生丁为救命之物。甲为主，庚为辅' },
    '子': { main: '甲', aux: '庚', desc: '七杀当权，冬水灭火，甲木为第一要务。甲为主，庚劈甲引丁' },
    '丑': { main: '甲', aux: '庚', desc: '寒土晦光，甲庚同用。甲疏土生火，庚劈甲引丁' }
  },
  '戊': {
    '寅': { main: '丙', aux: '甲癸', desc: '七杀当令，春木克土，丙火化杀生身为急。丙为主，甲癸为辅' },
    '卯': { main: '丙', aux: '甲癸', desc: '正官当令，木旺土虚，丙火通关化木生土。丙为主，甲癸为辅' },
    '辰': { main: '甲', aux: '癸丙', desc: '比肩当令，土重壅塞，甲木疏土为先。甲为主，癸丙配合' },
    '巳': { main: '壬', aux: '甲丙', desc: '印星当令，火炎土燥，壬水调候为先。壬为主，甲丙为辅' },
    '午': { main: '壬', aux: '甲丙', desc: '火旺土焦，印星过旺，壬水调候为急。壬为主，甲木疏土' },
    '未': { main: '癸', aux: '丙甲', desc: '劫财当令，燥土难生，癸水润泽为先。癸为主，丙甲佐之' },
    '申': { main: '丙', aux: '癸甲', desc: '食神泄气，金旺土虚，丙火生扶为要。丙为主，癸润为辅' },
    '酉': { main: '丙', aux: '癸', desc: '伤官当令，金多泄土，丙火为第一要务。丙为主，癸为助' },
    '戌': { main: '甲', aux: '丙癸', desc: '比肩当令，燥土重实，甲木疏通为先。甲为主，丙癸配合' },
    '亥': { main: '甲', aux: '丙', desc: '偏财当令，水旺土荡，甲木制水固土为先。甲为主，丙火暖局' },
    '子': { main: '丙', aux: '甲', desc: '正财当令，水冷土寒，丙火暖局生身为急。丙为主，甲为辅' },
    '丑': { main: '丙', aux: '甲', desc: '劫财当令，寒土凝结，丙火解冻暖身。丙为主，甲木疏土' }
  },
  '己': {
    '寅': { main: '丙', aux: '庚甲', desc: '正官当令，春木克土，丙火化官生身为要。丙为主，庚甲为辅' },
    '卯': { main: '甲', aux: '丙癸', desc: '七杀当令，木旺土倾，甲木疏泄为先。甲为主，丙癸为辅' },
    '辰': { main: '丙', aux: '甲癸', desc: '劫财当令，土湿气重，丙火暖局为急。丙为主，甲癸佐之' },
    '巳': { main: '癸', aux: '丙', desc: '印星当令，火炎土燥，癸水润泽调候为先。癸为主，丙为辅' },
    '午': { main: '癸', aux: '丙', desc: '偏印当令，火旺土焦，癸水解燥救急。癸为主，丙火温养为辅' },
    '未': { main: '癸', aux: '丙', desc: '比肩当令，燥土难生，癸水润泽为急。癸为主，丙为辅' },
    '申': { main: '丙', aux: '癸', desc: '伤官当令，金泄土气，丙火生扶为主。丙为主，癸润为辅' },
    '酉': { main: '丙', aux: '癸', desc: '食神当令，金多泄土，丙火暖局生身。丙为主，癸为辅' },
    '戌': { main: '甲', aux: '丙癸', desc: '劫财当令，燥土壅塞，甲木疏劈为先。甲为主，丙癸配合' },
    '亥': { main: '丙', aux: '甲', desc: '正财当令，水冷土寒，丙火暖局为急。丙为主，甲为辅' },
    '子': { main: '丙', aux: '甲戊', desc: '三冬己土，非丙暖不生。壬水太旺，取戊土制之。土多，取甲木疏之' },
    '丑': { main: '丙', aux: '甲', desc: '比肩当令，寒土冰结，丙火解冻暖局。丙为主，甲疏土为辅' }
  },
  '庚': {
    '寅': { main: '丁', aux: '甲丙', desc: '偏财当令，春木旺而金囚，丁火炼金为主，甲木为辅' },
    '卯': { main: '丁', aux: '甲丙', desc: '正财当令，木坚金缺，丁火制木护金为急。丁为主，甲丙为辅' },
    '辰': { main: '甲', aux: '丁壬', desc: '偏印当令，土重埋金，甲木疏土为先。甲为主，丁火炼金' },
    '巳': { main: '壬', aux: '丙戊', desc: '七杀当令，火旺熔金，壬水救急为第一要务。壬为主，丙戊为辅' },
    '午': { main: '壬', aux: '癸', desc: '正官当令，烈火熔金，壬水救金不熔。壬为主，癸为辅' },
    '未': { main: '壬', aux: '甲丁', desc: '正印当令，燥土脆金，壬水润局为急。壬为主，甲丁为辅' },
    '申': { main: '丁', aux: '甲', desc: '比肩当令，金临禄旺，丁火炼金成器。丁为主，甲木为辅' },
    '酉': { main: '丁', aux: '甲丙', desc: '阳刃当令，金气过旺，丁火锻炼为先。丁为主，甲丙为辅' },
    '戌': { main: '甲', aux: '壬', desc: '偏印当令，燥土埋金，甲木疏土为要。甲为主，壬水润局' },
    '亥': { main: '丁', aux: '丙', desc: '食神当令，水冷金寒，丁火暖局为先。丁为主，丙火为助' },
    '子': { main: '丁', aux: '甲丙', desc: '伤官当令，水旺金沉，丁火暖身为急。丁为主，甲丙为辅' },
    '丑': { main: '丙', aux: '丁甲', desc: '正印当令，寒土埋金，丙火暖局为先。丙为主，丁甲为辅' }
  },
  '辛': {
    '寅': { main: '己', aux: '壬庚', desc: '正财当令，春木旺而金弱，己土生金为先。己为主，壬庚为辅' },
    '卯': { main: '壬', aux: '甲', desc: '偏财当令，木坚金缺，壬水通关润金。壬为主，甲为辅' },
    '辰': { main: '壬', aux: '甲', desc: '正印当令，土重埋金，壬水淘洗为先。壬为主，甲木疏土' },
    '巳': { main: '壬', aux: '甲癸', desc: '正官当令，火旺熔金，壬水救急解炎。壬为主，甲癸为辅' },
    '午': { main: '壬', aux: '己癸', desc: '七杀当令，烈火熔金，壬水解炎救急。壬为主，己癸为辅' },
    '未': { main: '壬', aux: '庚甲', desc: '偏印当令，燥土脆金，壬水润局为先。壬为主，庚甲为辅' },
    '申': { main: '壬', aux: '甲', desc: '劫财当令，金多水浊，壬水淘洗为急。壬为主，甲木为辅' },
    '酉': { main: '壬', aux: '甲', desc: '比肩当令，金气过重，壬水泄金之秀。壬为主，甲木为辅' },
    '戌': { main: '壬', aux: '甲', desc: '正印当令，燥土埋金，壬水润局为先。壬为主，甲木疏土' },
    '亥': { main: '壬', aux: '丙', desc: '伤官当令，水冷金寒，壬水淘洗为主，丙火暖局为辅' },
    '子': { main: '丙', aux: '壬甲', desc: '食神当令，水旺金沉，丙火暖局为急。丙为主，壬甲为辅' },
    '丑': { main: '丙', aux: '壬甲', desc: '偏印当令，寒土冻金，丙火解冻暖局。丙为主，壬甲为辅' }
  },
  '壬': {
    '寅': { main: '庚', aux: '丙戊', desc: '食神当令，春木泄水，庚金发源为急。庚为主，丙戊为辅' },
    '卯': { main: '戊', aux: '辛庚', desc: '伤官当令，木旺水浅，戊土制水归流为先。戊为主，辛庚发源' },
    '辰': { main: '甲', aux: '庚', desc: '七杀当令，水库土壅，甲木疏土泄水。甲为主，庚金发源' },
    '巳': { main: '壬', aux: '辛庚', desc: '偏财当令，火旺水涸，壬水帮身为急。壬为主，辛庚为辅' },
    '午': { main: '癸', aux: '庚辛', desc: '正财当令，火炎水干，癸水解炎为先。癸为主，庚辛发源' },
    '未': { main: '辛', aux: '甲', desc: '正官当令，土燥水涸，辛金发源为急。辛为主，甲木疏土' },
    '申': { main: '戊', aux: '丁', desc: '偏印当令，金水相生，戊土堤防为先。戊为主，丁佐之' },
    '酉': { main: '甲', aux: '庚', desc: '正印当令，金多水浊，甲木泄水为用。甲为主，庚金为辅' },
    '戌': { main: '甲', aux: '丙', desc: '七杀当令，土燥水涸，甲木疏土为先。甲为主，丙火暖局' },
    '亥': { main: '戊', aux: '丙庚', desc: '比肩当令，水旺泛滥，戊土堤防为急。戊为主，丙庚为辅' },
    '子': { main: '戊', aux: '丙', desc: '阳刃当令，水势滔天，戊土堤防为主。戊为主，丙火暖局' },
    '丑': { main: '丙', aux: '丁甲', desc: '正官当令，寒水冰结，丙火解冻暖局。丙为主，丁甲为辅' }
  },
  '癸': {
    '寅': { main: '辛', aux: '丙', desc: '伤官当令，春木泄水，辛金发源为先。辛为主，丙火暖局' },
    '卯': { main: '庚', aux: '辛', desc: '食神当令，木盛水浅，庚金发源为急。庚为主，辛金助之' },
    '辰': { main: '辛', aux: '甲', desc: '正官当令，水库壅塞，辛金发源流通。辛为主，甲木疏土' },
    '巳': { main: '辛', aux: '壬', desc: '正财当令，火旺水涸，辛金发源为先。辛为主，壬水帮身' },
    '午': { main: '庚', aux: '壬癸', desc: '偏财当令，火炎水干，庚金发源为急。庚为主，壬癸帮身' },
    '未': { main: '庚', aux: '辛壬', desc: '七杀当令，燥土干涸，庚金为水源。庚为主，辛壬为辅' },
    '申': { main: '丁', aux: '甲', desc: '正印当令，金多水浊，丁火制金为先。丁为主，甲木为辅' },
    '酉': { main: '辛', aux: '丙', desc: '偏印当令，金重水涩，辛金发源通流。辛为主，丙火暖局' },
    '戌': { main: '辛', aux: '甲壬', desc: '正官当令，燥土塞水，辛金发源为先。辛为主，甲疏壬辅' },
    '亥': { main: '庚', aux: '辛戊', desc: '劫财当令，水旺需庚金为源。庚为主，辛戊为辅' },
    '子': { main: '丙', aux: '辛', desc: '比肩当令，水冷冰寒，丙火暖局为第一要务。丙为主，辛为辅' },
    '丑': { main: '丙', aux: '丁', desc: '七杀当令，冬寒水冻，丙火解冻暖局。丙为主，丁火助暖' }
  }
};

// 获取调候用神
function getTiaoHou(dayGan, monthZhi) {
  const entry = TIAO_HOU[dayGan] && TIAO_HOU[dayGan][monthZhi];
  if (!entry) return null;
  return {
    mainGan: entry.main,
    auxGan: entry.aux,
    description: entry.desc,
    mainWx: entry.main ? GAN_WU_XING[entry.main.split('')[0]] : null
  };
}

// ========== 格局判定（子平真诠） ==========
// 以月令为主，看月支藏干在天干透出情况确定格局
function determineGeJu(fourPillars) {
  const monthZhi = fourPillars.month.zhi;
  const dayGan = fourPillars.day.gan;
  const dayWx = GAN_WU_XING[dayGan];
  const cangGan = ZHI_CANG_GAN[monthZhi];

  // 所有透出的天干
  const allGans = [
    fourPillars.year.gan,
    fourPillars.month.gan,
    fourPillars.day.gan,
    fourPillars.hour.gan
  ];

  // 检查月令藏干哪些在天干透出
  const touChu = cangGan.filter(g => allGans.includes(g));

  let geJu = null;
  let geJuType = null;

  // 先检查是否为建禄格/月刃格（月令为日主之禄或羊刃）
  const luShenZhi = LU_SHEN[dayGan];
  const yangRenZhi = YANG_REN[dayGan];

  if (monthZhi === luShenZhi) {
    // 建禄格：月令为日主之禄
    // 再看透出何干取格
    if (touChu.length > 0) {
      const firstTou = touChu[0];
      const ss = getShiShen(dayGan, firstTou);
      geJuType = '建禄格';
      geJu = { type: geJuType, ss: ss, touGan: firstTou };
    } else {
      geJuType = '建禄格';
      geJu = { type: geJuType, ss: null, touGan: null };
    }
  } else if (monthZhi === yangRenZhi) {
    // 月刃格（阳刃格）
    if (touChu.length > 0) {
      const firstTou = touChu[0];
      const ss = getShiShen(dayGan, firstTou);
      geJuType = '月刃格';
      geJu = { type: geJuType, ss: ss, touGan: firstTou };
    } else {
      geJuType = '月刃格';
      geJu = { type: geJuType, ss: null, touGan: null };
    }
  } else {
    // 普通格局：以月令透出之十神定格局
    // 比肩劫财不入格，需过滤后再取透干
    const validTouChu = touChu.filter(g => {
      const s = getShiShen(dayGan, g);
      return s !== '比肩' && s !== '劫财';
    });
    if (validTouChu.length > 0) {
      const firstTou = validTouChu[0];
      const ss = getShiShen(dayGan, firstTou);
      const geJuMap = {
        '正官': '正官格', '偏官': '七杀格',
        '正印': '正印格', '偏印': '偏印格',
        '正财': '正财格', '偏财': '偏财格',
        '食神': '食神格', '伤官': '伤官格'
      };
      geJuType = geJuMap[ss] || (ss + '格');
      geJu = { type: geJuType, ss: ss, touGan: firstTou };
    } else {
      // 月令不透（或只透比劫），以月令本气取格
      const benQi = cangGan[0];
      const ss = getShiShen(dayGan, benQi);
      const geJuMap = {
        '正官': '正官格', '偏官': '七杀格',
        '正印': '正印格', '偏印': '偏印格',
        '正财': '正财格', '偏财': '偏财格',
        '食神': '食神格', '伤官': '伤官格',
        '比肩': '建禄格', '劫财': '月刃格'
      };
      geJuType = geJuMap[ss] || (ss + '格');
      geJu = { type: geJuType, ss: ss, touGan: benQi, hidden: true };
    }
  }

  return {
    ...geJu,
    monthZhi,
    cangGan,
    touChu,
    isJianLu: geJuType === '建禄格',
    isYueRen: geJuType === '月刃格'
  };
}

// ========== 特殊组合分析 ==========
function analyzeSpecialCombinations(fourPillars, shiShen) {
  const dayGan = fourPillars.day.gan;
  const combinations = [];

  // 天干十神列表
  const ganShiShen = [
    { pos: '年干', gan: fourPillars.year.gan, ss: shiShen.year.gan },
    { pos: '月干', gan: fourPillars.month.gan, ss: shiShen.month.gan },
    { pos: '日干', gan: fourPillars.day.gan, ss: '日主' },
    { pos: '时干', gan: fourPillars.hour.gan, ss: shiShen.hour.gan }
  ];

  // 1. 枭印夺食：偏印 + (食神或伤官)同现
  const hasPianYin = ganShiShen.filter(g => g.ss === '偏印');
  const hasShiShang = ganShiShen.filter(g => g.ss === '食神' || g.ss === '伤官');
  if (hasPianYin.length > 0 && hasShiShang.length > 0) {
    for (const py of hasPianYin) {
      for (const ss2 of hasShiShang) {
        if (py.pos !== ss2.pos) {
          const ssName = ss2.ss === '食神' ? '食神' : '伤官';
          combinations.push({
            name: '枭印夺食',
            severity: 'high',
            description: `${py.pos}${py.gan}（偏印）克制${ss2.pos}${ss2.gan}（${ssName}），为枭印夺食。才华难展、福气受损，思路容易受限，需注意情绪管理。`,
            solution: '若有偏财透出可制枭护食，或走财运通关化解。',
            involved: [py, ss2]
          });
        }
      }
    }
  }

  // 2. 伤官见官：伤官 + 正官同现
  const hasShangGuan = ganShiShen.filter(g => g.ss === '伤官');
  const hasZhengGuan = ganShiShen.filter(g => g.ss === '正官');
  if (hasShangGuan.length > 0 && hasZhengGuan.length > 0) {
    for (const sg of hasShangGuan) {
      for (const zg of hasZhengGuan) {
        if (sg.pos !== zg.pos) {
          combinations.push({
            name: '伤官见官',
            severity: 'medium',
            description: `${sg.pos}${sg.gan}（伤官）与${zg.pos}${zg.gan}（正官）并见。伤官克官，主叛逆不服管束，事业易有波折，人际关系需谨慎处理。`,
            solution: '若有印星透出制伤护官，可化解此病。',
            involved: [sg, zg]
          });
        }
      }
    }
  }

  // 3. 财星坏印：正/偏财克正/偏印
  const hasCai = ganShiShen.filter(g => g.ss === '正财' || g.ss === '偏财');
  const hasYin = ganShiShen.filter(g => g.ss === '正印' || g.ss === '偏印');
  if (hasCai.length > 0 && hasYin.length > 0) {
    for (const c of hasCai) {
      for (const y of hasYin) {
        if (c.pos !== y.pos) {
          combinations.push({
            name: '财星坏印',
            severity: 'medium',
            description: `${c.pos}${c.gan}（财星）克制${y.pos}${y.gan}（印星），为财坏印。印主学业、名誉、靠山，被财所坏容易因利益损名誉，读书期间易分心。`,
            solution: '若有官星通关（财生官、官生印），或比劫制财护印可解。',
            involved: [c, y]
          });
        }
      }
    }
  }

  // 4. 官杀混杂：正官 + 偏官同现
  if (hasZhengGuan.length > 0) {
    const hasPianGuan = ganShiShen.filter(g => g.ss === '偏官');
    if (hasPianGuan.length > 0) {
      combinations.push({
        name: '官杀混杂',
        severity: 'medium',
        description: '正官与偏官（七杀）并见，事业上容易面临多重压力，选择困难，需分清主次、专注一处。',
        solution: '去官留杀或去杀留官，以印化杀或食神制杀，取清为贵。',
        involved: [...hasZhengGuan, ...hasPianGuan]
      });
    }
  }

  // 5. 食神制杀：食神克制七杀（吉）
  const hasShiShen2 = ganShiShen.filter(g => g.ss === '食神');
  if (hasShiShen2.length > 0) {
    const hasPianGuan2 = ganShiShen.filter(g => g.ss === '偏官');
    if (hasPianGuan2.length > 0) {
      combinations.push({
        name: '食神制杀',
        severity: 'good',
        description: '食神制七杀，以才华智慧驾驭权力压力，是成大事之象。有魄力有手段，能化压力为动力。',
        solution: '',
        involved: [...hasShiShen2, ...hasPianGuan2]
      });
    }
  }

  // 6. 杀印相生：七杀生印、印生身（吉）
  if (hasYin.length > 0) {
    const hasPianGuan3 = ganShiShen.filter(g => g.ss === '偏官');
    if (hasPianGuan3.length > 0) {
      combinations.push({
        name: '杀印相生',
        severity: 'good',
        description: '七杀生印、印再生身，压力化为动力，又有贵人扶持，是掌权柄之象。',
        solution: '',
        involved: [...hasYin, ...hasPianGuan3]
      });
    }
  }

  // 7. 伤官生财：伤官生财星（吉）
  if (hasShangGuan.length > 0 && hasCai.length > 0) {
    combinations.push({
      name: '伤官生财',
      severity: 'good',
      description: '伤官才华转化为财星，靠技术和创意赚钱，是以技艺致富之路。',
      solution: '',
      involved: [...hasShangGuan, ...hasCai]
    });
  }

  // 8. 财官相生：财生官（吉）
  if (hasCai.length > 0 && hasZhengGuan.length > 0) {
    combinations.push({
      name: '财官相生',
      severity: 'good',
      description: '财生官，事业因财富而得提升，适合走正规职业发展道路，有名有利。',
      solution: '',
      involved: [...hasCai, ...hasZhengGuan]
    });
  }

  // 去重
  const seen = new Set();
  return combinations.filter(c => {
    const key = c.name;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ========== 综合用神分析（整合调候+格局+强弱） ==========
function analyzeYongShen(fourPillars, dayStrength, shiShen, tiaoHou) {
  const dayGan = fourPillars.day.gan;
  const dayWx = GAN_WU_XING[dayGan];
  const monthZhi = fourPillars.month.zhi;
  const strength = dayStrength.strength;

  // 1. 调候用神（第一优先）
  let tiaoHouYongShen = null;
  let tiaoHouWx = null;
  if (tiaoHou) {
    tiaoHouYongShen = tiaoHou.mainGan;
    tiaoHouWx = tiaoHou.mainWx;
  }

  // 2. 格局用神
  const geJu = determineGeJu(fourPillars);
  let geJuYongShen = null;

  if (geJu.type === '正官格') {
    geJuYongShen = { ss: '正印', wx: WU_XING_BEI_SHENG[dayWx], desc: '正官格喜印护官、喜财生官' };
  } else if (geJu.type === '七杀格') {
    geJuYongShen = { ss: '食神', wx: WU_XING_SHENG[dayWx], desc: '七杀格喜食神制杀、喜印化杀' };
  } else if (geJu.type === '正财格') {
    geJuYongShen = { ss: '正官', wx: WU_XING_BEI_KE[dayWx], desc: '正财格喜官护财、喜食伤生财' };
  } else if (geJu.type === '偏财格') {
    geJuYongShen = { ss: '正官', wx: WU_XING_BEI_KE[dayWx], desc: '偏财格喜官护财、喜食伤生财' };
  } else if (geJu.type === '正印格') {
    geJuYongShen = { ss: '正官', wx: WU_XING_BEI_KE[dayWx], desc: '正印格喜官生印、忌财坏印' };
  } else if (geJu.type === '偏印格') {
    geJuYongShen = { ss: '偏财', wx: WU_XING_KE[dayWx], desc: '偏印格喜财制枭、忌食神被夺' };
  } else if (geJu.type === '食神格') {
    geJuYongShen = { ss: '偏财', wx: WU_XING_KE[dayWx], desc: '食神格喜生财、忌偏印夺食' };
  } else if (geJu.type === '伤官格') {
    geJuYongShen = { ss: '正印', wx: WU_XING_BEI_SHENG[dayWx], desc: '伤官格喜印制伤护官、喜财泄伤' };
  } else if (geJu.type === '建禄格') {
    geJuYongShen = { ss: '正官', wx: WU_XING_BEI_KE[dayWx], desc: '建禄格喜官杀制、喜财生官、喜食伤泄秀' };
  } else if (geJu.type === '月刃格') {
    geJuYongShen = { ss: '正官', wx: WU_XING_BEI_KE[dayWx], desc: '月刃格喜官杀制刃、忌冲刃' };
  }

  // 3. 强弱用神（扶抑）
  let strengthYongShen = null;
  if (['身强', '偏强'].includes(strength)) {
    // 身强宜克泄耗：官杀 > 食伤 > 财
    strengthYongShen = {
      main: WU_XING_BEI_KE[dayWx] || WU_XING_KE[dayWx],
      alt: WU_XING_SHENG[dayWx],
      desc: '身强喜克泄耗，以官杀制身、食伤泄秀、财星耗身为用'
    };
  } else if (['身弱', '偏弱'].includes(strength)) {
    // 身弱宜生扶：印 > 比劫
    strengthYongShen = {
      main: WU_XING_BEI_SHENG[dayWx],
      alt: dayWx,
      desc: '身弱喜生扶，以印星生身、比劫帮身为用'
    };
  } else {
    strengthYongShen = {
      main: WU_XING_SHENG[dayWx] || WU_XING_BEI_SHENG[dayWx],
      alt: dayWx,
      desc: '中和偏灵活，顺势取用'
    };
  }

  // === 综合优先级 ===
  // 1. 调候为急（优先于一切）
  // 2. 格局用神
  // 3. 强弱扶抑
  // 4. 特殊组合通关

  const priority = [];
  let mainYongShenWx = null;

  if (tiaoHouWx) {
    priority.push({
      priority: 1,
      source: '调候（穷通宝鉴）',
      wx: tiaoHouWx,
      gan: tiaoHouYongShen,
      desc: tiaoHou ? tiaoHou.description : ''
    });
    mainYongShenWx = tiaoHouWx;
  }

  if (geJuYongShen) {
    priority.push({
      priority: 2,
      source: '格局（子平真诠）',
      wx: geJuYongShen.wx,
      ss: geJuYongShen.ss,
      desc: geJuYongShen.desc
    });
    if (!mainYongShenWx) mainYongShenWx = geJuYongShen.wx;
  }

  if (strengthYongShen) {
    priority.push({
      priority: 3,
      source: '扶抑（强弱平衡）',
      wx: strengthYongShen.main,
      altWx: strengthYongShen.alt,
      desc: strengthYongShen.desc
    });
    if (!mainYongShenWx) mainYongShenWx = strengthYongShen.main;
  }

  return {
    mainYongShenWx,
    priority,
    tiaoHou,
    geJu,
    strengthYongShen
  };
}


// === src/analysis/report.js ===

// 日柱性格描述
const RI_ZHU_XING_GE = {
  '甲': {
    base: '甲木为参天大树，性格正直、有主见、有担当，做事有魄力，不轻易低头。',
    strong: '身强时更显固执己见，不易变通，但领导力强，适合独当一面。',
    weak: '身弱时外强中干，容易逞强，需要有人扶持才能发挥实力。'
  },
  '乙': {
    base: '乙木为花草藤蔓，性格柔韧、善于变通、亲和力强，懂得以柔克刚。',
    strong: '身强时有主见又不失灵活，人缘好，善于经营关系。',
    weak: '身弱时容易优柔寡断，依赖性强，需要找到自己的支撑点。'
  },
  '丙': {
    base: '丙火为太阳之火，性格热情开朗、大方豪爽，有感染力，喜欢照顾别人。',
    strong: '身强时光芒四射，但容易过于高调，有时大大咧咧不拘小节。',
    weak: '身弱时热情减退，容易患得患失，需要有人给予信心和温暖。'
  },
  '丁': {
    base: '丁火为烛光之火，性格细腻温和、心思缜密，外柔内刚，有洞察力。',
    strong: '身强时聪慧过人，做事有条理，内心坚定，善于谋划。',
    weak: '身弱时敏感多虑，容易钻牛角尖，需要有稳定的环境才能发挥。'
  },
  '戊': {
    base: '戊土为高山大地，性格稳重厚道、言出必行，给人踏实靠谱的感觉。',
    strong: '身强时沉稳大气，有包容力，但可能过于固执，不易接受新事物。',
    weak: '身弱时表面沉稳但内心不安，做事犹豫，需要实际的成绩来建立信心。'
  },
  '己': {
    base: '己土为田园之土，性格谦和包容、务实低调，善于滋养和成就别人。',
    strong: '身强时踏实能干，有耐心，善于积累，为人厚道有人缘。',
    weak: '身弱时容易多虑、不自信，付出多回报少，需要被认可和鼓励。'
  },
  '庚': {
    base: '庚金为刀剑之金，性格果断刚毅、讲义气，做事雷厉风行，有决断力。',
    strong: '身强时杀伐果断，有魄力有执行力，但容易过于强势和直接。',
    weak: '身弱时外刚内柔，看似强硬但底气不足，需要有坚实的后盾。'
  },
  '辛': {
    base: '辛金为珠宝之金，性格精致细腻、有品味，外表温润但内心有主见。',
    strong: '身强时优雅有格调，对细节要求高，善于发现美和价值。',
    weak: '身弱时敏感脆弱，容易纠结，对外界评价在意，需要精神上的滋养。'
  },
  '壬': {
    base: '壬水为江河大海，性格聪慧豁达、善于变通，视野开阔，不拘一格。',
    strong: '身强时智慧过人，思维活跃，社交能力强，但容易不安分。',
    weak: '身弱时想法多但行动力不足，容易随波逐流，需要找到方向感。'
  },
  '癸': {
    base: '癸水为雨露之水，性格聪明内敛、直觉强，善于观察和感知，有灵性。',
    strong: '身强时心思缜密，记忆力好，有研究精神，适合从事脑力工作。',
    weak: '身弱时多愁善感，容易内耗，需要有人理解和支持。'
  }
};

// 十神在各柱的含义概要
const SHI_SHEN_MEANING = {
  '比肩': { keyword: '同辈、竞争、合作', personality: '独立自主，有竞争意识' },
  '劫财': { keyword: '竞争、争夺、社交', personality: '好胜心强，敢于冒险' },
  '食神': { keyword: '才华、口福、表达', personality: '有才华，生活品味好，善于表达' },
  '伤官': { keyword: '才华、叛逆、创新', personality: '聪明有创意，不走寻常路' },
  '偏财': { keyword: '大财、投资、父亲', personality: '慷慨大方，有商业头脑' },
  '正财': { keyword: '稳定收入、妻子', personality: '勤俭持家，重视稳定' },
  '偏官': { keyword: '权力、压力、魄力', personality: '有魄力有压力，适合管理' },
  '正官': { keyword: '正统、规矩、名誉', personality: '守规矩，有责任感' },
  '偏印': { keyword: '偏才、玄学、孤独', personality: '思维独特，对神秘事物感兴趣' },
  '正印': { keyword: '学历、长辈、庇护', personality: '有学识，受长辈关照' }
};

// 五行对应行业
const WU_XING_CAREER = {
  '木': '教育培训、文化传媒、出版、医药、农林、服装、设计、公益',
  '火': '餐饮、电子科技、能源、娱乐演艺、美容美发、广告营销、直播',
  '土': '房地产、建筑、农业、物流仓储、咨询策划、殡葬、保险',
  '金': '金融、汽车机械、五金、法律、军警、IT硬件、钢铁矿业',
  '水': '贸易、物流运输、旅游、水利、酒水饮料、传播传媒、玄学命理'
};

// 五行对应方位
const WU_XING_DIRECTION = {
  '木': '东方', '火': '南方', '土': '中部/本地',
  '金': '西方', '水': '北方'
};

// 五行对应颜色
const WU_XING_COLOR = {
  '木': '绿色、青色', '火': '红色、紫色、橙色',
  '土': '黄色、棕色', '金': '白色、银色、金色',
  '水': '黑色、蓝色、灰色'
};

// 五行对应数字
const WU_XING_NUMBER = {
  '木': '3、8', '火': '2、7', '土': '5、0', '金': '4、9', '水': '1、6'
};

function generateReport(result) {
  const sections = [];
  const fp = result.fourPillars;
  const dayGan = fp.day.gan;
  const dayWx = GAN_WU_XING[dayGan];
  const strength = result.dayStrength;
  const shiShen = result.shiShen;

  // ===== 一、命主概述 =====
  sections.push(genOverview(result));

  // ===== 二、格局与用神 =====
  sections.push(genGeJuAndYongShen(result));

  // ===== 三、性格特征 =====
  sections.push(genPersonality(result));

  // ===== 四、事业方向 =====
  sections.push(genCareer(result));

  // ===== 五、财运分析 =====
  sections.push(genWealth(result));

  // ===== 六、感情婚姻 =====
  sections.push(genRelationship(result));

  // ===== 七、健康提醒 =====
  sections.push(genHealth(result));

  // ===== 八、大运走势 =====
  sections.push(genDaYunTrend(result));

  // ===== 九、开运建议 =====
  sections.push(genSuggestions(result));

  return formatReport(sections, result);
}

function genOverview(result) {
  const fp = result.fourPillars;
  const dayGan = fp.day.gan;
  const dayWx = GAN_WU_XING[dayGan];
  const strength = result.dayStrength;
  const bi = result.birthInfo;

  const ganZhiStr = `${fp.year.ganZhi}年 ${fp.month.ganZhi}月 ${fp.day.ganZhi}日 ${fp.hour.ganZhi}时`;

  let strengthDesc;
  if (strength.strength === '身强' || strength.strength === '偏强') {
    strengthDesc = `日主${dayGan}${dayWx}${strength.strength}，自身力量充足，适合主动出击、承担责任`;
  } else if (strength.strength === '中和') {
    strengthDesc = `日主${dayGan}${dayWx}中和平衡，能攻能守，灵活变通是你的优势`;
  } else {
    strengthDesc = `日主${dayGan}${dayWx}${strength.strength}，需要借助外力（贵人、团队、资源）来成就事业`;
  }

  const lines = [
    `命主${bi.gender}命，出生于${bi.year}年${bi.month}月${bi.day}日${bi.hour}时。`,
    `四柱：${ganZhiStr}`,
    `日主${dayGan}${dayWx}，生于${fp.month.zhi}月。${strengthDesc}。`
  ];

  // 提及重要神煞
  const importantShenSha = result.shenSha.filter(s =>
    ['天乙贵人', '文昌贵人', '驿马', '禄神', '羊刃', '天德贵人', '月德贵人',
     '太极贵人', '福星贵人', '学堂', '词馆', '红鸾', '天喜', '金舆', '将星'].includes(s.name)
  );
  if (importantShenSha.length > 0) {
    const names = [...new Set(importantShenSha.map(s => s.name))];
    lines.push(`命带${names.join('、')}，${getShenShaOverview(names)}。`);
  }

  return { title: '命主概述', content: lines.join('\n') };
}

function getShenShaOverview(names) {
  const parts = [];
  if (names.includes('天乙贵人')) parts.push('一生多有贵人相助');
  if (names.includes('文昌贵人')) parts.push('聪慧好学有才华');
  if (names.includes('驿马')) parts.push('一生多动多走动');
  if (names.includes('禄神')) parts.push('能靠自身能力立足');
  if (names.includes('羊刃')) parts.push('性格刚强有魄力');
  if (names.includes('天德贵人') || names.includes('月德贵人')) parts.push('灾祸不侵贵人扶助');
  if (names.includes('太极贵人')) parts.push('喜钻研有玄学天赋');
  if (names.includes('福星贵人')) parts.push('福气深厚衣食无忧');
  if (names.includes('学堂') || names.includes('词馆')) parts.push('学业优秀文采出众');
  if (names.includes('红鸾') || names.includes('天喜')) parts.push('婚恋顺利喜事临门');
  if (names.includes('金舆')) parts.push('出行得助有车马之福');
  if (names.includes('将星')) parts.push('有领导才能和权威');
  return parts.join('，');
}

function genGeJuAndYongShen(result) {
  const dayGan = result.fourPillars.day.gan;
  const dayWx = GAN_WU_XING[dayGan];
  const geJu = result.geJu;
  const yongShen = result.yongShen;
  const tiaoHou = result.tiaoHou;
  const combos = result.specialCombinations || [];
  const strength = result.dayStrength;

  const lines = [];

  // 格局
  const geJuLabel = geJu.type || '未定';
  let geJuDesc = `月令${geJu.monthZhi}`;
  if (geJu.touChu && geJu.touChu.length > 0) {
    geJuDesc += `，藏干${geJu.cangGan.join('、')}，透出${geJu.touChu.join('、')}，`;
  } else {
    geJuDesc += `，藏干${geJu.cangGan.join('、')}，不透天干，`;
  }
  geJuDesc += `取【${geJuLabel}】。`;

  if (geJu.isJianLu) {
    geJuDesc += '建禄格日主得月令禄根，自身力量不弱，喜官杀制、食伤泄。';
  } else if (geJu.isYueRen) {
    geJuDesc += '月刃格日主极旺，刃为凶物，喜官杀制刃为用。';
  } else if (geJu.hidden) {
    geJuDesc += '因月令不透天干，以本气取格。';
  }
  lines.push(geJuDesc);

  // 调候
  if (tiaoHou) {
    lines.push('');
    lines.push(`【调候分析】日主${dayGan}生于${result.fourPillars.month.zhi}月，${tiaoHou.description}。`);
    lines.push(`调候用神取【${tiaoHou.mainGan}】(${tiaoHou.mainWx})——这是命局的第一需要，优先于其他取用。`);
  }

  // 特殊组合
  if (combos.length > 0) {
    lines.push('');
    lines.push('【特殊组合】');
    for (const c of combos) {
      const icon = c.severity === 'good' ? '✓' : c.severity === 'high' ? '⚠' : '○';
      lines.push(`${icon} ${c.name}：${c.description}`);
      if (c.solution) {
        lines.push(`  化解：${c.solution}`);
      }
    }
  }

  // 用神综合分析
  if (yongShen && yongShen.priority) {
    lines.push('');
    lines.push('【用神综合分析】');
    lines.push(`主用神五行：【${yongShen.mainYongShenWx}】`);
    for (const p of yongShen.priority) {
      lines.push(`  ${p.priority}. ${p.source} → 取${p.wx}（${p.desc}）`);
    }
  }

  // 忌神
  const jiShen = WU_XING_BEI_KE[yongShen.mainYongShenWx] || '';
  const chouShen = WU_XING_SHENG[yongShen.mainYongShenWx] || '';
  if (jiShen) {
    lines.push(`\n忌神：${jiShen}（克制用神）、${chouShen}（泄耗用神）`);
  }

  return { title: '格局与用神分析', content: lines.join('\n') };
}

function genPersonality(result) {
  const dayGan = result.fourPillars.day.gan;
  const strength = result.dayStrength;
  const info = RI_ZHU_XING_GE[dayGan];
  const shiShen = result.shiShen;

  const lines = [info.base];

  if (['身强', '偏强'].includes(strength.strength)) {
    lines.push(info.strong);
  } else if (['身弱', '偏弱'].includes(strength.strength)) {
    lines.push(info.weak);
  } else {
    lines.push(info.strong.replace('身强时', '好的方面，'));
  }

  // 根据十神组合补充性格
  const ganShiShen = [shiShen.year.gan, shiShen.month.gan, shiShen.hour.gan];

  if (ganShiShen.includes('食神') || ganShiShen.includes('伤官')) {
    lines.push('命中食伤透出，思维活跃有创意，表达能力强，适合从事需要动脑和表达的工作。');
  }
  if (ganShiShen.includes('正官') || ganShiShen.includes('偏官')) {
    lines.push('命中官杀透出，有管理能力和责任心，做事有原则有底线，适合有规则的环境。');
  }
  if (ganShiShen.includes('正印') || ganShiShen.includes('偏印')) {
    lines.push('命中印星透出，喜欢学习和思考，悟性高，容易得到长辈或上级的认可和支持。');
  }
  if (ganShiShen.includes('比肩') || ganShiShen.includes('劫财')) {
    lines.push('命中比劫透出，社交能力强，重情重义，但也要注意把握好合作中的主次关系。');
  }

  // 根据神煞补充
  const shenShaNames = result.shenSha.map(s => s.name);
  if (shenShaNames.includes('学堂') || shenShaNames.includes('词馆')) {
    lines.push('命带学堂/词馆，天生聪慧，学习能力强，文采出众，适合学术研究和文字工作。');
  }
  if (shenShaNames.includes('太极贵人')) {
    lines.push('命带太极贵人，对哲学、玄学、命理等有天然兴趣和天赋，悟性高。');
  }
  if (shenShaNames.includes('福星贵人')) {
    lines.push('命带福星贵人，天生福气好，一生少有大灾大难，遇事多能化险为夷。');
  }

  return { title: '性格特征', content: lines.join('\n') };
}

function genCareer(result) {
  const dayGan = result.fourPillars.day.gan;
  const dayWx = GAN_WU_XING[dayGan];
  const strength = result.dayStrength;
  const shiShen = result.shiShen;

  const lines = [];

  // 用神方向推荐行业
  let yongShen, xiShen;
  if (['身强', '偏强'].includes(strength.strength)) {
    // 身强喜克泄耗：官杀、食伤、财
    yongShen = WU_XING_KE[dayWx]; // 我克的（财）
    xiShen = WU_XING_SHENG[dayWx]; // 我生的（食伤）
    lines.push(`日主偏强，喜用${yongShen}（财星）和${xiShen}（食伤）的力量来平衡。`);
    lines.push(`事业上适合走"以技生财"的路线——用自己的本事和创意去赚钱。`);
  } else if (['身弱', '偏弱'].includes(strength.strength)) {
    yongShen = WU_XING_BEI_SHENG[dayWx]; // 生我的（印）
    xiShen = dayWx; // 同类（比劫）
    lines.push(`日主偏弱，喜用${yongShen}（印星）和${dayWx}（比劫）的力量来扶助。`);
    lines.push(`事业上适合依托平台、团队或品牌来发展，借力使力效果更好。`);
  } else {
    yongShen = WU_XING_SHENG[dayWx];
    xiShen = WU_XING_KE[dayWx];
    lines.push(`日主中和，用神灵活，顺势而为即可。`);
    lines.push(`你的适应能力强，能在不同环境中找到自己的位置。`);
  }

  // 推荐行业
  const career1 = WU_XING_CAREER[yongShen];
  const career2 = WU_XING_CAREER[xiShen];
  lines.push(`\n适合从事的行业方向（五行${yongShen}）：${career1}`);
  lines.push(`次选行业方向（五行${xiShen}）：${career2}`);

  // 根据十神特征补充
  const ganSS = [shiShen.year.gan, shiShen.month.gan, shiShen.hour.gan];
  if (ganSS.includes('食神') || ganSS.includes('伤官')) {
    lines.push('\n你命中食伤旺，特别适合需要创意、策划、教学、培训、文化传播类的工作。靠脑子吃饭是你的优势。');
  }
  if (ganSS.includes('偏财')) {
    lines.push('\n命有偏财，有大财运的潜力，适合做生意或投资，但要注意风险控制。');
  }

  return { title: '事业方向', content: lines.join('\n') };
}

function genWealth(result) {
  const dayGan = result.fourPillars.day.gan;
  const dayWx = GAN_WU_XING[dayGan];
  const strength = result.dayStrength;
  const shiShen = result.shiShen;
  const fp = result.fourPillars;

  const lines = [];

  // 看财星位置和强弱
  const caiWx = WU_XING_KE[dayWx]; // 我克的五行为财
  const wxWeight = result.wuXingWeight;
  const caiWeight = wxWeight[caiWx];

  const ganSS = [
    { pos: '年', ss: shiShen.year.gan },
    { pos: '月', ss: shiShen.month.gan },
    { pos: '时', ss: shiShen.hour.gan }
  ];
  const hasCai = ganSS.some(g => g.ss === '正财' || g.ss === '偏财');
  const caiPositions = ganSS.filter(g => g.ss === '正财' || g.ss === '偏财');

  if (hasCai) {
    const posStr = caiPositions.map(c => `${c.pos}柱`).join('、');
    lines.push(`财星透出在${posStr}，说明你有明确的求财意识和赚钱能力。`);
    if (caiPositions.some(c => c.ss === '偏财')) {
      lines.push('偏财透出，适合做生意、做项目，来财方式多元化，不局限于固定工资。');
    }
    if (caiPositions.some(c => c.ss === '正财')) {
      lines.push('正财透出，有稳定的收入来源，理财观念好，适合稳扎稳打。');
    }
  } else {
    lines.push('财星不透天干，并不代表没有财运，而是说财运相对含蓄，需要通过努力和机遇来激发。');
  }

  // 身强身弱对财运的影响
  if (['身强', '偏强'].includes(strength.strength)) {
    lines.push('\n日主偏强能担财，有能力赚大钱也能守住。做事有魄力，适合主动出击求财。');
  } else if (['身弱', '偏弱'].includes(strength.strength)) {
    lines.push('\n日主偏弱，财大身不能担，建议稳中求进，不宜过度冒险。与人合作、借助团队力量求财更稳妥。');
  } else {
    lines.push('\n日主中和，财运平稳，能进能退。关键是把握好时机，大运走到财运旺的阶段可以加大投入。');
  }

  // 食伤生财
  const hasShiShang = ganSS.some(g => g.ss === '食神' || g.ss === '伤官');
  if (hasShiShang) {
    lines.push('\n命中有食伤生财的组合，这是"靠才华赚钱"的格局。你的创意、策划、表达能力就是你最大的财富来源。');
  }

  return { title: '财运分析', content: lines.join('\n') };
}

function genRelationship(result) {
  const fp = result.fourPillars;
  const dayGan = fp.day.gan;
  const dayZhi = fp.day.zhi;
  const dayWx = GAN_WU_XING[dayGan];
  const dayYy = GAN_YIN_YANG[dayGan];
  const gender = result.birthInfo.gender;
  const shiShen = result.shiShen;
  const xchh = result.xingChongHeHai;

  const lines = [];

  // 日支看配偶特征
  const dayZhiCangGan = ZHI_CANG_GAN[dayZhi];
  const dayZhiWx = ZHI_WU_XING[dayZhi];
  lines.push(`日支${dayZhi}（${dayZhiWx}）为配偶宫，代表另一半的特征和婚姻状态。`);

  // 日支藏干看配偶性格
  const benQi = dayZhiCangGan[0];
  const benQiWx = GAN_WU_XING[benQi];
  const spouseTraits = {
    '木': '性格正直善良，有上进心，做事有规划，但有时会固执',
    '火': '性格热情开朗，有活力有激情，做事积极主动，但有时急躁',
    '土': '性格稳重踏实，为人厚道，顾家有责任感，但可能缺少浪漫',
    '金': '性格果断干练，有原则有主见，做事利落，但有时过于严肃',
    '水': '性格聪慧灵活，善于沟通，温柔体贴，但有时想法多变'
  };
  lines.push(`日支本气${benQi}（${benQiWx}），另一半大致特征：${spouseTraits[benQiWx]}。`);

  // 十二长生看配偶宫状态
  const dayCS = result.changSheng.day;
  const csMarriage = {
    '长生': '配偶宫逢长生，另一半有活力有能力，婚姻基础好',
    '沐浴': '配偶宫逢沐浴，感情生活丰富多彩，但也容易有桃花纷扰',
    '冠带': '配偶宫逢冠带，另一半有追求有上进心，婚后生活有品质',
    '临官': '配偶宫逢临官，另一半事业心强，能独当一面',
    '帝旺': '配偶宫逢帝旺，另一半性格强势有能力，婚姻中需要互让',
    '衰': '配偶宫逢衰，感情趋于平淡稳定，细水长流型',
    '病': '配偶宫逢病，需要多关心另一半的健康和情绪',
    '死': '配偶宫逢死，婚姻相对低调平静，适合找踏实稳重的另一半',
    '墓': '配偶宫逢墓，另一半偏内敛保守，适合找务实型的伴侣',
    '绝': '配偶宫逢绝，感情上可能经历一些波折，但绝处逢生也是一种转机',
    '胎': '配偶宫逢胎，婚姻有新生的力量，适合共同成长型的关系',
    '养': '配偶宫逢养，另一半温和包容，婚姻关系需要慢慢培养'
  };
  if (csMarriage[dayCS]) {
    lines.push(`${csMarriage[dayCS]}。`);
  }

  // 配偶星
  let spouseDesc;
  if (gender === '男') {
    const zhengCai = WU_XING_KE[dayWx];
    spouseDesc = `男命以正财为妻星（五行${zhengCai}），`;
  } else {
    const zhengGuan = WU_XING_BEI_KE[dayWx];
    spouseDesc = `女命以正官为夫星（五行${zhengGuan}），`;
  }

  // 检查配偶星在四柱的情况
  const ganSS = [shiShen.year.gan, shiShen.month.gan, shiShen.hour.gan];
  if (gender === '男') {
    const hasCai = ganSS.includes('正财') || ganSS.includes('偏财');
    if (hasCai) {
      lines.push(`\n${spouseDesc}财星透出，说明另一半对你帮助较大，夫妻感情有基础。`);
    } else {
      lines.push(`\n${spouseDesc}财星未透天干，感情上属于内敛型，不善表达但内心重视家庭。`);
      // 看地支藏干有没有财星
      const zhiHasCai = ['year', 'month', 'day', 'hour'].some(pos => {
        const cg = ZHI_CANG_GAN[fp[pos].zhi];
        return cg.some(g => {
          const wx = GAN_WU_XING[g];
          return WU_XING_KE[dayWx] === wx;
        });
      });
      if (zhiHasCai) {
        lines.push('不过财星藏在地支中，说明暗中有缘分，姻缘来时自然水到渠成。');
      }
    }
  } else {
    const hasGuan = ganSS.includes('正官') || ganSS.includes('偏官');
    if (hasGuan) {
      lines.push(`\n${spouseDesc}官星透出，异性缘较好，另一半对你有一定的约束力和保护力。`);
    } else {
      lines.push(`\n${spouseDesc}官星未透天干，感情上偏晚熟或低调，适合顺其自然。`);
    }
  }

  // 日支冲合对婚姻的影响
  const dayZhiChong = xchh.diZhiChong.filter(c => c.positions.includes('日支'));
  const dayZhiHe = xchh.diZhiHe.filter(c => c.positions.includes('日支'));
  const dayZhiHai = xchh.diZhiHai.filter(c => c.positions.includes('日支'));

  if (dayZhiChong.length > 0) {
    lines.push('\n配偶宫逢冲，婚姻中容易有波动和变化，双方需多沟通包容，遇事冷静处理。');
  }
  if (dayZhiHe.length > 0) {
    lines.push('\n配偶宫逢合，和另一半关系紧密、默契度高，是互相依赖的一对。');
  }
  if (dayZhiHai.length > 0) {
    lines.push('\n配偶宫逢害，感情中偶有小摩擦和误解，学会换位思考是关键。');
  }

  // 桃花
  const taohua = result.shenSha.filter(s => s.name === '桃花');
  if (taohua.length > 0) {
    const thPositions = taohua.map(t => t.position).join('、');
    lines.push(`\n命带桃花（${thPositions}），人缘好、异性缘佳。社交场合容易吸引注意，但婚后需注意保持适当的社交边界。`);
  }

  // 红鸾天喜
  const hongluan = result.shenSha.filter(s => s.name === '红鸾');
  const tianxi = result.shenSha.filter(s => s.name === '天喜');
  if (hongluan.length > 0 || tianxi.length > 0) {
    const hlPositions = [...hongluan, ...tianxi].map(t => `${t.name}(${t.position})`).join('、');
    lines.push(`\n命带${hlPositions}，主婚恋顺利，喜事临门。在感情方面比较容易遇到合适的缘分，婚姻大事相对顺遂。`);
  }

  // 孤辰寡宿
  const guchen = result.shenSha.filter(s => s.name === '孤辰');
  const guasu = result.shenSha.filter(s => s.name === '寡宿');
  if (guchen.length > 0 || guasu.length > 0) {
    const goPositions = [...guchen, ...guasu].map(t => `${t.name}(${t.position})`).join('、');
    lines.push(`\n命带${goPositions}，感情上可能偏晚或偏淡，对独处有天然的需求。建议多主动社交，拓宽交友圈。`);
  }

  return { title: '感情婚姻', content: lines.join('\n') };
}

function genHealth(result) {
  const dayGan = result.fourPillars.day.gan;
  const dayWx = GAN_WU_XING[dayGan];
  const wxCount = result.wuXing.count;
  const wxWeight = result.wuXingWeight;

  const lines = [];

  const wxBody = {
    '木': '肝胆、眼睛、筋骨、神经系统',
    '火': '心脏、小肠、血液循环、眼目',
    '土': '脾胃、消化系统、肌肉、皮肤',
    '金': '肺、大肠、呼吸系统、骨骼、牙齿',
    '水': '肾、膀胱、泌尿系统、耳朵、生殖系统'
  };

  const wxFood = {
    '木': '绿色蔬菜（菠菜、西兰花、芹菜）、酸味食物、枸杞、菊花茶',
    '火': '红色食物（番茄、红枣、胡萝卜）、苦味食物、莲子、百合',
    '土': '黄色食物（小米、南瓜、玉米）、甘味食物、山药、薏米',
    '金': '白色食物（白萝卜、银耳、梨）、辛味食物、蜂蜜润肺',
    '水': '黑色食物（黑芝麻、黑豆、黑木耳）、咸味食物、核桃补肾'
  };

  const wxExercise = {
    '木': '散步、瑜伽、太极拳等舒缓运动，有助疏肝理气',
    '火': '游泳、慢跑等有氧运动，注意不要过度激烈',
    '土': '饭后散步、腹部按摩，规律饮食最重要',
    '金': '深呼吸练习、登山、有氧运动，加强肺活量',
    '水': '泡脚、腰部运动、太极等，注意保暖护腰'
  };

  lines.push('从五行角度看健康，需要关注以下方面：');

  // 找出过旺和过弱的五行
  const sortedWx = Object.entries(wxWeight).sort((a, b) => b[1] - a[1]);
  const strongest = sortedWx[0];
  const weakest = sortedWx[sortedWx.length - 1];

  // 缺失的五行
  const missing = Object.keys(wxCount).filter(k => wxCount[k] === 0);

  if (missing.length > 0) {
    for (const m of missing) {
      lines.push(`\n▸ 五行缺${m}，${wxBody[m]}方面相对薄弱，平时需多加注意。`);
      lines.push(`  饮食调理：多吃${wxFood[m]}`);
      lines.push(`  运动建议：${wxExercise[m]}`);
    }
  }

  if (strongest[1] >= 3.5) {
    lines.push(`\n▸ ${strongest[0]}五行偏旺（权重${strongest[1]}），${wxBody[strongest[0]]}方面容易功能亢进或过度劳累。`);
    const keWx = WU_XING_BEI_KE[strongest[0]];
    lines.push(`  可适当补充${keWx}五行来平衡，饮食上多吃${wxFood[keWx]}`);
  }

  if (weakest[1] <= 0.5 && !missing.includes(weakest[0])) {
    lines.push(`\n▸ ${weakest[0]}五行偏弱（权重${weakest[1]}），${wxBody[weakest[0]]}方面需要适当调养。`);
    lines.push(`  饮食调理：多吃${wxFood[weakest[0]]}`);
    lines.push(`  运动建议：${wxExercise[weakest[0]]}`);
  }

  // 日主五行对应的健康重点
  lines.push(`\n▸ 日主${dayGan}属${dayWx}，${wxBody[dayWx]}是你先天的敏感区域，需要长期关注。`);

  lines.push('\n总体养生原则：保持规律作息，饮食均衡，情绪稳定。命理看健康是"防未病"，提前注意比事后补救更重要。');

  return { title: '健康提醒', content: lines.join('\n') };
}

function genDaYunTrend(result) {
  const dayGan = result.fourPillars.day.gan;
  const dayWx = GAN_WU_XING[dayGan];
  const strength = result.dayStrength;
  const daYun = result.daYun;
  const currentYear = new Date().getFullYear();

  const lines = [];

  lines.push(`起运年龄：${daYun.qiYunAge}岁，${daYun.direction}。\n`);

  // 找到当前所在大运
  let currentDy = null;
  for (const dy of daYun.daYunList) {
    if (currentYear >= dy.startYear && currentYear <= dy.endYear) {
      currentDy = dy;
      break;
    }
  }

  // 逐步分析每步大运
  for (const dy of daYun.daYunList) {
    const dyGanWx = GAN_WU_XING[dy.gan];
    const dyZhiWx = ZHI_WU_XING[dy.zhi];
    const isCurrent = dy === currentDy;
    const marker = isCurrent ? ' 👈 当前大运' : '';

    let trend = analyzeDaYunQuality(dayGan, dayWx, strength.strength, dy.gan, dy.zhi);

    lines.push(`${dy.startAge}-${dy.endAge}岁 (${dy.startYear}-${dy.endYear}) ${dy.ganZhi}运${marker}`);
    lines.push(`  ${trend}`);
    lines.push('');
  }

  // 当前流年提醒
  if (currentDy) {
    const currentLn = currentDy.liuNian.find(ln => ln.year === currentYear);
    if (currentLn) {
      lines.push(`【${currentYear}年流年 ${currentLn.ganZhi}】`);
      const lnAnalysis = analyzeLiuNian(dayGan, dayWx, strength.strength, currentLn, currentDy);
      lines.push(lnAnalysis);
    }
  }

  return { title: '大运走势', content: lines.join('\n') };
}

function analyzeDaYunQuality(dayGan, dayWx, strengthStr, dyGan, dyZhi) {
  const dyGanWx = GAN_WU_XING[dyGan];
  const dyZhiWx = ZHI_WU_XING[dyZhi];
  const isStrong = ['身强', '偏强'].includes(strengthStr);
  const isWeak = ['身弱', '偏弱'].includes(strengthStr);
  const isNeutral = strengthStr === '中和';

  const parts = [];

  // 天干分析
  if (dyGanWx === dayWx) {
    if (isStrong) parts.push('天干比劫帮身，竞争加大，注意合作中的利益分配');
    else if (isWeak) parts.push('天干帮身有力，贵人运旺，事业有助力，自信心增强');
    else parts.push('天干比劫帮身，人脉和社交活跃，适合拓展合作关系');
  } else if (WU_XING_SHENG[dyGanWx] === dayWx) {
    if (isStrong) parts.push('天干印星生身，利学习进修，但要避免安于现状');
    else if (isWeak) parts.push('天干印星生身，得贵人提携，学业事业有靠山');
    else parts.push('天干印星生身，贵人运好，利学习考证、积累资源');
  } else if (WU_XING_SHENG[dayWx] === dyGanWx) {
    if (isStrong) parts.push('天干食伤泄秀，才华得以发挥，表达和创意运好，适合做策划、培训、创作');
    else if (isWeak) parts.push('天干食伤泄身，精力容易分散，注意聚焦核心业务');
    else parts.push('天干食伤泄秀，思维活跃有创意，是发挥才华、输出作品的好时期');
  } else if (WU_XING_KE[dayWx] === dyGanWx) {
    if (isStrong) parts.push('天干走财运，求财积极且能担得住，是赚钱的好时机');
    else if (isWeak) parts.push('天干财星耗身，财来财去不易留，量力而行，不宜贪大');
    else parts.push('天干走财运，收入有提升机会，但也要注意开支平衡');
  } else if (WU_XING_KE[dyGanWx] === dayWx) {
    if (isStrong) parts.push('天干官杀制身，事业有压力也有机遇，利于升职和承担更大责任');
    else if (isWeak) parts.push('天干官杀克身，压力较大，注意健康和人际关系，宜守不宜攻');
    else parts.push('天干官杀现，工作上有考验，也是锻炼自己、提升地位的阶段');
  }

  // 地支分析
  const dyZhiCangGan = ZHI_CANG_GAN[dyZhi];
  const dyBenQiWx = GAN_WU_XING[dyZhiCangGan[0]];

  if (dyZhiWx === dayWx || dyBenQiWx === dayWx) {
    parts.push('地支有根有靠，根基稳固，做事有底气');
  } else if (WU_XING_SHENG[dyZhiWx] === dayWx || WU_XING_SHENG[dyBenQiWx] === dayWx) {
    parts.push('地支暗中有助力，贵人在暗处，关键时刻有人帮');
  } else if (WU_XING_KE[dyZhiWx] === dayWx || WU_XING_KE[dyBenQiWx] === dayWx) {
    parts.push('地支环境有压力，宜稳扎稳打，不宜冒进');
  } else if (WU_XING_SHENG[dayWx] === dyZhiWx) {
    parts.push('地支泄耗日主，注意劳逸结合，不要透支精力');
  } else if (WU_XING_KE[dayWx] === dyZhiWx) {
    parts.push('地支财星暗藏，有暗财运，适合默默积累');
  }

  return parts.join('。') + '。';
}

function analyzeLiuNian(dayGan, dayWx, strengthStr, liuNian, daYun) {
  const lnGanWx = GAN_WU_XING[liuNian.gan];
  const lnZhiWx = ZHI_WU_XING[liuNian.zhi];
  const isStrong = ['身强', '偏强'].includes(strengthStr);
  const isNeutral = strengthStr === '中和';

  const parts = [];

  // 流年天干
  if (lnGanWx === dayWx) {
    parts.push('流年比劫，社交活跃，竞争与合作并存，适合拓展人脉');
  } else if (WU_XING_SHENG[lnGanWx] === dayWx) {
    parts.push('流年印星，利学习考试、贵人运好，有长辈或权威人士提携');
  } else if (WU_XING_SHENG[dayWx] === lnGanWx) {
    parts.push('流年食伤，才华发挥的一年，利创作、策划、表达，可以多输出内容');
  } else if (WU_XING_KE[dayWx] === lnGanWx) {
    if (isStrong || isNeutral) parts.push('流年走财运，求财有机会，可以积极争取');
    else parts.push('流年走财运，有赚钱机会但也有花销，量入为出');
  } else if (WU_XING_KE[lnGanWx] === dayWx) {
    parts.push('流年官杀，工作上有压力和考验，也是承担更大责任的机会');
  }

  // 流年地支分析
  const lnZhiCangGan = ZHI_CANG_GAN[liuNian.zhi];
  const lnBenQiWx = GAN_WU_XING[lnZhiCangGan[0]];

  if (lnZhiWx === dayWx || lnBenQiWx === dayWx) {
    parts.push('地支帮身，今年做事有底气，贵人运也不错');
  } else if (WU_XING_SHENG[lnZhiWx] === dayWx) {
    parts.push('地支有暗中助力，遇到困难会有人帮忙');
  } else if (WU_XING_KE[lnZhiWx] === dayWx) {
    parts.push('地支有压力，注意健康和情绪管理');
  } else if (WU_XING_KE[dayWx] === lnZhiWx) {
    parts.push('地支暗财，有意外收获的可能，注意把握身边的机会');
  }

  // 流年与大运的配合
  const dyGanWx = GAN_WU_XING[daYun.gan];
  if (lnGanWx === dyGanWx) {
    parts.push('流年与大运天干同气，今年运势主题明确，好坏都会更明显');
  } else if (WU_XING_KE[lnGanWx] === dyGanWx || WU_XING_KE[dyGanWx] === lnGanWx) {
    parts.push('流年与大运天干相克，今年可能有变动或调整，随机应变');
  }

  return parts.join('。') + '。';
}

function genSuggestions(result) {
  const dayGan = result.fourPillars.day.gan;
  const dayWx = GAN_WU_XING[dayGan];
  const yongShen = result.yongShen;
  const tiaoHou = result.tiaoHou;

  const yongShenWx = (yongShen && yongShen.mainYongShenWx) || WU_XING_BEI_SHENG[dayWx];

  const lines = [];

  lines.push(`根据调候、格局、强弱综合判断，你的主用神五行为【${yongShenWx}】：`);
  lines.push('');
  lines.push(`  幸运颜色：${WU_XING_COLOR[yongShenWx]}`);
  lines.push(`  有利方位：${WU_XING_DIRECTION[yongShenWx]}`);
  lines.push(`  幸运数字：${WU_XING_NUMBER[yongShenWx]}`);
  lines.push(`  适合行业：${WU_XING_CAREER[yongShenWx]}`);

  // 如果有调候需要，额外提示
  if (tiaoHou && tiaoHou.mainWx !== yongShenWx) {
    lines.push('');
    lines.push(`调候提示：日主${dayGan}生于${result.fourPillars.month.zhi}月，需${tiaoHou.mainGan}(${tiaoHou.mainWx})调候，在生活环境中可兼顾此五行。`);
  }

  lines.push('');
  lines.push('提示：以上为基础分析，仅供参考。命理讲究"命运在自己手中"，了解自己的优势和不足，扬长避短，才是命理的真正价值。');
  lines.push('');
  lines.push('如需更精准的深度解读（结合大运流年详细分析事业、感情、财运走势），欢迎预约老师一对一分析。');

  return { title: '开运建议', content: lines.join('\n') };
}

function formatReport(sections, result) {
  const lines = [];
  const bi = result.birthInfo;

  lines.push('');
  lines.push('╔═══════════════════════════════════════════════════╗');
  lines.push('║              八字命理分析报告                      ║');
  lines.push('╚═══════════════════════════════════════════════════╝');
  lines.push('');

  const nums = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
  for (let i = 0; i < sections.length; i++) {
    const s = sections[i];
    const num = nums[i] || (i + 1);
    lines.push(`━━━ ${num}、${s.title} ━━━`);
    lines.push('');
    lines.push(s.content);
    lines.push('');
  }

  lines.push('════════════════════════════════════════════════════');
  lines.push('  本报告由八字排盘系统自动生成，仅供参考');
  lines.push('  深度解读请预约老师一对一分析');
  lines.push('════════════════════════════════════════════════════');

  return lines.join('\n');
}


// === index.js ===



// === src/utils/lunar.js ===
// 农历转换（用于称骨等需要农历月日的场景）
// 1900-2100 年农历数据：每年一个整数，低4位=闰月(0=无闰)，bit4-15依次为正月到十二月的大小月(1=30天,0=29天)
var LUNAR_INFO = [
  0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
  0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
  0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
  0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
  0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
  0x06ca0,0x0b550,0x15355,0x04d70,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa3,
  0x0aea0,0x0ab50,0x04b60,0x1aae4,0x0a570,0x14e50,0x05260,0x0f263,0x0d950,0x05b57,
  0x056a0,0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a3,
  0x195a0,0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,
  0x09570,0x092e0,0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,
  0x092d0,0x0cab5,0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,
  0x052b0,0x0a930,0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,
  0x0ea65,0x0d530,0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,
  0x0d520,0x0dd45,0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,
  0x06d20,0x0ada0,0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,
  0x1a6c4,0x0aae0,0x0a2e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,
  0x0a6d0,0x055d4,0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,
  0x0a5b0,0x052b0,0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,
  0x054e4,0x0d160,0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a4d0,
  0x0d150,0x0f252,0x0d520
];

function solarToLunar(year, month, day) {
  var CHN_MONTH = { '正月':1,'二月':2,'三月':3,'四月':4,'五月':5,'六月':6,'七月':7,'八月':8,'九月':9,'十月':10,'十一月':11,'腊月':12,'十二月':12 };
  var fmt = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', {
    year: 'numeric', month: 'numeric', day: 'numeric'
  });
  var date = new Date(year, month - 1, day, 12, 0, 0);
  // 先用 formatToParts（更可靠）
  if (fmt.formatToParts) {
    var parts = fmt.formatToParts(date);
    var ly = 0, lm = 0, ld = 0, leap = false;
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (p.type === 'year' || p.type === 'relatedYear') ly = parseInt(p.value);
      else if (p.type === 'month') {
        // "正月" 或 "闰四月"
        var mv = p.value;
        if (mv.indexOf('闰') === 0) { leap = true; mv = mv.substring(1); }
        lm = CHN_MONTH[mv] || parseInt(mv);
      }
      else if (p.type === 'day') ld = parseInt(p.value);
    }
    if (ly && lm && ld) return { year: ly, month: lm, day: ld, isLeap: leap };
  }
  // fallback: 正则解析
  var str = fmt.format(date);
  var match = str.match(/(\d+)年(闰?)(.+?)月(\d+)/);
  if (match) {
    return {
      year: parseInt(match[1]),
      month: CHN_MONTH[match[3]] || parseInt(match[3]),
      day: parseInt(match[4]),
      isLeap: match[2] === '闰'
    };
  }
  return { year: year, month: month, day: day, isLeap: false };
}

function lunarYearDays(y) {
  var info = LUNAR_INFO[y - 1900];
  var days = 0;
  for (var m = 1; m <= 12; m++) { days += (info >> (3 + m) & 1) ? 30 : 29; }
  if (info & 0xf) { days += (info >> 16 & 1) ? 30 : 29; }
  return days;
}

function solarMonthDays(y, m) {
  if (m === 2) return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 29 : 28;
  return [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
}


// === src/misc/mansions.js ===
var ERSHIBA_XIU = [
  '角','亢','氐','房','心','尾','箕',
  '斗','牛','女','虚','危','室','壁',
  '奎','娄','胃','昴','毕','觜','参',
  '井','鬼','柳','星','张','翼','轸'
];

function getDayPillar60Index(dayGan, dayZhi) {
  var ganIdx = TIAN_GAN.indexOf(dayGan);
  var zhiIdx = DI_ZHI.indexOf(dayZhi);
  for (var i = 0; i < 60; i++) {
    if (i % 10 === ganIdx && i % 12 === zhiIdx) return i;
  }
  return 0;
}

// 计算从1900-01-01到给定日期的总天数偏移
function getDayOffsetFrom1900(year, month, day) {
  var offset = 0;
  for (var y = 1900; y < year; y++) {
    offset += (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 366 : 365;
  }
  for (var m = 1; m < month; m++) {
    offset += solarMonthDays(year, m);
  }
  offset += day - 1;
  return offset;
}

function getRiXiu(totalDayOffset) {
  // 1900-01-01 = 张宿(index 24)，经验证1990-12-10=房宿
  return ERSHIBA_XIU[(24 + totalDayOffset) % 28];
}


// === src/misc/palaces.js ===
function calcTaiYuan(monthGan, monthZhi) {
  var ganIdx = TIAN_GAN.indexOf(monthGan);
  var zhiIdx = DI_ZHI.indexOf(monthZhi);
  var tGan = TIAN_GAN[(ganIdx + 1) % 10];
  var tZhi = DI_ZHI[(zhiIdx + 3) % 12];
  return { gan: tGan, zhi: tZhi, ganZhi: tGan + tZhi };
}

function calcTaiXi(dayGan, dayZhi) {
  var heGan = dayGan;
  for (var i = 0; i < TIAN_GAN_HE.length; i++) {
    var pair = TIAN_GAN_HE[i].gan;
    if (pair[0] === dayGan) { heGan = pair[1]; break; }
    if (pair[1] === dayGan) { heGan = pair[0]; break; }
  }
  var heZhiMap = { '子':'丑','丑':'子','寅':'亥','亥':'寅','卯':'戌','戌':'卯','辰':'酉','酉':'辰','巳':'申','申':'巳','午':'未','未':'午' };
  var heZhi = heZhiMap[dayZhi] || dayZhi;
  return { gan: heGan, zhi: heZhi, ganZhi: heGan + heZhi };
}

function calcMingGong(monthZhi, hourZhi, yearGan) {
  // 命宫：以子为正月（寅），逆数至生月；再将时支加临其上，顺数至卯
  var monthIdx = DI_ZHI.indexOf(monthZhi);
  var hourIdx = DI_ZHI.indexOf(hourZhi);
  // 子为正月(寅)：寅→子(0), 卯→亥(11), 辰→戌(10)... 逆数
  var monthBranch = (2 - monthIdx + 12) % 12;
  // 从时支顺数到卯的步数：子→卯=3步, 丑→卯=2步...
  var stepsToMao = (3 - hourIdx + 12) % 12;
  var zhiIdx = (monthBranch + stepsToMao) % 12;
  var zhi = DI_ZHI[zhiIdx];
  var gan = getMonthGanFromYear(yearGan, zhi);
  return { gan: gan, zhi: zhi, ganZhi: gan + zhi };
}

function calcShenGong(monthZhi, hourZhi, yearGan) {
  // 身宫：地支 = (时支 + (13 - 月支序) % 12) % 12
  var monthIdx = DI_ZHI.indexOf(monthZhi);
  var hourIdx = DI_ZHI.indexOf(hourZhi);
  var zhiIdx = (hourIdx + (13 - monthIdx)) % 12;
  var zhi = DI_ZHI[zhiIdx];
  var gan = getMonthGanFromYear(yearGan, zhi);
  return { gan: gan, zhi: zhi, ganZhi: gan + zhi };
}

function getMonthGanFromYear(yearGan, monthZhi) {
  var yearGanIdx = TIAN_GAN.indexOf(yearGan);
  var monthZhiIdx = DI_ZHI.indexOf(monthZhi);
  var startGan = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0][yearGanIdx];
  var monthOffset = (monthZhiIdx - 2 + 12) % 12;
  return TIAN_GAN[(startGan + monthOffset) % 10];
}


// === src/misc/kongwang.js ===
function getKongWang(gan, zhi) {
  var ganIdx = TIAN_GAN.indexOf(gan);
  var zhiIdx = DI_ZHI.indexOf(zhi);
  var xunStartZhi = (zhiIdx - ganIdx + 12) % 12;
  var kong1 = DI_ZHI[(xunStartZhi + 10) % 12];
  var kong2 = DI_ZHI[(xunStartZhi + 11) % 12];
  return { zhi: [kong1, kong2], desc: kong1 + kong2 + '空' };
}


// === src/misc/chenggu.js ===
var CG_YEAR = {
  '甲子':0.7,'乙丑':0.9,'丙寅':0.6,'丁卯':0.7,'戊辰':1.2,'己巳':0.5,'庚午':0.9,'辛未':0.8,'壬申':0.7,'癸酉':0.8,
  '甲戌':0.5,'乙亥':0.9,'丙子':0.8,'丁丑':0.8,'戊寅':0.8,'己卯':1.9,'庚辰':1.2,'辛巳':0.6,'壬午':0.8,'癸未':0.7,
  '甲申':0.5,'乙酉':1.5,'丙戌':0.6,'丁亥':1.6,'戊子':1.5,'己丑':0.7,'庚寅':0.9,'辛卯':1.2,'壬辰':1.0,'癸巳':0.7,
  '甲午':1.5,'乙未':0.6,'丙申':0.5,'丁酉':1.4,'戊戌':1.4,'己亥':0.9,'庚子':0.7,'辛丑':0.7,'壬寅':0.9,'癸卯':1.2,
  '甲辰':0.8,'乙巳':0.7,'丙午':1.3,'丁未':0.5,'戊申':1.4,'己酉':0.5,'庚戌':0.9,'辛亥':1.7,'壬子':0.5,'癸丑':0.7,
  '甲寅':1.2,'乙卯':0.8,'丙辰':0.8,'丁巳':0.6,'戊午':1.9,'己未':0.6,'庚申':0.8,'辛酉':1.6,'壬戌':1.0,'癸亥':0.7
};
var CG_MONTH = { 1:0.6,2:0.7,3:1.8,4:0.9,5:0.5,6:1.6,7:0.9,8:1.5,9:1.8,10:0.8,11:0.9,12:0.5 };
var CG_DAY = {
  1:0.5,2:1.0,3:0.8,4:1.5,5:1.0,6:1.5,7:0.8,8:1.6,9:0.8,10:1.6,
  11:0.9,12:1.7,13:0.8,14:1.7,15:1.0,16:0.8,17:0.9,18:1.8,19:0.5,20:1.0,
  21:1.0,22:0.9,23:0.8,24:0.9,25:1.5,26:1.8,27:0.7,28:0.8,29:1.6,30:0.6
};
var CG_HOUR = {
  '子':1.6,'丑':0.6,'寅':0.7,'卯':1.0,'辰':0.9,'巳':1.6,'午':1.0,'未':0.8,'申':0.8,'酉':0.9,'戌':0.6,'亥':0.6
};
var CG_SCORES = [
  [2.1,'短命非业谓大凶，平生灾难事重重，凶祸频临陷逆境，终世困苦事不成。'],
  [2.2,'身寒骨冷苦伶仃，此命推来行乞人，劳劳碌碌无度日，终年打拱过平生。'],
  [2.3,'此命推来骨格轻，求谋作事事难成，妻儿兄弟应难许，别处他乡作散人。'],
  [2.4,'此命推来福禄无，门庭困苦总难荣，六亲骨肉皆无靠，流浪他乡作老翁。'],
  [2.5,'此命推来祖业微，门庭营度似稀奇，六亲骨肉如冰炭，一世勤劳自把持。'],
  [2.6,'平生衣禄苦中求，独自营谋事不休，离祖出门宜早计，晚来衣禄自无休。'],
  [2.7,'一生作事少商量，难靠祖宗作主张，独马单枪空做去，早年晚岁总无长。'],
  [2.8,'一生行事似飘蓬，祖宗产业在梦中，若不过房改名姓，也当移徒二三通。'],
  [2.9,'初年运限未曾亨，纵有功名在后成，须过四旬才可立，移居改姓始为良。'],
  [3.0,'劳劳碌碌苦中求，东奔西走何日休，若使终身勤与俭，老来稍可免忧愁。'],
  [3.1,'忙忙碌碌苦中求，何日云开见日头，难得祖基家可立，中年衣食渐无忧。'],
  [3.2,'初年运蹇事难谋，渐有财源如水流，到得中年衣食旺，那时名利一齐收。'],
  [3.3,'早年做事事难成，百年勤劳枉费心，半世自如流水去，后来运到始得金。'],
  [3.4,'此命福气果如何，僧道门中衣禄多，离祖出家方为妙，终朝拜佛念弥陀。'],
  [3.5,'生平福量不周全，祖业根基觉少传，营事生涯宜守旧，时来衣食胜从前。'],
  [3.6,'不须劳碌过平生，独自成家福不轻，早有福星常照命，任君行去百般成。'],
  [3.7,'此命般般事不成，弟兄少力自孤行，虽然祖业须微有，来得明时去不明。'],
  [3.8,'一身骨肉最清高，早入簧门姓氏标，待到年将三十六，蓝衫脱去换红袍。'],
  [3.9,'此命终身运不通，劳劳作事尽皆空，苦心竭力成家计，到得那时在梦中。'],
  [4.0,'平生衣禄是绵长，件件心中自主张，前面风霜多受过，后来必定享安康。'],
  [4.1,'此命推来自不同，为人能干异凡庸，中年还有逍遥福，不比前时运未通。'],
  [4.2,'得宽怀处且宽怀，何用双眉皱不开，若使中年命运济，那时名利一齐来。'],
  [4.3,'为人心性最聪明，作事轩昂近贵人，衣禄一生天注定，不须劳碌是丰亨。'],
  [4.4,'万事由天莫苦求，须知福禄赖人修，当年财帛难如意，晚景欣然便不忧。'],
  [4.5,'名利推求竟若何，前番辛苦后奔波，命中难养男和女，骨肉扶持也不多。'],
  [4.6,'东西南北尽皆通，出姓移居更觉隆，衣禄无穷无数定，中年晚景一般同。'],
  [4.7,'此命推求旺末年，妻荣子贵自怡然，平生原有滔滔福，可卜财源若水泉。'],
  [4.8,'初年运道未曾通，几许蹉跎命亦穷，兄弟六亲无依靠，一生事业晚来丰。'],
  [4.9,'此命推来福不轻，自成自立显门庭，从来富贵人钦敬，使婢差奴过一生。'],
  [5.0,'为利为名终日劳，中年福禄也多遭，老来自有财星照，不比前番目下高。'],
  [5.1,'一世荣华事事通，不须劳碌自亨通，弟兄叔侄皆如意，家业成时福禄宏。'],
  [5.2,'一世亨通事事能，不须劳苦自然宁，宗族有光欣喜甚，家产丰盈自称心。'],
  [5.3,'此格推来福泽宏，兴家立业在其中，一生衣食安排定，却是人间一福翁。'],
  [5.4,'此命详审福泽宏，诗书满腹看功成，丰衣足食多安稳，正是人间有福人。'],
  [5.5,'走马扬鞭争利名，少年做事费筹论，一朝福禄源源至，富贵荣华显六亲。'],
  [5.6,'此格推来礼义通，一身福禄用无穷，甜酸苦辣皆尝过，滚滚财源盈而丰。'],
  [5.7,'福禄丰盈万事全，一身荣耀乐天年，名扬威震人争羡，处世逍遥宛遇仙。'],
  [5.8,'平生衣食自然来，名利双全富贵偕，金榜题名登甲第，紫袍玉带走金阶。'],
  [5.9,'细推此格秀而清，必定才高学业成，甲第之中应有分，扬鞭走马显威荣。'],
  [6.0,'一朝金榜快题名，显祖荣宗大器成，衣禄定然无欠缺，田园财帛更丰盈。'],
  [6.1,'不作朝中金榜客，定为世上大财翁，聪明天赋经书熟，名显高科自是荣。'],
  [6.2,'此命生来福不穷，读书必定显亲宗，紫衣金带为卿相，富贵荣华孰与同。'],
  [6.3,'命主为官福禄长，得来富贵实非常，名题金塔传金榜，定中高科天下扬。'],
  [6.4,'此格威权不可当，紫袍金带坐高堂，荣华富贵谁能及，万古留名姓氏扬。'],
  [6.5,'细推此命福非轻，富贵荣华孰与争，定国安邦人极品，威声显赫震寰瀛。'],
  [6.6,'此格人间一福人，堆金积玉满堂春，从来富贵由天定，正笏垂绅谒圣君。'],
  [6.7,'此命生来福自宏，田园家业最高隆，平生衣禄盈丰足，一路荣华万事通。'],
  [6.8,'富贵由天莫苦求，万金家计不须谋，如今不比前番事，祖业根基万古留。'],
  [6.9,'君是人间衣禄星，一身富贵众人钦，总然福禄由天定，安享荣华过一生。'],
  [7.0,'此命推来福不轻，何须愁虑苦劳心，荣华富贵已天定，正笏垂绅拜紫宸。'],
  [7.1,'此命推来大不同，公侯卿相在其中，一生自有逍遥福，富贵荣华极登场。']
];

function calcChengGu(yearGanZhi, lunarMonth, lunarDay, hourZhi) {
  var yw = CG_YEAR[yearGanZhi] || 0;
  var mw = CG_MONTH[lunarMonth] || 0;
  var dw = CG_DAY[lunarDay] || 0;
  var hw = CG_HOUR[hourZhi] || 0;
  var total = Math.round((yw + mw + dw + hw) * 10) / 10;
  var poem = '';
  for (var i = 0; i < CG_SCORES.length; i++) {
    if (Math.abs(CG_SCORES[i][0] - total) < 0.05) { poem = CG_SCORES[i][1]; break; }
  }
  return { yearWeight: yw, monthWeight: mw, dayWeight: dw, hourWeight: hw, total: total, poem: poem };
}


// === src/fate/liuyue.js ===
function calcLiuYue(liuNianGan) {
  var months = [];
  var yearGanIdx = TIAN_GAN.indexOf(liuNianGan);
  var startGan = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0][yearGanIdx];
  var monthNames = ['正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','冬月','腊月'];
  for (var i = 0; i < 12; i++) {
    var zhiIdx = (2 + i) % 12;
    var ganIdx = (startGan + i) % 10;
    var gan = TIAN_GAN[ganIdx];
    var zhi = DI_ZHI[zhiIdx];
    var gz = gan + zhi;
    months.push({ gan: gan, zhi: zhi, ganZhi: gz, month: i + 1, name: monthNames[i], naYin: NA_YIN[gz] });
  }
  return months;
}


// 根据四柱反查公历日期（1911-2100）
function searchByPillars(targetYearGan, targetYearZhi, targetMonthGan, targetMonthZhi, targetDayGan, targetDayZhi, targetHourGan, targetHourZhi) {
  var results = [];
  var HOUR_VALS = [0, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21]; // 时辰起始小时

  for (var year = 1911; year <= 2100; year++) {
    // 快速跳过：用年中6月15日的年柱做筛选（远离立春边界）
    var midYear = new Date(year, 5, 15, 12, 0, 0);
    var yp = getYearPillar(midYear);
    if (yp.gan !== targetYearGan || yp.zhi !== targetYearZhi) continue;

    // 年柱匹配，遍历全年每一天
    for (var month = 0; month < 12; month++) {
      var daysInMonth = new Date(year, month + 1, 0).getDate();
      for (var day = 1; day <= daysInMonth; day++) {
        for (var hi = 0; hi < HOUR_VALS.length; hi++) {
          var h = HOUR_VALS[hi];
          var date = new Date(year, month, day, h, 0, 0);
          var fp = getFourPillars(date);

          if (fp.month.gan === targetMonthGan && fp.month.zhi === targetMonthZhi &&
              fp.day.gan === targetDayGan && fp.day.zhi === targetDayZhi &&
              fp.hour.gan === targetHourGan && fp.hour.zhi === targetHourZhi) {
            results.push({
              year: year,
              month: month + 1,
              day: day,
              hour: h,
              fourPillars: {
                year: fp.year,
                month: fp.month,
                day: fp.day,
                hour: fp.hour
              }
            });
          }
        }
      }
    }
  }

  return results;
}

function paipan(year, month, day, hour, gender) {
  const birthDate = new Date(year, month - 1, day, hour);

  // 1. 四柱
  const fourPillars = getFourPillars(birthDate);

  // 2. 十神
  const shiShen = calcAllShiShen(fourPillars);

  // 3. 五行统计
  const wuXing = countWuXing(fourPillars);
  const wuXingWeight = countWuXingWithCangGan(fourPillars);

  // 4. 十二长生
  const changSheng = {
    year: getChangSheng(fourPillars.day.gan, fourPillars.year.zhi),
    month: getChangSheng(fourPillars.day.gan, fourPillars.month.zhi),
    day: getChangSheng(fourPillars.day.gan, fourPillars.day.zhi),
    hour: getChangSheng(fourPillars.day.gan, fourPillars.hour.zhi)
  };

  // 5. 大运
  const daYun = calcDaYun(fourPillars, gender, birthDate);

  // 6. 神煞
  const shenSha = calcShenSha(fourPillars);

  // 7. 刑冲合害
  const xchh = calcXingChongHeHai(fourPillars);

  // 8. 日主强弱
  const dayStrength = judgeDayStrength(fourPillars);

  // 9. 调候
  const tiaoHou = getTiaoHou(fourPillars.day.gan, fourPillars.month.zhi);

  // 10. 格局
  const geJu = determineGeJu(fourPillars);

  // 11. 特殊组合
  const specialCombinations = analyzeSpecialCombinations(fourPillars, shiShen);

  // 12. 综合用神
  const yongShen = analyzeYongShen(fourPillars, dayStrength, shiShen, tiaoHou);

  // 13. 二十八星宿
  const dayPillar60Index = getDayPillar60Index(fourPillars.day.gan, fourPillars.day.zhi);
  const totalDayOffset = getDayOffsetFrom1900(year, month, day);
  const riXiu = getRiXiu(totalDayOffset);

  // 14. 命宫/胎元/胎息/身宫
  const hourZhi = fourPillars.hour.zhi;
  const taiYuan = calcTaiYuan(fourPillars.month.gan, fourPillars.month.zhi);
  taiYuan.naYin = NA_YIN[taiYuan.ganZhi] || '';
  const taiXi = calcTaiXi(fourPillars.day.gan, fourPillars.day.zhi);
  taiXi.naYin = NA_YIN[taiXi.ganZhi] || '';
  const mingGong = calcMingGong(fourPillars.month.zhi, hourZhi, fourPillars.year.gan);
  mingGong.naYin = NA_YIN[mingGong.ganZhi] || '';
  const shenGong = calcShenGong(fourPillars.month.zhi, hourZhi, fourPillars.year.gan);
  shenGong.naYin = NA_YIN[shenGong.ganZhi] || '';

  // 15. 空亡
  const kongWang = getKongWang(fourPillars.day.gan, fourPillars.day.zhi);
  const yearKongWang = getKongWang(fourPillars.year.gan, fourPillars.year.zhi);

  // 16. 自坐星运（每柱天干坐本柱地支的十二长生）
  var ziZuo = {};
  var positions = ['year', 'month', 'day', 'hour'];
  positions.forEach(function(pos) {
    ziZuo[pos] = getChangSheng(fourPillars[pos].gan, fourPillars[pos].zhi);
  });

  // 17. 袁天罡称骨
  var lunar = solarToLunar(year, month, day);
  const chengGu = calcChengGu(fourPillars.year.ganZhi, lunar.month, lunar.day, hourZhi);

  // 18. 小运
  const xiaoYun = calcXiaoYun(fourPillars, gender, birthDate, daYun.qiYunAge);

  return {
    birthInfo: { year, month, day, hour, gender },
    fourPillars,
    shiShen,
    wuXing,
    wuXingWeight,
    changSheng,
    daYun,
    shenSha,
    xingChongHeHai: xchh,
    dayStrength,
    tiaoHou,
    geJu,
    specialCombinations,
    yongShen,
    // 新增
    riXiu: riXiu,
    taiYuan: taiYuan,
    taiXi: taiXi,
    mingGong: mingGong,
    shenGong: shenGong,
    kongWang: kongWang,
    yearKongWang: yearKongWang,
    ziZuo: ziZuo,
    chengGu: chengGu,
    xiaoYun: xiaoYun,
    lunarDate: lunar
  };
}

// 格式化输出排盘结果
function formatResult(result) {
  const lines = [];
  const fp = result.fourPillars;
  const ss = result.shiShen;
  const bi = result.birthInfo;

  lines.push('');
  lines.push('═══════════════════════════════════════════════════');
  lines.push('                    八字排盘');
  lines.push('═══════════════════════════════════════════════════');
  lines.push('');
  lines.push(`出生信息：${bi.year}年${bi.month}月${bi.day}日 ${bi.hour}时  ${bi.gender}命`);
  lines.push('');

  // 四柱表格
  lines.push('┌────────┬────────┬────────┬────────┐');
  lines.push(`│  年柱  │  月柱  │  日柱  │  时柱  │`);
  lines.push('├────────┼────────┼────────┼────────┤');
  lines.push(`│${padCenter(ss.year.gan, 8)}│${padCenter(ss.month.gan, 8)}│${padCenter('日主', 8)}│${padCenter(ss.hour.gan, 8)}│`);
  lines.push(`│${padCenter(fp.year.gan, 8)}│${padCenter(fp.month.gan, 8)}│${padCenter(fp.day.gan, 8)}│${padCenter(fp.hour.gan, 8)}│`);
  lines.push(`│${padCenter(`(${GAN_WU_XING[fp.year.gan]})`, 8)}│${padCenter(`(${GAN_WU_XING[fp.month.gan]})`, 8)}│${padCenter(`(${GAN_WU_XING[fp.day.gan]})`, 8)}│${padCenter(`(${GAN_WU_XING[fp.hour.gan]})`, 8)}│`);
  lines.push('├────────┼────────┼────────┼────────┤');
  lines.push(`│${padCenter(fp.year.zhi, 8)}│${padCenter(fp.month.zhi, 8)}│${padCenter(fp.day.zhi, 8)}│${padCenter(fp.hour.zhi, 8)}│`);
  lines.push(`│${padCenter(`(${ZHI_WU_XING[fp.year.zhi]})`, 8)}│${padCenter(`(${ZHI_WU_XING[fp.month.zhi]})`, 8)}│${padCenter(`(${ZHI_WU_XING[fp.day.zhi]})`, 8)}│${padCenter(`(${ZHI_WU_XING[fp.hour.zhi]})`, 8)}│`);
  lines.push('├────────┼────────┼────────┼────────┤');

  // 藏干
  const maxCang = 3;
  for (let i = 0; i < maxCang; i++) {
    const cols = ['year', 'month', 'day', 'hour'].map(pos => {
      const cg = ZHI_CANG_GAN[fp[pos].zhi];
      if (i < cg.length) {
        const label = i === 0 ? '本' : i === 1 ? '中' : '余';
        return `${label}:${cg[i]}(${GAN_WU_XING[cg[i]]})`;
      }
      return '';
    });
    lines.push(`│${padCenter(cols[0], 8)}│${padCenter(cols[1], 8)}│${padCenter(cols[2], 8)}│${padCenter(cols[3], 8)}│`);
  }
  lines.push('├────────┼────────┼────────┼────────┤');

  // 纳音
  lines.push(`│${padCenter(fp.year.naYin || '', 8)}│${padCenter(fp.month.naYin || '', 8)}│${padCenter(fp.day.naYin || '', 8)}│${padCenter(fp.hour.naYin || '', 8)}│`);
  lines.push('├────────┼────────┼────────┼────────┤');

  // 十二长生
  const cs = result.changSheng;
  lines.push(`│${padCenter(cs.year, 8)}│${padCenter(cs.month, 8)}│${padCenter(cs.day, 8)}│${padCenter(cs.hour, 8)}│`);
  lines.push('└────────┴────────┴────────┴────────┘');

  // 五行统计
  lines.push('');
  lines.push('【五行统计】');
  const wx = result.wuXing.count;
  const wxw = result.wuXingWeight;
  lines.push(`  木: ${wx['木']}个(权重${wxw['木']})  火: ${wx['火']}个(权重${wxw['火']})  土: ${wx['土']}个(权重${wxw['土']})  金: ${wx['金']}个(权重${wxw['金']})  水: ${wx['水']}个(权重${wxw['水']})`);

  // 缺失五行
  const missing = Object.keys(wx).filter(k => wx[k] === 0);
  if (missing.length > 0) {
    lines.push(`  缺: ${missing.join('、')}`);
  }

  // 日主强弱
  lines.push('');
  lines.push('【日主分析】');
  lines.push(`  日主: ${result.dayStrength.dayGan}(${result.dayStrength.dayWx})  判断: ${result.dayStrength.strength} (评分: ${result.dayStrength.score})`);
  for (const a of result.dayStrength.analysis) {
    lines.push(`  · ${a}`);
  }

  // 神煞
  if (result.shenSha.length > 0) {
    lines.push('');
    lines.push('【神煞】');
    for (const s of result.shenSha) {
      lines.push(`  ${s.position} - ${s.name}: ${s.description}`);
    }
  }

  // 刑冲合害
  const xchh = result.xingChongHeHai;
  const hasXCHH = xchh.tianGanHe.length + xchh.tianGanChong.length +
    xchh.diZhiHe.length + xchh.diZhiChong.length +
    xchh.diZhiHai.length + xchh.diZhiXing.length +
    xchh.sanHe.length + xchh.sanHui.length > 0;

  if (hasXCHH) {
    lines.push('');
    lines.push('【刑冲合害】');
    for (const item of xchh.tianGanHe) lines.push(`  天干: ${item.description}`);
    for (const item of xchh.tianGanChong) lines.push(`  天干: ${item.description}`);
    for (const item of xchh.diZhiHe) lines.push(`  地支: ${item.description}`);
    for (const item of xchh.diZhiChong) lines.push(`  地支: ${item.description}`);
    for (const item of xchh.diZhiHai) lines.push(`  地支: ${item.description}`);
    for (const item of xchh.diZhiXing) lines.push(`  地支: ${item.description}`);
    for (const item of xchh.sanHe) lines.push(`  地支: ${item.description}`);
    for (const item of xchh.sanHui) lines.push(`  地支: ${item.description}`);
  }

  // 大运
  lines.push('');
  lines.push('【大运】');
  lines.push(`  排运方向: ${result.daYun.direction}  起运年龄: ${result.daYun.qiYunAge}岁 (${result.daYun.qiYunYear}年)`);
  if (result.daYun.jieInfo) {
    lines.push(`  前节: ${result.daYun.jieInfo.prevJie}  后节: ${result.daYun.jieInfo.nextJie}`);
  }
  lines.push('');

  // 大运列表
  lines.push('  ┌──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┐');
  let dyGans = '  │';
  let dyZhis = '  │';
  let dyAges = '  │';
  let dyYears = '  │';

  for (const dy of result.daYun.daYunList) {
    dyGans += padCenter(dy.gan, 6) + '│';
    dyZhis += padCenter(dy.zhi, 6) + '│';
    dyAges += padCenter(`${dy.startAge}-${dy.endAge}`, 6) + '│';
    dyYears += padCenter(`${dy.startYear}`, 6) + '│';
  }

  lines.push(dyGans);
  lines.push(dyZhis);
  lines.push('  ├──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤');
  lines.push(dyAges);
  lines.push(dyYears);
  lines.push('  └──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┘');

  lines.push('');
  lines.push('═══════════════════════════════════════════════════');

  return lines.join('\n');
}

// 辅助函数：居中对齐
function padCenter(str, width) {
  str = String(str);
  // 计算字符串的显示宽度（中文字符算2）
  const displayWidth = getDisplayWidth(str);
  if (displayWidth >= width) return str;
  const left = Math.floor((width - displayWidth) / 2);
  const right = width - displayWidth - left;
  return ' '.repeat(left) + str + ' '.repeat(right);
}

function getDisplayWidth(str) {
  let width = 0;
  for (const char of str) {
    const code = char.charCodeAt(0);
    if (code >= 0x4e00 && code <= 0x9fff ||
        code >= 0x3000 && code <= 0x303f ||
        code >= 0xff00 && code <= 0xffef) {
      width += 2;
    } else {
      width += 1;
    }
  }
  return width;
}


// === Public API ===
return {
  paipan: paipan,
  generateReport: generateReport,
  analyzeLiuNian: analyzeLiuNian,
  calcLiuYue: calcLiuYue,
  solarToLunar: solarToLunar,
  searchByPillars: searchByPillars,
  _constants: {
    GAN_WU_XING: GAN_WU_XING,
    ZHI_WU_XING: ZHI_WU_XING,
    ZHI_CANG_GAN: ZHI_CANG_GAN,
    GAN_YIN_YANG: GAN_YIN_YANG,
    TIAN_GAN: TIAN_GAN,
    DI_ZHI: DI_ZHI,
    NA_YIN: NA_YIN
  },
  getKongWang: getKongWang
};

})();
if (typeof window !== 'undefined') { window.BaziEngine = BaziEngine; }
