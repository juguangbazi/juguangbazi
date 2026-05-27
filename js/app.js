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

  // 神煞
  renderShenSha(result);

  // 格局
  renderGeJu(result);

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

let _selectedDaYunIdx = null;

function renderDaYun(result) {
  const dy = result.daYun;
  const currentYear = new Date().getFullYear();
  const GAN_WX = BaziEngine._constants.GAN_WU_XING;
  const ZHI_WX = BaziEngine._constants.ZHI_WU_XING;

  // 默认选中当前所在大运
  if (_selectedDaYunIdx === null) {
    _selectedDaYunIdx = dy.daYunList.findIndex(d => currentYear >= d.startYear && currentYear <= d.endYear);
    if (_selectedDaYunIdx < 0) _selectedDaYunIdx = 0;
  }

  const container = document.getElementById('da-yun');
  container.innerHTML = `
    <div class="dayun-info">
      ${dy.direction} · 起运${dy.qiYunAge}岁（${dy.qiYunYear}年）
      <span style="font-size:11px;color:var(--text-dim);"> （点击大运查看流年）</span>
    </div>
    <div class="dayun-scroll">
      <div class="dayun-table">
        ${dy.daYunList.map((d, i) => {
          const isCurrent = currentYear >= d.startYear && currentYear <= d.endYear;
          const isSelected = i === _selectedDaYunIdx;
          const ganWx = GAN_WX[d.gan];
          const zhiWx = ZHI_WX[d.zhi];
          let cls = '';
          if (isCurrent) cls += ' current';
          if (isSelected) cls += ' selected';
          return `
            <div class="dayun-item${cls}" onclick="selectDaYun(${i})">
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
    <div id="liunian-area"></div>
  `;

  // 渲染选中大运的流年
  renderLiuNianSelector(dy.daYunList[_selectedDaYunIdx], currentYear);
}

function selectDaYun(idx) {
  _selectedDaYunIdx = idx;
  renderDaYun(currentResult);
}

function renderLiuNianSelector(daYunPeriod, currentYear) {
  const area = document.getElementById('liunian-area');
  if (!area || !daYunPeriod) return;

  const GAN_WX = BaziEngine._constants.GAN_WU_XING;
  const years = daYunPeriod.liuNian;

  // 分组显示流年按钮：每5年一组
  const startYear = years[0].year;
  const endYear = years[years.length - 1].year;
  const groups = [];
  for (let y = startYear; y <= endYear; y += 5) {
    groups.push(years.filter(ln => ln.year >= y && ln.year < y + 5));
  }

  area.innerHTML = `
    <div class="liunian-block">
      <div class="liunian-info">${daYunPeriod.ganZhi}运 · 流年选择</div>
      <div class="liunian-groups">
        ${groups.map(group => `
          <div class="liunian-row">
            ${group.map(ln => {
              const isCurrentYr = ln.year === currentYear;
              const ganWx = GAN_WX[ln.gan];
              return `
                <button class="liunian-btn ${isCurrentYr ? 'liunian-current' : ''}" onclick="selectLiuNian(${ln.year})">
                  <span class="liunian-yr">${ln.year}</span>
                  <span class="liunian-gz ${WX_CLASS[ganWx]}">${ln.ganZhi}</span>
                </button>
              `;
            }).join('')}
          </div>
        `).join('')}
      </div>
      <div id="liunian-detail" class="liunian-detail"></div>
    </div>
  `;
}

function selectLiuNian(year) {
  const dy = currentResult.daYun;
  const sel = dy.daYunList[_selectedDaYunIdx];
  if (!sel) return;

  const ln = sel.liuNian.find(l => l.year === year);
  if (!ln) return;

  // 高亮当前选中的流年按钮
  document.querySelectorAll('.liunian-btn').forEach(b => b.classList.remove('liunian-active'));
  const target = document.querySelector(`.liunian-btn[onclick="selectLiuNian(${year})"]`);
  if (target) target.classList.add('liunian-active');

  // 生成分析
  const fp = currentResult.fourPillars;
  const ds = currentResult.dayStrength;
  const analysis = BaziEngine.analyzeLiuNian(fp.day.gan, BaziEngine._constants.GAN_WU_XING[fp.day.gan], ds.strength, ln, sel);
  const GAN_WX = BaziEngine._constants.GAN_WU_XING;
  const ZHI_WX = BaziEngine._constants.ZHI_WU_XING;
  const ZHI_CANG_GAN = BaziEngine._constants.ZHI_CANG_GAN;

  const detail = document.getElementById('liunian-detail');
  detail.innerHTML = `
    <div class="liunian-detail-card">
      <div class="liunian-detail-header">
        <span>${ln.year}年</span>
        <span class="liunian-detail-gz">
          <span class="${WX_CLASS[GAN_WX[ln.gan]]}">${ln.gan}</span>
          <span class="${WX_CLASS[ZHI_WX[ln.zhi]]}">${ln.zhi}</span>
        </span>
        <span class="liunian-detail-nayin">${ln.naYin || ''}</span>
      </div>
      <div class="liunian-detail-body">
        <p>${analysis}</p>
      </div>
      ${ln.zhi ? `
      <div class="liunian-detail-cang">
        <span style="color:var(--text-dim);">地支藏干：</span>
        ${(ZHI_CANG_GAN[ln.zhi] || []).map(g => `<span class="${WX_CLASS[GAN_WX[g]]}">${g}(${GAN_WX[g]})</span>`).join(' · ')}
      </div>
      ` : ''}
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
