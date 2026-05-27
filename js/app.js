// ========== 页面切换 ==========
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  window.scrollTo(0, 0);
}

// ========== 五行颜色映射 ==========
const WX_CLASS = { '木': 'wx-wood', '火': 'wx-fire', '土': 'wx-earth', '金': 'wx-metal', '水': 'wx-water' };
const WX_COLOR = { '木': '#4CAF50', '火': '#F44336', '土': '#d4a852', '金': '#E0E0E0', '水': '#2196F3' };

// ========== 初始化表单 ==========
function initForm() {
  const yearSel = document.getElementById('birth-year');
  const monthSel = document.getElementById('birth-month');
  const daySel = document.getElementById('birth-day');
  const currentYear = new Date().getFullYear();

  for (let y = currentYear; y >= 1940; y--) {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y + '年';
    if (y === 1990) opt.selected = true;
    yearSel.appendChild(opt);
  }

  for (let m = 1; m <= 12; m++) {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m + '月';
    monthSel.appendChild(opt);
  }

  function updateDays() {
    const y = parseInt(yearSel.value);
    const m = parseInt(monthSel.value);
    const days = new Date(y, m, 0).getDate();
    const curDay = parseInt(daySel.value) || 1;
    daySel.innerHTML = '';
    for (let d = 1; d <= days; d++) {
      const opt = document.createElement('option');
      opt.value = d;
      opt.textContent = d + '日';
      if (d === curDay || (curDay > days && d === days)) opt.selected = true;
      daySel.appendChild(opt);
    }
  }

  yearSel.addEventListener('change', updateDays);
  monthSel.addEventListener('change', updateDays);
  updateDays();

  // 性别切换
  document.querySelectorAll('.gender-btn[data-gender]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gender-btn[data-gender]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // 历法切换
  document.querySelectorAll('[data-calendar]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-calendar]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const isSolar = btn.dataset.calendar === 'solar';
      const dateLabel = document.getElementById('date-label');
      if (dateLabel) {
        dateLabel.textContent = isSolar ? '出生日期（阳历）' : '出生日期（农历）';
      }
    });
  });

  // 排盘按钮
  document.getElementById('btn-paipan').addEventListener('click', doPaipan);
}

// ========== 排盘 ==========
let currentResult = null;

function doPaipan() {
  const year = parseInt(document.getElementById('birth-year').value);
  const month = parseInt(document.getElementById('birth-month').value);
  const day = parseInt(document.getElementById('birth-day').value);
  const hourStr = document.getElementById('birth-hour').value;
  const gender = document.querySelector('.gender-btn.active').dataset.gender;

  if (!hourStr && hourStr !== '0') {
    alert('请选择出生时辰');
    return;
  }

  const hour = parseInt(hourStr);

  currentResult = BaziEngine.paipan(year, month, day, hour, gender);
  renderResult(currentResult);
  showPage('result');
}

// ========== 渲染排盘结果 ==========
function renderResult(result) {
  const bi = result.birthInfo;
  const fp = result.fourPillars;
  const ss = result.shiShen;

  // 出生信息
  const hourNames = ['子', '丑', '丑', '寅', '寅', '卯', '卯', '辰', '辰', '巳', '巳', '午', '午', '未', '未', '申', '申', '酉', '酉', '戌', '戌', '亥', '亥', '子'];
  document.getElementById('birth-info-bar').textContent =
    `${bi.year}年${bi.month}月${bi.day}日 ${hourNames[bi.hour] || ''}时 · ${bi.gender}命 · ${fp.year.ganZhi}年${fp.month.ganZhi}月${fp.day.ganZhi}日${fp.hour.ganZhi}时`;

  // 四柱
  renderFourPillars(result);

  // 五行
  renderWuXing(result);

  // 日主分析
  renderDayStrength(result);

  // 专业分析
  renderGeJu(result);
  renderTiaoHou(result);
  renderSpecialCombinations(result);

  // 神煞
  renderShenSha(result);

  // 刑冲合害
  renderXCHH(result);

  // 大运
  renderDaYun(result);

  // 内联报告
  renderReportInline(result);
}

