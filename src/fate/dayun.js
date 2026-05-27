import { TIAN_GAN, DI_ZHI, NA_YIN, GAN_YIN_YANG } from '../utils/constants.js';
import { getDaysFromJie } from '../calendar/jieqi.js';
import { getShiShen } from '../pillars/shiShen.js';

// 大运排列
export function calcDaYun(fourPillars, gender, birthDate) {
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
export function calcXiaoYun(fourPillars, gender, birthDate, qiYunAge) {
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
