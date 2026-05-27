import {
  TIAN_GAN, DI_ZHI, WU_XING,
  GAN_WU_XING, GAN_YIN_YANG, ZHI_WU_XING,
  ZHI_CANG_GAN, WU_XING_SHENG, WU_XING_KE,
  WU_XING_BEI_SHENG, WU_XING_BEI_KE,
  SHI_ER_CHANG_SHENG, CHANG_SHENG_QI
} from '../utils/constants.js';

// 计算某天干相对于日干的十神
export function getShiShen(dayGan, targetGan) {
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
export function calcAllShiShen(fourPillars) {
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
export function countWuXing(fourPillars) {
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
export function countWuXingWithCangGan(fourPillars) {
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
export function getChangSheng(gan, zhi) {
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
export function judgeDayStrength(fourPillars) {
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
