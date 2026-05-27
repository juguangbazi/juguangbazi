import {
  TIAN_GAN, DI_ZHI,
  GAN_WU_XING, GAN_YIN_YANG, ZHI_WU_XING, ZHI_CANG_GAN,
  WU_XING_SHENG, WU_XING_KE, WU_XING_BEI_SHENG, WU_XING_BEI_KE
} from '../utils/constants.js';
import { getShiShen } from '../pillars/shiShen.js';
import { LU_SHEN, YANG_REN } from '../spirits/shensha.js';

// ========== 调候用神表（穷通宝鉴） ==========
export const TIAO_HOU = {
  '甲': {
    '寅': { main: '丙', aux: '癸', desc: '初春尚寒，丙火温暖，癸水滋润' },
    '卯': { main: '庚', aux: '丙丁', desc: '木旺需庚金修剪，辅以火暖' },
    '辰': { main: '庚', aux: '丁', desc: '春末木盛，庚金制木，丁火配合' },
    '巳': { main: '癸', aux: '', desc: '夏初火旺，癸水调候为先' },
    '午': { main: '癸', aux: '', desc: '盛夏木枯，癸水解炎' },
    '未': { main: '癸', aux: '', desc: '长夏土燥，癸水润泽' },
    '申': { main: '庚', aux: '丁', desc: '秋金当令，庚金雕木，丁火推助' },
    '酉': { main: '庚', aux: '丁', desc: '秋深金旺，庚金修剪，丁火暖局' },
    '戌': { main: '庚', aux: '甲丁', desc: '土燥木枯，庚金雕琢，甲丁配合' },
    '亥': { main: '庚', aux: '丁', desc: '水旺木浮，庚金制水，丁火暖之' },
    '子': { main: '丁', aux: '庚', desc: '寒冬水冷，丁火暖局为先，庚金为辅' },
    '丑': { main: '丁', aux: '庚', desc: '季冬寒重，丁火暖身，庚金佐之' }
  },
  '乙': {
    '寅': { main: '丙', aux: '', desc: '初春尚寒，丙火暖局催发' },
    '卯': { main: '丙', aux: '', desc: '春深木旺，丙火照暖' },
    '辰': { main: '癸', aux: '', desc: '春末湿重，癸水润木' },
    '巳': { main: '癸', aux: '', desc: '夏初火炎，癸水调候' },
    '午': { main: '癸', aux: '', desc: '盛夏火烈，癸水救急' },
    '未': { main: '癸', aux: '', desc: '长夏土燥，癸水润培' },
    '申': { main: '丙', aux: '癸', desc: '秋金克木，丙火制金护木，癸水润根' },
    '酉': { main: '癸', aux: '', desc: '秋深金锐，癸水化金生木' },
    '戌': { main: '癸', aux: '', desc: '土燥木困，癸水解燥' },
    '亥': { main: '丙', aux: '戊', desc: '冬水寒木，丙火温暖，戊土制水' },
    '子': { main: '丙', aux: '', desc: '寒冬水冷，丙火暖局' },
    '丑': { main: '丙', aux: '', desc: '季冬寒重，丙火暖身' }
  },
  '丙': {
    '寅': { main: '壬', aux: '', desc: '春木生火，壬水制旺为要' },
    '卯': { main: '壬', aux: '', desc: '木盛火炎，壬水调济' },
    '辰': { main: '壬', aux: '甲', desc: '土晦火光，壬甲并用' },
    '巳': { main: '壬', aux: '庚癸', desc: '火临禄地，壬水解炎，庚金发源' },
    '午': { main: '壬', aux: '庚', desc: '火旺极，壬水救局，庚金水源' },
    '未': { main: '壬', aux: '庚', desc: '火土相炎，壬庚并用' },
    '申': { main: '壬', aux: '', desc: '秋金生水，壬水通源' },
    '酉': { main: '壬', aux: '', desc: '秋深金旺，壬水为用' },
    '戌': { main: '甲', aux: '壬', desc: '火库燥土，甲木疏土，壬水解燥' },
    '亥': { main: '甲', aux: '壬庚戊', desc: '火绝水旺，甲木生火，壬水调济' },
    '子': { main: '壬', aux: '戊己', desc: '水旺火熄，壬戊并用' },
    '丑': { main: '壬', aux: '甲', desc: '寒土晦火，壬甲同用' }
  },
  '丁': {
    '寅': { main: '甲', aux: '庚', desc: '春木生火，甲木为源，庚金劈甲' },
    '卯': { main: '庚', aux: '甲', desc: '木旺火塞，庚金劈木引火' },
    '辰': { main: '甲', aux: '庚', desc: '土晦光，甲木疏土，庚金劈甲' },
    '巳': { main: '甲', aux: '庚', desc: '火旺需甲木为源，庚金劈甲引丁' },
    '午': { main: '壬', aux: '庚癸', desc: '火炎土燥，壬水解炎为先' },
    '未': { main: '甲', aux: '庚壬', desc: '火退气，甲木扶助，庚壬配合' },
    '申': { main: '甲', aux: '庚丙戊', desc: '金旺晦火，甲木生火为先' },
    '酉': { main: '甲', aux: '庚丙戊', desc: '金重火熄，甲木扶身' },
    '戌': { main: '甲', aux: '庚戊', desc: '火库被晦，甲庚戊并用' },
    '亥': { main: '甲', aux: '庚', desc: '水旺火绝，甲木生扶' },
    '子': { main: '甲', aux: '庚', desc: '冬水灭火，甲木救命，庚金劈甲' },
    '丑': { main: '甲', aux: '庚', desc: '寒土晦火，甲庚同用' }
  },
  '戊': {
    '寅': { main: '丙', aux: '甲癸', desc: '春木克土，丙火化木生土' },
    '卯': { main: '丙', aux: '甲癸', desc: '木旺土虚，丙火通关' },
    '辰': { main: '甲', aux: '癸丙', desc: '春末土湿，甲木疏土，癸水润泽' },
    '巳': { main: '甲', aux: '丙癸', desc: '火炎土燥，甲木疏劈' },
    '午': { main: '壬', aux: '甲丙', desc: '火旺土焦，壬水调候为先' },
    '未': { main: '癸', aux: '丙甲', desc: '燥土，癸水润泽，丙火暖局' },
    '申': { main: '丙', aux: '癸甲', desc: '金泄土气，丙火生扶' },
    '酉': { main: '丙', aux: '癸', desc: '金旺泄土，丙火为用' },
    '戌': { main: '甲', aux: '丙癸', desc: '燥土，甲木疏劈，丙癸配合' },
    '亥': { main: '甲', aux: '丙', desc: '水旺土荡，甲木制水' },
    '子': { main: '丙', aux: '甲', desc: '水冷土寒，丙火暖局' },
    '丑': { main: '丙', aux: '甲', desc: '寒土冰结，丙火暖身为先' }
  },
  '己': {
    '寅': { main: '丙', aux: '庚甲', desc: '春木克土，丙火化木' },
    '卯': { main: '甲', aux: '癸', desc: '木旺克土，甲木疏泄' },
    '辰': { main: '丙', aux: '甲癸', desc: '土湿，丙火暖局，甲木疏土' },
    '巳': { main: '癸', aux: '丙', desc: '火炎土燥，癸水润泽为先' },
    '午': { main: '癸', aux: '丙', desc: '盛夏火炎，癸水解燥' },
    '未': { main: '癸', aux: '丙', desc: '季夏土燥，癸水润泽' },
    '申': { main: '丙', aux: '癸', desc: '金泄土气，丙火生扶' },
    '酉': { main: '丙', aux: '癸', desc: '秋金泄土，丙火暖局' },
    '戌': { main: '甲', aux: '丙癸', desc: '燥土，甲木疏劈，丙癸配合' },
    '亥': { main: '丙', aux: '甲', desc: '水冷土寒，丙火为用' },
    '子': { main: '丙', aux: '甲', desc: '寒冬，丙火暖土' },
    '丑': { main: '丙', aux: '甲', desc: '季冬寒土，丙火暖局为先' }
  },
  '庚': {
    '寅': { main: '丁', aux: '甲丙', desc: '春木旺金囚，丁火炼金，甲木为辅' },
    '卯': { main: '丁', aux: '甲庚', desc: '木旺金缺，丁火制木护金' },
    '辰': { main: '甲', aux: '丁', desc: '春末土重埋金，甲木疏土' },
    '巳': { main: '壬', aux: '丙丁', desc: '火旺熔金，壬水救急为先' },
    '午': { main: '壬', aux: '癸', desc: '烈火熔金，壬癸水解炎' },
    '未': { main: '壬', aux: '甲丁', desc: '燥土，壬水润局，甲木疏土' },
    '申': { main: '丁', aux: '甲', desc: '金临禄地，丁火炼金成器' },
    '酉': { main: '丁', aux: '甲丙', desc: '金旺极，丁火锻炼' },
    '戌': { main: '甲', aux: '壬', desc: '燥土埋金，甲木疏土，壬水润局' },
    '亥': { main: '丁', aux: '丙', desc: '水冷金寒，丁火暖局' },
    '子': { main: '丁', aux: '甲丙', desc: '水旺金沉，丁火暖身' },
    '丑': { main: '丙', aux: '丁甲', desc: '寒土埋金，丙丁火暖局' }
  },
  '辛': {
    '寅': { main: '己', aux: '壬庚', desc: '春木旺，己土生金为先' },
    '卯': { main: '壬', aux: '甲', desc: '木旺金缺，壬水通关' },
    '辰': { main: '壬', aux: '甲', desc: '土重埋金，壬甲并用' },
    '巳': { main: '壬', aux: '甲癸', desc: '火旺熔金，壬水救急' },
    '午': { main: '壬', aux: '己癸', desc: '烈火熔金，壬水解炎' },
    '未': { main: '壬', aux: '庚甲', desc: '燥土，壬水润泽' },
    '申': { main: '壬', aux: '甲戊', desc: '金旺水浅，壬水淘洗' },
    '酉': { main: '壬', aux: '甲', desc: '金重，壬水淘洗' },
    '戌': { main: '壬', aux: '甲', desc: '燥土埋金，壬甲并用' },
    '亥': { main: '壬', aux: '丙', desc: '水冷金寒，壬水为用，丙火暖局' },
    '子': { main: '丙', aux: '壬甲', desc: '寒冬水冷，丙火暖局' },
    '丑': { main: '丙', aux: '壬甲', desc: '季冬寒重，丙火为先' }
  },
  '壬': {
    '寅': { main: '庚', aux: '丙戊', desc: '春木泄水，庚金发源' },
    '卯': { main: '戊', aux: '辛庚', desc: '木旺水浅，戊土制水' },
    '辰': { main: '甲', aux: '庚', desc: '水库土壅，甲木疏土' },
    '巳': { main: '壬', aux: '辛庚', desc: '火旺水涸，壬水帮身' },
    '午': { main: '癸', aux: '庚辛', desc: '火炎水干，癸水解炎' },
    '未': { main: '辛', aux: '甲', desc: '土燥水涸，辛金发源' },
    '申': { main: '戊', aux: '丁', desc: '金生水旺，戊土堤防' },
    '酉': { main: '甲', aux: '庚', desc: '金多水浊，甲木泄水' },
    '戌': { main: '甲', aux: '丙', desc: '土燥水涸，甲木疏土' },
    '亥': { main: '戊', aux: '丙庚', desc: '水旺泛滥，戊土堤防' },
    '子': { main: '戊', aux: '丙', desc: '水旺极，戊土堤防，丙火暖局' },
    '丑': { main: '丙', aux: '丁甲', desc: '寒水冰结，丙火暖局' }
  },
  '癸': {
    '寅': { main: '辛', aux: '丙', desc: '春木泄水，辛金发源' },
    '卯': { main: '庚', aux: '辛', desc: '木盛水浅，庚辛金发源' },
    '辰': { main: '辛', aux: '甲', desc: '水库土壅，辛金发源' },
    '巳': { main: '辛', aux: '壬', desc: '火旺水涸，辛金发源' },
    '午': { main: '庚', aux: '壬癸', desc: '火炎水干，庚金发源为急' },
    '未': { main: '庚', aux: '辛壬', desc: '燥土，庚辛金发源' },
    '申': { main: '丁', aux: '', desc: '金多水浊，丁火制金' },
    '酉': { main: '辛', aux: '丙', desc: '金多水涩，辛金发源' },
    '戌': { main: '辛', aux: '甲壬癸', desc: '燥土，辛金发源，甲木疏土' },
    '亥': { main: '庚', aux: '辛戊丁', desc: '水旺，庚辛金为源' },
    '子': { main: '丙', aux: '辛', desc: '寒水冰结，丙火暖局为先' },
    '丑': { main: '丙', aux: '丁', desc: '季冬寒重，丙火暖局' }
  }
};

