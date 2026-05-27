import {
  GAN_WU_XING, GAN_YIN_YANG, ZHI_WU_XING, ZHI_CANG_GAN,
  WU_XING_SHENG, WU_XING_KE, WU_XING_BEI_SHENG, WU_XING_BEI_KE
} from '../utils/constants.js';

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

export function generateReport(result) {
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
    ['天乙贵人', '文昌贵人', '驿马', '禄神', '羊刃'].includes(s.name)
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
  return parts.join('，');
}

function genGeJuAndYongShen(result) {
  const dayGan = result.fourPillars.day.gan;
  const dayWx = GAN_WU_XING[dayGan];
  const geJu = result.geJu;
  const yongShen = result.yongShen;
  const tiaoHou = result.tiaoHou;
  const combos = result.specialCombinations || [];

  const lines = [];

  if (!geJu) {
    return { title: '格局与用神分析', content: '格局信息未获取。' };
  }

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

  if (tiaoHou) {
    lines.push('');
    lines.push(`【调候分析】日主${dayGan}生于${result.fourPillars.month.zhi}月，${tiaoHou.description}。`);
    lines.push(`调候用神取【${tiaoHou.mainGan}】(${tiaoHou.mainWx})——这是命局的第一需要，优先于其他取用。`);
  }

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

  if (yongShen && yongShen.priority) {
    lines.push('');
    lines.push('【用神综合分析】');
    lines.push(`主用神五行：【${yongShen.mainYongShenWx}】`);
    for (const p of yongShen.priority) {
      lines.push(`  ${p.priority}. ${p.source} → 取${p.wx}（${p.desc}）`);
    }
  }

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