function renderFourPillars(result) {
  const fp = result.fourPillars;
  const ss = result.shiShen;
  const cs = result.changSheng;
  const positions = ['year', 'month', 'day', 'hour'];
  const labels = ['年柱', '月柱', '日柱', '时柱'];
  const GAN_WX = BaziEngine._constants.GAN_WU_XING;
  const ZHI_WX = BaziEngine._constants.ZHI_WU_XING;
  const CANG_GAN = BaziEngine._constants.ZHI_CANG_GAN;

  const container = document.getElementById('four-pillars');
  container.innerHTML = '';

  positions.forEach((pos, i) => {
    const ganWx = GAN_WX[fp[pos].gan];
    const zhiWx = ZHI_WX[fp[pos].zhi];
    const shiShenGan = pos === 'day' ? '日主' : ss[pos].gan;
    const cangGan = CANG_GAN[fp[pos].zhi];
    const cangLabels = ['本', '中', '余'];

    const pillar = document.createElement('div');
    pillar.className = 'pillar';
    pillar.innerHTML = `
      <div class="pillar-label">${labels[i]}</div>
      <div class="pillar-shishen">${shiShenGan}</div>
      <div class="pillar-gan ${WX_CLASS[ganWx]}">${fp[pos].gan}</div>
      <div class="pillar-gan-wx ${WX_CLASS[ganWx]}">${ganWx}</div>
      <div class="pillar-zhi ${WX_CLASS[zhiWx]}">${fp[pos].zhi}</div>
      <div class="pillar-zhi-wx ${WX_CLASS[zhiWx]}">${zhiWx}</div>
      <div class="pillar-canggan">
        ${cangGan.map((g, j) => `<div>${cangLabels[j]}:${g}<span class="${WX_CLASS[GAN_WX[g]]}">(${GAN_WX[g]})</span></div>`).join('')}
      </div>
      <div class="pillar-nayin">${fp[pos].naYin || ''}</div>
      <div class="pillar-changsheng">${cs[pos]}</div>
    `;
    container.appendChild(pillar);
  });
}

function renderWuXing(result) {
  const wxWeight = result.wuXingWeight;
  const wxCount = result.wuXing.count;
  const maxWeight = Math.max(...Object.values(wxWeight), 1);
  const wxNames = ['木', '火', '土', '金', '水'];

  const container = document.getElementById('wuxing-chart');
  const missing = wxNames.filter(w => wxCount[w] === 0);

  container.innerHTML = `
    <div class="wuxing-bars">
      ${wxNames.map(wx => `
        <div class="wx-bar-row">
          <div class="wx-bar-label ${WX_CLASS[wx]}">${wx}</div>
          <div class="wx-bar-track">
            <div class="wx-bar-fill" style="width:${(wxWeight[wx] / maxWeight * 100)}%;background:${WX_COLOR[wx]}"></div>
          </div>
          <div class="wx-bar-value">${wxCount[wx]}个/${wxWeight[wx]}</div>
        </div>
      `).join('')}
    </div>
    ${missing.length > 0 ? `<div class="wx-missing">五行缺：${missing.join('、')}</div>` : ''}
  `;
}

function renderDayStrength(result) {
  const ds = result.dayStrength;
  const GAN_WX = BaziEngine._constants.GAN_WU_XING;
  const ganWx = GAN_WX[ds.dayGan];

  let badgeClass = 'strength-neutral';
  if (['身强', '偏强'].includes(ds.strength)) badgeClass = 'strength-strong';
  else if (['身弱', '偏弱'].includes(ds.strength)) badgeClass = 'strength-weak';

  const container = document.getElementById('day-strength');
  container.innerHTML = `
    <div class="strength-info">
      <div class="strength-daygan ${WX_CLASS[ganWx]}">${ds.dayGan}</div>
      <div class="strength-label">日主 · ${ganWx}</div>
      <span class="strength-badge ${badgeClass}">${ds.strength}</span>
    </div>
    <div class="strength-details">
      ${ds.analysis.map(a => `<div class="detail-item">${a}</div>`).join('')}
    </div>
  `;
}