export function getTiaoHou(dayGan, monthZhi) {
  const entry = TIAO_HOU[dayGan] && TIAO_HOU[dayGan][monthZhi];
  if (!entry) return null;
  return {
    mainGan: entry.main,
    auxGan: entry.aux,
    description: entry.desc,
    mainWx: GAN_WU_XING[entry.main.split('')[0]]
  };
}

// ========== 格局判定（子平真诠） ==========
export function determineGeJu(fourPillars) {
  const monthZhi = fourPillars.month.zhi;
  const dayGan = fourPillars.day.gan;
  const cangGan = ZHI_CANG_GAN[monthZhi];

  const allGans = [
    fourPillars.year.gan,
    fourPillars.month.gan,
    fourPillars.day.gan,
    fourPillars.hour.gan
  ];

  const touChu = cangGan.filter(g => allGans.includes(g));

  let geJu = null;
  let geJuType = null;

  const luShenZhi = LU_SHEN[dayGan];
  const yangRenZhi = YANG_REN[dayGan];

  if (monthZhi === luShenZhi) {
    if (touChu.length > 0) {
      const firstTou = touChu[0];
      const ss = getShiShen(dayGan, firstTou);
      geJuType = '建禄格';
      geJu = { type: geJuType, ss, touGan: firstTou };
    } else {
      geJuType = '建禄格';
      geJu = { type: geJuType, ss: null, touGan: null };
    }
  } else if (monthZhi === yangRenZhi) {
    if (touChu.length > 0) {
      const firstTou = touChu[0];
      const ss = getShiShen(dayGan, firstTou);
      geJuType = '月刃格';
      geJu = { type: geJuType, ss, touGan: firstTou };
    } else {
      geJuType = '月刃格';
      geJu = { type: geJuType, ss: null, touGan: null };
    }
  } else {
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
      geJu = { type: geJuType, ss, touGan: firstTou };
    } else {
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
      geJu = { type: geJuType, ss, touGan: benQi, hidden: true };
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
export function analyzeSpecialCombinations(fourPillars, shiShen) {
  const combinations = [];

  const ganShiShen = [
    { pos: '年干', gan: fourPillars.year.gan, ss: shiShen.year.gan },
    { pos: '月干', gan: fourPillars.month.gan, ss: shiShen.month.gan },
    { pos: '日干', gan: fourPillars.day.gan, ss: '日主' },
    { pos: '时干', gan: fourPillars.hour.gan, ss: shiShen.hour.gan }
  ];

  // 1. 枭印夺食
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
            description: `${py.pos}${py.gan}（偏印）克制${ss2.pos}${ss2.gan}（${ssName}），为枭印夺食。才华难展、福气受损，需注意情绪。`,
            solution: '若有偏财透出可制枭护食，或走财运通关化解。',
            involved: [py, ss2]
          });
        }
      }
    }
  }

  // 2. 伤官见官
  const hasShangGuan = ganShiShen.filter(g => g.ss === '伤官');
  const hasZhengGuan = ganShiShen.filter(g => g.ss === '正官');
  if (hasShangGuan.length > 0 && hasZhengGuan.length > 0) {
    for (const sg of hasShangGuan) {
      for (const zg of hasZhengGuan) {
        if (sg.pos !== zg.pos) {
          combinations.push({
            name: '伤官见官',
            severity: 'medium',
            description: `${sg.pos}${sg.gan}（伤官）与${zg.pos}${zg.gan}（正官）并见。叛逆不服管束，事业易有波折。`,
            solution: '若有印星透出制伤护官，可化解。',
            involved: [sg, zg]
          });
        }
      }
    }
  }

  // 3. 财星坏印
  const hasCai = ganShiShen.filter(g => g.ss === '正财' || g.ss === '偏财');
  const hasYin = ganShiShen.filter(g => g.ss === '正印' || g.ss === '偏印');
  if (hasCai.length > 0 && hasYin.length > 0) {
    for (const c of hasCai) {
      for (const y of hasYin) {
        if (c.pos !== y.pos) {
          combinations.push({
            name: '财星坏印',
            severity: 'medium',
            description: `${c.pos}${c.gan}（财星）克制${y.pos}${y.gan}（印星），易因利益损名誉。`,
            solution: '若有官星通关，或比劫制财护印可解。',
            involved: [c, y]
          });
        }
      }
    }
  }

  // 4. 官杀混杂
  const hasPianGuan = ganShiShen.filter(g => g.ss === '偏官');
  if (hasZhengGuan.length > 0 && hasPianGuan.length > 0) {
    combinations.push({
      name: '官杀混杂',
      severity: 'medium',
      description: '正官与七杀并见，事业上面临多重压力，需分清主次。',
      solution: '去官留杀或去杀留官，以印化杀或食神制杀取清为贵。',
      involved: [...hasZhengGuan, ...hasPianGuan]
    });
  }

  // 5. 食神制杀（吉）
  const hasShiShen2 = ganShiShen.filter(g => g.ss === '食神');
  if (hasShiShen2.length > 0 && hasPianGuan.length > 0) {
    combinations.push({
      name: '食神制杀',
      severity: 'good',
      description: '以才华智慧驾驭权力压力，是成大事之象。有魄力有手段。',
      solution: '',
      involved: [...hasShiShen2, ...hasPianGuan]
    });
  }

  // 6. 杀印相生（吉）
  if (hasYin.length > 0 && hasPianGuan.length > 0) {
    combinations.push({
      name: '杀印相生',
      severity: 'good',
      description: '七杀生印、印再生身，压力化为动力，是掌权柄之象。',
      solution: '',
      involved: [...hasYin, ...hasPianGuan]
    });
  }

  // 7. 伤官生财（吉）
  if (hasShangGuan.length > 0 && hasCai.length > 0) {
    combinations.push({
      name: '伤官生财',
      severity: 'good',
      description: '才华转化为财富，靠技术和创意赚钱，以技艺致富之路。',
      solution: '',
      involved: [...hasShangGuan, ...hasCai]
    });
  }

  // 8. 财官相生（吉）
  if (hasCai.length > 0 && hasZhengGuan.length > 0) {
    combinations.push({
      name: '财官相生',
      severity: 'good',
      description: '财生官，事业因财富得提升，有名有利。',
      solution: '',
      involved: [...hasCai, ...hasZhengGuan]
    });
  }

  const seen = new Set();
  return combinations.filter(c => {
    const key = c.name;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ========== 综合用神分析 ==========
export function analyzeYongShen(fourPillars, dayStrength, shiShen, tiaoHou) {
  const dayGan = fourPillars.day.gan;
  const dayWx = GAN_WU_XING[dayGan];
  const strength = dayStrength.strength;

  let tiaoHouYongShen = null;
  let tiaoHouWx = null;
  if (tiaoHou) {
    tiaoHouYongShen = tiaoHou.mainGan;
    tiaoHouWx = tiaoHou.mainWx;
  }

  const geJu = determineGeJu(fourPillars);
  let geJuYongShen = null;

  const geJuTypeMap = {
    '正官格': { ss: '正印', wx: WU_XING_BEI_SHENG[dayWx], desc: '正官格喜印护官、喜财生官' },
    '七杀格': { ss: '食神', wx: WU_XING_SHENG[dayWx], desc: '七杀格喜食神制杀、喜印化杀' },
    '正财格': { ss: '正官', wx: WU_XING_BEI_KE[dayWx], desc: '正财格喜官护财、喜食伤生财' },
    '偏财格': { ss: '正官', wx: WU_XING_BEI_KE[dayWx], desc: '偏财格喜官护财、喜食伤生财' },
    '正印格': { ss: '正官', wx: WU_XING_BEI_KE[dayWx], desc: '正印格喜官生印、忌财坏印' },
    '偏印格': { ss: '偏财', wx: WU_XING_KE[dayWx], desc: '偏印格喜财制枭、忌食神被夺' },
    '食神格': { ss: '偏财', wx: WU_XING_KE[dayWx], desc: '食神格喜生财、忌偏印夺食' },
    '伤官格': { ss: '正印', wx: WU_XING_BEI_SHENG[dayWx], desc: '伤官格喜印制伤、喜财泄伤' },
    '建禄格': { ss: '正官', wx: WU_XING_BEI_KE[dayWx], desc: '建禄格喜官杀制、喜财生官、喜食伤泄秀' },
    '月刃格': { ss: '正官', wx: WU_XING_BEI_KE[dayWx], desc: '月刃格喜官杀制刃、忌冲刃' }
  };
  geJuYongShen = geJuTypeMap[geJu.type] || null;

  let strengthYongShen = null;
  if (['身强', '偏强'].includes(strength)) {
    strengthYongShen = {
      main: WU_XING_BEI_KE[dayWx] || WU_XING_KE[dayWx],
      alt: WU_XING_SHENG[dayWx],
      desc: '身强喜克泄耗，以官杀制身、食伤泄秀、财星耗身为用'
    };
  } else if (['身弱', '偏弱'].includes(strength)) {
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
