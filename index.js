import { getFourPillars } from './src/pillars/fourPillars.js';
import { calcAllShiShen, countWuXing, countWuXingWithCangGan, getChangSheng, judgeDayStrength } from './src/pillars/shiShen.js';
import { calcDaYun } from './src/fate/dayun.js';
import { calcShenSha, calcXingChongHeHai } from './src/spirits/shensha.js';
import { GAN_WU_XING, ZHI_WU_XING, ZHI_CANG_GAN } from './src/utils/constants.js';
import { generateReport } from './src/analysis/report.js';

export function paipan(year, month, day, hour, gender) {
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
    dayStrength
  };
}

// 格式化输出排盘结果
export function formatResult(result) {
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

// 命令行入口
const args = process.argv.slice(2);
if (args.length >= 5) {
  const [year, month, day, hour, gender] = args;
  const showReport = args.includes('--report') || args.includes('-r');
  const result = paipan(parseInt(year), parseInt(month), parseInt(day), parseInt(hour), gender);
  console.log(formatResult(result));
  if (showReport) {
    console.log(generateReport(result));
  }
} else if (args.length === 0) {
  console.log('使用方法: node index.js <年> <月> <日> <时> <性别> [--report]');
  console.log('示例: node index.js 1990 5 15 10 男');
  console.log('加 --report 或 -r 参数可生成分析报告');
  console.log('');
  console.log('运行示例排盘...');
  const result = paipan(1990, 5, 15, 10, '男');
  console.log(formatResult(result));
} else {
  console.log('使用方法: node index.js <年> <月> <日> <时(0-23)> <性别(男/女)> [--report]');
  console.log('示例: node index.js 1990 5 15 10 男 --report');
}