// 神煞分类
const SHENSHA_CATEGORIES = {
  ji: {
    label: '吉神',
    icon: '吉',
    names: ['天乙贵人', '文昌贵人', '禄神', '天德贵人', '月德贵人',
            '红鸾', '天喜', '金舆', '学堂', '词馆', '太极贵人',
            '福星贵人', '国印贵人', '天厨贵人', '将星']
  },
  xiong: {
    label: '凶煞',
    icon: '凶',
    names: ['羊刃', '孤辰', '寡宿', '亡神', '劫煞', '丧门', '吊客']
  },
  neutral: {
    label: '其他',
    icon: '',
    names: ['驿马', '桃花', '华盖']
  }
};

function renderShenSha(result) {
  const container = document.getElementById('shen-sha');
  if (result.shenSha.length === 0) {
    container.innerHTML = '<div style="text-align:center;color:var(--text-dim);padding:12px">无特殊神煞</div>';
    return;
  }

  // 分组
  const ji = result.shenSha.filter(s => SHENSHA_CATEGORIES.ji.names.includes(s.name));
  const xiong = result.shenSha.filter(s => SHENSHA_CATEGORIES.xiong.names.includes(s.name));
  const neutral = result.shenSha.filter(s => SHENSHA_CATEGORIES.neutral.names.includes(s.name));

  let html = '';

  if (ji.length > 0) {
    html += `<div class="shensha-group">
      <div class="shensha-group-title shensha-ji-title">🌟 吉神 (${ji.length})</div>
      <div class="shensha-list">
        ${ji.map(s => `
          <div class="shensha-tag shensha-ji" title="${s.description}">
            <span class="shensha-name">${s.name}</span>
            <span class="shensha-pos">${s.position}</span>
          </div>
        `).join('')}
      </div>
    </div>`;
  }

  if (xiong.length > 0) {
    html += `<div class="shensha-group">
      <div class="shensha-group-title shensha-xiong-title">⚠ 凶煞 (${xiong.length})</div>
      <div class="shensha-list">
        ${xiong.map(s => `
          <div class="shensha-tag shensha-xiong" title="${s.description}">
            <span class="shensha-name">${s.name}</span>
            <span class="shensha-pos">${s.position}</span>
          </div>
        `).join('')}
      </div>
    </div>`;
  }

  if (neutral.length > 0) {
    html += `<div class="shensha-group">
      <div class="shensha-group-title shensha-neutral-title">— 其他 (${neutral.length})</div>
      <div class="shensha-list">
        ${neutral.map(s => `
          <div class="shensha-tag shensha-neutral" title="${s.description}">
            <span class="shensha-name">${s.name}</span>
            <span class="shensha-pos">${s.position}</span>
          </div>
        `).join('')}
      </div>
    </div>`;
  }

  container.innerHTML = html;
}

function renderXCHH(result) {
  const xchh = result.xingChongHeHai;
  const items = [];

  xchh.tianGanHe.forEach(i => items.push({ cls: 'xchh-he', text: `天干 ${i.description}` }));
  xchh.tianGanChong.forEach(i => items.push({ cls: 'xchh-chong', text: `天干 ${i.description}` }));
  xchh.diZhiHe.forEach(i => items.push({ cls: 'xchh-he', text: `地支 ${i.description}` }));
  xchh.diZhiChong.forEach(i => items.push({ cls: 'xchh-chong', text: `地支 ${i.description}` }));
  xchh.diZhiHai.forEach(i => items.push({ cls: 'xchh-hai', text: `地支 ${i.description}` }));
  xchh.diZhiXing.forEach(i => items.push({ cls: 'xchh-xing', text: `地支 ${i.description}` }));
  xchh.sanHe.forEach(i => items.push({ cls: 'xchh-sanhe', text: `地支 ${i.description}` }));
  xchh.sanHui.forEach(i => items.push({ cls: 'xchh-sanhe', text: `地支 ${i.description}` }));

  const card = document.getElementById('xchh-card');
  const container = document.getElementById('xing-chong');

  if (items.length === 0) {
    card.style.display = 'none';
    return;
  }

  card.style.display = '';
  container.innerHTML = `
    <div class="xchh-list">
      ${items.map(i => `<div class="xchh-item ${i.cls}">${i.text}</div>`).join('')}
    </div>
  `;
}

