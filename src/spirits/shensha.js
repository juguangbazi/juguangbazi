import {
  DI_ZHI, TIAN_GAN,
  LIU_HE, SAN_HE, SAN_HUI, LIU_CHONG, LIU_HAI, XING,
  TIAN_GAN_HE, TIAN_GAN_CHONG,
  GAN_YIN_YANG
} from '../utils/constants.js';

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
export const LU_SHEN = {
  '甲': '寅', '乙': '卯', '丙': '巳', '丁': '午',
  '戊': '巳', '己': '午', '庚': '申', '辛': '酉',
  '壬': '亥', '癸': '子'
};

// 羊刃（以日干查）
export const YANG_REN = {
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

// 亡神（以年支查，三合局临官位）
const WANG_SHEN = {
  '寅': '巳', '午': '巳', '戌': '巳',
  '申': '亥', '子': '亥', '辰': '亥',
  '巳': '申', '酉': '申', '丑': '申',
  '亥': '寅', '卯': '寅', '未': '寅'
};

// 劫煞（以年支查，三合局绝位）
const JIE_SHA = {
  '寅': '亥', '午': '亥', '戌': '亥',
  '申': '巳', '子': '巳', '辰': '巳',
  '巳': '寅', '酉': '寅', '丑': '寅',
  '亥': '申', '卯': '申', '未': '申'
};

// 丧门（以年支查，顺数第二位）
const SANG_MEN = {
  '子': '寅', '丑': '卯', '寅': '辰', '卯': '巳',
  '辰': '午', '巳': '未', '午': '申', '未': '酉',
  '申': '戌', '酉': '亥', '戌': '子', '亥': '丑'
};

// 吊客（以年支查，顺数第三位）
const DIAO_KE = {
  '子': '辰', '丑': '巳', '寅': '午', '卯': '未',
  '辰': '申', '巳': '酉', '午': '戌', '未': '亥',
  '申': '子', '酉': '丑', '戌': '寅', '亥': '卯'
};

export function calcShenSha(fourPillars) {
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

export function calcXingChongHeHai(fourPillars) {
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