function renderDaYun(result) {
  const dy = result.daYun;
  const currentYear = new Date().getFullYear();
  const GAN_WX = BaziEngine._constants.GAN_WU_XING;
  const ZHI_WX = BaziEngine._constants.ZHI_WU_XING;

  const container = document.getElementById('da-yun');
  container.innerHTML = `
    <div class="dayun-info">
      ${dy.direction} · 起运${dy.qiYunAge}岁（${dy.qiYunYear}年）
    </div>
    <div class="dayun-scroll">
      <div class="dayun-table">
        ${dy.daYunList.map(d => {
          const isCurrent = currentYear >= d.startYear && currentYear <= d.endYear;
          const ganWx = GAN_WX[d.gan];
          const zhiWx = ZHI_WX[d.zhi];
          return `
            <div class="dayun-item ${isCurrent ? 'current' : ''}">
              <div class="dayun-gan ${WX_CLASS[ganWx]}">${d.gan}</div>
              <div class="dayun-zhi ${WX_CLASS[zhiWx]}">${d.zhi}</div>
              <div class="dayun-age">${d.startAge}-${d.endAge}岁</div>
              <div class="dayun-year">${d.startYear}</div>
              ${isCurrent ? '<div class="dayun-current-label">当前</div>' : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// ========== 专业分析：格局判定 ==========
function renderGeJu(result) {
  const geJu = result.geJu;
  const container = document.getElementById('geju-content');

  let rationale = `月令${geJu.monthZhi}，藏干${geJu.cangGan.join('、')}`;
  if (geJu.touChu && geJu.touChu.length > 0) {
    rationale += `，透出${geJu.touChu.join('、')}`;
  } else {
    rationale += `，不透天干`;
  }
  rationale += `，故取<span style="color:var(--gold-light);font-weight:bold;">【${geJu.type}】</span>`;

  if (geJu.hidden) {
    rationale += '（以月令本气取格）';
  }

  const geJuExtra = {
    '建禄格': '日主得月令禄根，自身力量不弱，喜官杀制身、食伤泄秀为用。',
    '月刃格': '日主极旺，阳刃为凶物，喜官杀制刃，忌冲刃。',
    '正官格': '以正官立格，官星为贵气所钟，喜印护官、财生官。',
    '七杀格': '以七杀立格，杀为攻身之物，喜食神制杀或印星化杀。',
    '正财格': '以正财立格，财为养命之源，喜食伤生财、官星护财。',
    '偏财格': '以偏财立格，财路宽广，喜食伤生财、官星护财。',
    '正印格': '以正印立格，印为生身之本，喜官杀生印，忌财星坏印。',
    '偏印格': '以偏印立格，枭印夺食为忌，喜财星制枭。',
    '食神格': '以食神立格，食神主才华福气，喜生财，忌偏印来夺。',
    '伤官格': '以伤官立格，伤官主聪明叛逆，喜印制伤护官，或财星泄伤。'
  };
  const extra = geJuExtra[geJu.type] || '';

  container.innerHTML = `
    <div style="text-align:center;margin-bottom:10px;">
      <span class="geju-badge">${geJu.type}</span>
    </div>
    <div class="geju-rationale">
      <p>${rationale}</p>
      ${extra ? `<p style="margin-top:8px;">${extra}</p>` : ''}
    </div>
  `;
}

// ========== 专业分析：调候用神 ==========
const _WX_BEI_KE = { '木': '金', '火': '水', '土': '木', '金': '火', '水': '土' };
const _WX_SHENG = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };

function renderTiaoHou(result) {
  const tiaoHou = result.tiaoHou;
  const yongShen = result.yongShen;
  const container = document.getElementById('tiaohou-content');
  const GAN_WX = BaziEngine._constants.GAN_WU_XING;

  if (!tiaoHou) {
    container.innerHTML = '<div style="text-align:center;color:var(--text-dim);padding:12px;">此日主无需特殊调候</div>';
    return;
  }

  const mainGanList = tiaoHou.mainGan.split('').filter(g => g.trim());
  const auxGanList = tiaoHou.auxGan ? tiaoHou.auxGan.split('').filter(g => g.trim()) : [];

  const mainHtml = mainGanList.map(g =>
    `<span class="tiaohou-gan tiaohou-gan-main ${WX_CLASS[GAN_WX[g]]}">${g}（${GAN_WX[g]}）</span>`
  ).join('');

  const auxHtml = auxGanList.length > 0
    ? auxGanList.map(g =>
        `<span class="tiaohou-gan tiaohou-gan-aux ${WX_CLASS[GAN_WX[g]]}">${g}（${GAN_WX[g]}）</span>`
      ).join('')
    : '';

  const mainWx = yongShen && yongShen.mainYongShenWx ? yongShen.mainYongShenWx : tiaoHou.mainWx;
  const jiShen = _WX_BEI_KE[mainWx] || '';
  const chouShen = _WX_SHENG[mainWx] || '';

  container.innerHTML = `
    <div class="tiaohou-main">
      ${mainHtml}
    </div>
    ${auxHtml ? `<div style="text-align:center;margin-bottom:10px;display:flex;gap:6px;justify-content:center;flex-wrap:wrap;">${auxHtml}</div>` : ''}
    <div class="tiaohou-desc">
      日主生于${result.fourPillars.month.zhi}月，${tiaoHou.description}
    </div>
    <div class="tiaohou-ref">
      —— 参考《穷通宝鉴》
    </div>
    <div class="tiaohou-jishen">
      主用神：<span style="color:var(--gold-light);">${mainWx}</span>　忌神：${jiShen}（克制用神）　仇神：${chouShen}（泄耗用神）
    </div>
  `;
}

// ========== 专业分析：特殊组合 ==========
function renderSpecialCombinations(result) {
  const combos = result.specialCombinations;
  const container = document.getElementById('combos-content');

  if (!combos || combos.length === 0) {
    container.innerHTML = '<div style="text-align:center;color:var(--text-dim);padding:12px;">无特殊组合</div>';
    return;
  }

  const severityClass = { 'good': 'combo-good', 'medium': 'combo-medium', 'high': 'combo-high' };
  const severityIcon = { 'good': '✓', 'medium': '○', 'high': '⚠' };

  container.innerHTML = combos.map(c => `
    <div class="combo-tag ${severityClass[c.severity] || 'combo-medium'}">
      <div class="combo-name">${severityIcon[c.severity]} ${c.name}</div>
      <div class="combo-desc">${c.description}</div>
      ${c.solution ? `<div class="combo-solution">→ 化解：${c.solution}</div>` : ''}
    </div>
  `).join('');
}

// ========== 渲染分析报告（内联） ==========
function renderReportInline(result) {
  const report = BaziEngine.generateReport(result);
  const container = document.getElementById('report-content');
  const sections = report.split(/━━━ [一二三四五六七八九]、/);

  // 提取标题和内容
  const titleRe = /━━━ ([一二三四五六七八九])、(.+?) ━━━/g;
  const titles = [];
  let match;
  while ((match = titleRe.exec(report)) !== null) {
    titles.push({ num: match[1], title: match[2] });
  }

  const contents = sections.slice(1).map(s => {
    const endIdx = s.indexOf(' ━━━');
    const content = endIdx >= 0 ? s.substring(endIdx + 4).trim() : s.trim();
    return content
      .replace(/══+/g, '')
      .replace(/本报告.*$/gm, '')
      .replace(/深度解读.*$/gm, '')
      .trim();
  });

  container.innerHTML = titles.map((t, i) => `
    <div class="report-section ${i === 0 ? 'open' : ''}" onclick="toggleSection(this)">
      <div class="report-section-header">
        <span class="report-section-title">${t.num}、${t.title}</span>
        <span class="report-section-arrow">▼</span>
      </div>
      <div class="report-section-body">
        ${(contents[i] || '').split('\n').map(line => {
          line = line.trim();
          if (!line) return '<br>';
          return `<p>${line}</p>`;
        }).join('')}
      </div>
    </div>
  `).join('');
}

function toggleSection(el) {
  el.classList.toggle('open');
}

// ========== 启动 ==========
document.addEventListener('DOMContentLoaded', initForm);
