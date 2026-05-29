// ========== 页面切换 ==========
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  window.scrollTo(0, 0);
}

// ========== 五行颜色映射 ==========
var WX_CLASS = { '木': 'wx-wood', '火': 'wx-fire', '土': 'wx-earth', '金': 'wx-metal', '水': 'wx-water' };
var WX_COLOR = { '木': '#4CAF50', '火': '#F44336', '土': '#d4a852', '金': '#E0E0E0', '水': '#2196F3' };

// ========== 滴天髓十天干论述 ==========
var DI_TIAN_SUI = {
  '甲': '甲木參天，脫胎要火。春不容金，秋不容土。火熾乘龍，水宕騎虎。地潤天和，植立千古。',
  '乙': '乙木雖柔，刲羊解牛。懷丁抱丙，跨鳳乘猴。虛濕之地，騎馬亦憂。藤蘿繫甲，可春可秋。',
  '丙': '丙火猛烈，欺霜侮雪。能煅庚金，逢辛反怯。土眾成慈，水猖顯節。虎馬犬鄉，甲來焚滅。',
  '丁': '丁火柔中，內性昭融。抱乙而孝，合壬而忠。旺而不烈，衰而不窮。如有嫡母，可秋可冬。',
  '戊': '戊土固重，既中且正。靜翕動闢，萬物司命。水潤物生，火燥物病。若在艮坤，怕沖宜靜。',
  '己': '己土卑濕，中正蓄藏。不愁木盛，不畏水狂。火少火晦，金多金光。若要物旺，宜助宜幫。',
  '庚': '庚金帶煞，剛健為最。得水而清，得火而銳。土潤則生，土乾則脆。能贏甲兄，輸於乙妹。',
  '辛': '辛金軟弱，溫潤而清。畏土之疊，樂水之盈。能扶社稷，能救生靈。熱則喜母，寒則喜丁。',
  '壬': '壬水通河，能洩金氣。剛中之德，周流不滯。通根透癸，沖天奔地。化則有情，從則相濟。',
  '癸': '癸水至弱，達於天津。得龍而運，功化斯神。不愁火土，不論庚辛。合戊見火，化象斯真。'
};

// ========== 农历数据（用于显示） ==========
var LUNAR_MONTH_NAMES = ['正','二','三','四','五','六','七','八','九','十','冬','腊'];
var LUNAR_DAY_NAMES = [
  '初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
  '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
  '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'
];

// ========== 输入弹窗状态 ==========
var _kpBuffer = '';
var _kpSnapshot = {};  // 打开弹窗时的快照，用于取消时恢复

// 将实际小时(0-23)映射到时辰对应的隐藏select值(0,1,3,5,...)
function hourToSelectVal(h) {
  if (h === 0 || h === 23) return 0;   // 子時
  return ((h - 1) >> 1) * 2 + 1;
}

// 将实际小时(0-23)映射到地支索引(0=子...11=亥)
function hourToZhiIndex(h) {
  if (h >= 23 || h < 1) return 0;      // 子
  if (h < 3) return 1;                   // 丑
  if (h < 5) return 2;                   // 寅
  if (h < 7) return 3;                   // 卯
  if (h < 9) return 4;                   // 辰
  if (h < 11) return 5;                  // 巳
  if (h < 13) return 6;                  // 午
  if (h < 15) return 7;                  // 未
  if (h < 17) return 8;                  // 申
  if (h < 19) return 9;                  // 酉
  if (h < 21) return 10;                 // 戌
  return 11;                              // 亥
}

// 根据年月刷新日期下拉选项（全局可用）
function updateDayOptions() {
  var yearSel = document.getElementById('birth-year');
  var monthSel = document.getElementById('birth-month');
  var daySel = document.getElementById('birth-day');
  if (!yearSel || !monthSel || !daySel) return;
  var y = parseInt(yearSel.value);
  var m = parseInt(monthSel.value);
  if (isNaN(y) || isNaN(m)) return;
  var days = new Date(y, m, 0).getDate();
  var curDay = parseInt(daySel.value) || 1;
  daySel.innerHTML = '';
  for (var d = 1; d <= days; d++) {
    var opt = document.createElement('option');
    opt.value = d;
    opt.textContent = d;
    if (d === curDay || (curDay > days && d === days)) opt.selected = true;
    daySel.appendChild(opt);
  }
}

// ========== 初始化表单 ==========
function initForm() {
  var yearSel = document.getElementById('birth-year');
  var monthSel = document.getElementById('birth-month');
  var daySel = document.getElementById('birth-day');
  var now = new Date();
  var currentYear = now.getFullYear();
  var currentMonth = now.getMonth() + 1;
  var currentDay = now.getDate();
  var currentHour = now.getHours();

  // 填充年份，默认选中当前年
  for (var y = currentYear; y >= 1940; y--) {
    var opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    if (y === currentYear) opt.selected = true;
    yearSel.appendChild(opt);
  }

  // 填充月份，默认选中当前月
  for (var m = 1; m <= 12; m++) {
    var opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    if (m === currentMonth) opt.selected = true;
    monthSel.appendChild(opt);
  }

  updateDayOptions();

  // 设置默认日（当天）
  var dayOpts = daySel.querySelectorAll('option');
  for (var i = 0; i < dayOpts.length; i++) {
    if (parseInt(dayOpts[i].value) === currentDay) { dayOpts[i].selected = true; break; }
  }

  // 设置默认时辰（当前时刻对应的时辰）
  var hourSel = document.getElementById('birth-hour');
  if (hourSel) hourSel.value = hourToSelectVal(currentHour);

  // 初始化显示
  updatePlineDisplay();
  updateDateDisplay();

  // 性别切换
  document.querySelectorAll('.seg-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.seg-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
    });
  });

  // ---- 弹窗事件 ----

  // 打开弹窗
  document.getElementById('btn-open-picker').addEventListener('click', function() {
    _kpBuffer = '';
    _kpSnapshot = {
      year: document.getElementById('birth-year').value,
      month: document.getElementById('birth-month').value,
      day: document.getElementById('birth-day').value,
      hour: document.getElementById('birth-hour').value
    };
    updateBufferDisplay();
    updatePlineDisplay();
    document.getElementById('time-picker-overlay').classList.add('show');
  });

  // 关闭弹窗
  function closePicker() {
    document.getElementById('time-picker-overlay').classList.remove('show');
  }

  // 取消 — 恢复快照
  document.getElementById('picker-cancel').addEventListener('click', function() {
    document.getElementById('birth-year').value = _kpSnapshot.year;
    document.getElementById('birth-month').value = _kpSnapshot.month;
    document.getElementById('birth-day').value = _kpSnapshot.day;
    document.getElementById('birth-hour').value = _kpSnapshot.hour;
    updateDayOptions();
    updatePlineDisplay();
    updateDateDisplay();
    closePicker();
  });

  // 确定
  document.getElementById('picker-confirm').addEventListener('click', function() {
    // 把当前缓冲内容也尝试提交（如果还没按对应的行按钮）
    updateDayOptions();
    updateDateDisplay();
    closePicker();
  });

  // 遮罩关闭 = 取消
  document.getElementById('time-picker-overlay').addEventListener('click', function(e) {
    if (e.target === this) {
      document.getElementById('birth-year').value = _kpSnapshot.year;
      document.getElementById('birth-month').value = _kpSnapshot.month;
      document.getElementById('birth-day').value = _kpSnapshot.day;
      document.getElementById('birth-hour').value = _kpSnapshot.hour;
      updateDayOptions();
      updatePlineDisplay();
      updateDateDisplay();
      closePicker();
    }
  });

  // ---- 数字键盘 ----
  document.querySelectorAll('.kp-num').forEach(function(btn) {
    btn.addEventListener('click', function() {
      _kpBuffer += btn.dataset.key;
      updateBufferDisplay();
    });
  });

  // 清除按钮
  document.getElementById('kp-clear').addEventListener('click', function() {
    _kpBuffer = '';
    updateBufferDisplay();
  });

  // ---- 行按钮（年/月/日/時/分） ----
  document.querySelectorAll('.pline-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var field = btn.dataset.field;
      var val = parseInt(_kpBuffer);
      if (isNaN(val) || _kpBuffer === '') return;
      var yearSel = document.getElementById('birth-year');
      var monthSel = document.getElementById('birth-month');
      var daySel = document.getElementById('birth-day');
      var hourSel = document.getElementById('birth-hour');

      if (field === 'year') {
        if (val >= 1940 && val <= new Date().getFullYear()) {
          yearSel.value = val;
          updateDayOptions();
        }
      } else if (field === 'month') {
        if (val >= 1 && val <= 12) {
          monthSel.value = val;
          updateDayOptions();
        }
      } else if (field === 'day') {
        var maxDay = new Date(parseInt(yearSel.value), parseInt(monthSel.value), 0).getDate();
        if (val >= 1 && val <= maxDay) {
          daySel.value = val;
        }
      } else if (field === 'hour') {
        if (val >= 0 && val <= 23) {
          hourSel.value = hourToSelectVal(val);
        }
      } else if (field === 'minute') {
        if (val >= 0 && val <= 59) {
          var displayEl = document.getElementById('pline-minute');
          if (displayEl) displayEl.textContent = val + '分';
        }
      }

      _kpBuffer = '';
      updateBufferDisplay();
      updatePlineDisplay();
    });
  });

  // ---- 公历/农历切换 ----
  document.querySelectorAll('.pcal-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.pcal-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      // TODO: 农历模式（当前保持公历逻辑）
    });
  });

  // 重置时间
  document.getElementById('btn-reset-time').addEventListener('click', function() {
    var now = new Date();
    document.getElementById('birth-year').value = now.getFullYear();
    document.getElementById('birth-month').value = now.getMonth() + 1;
    updateDayOptions();
    document.getElementById('birth-day').value = now.getDate();
    document.getElementById('birth-hour').value = '';
    updatePlineDisplay();
    updateDateDisplay();
  });

  // 保存记录 (nav bar)
  document.getElementById('nav-save').addEventListener('click', function() {
    var surname = (document.getElementById('surname').value || '').trim();
    var givenname = (document.getElementById('givenname').value || '').trim();
    var name = (surname + givenname) || '未命名';
    var year = document.getElementById('birth-year').value;
    var month = document.getElementById('birth-month').value;
    var day = document.getElementById('birth-day').value;
    var hour = document.getElementById('birth-hour').value;
    var gender = document.querySelector('.seg-btn.active').dataset.gender;
    var note = document.getElementById('birth-note').value.trim();

    if (!year || !month || !day || (!hour && hour !== '0')) {
      alert('請先完善出生時間資訊');
      return;
    }

    var record = {
      id: Date.now(),
      name: name,
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
      hour: parseInt(hour),
      gender: gender,
      note: note,
      savedAt: new Date().toLocaleString('zh-CN')
    };

    var records = JSON.parse(localStorage.getItem('bazi_records') || '[]');
    records.unshift(record);
    // 最多保留 50 条
    if (records.length > 50) records = records.slice(0, 50);
    localStorage.setItem('bazi_records', JSON.stringify(records));
    alert('已保存「' + name + '」的記錄');
  });

  // 计算命盘 (nav bar)
  document.getElementById('nav-calc').addEventListener('click', doPaipan);

  // Tab 切换
  var tabTitles = {
    'tab-basic': '基本',
    'tab-chart': '命盤信息',
    'tab-detail': '細盤信息',
    'tab-dayun': '大運',
    'tab-liunian': '流年',
    'tab-tips': '提示'
  };
  document.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
      document.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
      var titleEl = document.getElementById('result-header-title');
      var tabTitle = tabTitles[btn.dataset.tab] || '';
      if (titleEl && tabTitle && currentResult) {
        titleEl.textContent = (currentResult._name || '') + ' ' + tabTitle;
      }
    });
  });

  // ---- 保存记录列表页（數據按钮） ----
  var funcItems = document.querySelectorAll('.func-item');
  if (funcItems.length > 0) {
    funcItems[0].addEventListener('click', function() {
      showPage('records');
      renderRecordsPageList();
    });
  }

  initRecordsPage();

  // 初始化四柱输入弹窗
  initSizhuPicker();
}

// ========== 输入缓冲显示 ==========
function updateBufferDisplay() {
  var el = document.getElementById('picker-buffer');
  if (el) el.textContent = _kpBuffer || '—';
}

// ========== 弹窗内五行行显示 ==========
function updatePlineDisplay() {
  var y = document.getElementById('birth-year').value;
  var m = document.getElementById('birth-month').value;
  var d = document.getElementById('birth-day').value;
  var h = document.getElementById('birth-hour').value;

  var elY = document.getElementById('pline-year');
  var elM = document.getElementById('pline-month');
  var elD = document.getElementById('pline-day');
  var elH = document.getElementById('pline-hour');

  if (elY) elY.textContent = (y ? y + '年' : '—');
  if (elM) elM.textContent = (m ? m + '月' : '—');
  if (elD) elD.textContent = (d ? d + '日' : '—');
  if (elH) elH.textContent = (h || h === '0') ? h + '時' : '—';
}

// ========== 更新西曆/農曆显示 ==========
function updateDateDisplay() {
  var year = parseInt(document.getElementById('birth-year').value);
  var month = parseInt(document.getElementById('birth-month').value);
  var day = parseInt(document.getElementById('birth-day').value);
  var hourStr = document.getElementById('birth-hour').value;
  var hour = (hourStr || hourStr === '0') ? parseInt(hourStr) : -1;

  // 西曆显示
  var timeText = hour >= 0 ? hour + '時' : '—時';
  var solarText = year + '年' + month + '月' + day + '日 ' + timeText;
  document.getElementById('solar-display').textContent = solarText;

  // 農曆显示
  if (year && month && day && BaziEngine && BaziEngine.solarToLunar) {
    try {
      var lunar = BaziEngine.solarToLunar(year, month, day);
      var DIGITS = ['零','一','二','三','四','五','六','七','八','九'];
      var yStr = String(lunar.year);
      var lYearStr = yStr.split('').map(function(c) { return DIGITS[parseInt(c)]; }).join('') + '年';
      var lMonthStr = (lunar.isLeap ? '閏' : '') + LUNAR_MONTH_NAMES[lunar.month - 1] + '月';
      var lDayStr = LUNAR_DAY_NAMES[lunar.day - 1];
      var HOUR_ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
      var lTimeStr = hour >= 0 ? HOUR_ZHI[hourToZhiIndex(hour)] + '時' : '';
      document.getElementById('lunar-display').textContent = lYearStr + ' ' + lMonthStr + ' ' + lDayStr + ' ' + lTimeStr;
    } catch(e) {
      document.getElementById('lunar-display').textContent = '—';
    }
  }
}

// ========== 四柱输入弹窗 ==========
var _szSelected = {
  year: { gan: '甲', zhi: '子' },
  month: { gan: '甲', zhi: '子' },
  day: { gan: '甲', zhi: '子' },
  hour: { gan: '甲', zhi: '子' }
};
var _szSearchResults = [];

function initSizhuPicker() {
  var TIAN_GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  var DI_ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  var PILLARS = ['year', 'month', 'day', 'hour'];

  // 构建轮盘选项（仅显示当前选中项，左右滑动切换）
  function buildWheel(wheelId, items, selectedVal) {
    var wheel = document.getElementById(wheelId);
    if (!wheel) return;
    var inner = wheel.querySelector('.sz-wheel-inner');
    if (!inner) return;
    inner.innerHTML = '';
    for (var i = 0; i < items.length; i++) {
      var div = document.createElement('div');
      div.className = 'sz-wheel-item' + (items[i] === selectedVal ? ' selected' : '');
      div.textContent = items[i];
      div.dataset.value = items[i];
      div.dataset.idx = i;
      inner.appendChild(div);
    }

    // 左右滑动切换
    var startX = 0;
    wheel.addEventListener('touchstart', function(e) {
      startX = e.touches[0].clientX;
    }, {passive: true});
    wheel.addEventListener('touchend', function(e) {
      var endX = e.changedTouches[0].clientX;
      var diff = endX - startX;
      if (Math.abs(diff) < 20) return; // 忽略短滑动
      var allItems = inner.querySelectorAll('.sz-wheel-item');
      var curIdx = 0;
      for (var i = 0; i < allItems.length; i++) {
        if (allItems[i].classList.contains('selected')) { curIdx = i; break; }
      }
      var nextIdx;
      if (diff > 0) {
        // 右滑 → 上一个
        nextIdx = curIdx <= 0 ? allItems.length - 1 : curIdx - 1;
      } else {
        // 左滑 → 下一个
        nextIdx = (curIdx + 1) % allItems.length;
      }
      allItems[curIdx].classList.remove('selected');
      allItems[nextIdx].classList.add('selected');
      updateSzSelection();
      updateSzDisplay();
    });
  }

  function updateWheelSelection(wheel, inner, items) {
    // 不再需要滚动检测，保留函数签名兼容
  }

  function updateSzSelection() {
    var wheels = document.querySelectorAll('.sz-wheel');
    wheels.forEach(function(w) {
      var sel = w.querySelector('.sz-wheel-item.selected');
      if (!sel) return;
      var id = w.id; // e.g. "sz-wheel-year-gan"
      var parts = id.replace('sz-wheel-', '').split('-'); // ['year', 'gan']
      var pillar = parts[0];
      var type = parts[1];
      if (_szSelected[pillar]) {
        _szSelected[pillar][type] = sel.dataset.value;
      }
    });
  }

  function updateSzDisplay() {
    var order = ['year', 'month', 'day', 'hour'];
    var dispEl = document.getElementById('sizhu-display');
    if (!dispEl) return;
    var spans = dispEl.querySelectorAll('span');
    for (var i = 0; i < order.length; i++) {
      var p = _szSelected[order[i]];
      if (spans[i]) spans[i].textContent = p.gan + p.zhi;
    }
  }

  // 构建所有8个轮盘
  PILLARS.forEach(function(pillar) {
    buildWheel('sz-wheel-' + pillar + '-gan', TIAN_GAN, _szSelected[pillar].gan);
    buildWheel('sz-wheel-' + pillar + '-zhi', DI_ZHI, _szSelected[pillar].zhi);
  });

  // 柱标签切换
  document.querySelectorAll('.sizhu-ptab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.sizhu-ptab').forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
    });
  });

  // 打开四柱弹窗（从时间弹窗底栏切换）
  function openSizhuPicker() {
    document.getElementById('time-picker-overlay').classList.remove('show');
    document.getElementById('sizhu-picker-overlay').classList.add('show');
    // 更新底栏激活态
    document.querySelectorAll('#sizhu-picker-overlay .pmode-item').forEach(function(it) {
      it.classList.toggle('active', it.dataset.mode === 'sizhu');
    });
    updateSzDisplay();
    // 清空搜索结果
    _szSearchResults = [];
    var resEl = document.getElementById('sizhu-results');
    if (resEl) resEl.innerHTML = '<div class="sizhu-results-empty">輸入四柱後點擊查找</div>';
  }

  function openTimePicker() {
    document.getElementById('sizhu-picker-overlay').classList.remove('show');
    document.getElementById('time-picker-overlay').classList.add('show');
    // 更新底栏激活态
    document.querySelectorAll('#time-picker-overlay .pmode-item').forEach(function(it) {
      it.classList.toggle('active', it.dataset.mode === 'time');
    });
  }

  // 时间弹窗底栏切换到四柱输入
  document.querySelectorAll('#time-picker-overlay .pmode-item').forEach(function(item) {
    item.addEventListener('click', function() {
      if (item.dataset.mode === 'sizhu') {
        openSizhuPicker();
      }
    });
  });

  // 四柱弹窗底栏切换到时间输入
  document.querySelectorAll('#sizhu-picker-overlay .pmode-item').forEach(function(item) {
    item.addEventListener('click', function() {
      if (item.dataset.mode === 'time') {
        openTimePicker();
      }
    });
  });

  // 查找按钮
  document.getElementById('sizhu-search-btn').addEventListener('click', function() {
    if (!BaziEngine || !BaziEngine.searchByPillars) {
      alert('引擎不支持四柱反查功能');
      return;
    }
    var resEl = document.getElementById('sizhu-results');
    if (resEl) resEl.innerHTML = '<div class="sizhu-results-empty">查找中...</div>';

    setTimeout(function() {
      _szSearchResults = BaziEngine.searchByPillars(
        _szSelected.year.gan, _szSelected.year.zhi,
        _szSelected.month.gan, _szSelected.month.zhi,
        _szSelected.day.gan, _szSelected.day.zhi,
        _szSelected.hour.gan, _szSelected.hour.zhi
      );

      if (!resEl) return;
      if (_szSearchResults.length === 0) {
        resEl.innerHTML = '<div class="sizhu-results-empty">未找到匹配日期</div>';
        return;
      }
      resEl.innerHTML = _szSearchResults.map(function(r, idx) {
        var fp = r.fourPillars;
        return '<div class="sizhu-result-item" data-idx="' + idx + '">' +
          '<span class="szr-date">' + r.year + '/' + r.month + '/' + r.day + ' ' + r.hour + '時</span>' +
          '<span class="szr-pillars">' + fp.year.ganZhi + ' ' + fp.month.ganZhi + ' ' + fp.day.ganZhi + ' ' + fp.hour.ganZhi + '</span>' +
          '<span class="szr-select">選取</span>' +
          '</div>';
      }).join('');

      // 结果点击事件
      resEl.querySelectorAll('.sizhu-result-item').forEach(function(item) {
        item.addEventListener('click', function() {
          var idx = parseInt(item.dataset.idx);
          var r = _szSearchResults[idx];
          document.getElementById('birth-year').value = r.year;
          document.getElementById('birth-month').value = r.month;
          document.getElementById('birth-day').value = r.day;
          document.getElementById('birth-hour').value = r.hour;
          // 更新日选项
          updateDayOptions();
          updatePlineDisplay();
          updateDateDisplay();
          document.getElementById('sizhu-picker-overlay').classList.remove('show');
        });
      });
    }, 50);
  });

  // 确定
  document.getElementById('sizhu-confirm').addEventListener('click', function() {
    document.getElementById('sizhu-picker-overlay').classList.remove('show');
  });

  // 取消
  document.getElementById('sizhu-cancel').addEventListener('click', function() {
    document.getElementById('sizhu-picker-overlay').classList.remove('show');
  });

  // 遮罩关闭
  document.getElementById('sizhu-picker-overlay').addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.remove('show');
    }
  });
}

// ========== 排盘 ==========
var currentResult = null;
var _selectedDaYunIdx = null;
var _selectedXiaoYunIdx = undefined;

function doPaipan() {
  if (typeof BaziEngine === 'undefined' || !BaziEngine.paipan) {
    alert('引擎載入失敗，請刷新頁面');
    return;
  }

  var year = parseInt(document.getElementById('birth-year').value);
  var month = parseInt(document.getElementById('birth-month').value);
  var day = parseInt(document.getElementById('birth-day').value);
  var hourStr = document.getElementById('birth-hour').value;
  var gender = document.querySelector('.seg-btn.active').dataset.gender;

  // 合并姓名
  var surname = (document.getElementById('surname').value || '').trim();
  var givenname = (document.getElementById('givenname').value || '').trim();
  var name = (surname + givenname) || '';

  if (!hourStr && hourStr !== '0') {
    alert('請選擇出生時辰');
    return;
  }

  var hour = parseInt(hourStr);

  try {
    currentResult = BaziEngine.paipan(year, month, day, hour, gender);
    currentResult._name = name;
    _selectedDaYunIdx = null;

    renderResult(currentResult);
    showPage('result');
  } catch (e) {
    alert('排盤出錯：' + e.message);
    console.error(e);
  }
}

// ========== 客户记录管理 ==========
var _selectedRecordIdx = -1;

function getRecords() {
  try {
    return JSON.parse(localStorage.getItem('bazi_records') || '[]');
  } catch(e) {
    return [];
  }
}

function saveRecords(records) {
  try {
    localStorage.setItem('bazi_records', JSON.stringify(records));
  } catch(e) {}
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;');
}

function fillFormFromRecord(r) {
  document.getElementById('birth-year').value = r.year;
  document.getElementById('birth-month').value = r.month;
  document.getElementById('birth-day').value = r.day;
  document.getElementById('birth-hour').value = r.hour;

  if (r.name) {
    var nameParts = r.name.match(/^(.{1,5})?(.{0,10})?$/);
    document.getElementById('surname').value = (nameParts && nameParts[1]) ? nameParts[1] : r.name;
    document.getElementById('givenname').value = (nameParts && nameParts[2]) ? nameParts[2] : '';
  }

  document.querySelectorAll('.seg-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.gender === r.gender);
  });

  if (document.getElementById('birth-note')) {
    document.getElementById('birth-note').value = r.note || '';
  }

  updateDayOptions();
  updatePlineDisplay();
  updateDateDisplay();
}

// ========== 保存记录列表页 ==========
function initRecordsPage() {
  // 返回
  document.getElementById('records-back').addEventListener('click', function() {
    _selectedRecordIdx = -1;
    document.getElementById('records-search').value = '';
    showPage('input');
  });

  // 取消（清空搜索和选择）
  document.getElementById('records-cancel').addEventListener('click', function() {
    _selectedRecordIdx = -1;
    document.getElementById('records-search').value = '';
    renderRecordsPageList();
  });

  // 搜索
  document.getElementById('records-search').addEventListener('input', function() {
    _selectedRecordIdx = -1;
    renderRecordsPageList(this.value.trim());
  });

  // 計算命盤
  document.getElementById('records-calc').addEventListener('click', function() {
    if (_selectedRecordIdx < 0) {
      alert('請先選擇一條記錄');
      return;
    }
    var records = getRecords();
    var r = records[_selectedRecordIdx];
    if (!r) return;
    fillFormFromRecord(r);

    var surname = (document.getElementById('surname').value || '').trim();
    var givenname = (document.getElementById('givenname').value || '').trim();
    var name = (surname + givenname) || '';
    currentResult = BaziEngine.paipan(r.year, r.month, r.day, r.hour, r.gender);
    currentResult._name = name;
    _selectedDaYunIdx = null;
    _selectedLiuNianYear = null;
    renderResult(currentResult);
    showPage('result');
  });

  // 刪除
  document.getElementById('records-delete').addEventListener('click', function() {
    if (_selectedRecordIdx < 0) {
      alert('請先選擇一條記錄');
      return;
    }
    if (!confirm('確定刪除該記錄？')) return;
    var records = getRecords();
    records.splice(_selectedRecordIdx, 1);
    saveRecords(records);
    _selectedRecordIdx = -1;
    renderRecordsPageList();
  });
}

function renderRecordsPageList(filter) {
  var container = document.getElementById('records-page-list');
  var wrap = document.getElementById('records-list-wrap');
  var bottomBar = document.getElementById('records-bottom-bar');
  var bottomEmpty = document.getElementById('records-bottom-empty');
  if (!container) return;

  var records = getRecords();
  var keyword = (filter || '').toLowerCase();

  // 过滤
  var filtered = records;
  if (keyword) {
    filtered = records.filter(function(r) {
      var name = (r.name || '').toLowerCase();
      var dateStr = r.year + '年' + r.month + '月' + r.day + '日 ' + r.hour + '時';
      return name.indexOf(keyword) >= 0 || dateStr.indexOf(keyword) >= 0;
    });
  }

  if (records.length === 0) {
    container.innerHTML = '<div class="records-page-empty">尚無保存記錄<br><span style="font-size:12px;">在輸入頁點擊「保存記錄」即可保存</span></div>';
    if (bottomBar) bottomBar.style.display = 'none';
    if (bottomEmpty) bottomEmpty.style.display = 'block';
    return;
  }

  if (filtered.length === 0) {
    container.innerHTML = '<div class="records-page-empty">無匹配記錄</div>';
    if (bottomBar) bottomBar.style.display = 'none';
    if (bottomEmpty) bottomEmpty.style.display = 'block';
    return;
  }

  if (bottomBar) bottomBar.style.display = 'flex';
  if (bottomEmpty) bottomEmpty.style.display = 'none';

  container.innerHTML = filtered.map(function(r) {
    // 在原始 records 数组中查找索引
    var origIdx = records.indexOf(r);
    var selClass = origIdx === _selectedRecordIdx ? ' selected' : '';
    return '<div class="records-page-item' + selClass + '" data-idx="' + origIdx + '">' +
      '<div class="records-page-item-info">' +
      '<div class="records-page-item-name">' + escapeHtml(r.name) + ' [' + r.gender + ']</div>' +
      '<div class="records-page-item-date">' + r.year + '年' + r.month + '月' + r.day + '日 ' + r.hour + '時</div>' +
      '</div>' +
      '<div class="records-page-item-check"></div>' +
      '</div>';
  }).join('');

  // 点击选择
  container.querySelectorAll('.records-page-item').forEach(function(item) {
    item.addEventListener('click', function() {
      var idx = parseInt(item.dataset.idx);
      if (_selectedRecordIdx === idx) {
        // 取消选择
        _selectedRecordIdx = -1;
      } else {
        _selectedRecordIdx = idx;
      }
      // 重新渲染以更新选中态
      container.querySelectorAll('.records-page-item').forEach(function(el) {
        var elIdx = parseInt(el.dataset.idx);
        el.classList.toggle('selected', elIdx === _selectedRecordIdx);
      });
    });
  });
}

// ========== 渲染入口 ==========
function renderResult(result) {
  document.getElementById('result-header-title').textContent = (result._name || '') + ' 命盤信息';
  renderTabBasic(result);
  renderTabChart(result);
  renderTabDetail(result);
  renderTabTips(result);
}

// ==================== Tab 1: 基本 ====================
function renderTabBasic(result) {
  var bi = result.birthInfo;
  var fp = result.fourPillars;
  var lun = result.lunarDate;

  // 性别标识: 陰/陽 + 乾造/坤造
  var yearGanYY = ({'甲':1,'乙':-1,'丙':1,'丁':-1,'戊':1,'己':-1,'庚':1,'辛':-1,'壬':1,'癸':-1})[fp.year.gan] || 0;
  var yyPrefix = yearGanYY > 0 ? '陽' : '陰';
  var qianKun = bi.gender === '男' ? '乾造' : '坤造';
  var genderLabel = yyPrefix + qianKun;

  var name = result._name || '';

  // 生肖
  var zodiacAnimal = getZodiacAnimal(fp.year.zhi);

  // 农历显示
  var DIGITS = ['零','一','二','三','四','五','六','七','八','九'];
  var lunarYearStr = String(lun.year).split('').map(function(c) { return DIGITS[parseInt(c)]; }).join('');
  var LUNAR_MONTHS = ['正','二','三','四','五','六','七','八','九','十','冬','腊'];
  var LUNAR_DAYS = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];
  var lunarMonthStr = (lun.isLeap ? '閏' : '') + LUNAR_MONTHS[lun.month - 1] + '月';
  var lunarDayStr = LUNAR_DAYS[lun.day - 1] || '';
  var HOUR_ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  var hourZhi = HOUR_ZHI[hourToZhiIndex(bi.hour)];

  // 星座
  var zodiacSign = getZodiacSign(bi.month, bi.day);
  var zodiacEn = getZodiacEn(bi.month, bi.day);

  // 星宿方向
  var xiuDir = getXiuDirection(result.riXiu);

  // 空亡
  var yearKW = result.yearKongWang ? result.yearKongWang.desc.replace('空','') : '';
  var dayKW = result.kongWang ? result.kongWang.desc.replace('空','') : '';
  var kongWangStr = (yearKW && dayKW) ? yearKW + ' ' + dayKW : (yearKW || dayKW || '');

  // 命宫等 + 纳音
  var palaces = [
    { label: '命宮', val: result.mingGong },
    { label: '胎元', val: result.taiYuan },
    { label: '胎息', val: result.taiXi },
    { label: '身宮', val: result.shenGong }
  ];

  // 用神忌神
  var yongShen = result.yongShen;
  var jiShen = result.yongShen ? (result.yongShen.jiShenWx || []) : [];
  var jiShenStr = jiShen.length > 0 ? jiShen.join(' ') : '—';

  // 强弱分数
  var ds = result.dayStrength;
  var strengthScore = ds.score || 0;
  var strengthLabel = ds.strength + ' (' + (strengthScore >= 50 ? '+' : '') + strengthScore + '%)';

  // 五行分数
  var wxBars = ['木','火','土','金','水'];
  var wxTotal = 0;
  wxBars.forEach(function(w) { wxTotal += result.wuXingWeight[w] || 0; });

  // 构建行
  var rows = [];

  // Row: 姓名
  rows.push(rowNormal('姓名', '<span class="bval-name">' + escapeHtml(name || '—') + '</span><span class="bval-gender">' + genderLabel + '</span>', true));

  // Row: 西曆
  rows.push(rowNormal('西曆', bi.year + '年' + bi.month + '月' + bi.day + '日 ' + hourConvert(bi.hour) + '<span class="bval-zodiac">屬' + zodiacAnimal + '</span>'));

  // Row: 農曆
  rows.push(rowNormal('農曆', '<div>' + lunarYearStr + '年 ' + lunarMonthStr + ' ' + lunarDayStr + '</div><div style="color:var(--text-dim);font-size:13px;">' + hourZhi + '時</div>'));

  // Row: 節氣
  rows.push(rowNormal('節氣', getJieQiDetail(bi.year, bi.month, bi.day)));

  // Row: 星座
  rows.push(rowNormal('星座', zodiacSign + '（' + zodiacEn + '）'));

  // Row: 二十八星宿
  rows.push(rowNormal('二十八星宿', (result.riXiu || '—') + '宿 · ' + xiuDir, true));

  // Row: 空亡(年日)
  rows.push(rowNormal('空亡(年日)', kongWangStr || '—'));

  // Rows: 命宮/胎元/胎息/身宮
  palaces.forEach(function(p) {
    var gz = p.val ? p.val.ganZhi : '';
    var nayin = p.val ? (p.val.naYin || '') : '';
    rows.push(rowNormal(p.label, gz + (nayin ? ' <span style="color:var(--text-dim);font-size:12px;">' + nayin + '</span>' : '')));
  });

  // --- 袁天罡稱骨 section ---
  var cg = result.chengGu;
  var weightDetail = '年' + formatChengGuWeight(cg.yearWeight) + ' + 月' + formatChengGuWeight(cg.monthWeight) + ' + 日' + formatChengGuWeight(cg.dayWeight) + ' + 時' + formatChengGuWeight(cg.hourWeight);
  rows.push(rowSection('袁天罡稱骨'));
  rows.push(rowNormal('重量', '<span class="bval-chenggu-total">' + formatChengGuWeight(cg.total) + '</span><div class="bval-chenggu-detail">' + weightDetail + '</div>'));
  if (cg.poem) {
    var poemLines = formatPoem(cg.poem);
    rows.push(rowNormal('提示', '<div class="bval-poem">' + poemLines + '</div>'));
  }

  // --- 五行信息 section ---
  rows.push(rowSection('五行信息'));
  rows.push(rowNormal('命主屬性',
    '<span class="' + WX_CLASS[ds.dayWx] + ' bval-daymaster">' + fp.day.gan + '</span>' +
    '<span class="bval-wx-name">（' + ds.dayWx + '）</span>' +
    '<span class="bval-strength">' + strengthLabel + '</span>'));
  rows.push(rowNormal('參考用神', '<span class="' + WX_CLASS[yongShen.mainYongShenWx] + ' bval-yongshen">' + yongShen.mainYongShenWx + '</span>'));
  rows.push(rowNormal('參考忌神', '<span class="bval-jishen">' + jiShenStr + '</span>'));

  // --- 五行分數 section ---
  rows.push(rowSection('五行分數 (共60分)'));
  // 五行分数放在一个特殊行里
  var barHtml = wxBars.map(function(w) {
    var v = result.wuXingWeight[w] || 0;
    var score = wxTotal > 0 ? Math.round(v / wxTotal * 60) : 0;
    return '<div class="bval-bar-row">' +
      '<span class="bval-bar-label ' + WX_CLASS[w] + '">' + w + '</span>' +
      '<span class="bval-bar-track"><span class="bval-bar-fill" style="width:' + Math.round(v / 7 * 100) + '%;background:' + WX_COLOR[w] + '"></span></span>' +
      '<span class="bval-bar-score">' + score + '</span>' +
      '</div>';
  }).join('');
  rows.push(rowNormal('', barHtml, false, true));

  // 渲染
  var html = '';
  rows.forEach(function(r, i) {
    html += r;
  });
  document.getElementById('basic-rows').innerHTML = html;
}

// --- 辅助函数 ---
function rowNormal(label, value, isGray, isBar) {
  var cls = 'basic-info-row';
  if (isGray) cls += ' row-gray';
  if (isBar) cls += ' row-bar';
  if (!label) cls += ' row-nolabel';
  return '<div class="' + cls + '">' +
    (label ? '<span class="bir-label">' + label + '</span>' : '') +
    '<span class="bir-value">' + value + '</span>' +
    '</div>';
}

function rowSection(title) {
  return '<div class="basic-section-title">' + title + '</div>';
}

function getZodiacAnimal(zhi) {
  var map = { '子':'鼠','丑':'牛','寅':'虎','卯':'兔','辰':'龍','巳':'蛇','午':'馬','未':'羊','申':'猴','酉':'雞','戌':'狗','亥':'豬' };
  return map[zhi] || '';
}

function getZodiacSign(month, day) {
  var signs = [
    { name: '水瓶座', end: [1,20] }, { name: '双鱼座', end: [2,19] },
    { name: '白羊座', end: [3,21] }, { name: '金牛座', end: [4,20] },
    { name: '双子座', end: [5,21] }, { name: '巨蟹座', end: [6,22] },
    { name: '狮子座', end: [7,23] }, { name: '处女座', end: [8,23] },
    { name: '天秤座', end: [9,23] }, { name: '天蝎座', end: [10,24] },
    { name: '射手座', end: [11,22] }, { name: '摩羯座', end: [12,22] }
  ];
  for (var i = 0; i < signs.length; i++) {
    if (month === i + 1 && day <= signs[i].end[1]) return signs[i].name;
    if (month > i + 1) continue;
    return signs[i].name;
  }
  return signs[0].name;
}

function getZodiacEn(month, day) {
  var signs = [
    { name: 'Aquarius', end: [1,20] }, { name: 'Pisces', end: [2,19] },
    { name: 'Aries', end: [3,21] }, { name: 'Taurus', end: [4,20] },
    { name: 'Gemini', end: [5,21] }, { name: 'Cancer', end: [6,22] },
    { name: 'Leo', end: [7,23] }, { name: 'Virgo', end: [8,23] },
    { name: 'Libra', end: [9,23] }, { name: 'Scorpio', end: [10,24] },
    { name: 'Sagittarius', end: [11,22] }, { name: 'Capricorn', end: [12,22] }
  ];
  for (var i = 0; i < signs.length; i++) {
    if (month === i + 1 && day <= signs[i].end[1]) return signs[i].name;
    if (month > i + 1) continue;
    return signs[i].name;
  }
  return signs[0].name;
}

function getXiuDirection(xiu) {
  var map = {
    '角':'東方青龍','亢':'東方青龍','氐':'東方青龍','房':'東方青龍','心':'東方青龍','尾':'東方青龍','箕':'東方青龍',
    '斗':'北方玄武','牛':'北方玄武','女':'北方玄武','虚':'北方玄武','危':'北方玄武','室':'北方玄武','壁':'北方玄武',
    '奎':'西方白虎','娄':'西方白虎','胃':'西方白虎','昴':'西方白虎','毕':'西方白虎','觜':'西方白虎','参':'西方白虎',
    '井':'南方朱雀','鬼':'南方朱雀','柳':'南方朱雀','星':'南方朱雀','张':'南方朱雀','翼':'南方朱雀','轸':'南方朱雀'
  };
  return map[xiu] || '';
}

function getJieQiDetail(year, month, day) {
  // 返回当月两个节气及大致时间
  var jieNames = ['小寒','立春','驚蟄','清明','立夏','芒種','小暑','立秋','白露','寒露','立冬','大雪'];
  var qiNames = ['大寒','雨水','春分','穀雨','小滿','夏至','大暑','處暑','秋分','霜降','小雪','冬至'];
  var jieDays = [5,4,6,5,6,6,7,7,8,8,7,7];
  var qiDays = [20,19,21,20,21,21,23,23,23,24,22,22];
  var idx = month - 1;
  var jd = jieDays[idx];
  var qd = qiDays[idx];
  // 简单判断当前日期在节和气之间
  var currentJie = jieNames[idx] + ' ' + padNum(jd) + '日';
  var currentQi = qiNames[idx] + ' ' + padNum(qd) + '日';
  return '<div>' + currentJie + '</div><div style="color:var(--text-dim);font-size:13px;">' + currentQi + '</div>';
}

function padNum(n) {
  return n < 10 ? '0' + n : '' + n;
}

function pad2(n) { return n < 10 ? '0' + n : '' + n; }

function hourConvert(h) {
  return ('0' + h).slice(-2) + ':00';
}

// 称骨重量转大写：3.4 → "三兩四錢"
function formatChengGuWeight(w) {
  if (w == null) return '—';
  var CN_NUM = ['零','一','二','三','四','五','六','七','八','九'];
  var liang = Math.floor(w);
  var qian = Math.round((w - liang) * 10);
  var result = '';
  if (liang > 0) result += CN_NUM[liang] + '兩';
  if (qian > 0) result += CN_NUM[qian] + '錢';
  if (!result) result = '零';
  return result;
}

// 诗句按逗号/句号断句，两句一行
function formatPoem(poem) {
  var phrases = poem.split(/[，,。.？?！!；;、\s]+/).filter(function(s) { return s.length > 0; });
  var lines = [];
  for (var i = 0; i < phrases.length; i += 2) {
    var line = phrases[i];
    if (i + 1 < phrases.length) line += '，' + phrases[i + 1];
    if (i + 1 < phrases.length) line += '。';
    lines.push('<span class="poem-line">' + line + '</span>');
  }
  return lines.join('');
}
function renderTabChart(result) {
  var fp = result.fourPillars;
  var ss = result.shiShen;
  var GAN_WX = BaziEngine._constants.GAN_WU_XING;
  var ZHI_WX = BaziEngine._constants.ZHI_WU_XING;
  var CANG_GAN = BaziEngine._constants.ZHI_CANG_GAN;
  var positions = ['year', 'month', 'day', 'hour'];
  var labels = ['年柱', '月柱', '日柱', '時柱'];
  var gender = result.birthInfo.gender;
  var dayLabel = gender === '男' ? '元男' : '元女';

  // 地支六合化五行
  var LIU_HE_HUA = {
    '子丑': '土', '丑子': '土',
    '寅亥': '木', '亥寅': '木',
    '卯戌': '火', '戌卯': '火',
    '辰酉': '金', '酉辰': '金',
    '巳申': '水', '申巳': '水',
    '午未': '土', '未午': '土'
  };

  // 神煞分类
  var SHENSHA_JI = ['天乙贵人','文昌贵人','禄神','天德贵人','月德贵人','红鸾','天喜','金舆','学堂','词馆','太极贵人','福星贵人','国印贵人','天厨贵人','将星'];
  var SHENSHA_XIONG = ['羊刃','孤辰','寡宿','亡神','劫煞','丧门','吊客'];

  // 各柱神煞
  var posMap = { '年': 0, '月': 1, '日': 2, '时': 3 };
  var pillarSS = [[], [], [], []];
  (result.shenSha || []).forEach(function(s) {
    var m = s.position.match(/^([年月日时])/);
    if (m && posMap[m[1]] !== undefined) pillarSS[posMap[m[1]]].push(s);
  });

  // 空亡（四柱）
  var getKW = BaziEngine.getKongWang || function(gan, zhi) {
    var tg = BaziEngine._constants.TIAN_GAN;
    var dz = BaziEngine._constants.DI_ZHI;
    var ganIdx = tg.indexOf(gan);
    var zhiIdx = dz.indexOf(zhi);
    var xunStartZhi = (zhiIdx - ganIdx + 12) % 12;
    var kong1 = dz[(xunStartZhi + 10) % 12];
    var kong2 = dz[(xunStartZhi + 11) % 12];
    return { zhi: [kong1, kong2], desc: kong1 + kong2 + '空' };
  };
  var kongWangs = {};
  positions.forEach(function(p) {
    var kw = getKW(fp[p].gan, fp[p].zhi);
    kongWangs[p] = kw ? kw.desc.replace('空', '') : '—';
  });

  // 构建表格行
  var rows = [];

  // Row 1: 主星
  rows.push({ label: '主星', cells: positions.map(function(p) {
    var s = p === 'day' ? dayLabel : ss[p].gan;
    var cls = p === 'day' ? 'chart-daymaster' : 'chart-shishen-label';
    return '<span class="' + cls + '">' + s + '</span>';
  })});

  // Row 2: 天干
  rows.push({ label: '天干', cells: positions.map(function(p) {
    return '<span class="chart-gan ' + WX_CLASS[GAN_WX[fp[p].gan]] + '">' + fp[p].gan + '</span>';
  })});

  // Row 3: 地支
  rows.push({ label: '地支', cells: positions.map(function(p) {
    return '<span class="chart-zhi ' + WX_CLASS[ZHI_WX[fp[p].zhi]] + '">' + fp[p].zhi + '</span>';
  })});

  // Row 4: 藏干（上下排列，附五行）
  rows.push({ label: '藏干', cells: positions.map(function(p) {
    var cg = CANG_GAN[fp[p].zhi];
    return '<div class="chart-canggan-list">' + cg.map(function(g) {
      var wx = GAN_WX[g];
      return '<div class="chart-canggan-item"><span class="chart-canggan ' + WX_CLASS[wx] + '">' + g + '</span><span class="chart-canggan-wx ' + WX_CLASS[wx] + '">' + wx + '</span></div>';
    }).join('') + '</div>';
  })});

  // Row 5: 副星（地支全部藏干对应的十神）
  rows.push({ label: '副星', cells: positions.map(function(p) {
    var zhiSS = ss[p].zhi;
    if (!zhiSS || zhiSS.length === 0) return '<span class="chart-shishen-label">—</span>';
    return '<div class="chart-canggan-list">' + zhiSS.map(function(item) {
      return '<span class="chart-shishen-label">' + item.shiShen + '</span>';
    }).join('') + '</div>';
  })});

  // Row 6: 納音
  rows.push({ label: '納音', cells: positions.map(function(p) {
    return '<span class="chart-nayin">' + (fp[p].naYin || '—') + '</span>';
  })});

  // Row 7: 星运（日柱天干在该地支的长生状态）
  rows.push({ label: '星运', cells: positions.map(function(p) {
    return '<span class="chart-ziZuo">' + (result.changSheng[p] || '') + '</span>';
  })});

  // Row 8: 自坐（该柱天干自坐地支的长生状态）
  rows.push({ label: '自坐', cells: positions.map(function(p) {
    return '<span class="chart-ziZuo">' + (result.ziZuo[p] || '') + '</span>';
  })});

  // Row 10: 空亡
  rows.push({ label: '空亡', cells: positions.map(function(p) {
    return '<span class="chart-kongwang">' + (kongWangs[p] || '—') + '</span>';
  })});

  // Row 9: 神煞
  rows.push({ label: '神煞', cells: pillarSS.map(function(arr) {
    if (arr.length === 0) return '<span class="chart-shensha-empty">—</span>';
    return '<div class="chart-shensha-tags">' + arr.map(function(s) {
      var cat = SHENSHA_JI.indexOf(s.name) >= 0 ? 'ji' : (SHENSHA_XIONG.indexOf(s.name) >= 0 ? 'xiong' : 'neutral');
      return '<span class="chart-ss-tag ss-' + cat + '">' + s.name + '</span>';
    }).join('') + '</div>';
  })});

  // 渲染表格
  var html = '<table class="chart-table"><thead><tr><th></th>';
  positions.forEach(function(p, i) {
    var cls = p === 'day' ? ' col-day' : '';
    html += '<th class="' + cls + '">' + labels[i] + '</th>';
  });
  html += '</tr></thead><tbody>';
  rows.forEach(function(row, ri) {
    var rowCls = ri % 2 === 1 ? ' row-alt' : '';
    html += '<tr class="' + rowCls + '"><td class="row-label">' + row.label + '</td>';
    row.cells.forEach(function(cell, i) {
      var cls = i === 2 ? ' col-day' : '';
      html += '<td class="' + cls + '">' + cell + '</td>';
    });
    html += '</tr>';
  });
  html += '</tbody></table>';

  // 底部提示
  html += '<div class="chart-hints">';

  // 命盤四柱提示
  html += '<div class="chart-hint-section">';
  html += '<div class="chart-hint-title">【命盤四柱提示】</div>';
  var xchh = result.xingChongHeHai || {};

  // 天干提示
  var ganHints = [];
  (xchh.tianGanHe || []).forEach(function(h) {
    ganHints.push(h.description + '可化' + (h.hua || ''));
  });
  html += '<div class="chart-hint-row"><span class="chart-hint-label">天干提示：</span>';
  html += ganHints.length > 0 ? ganHints.join('、') : '無';
  html += '</div>';

  // 地支提示
  var zhiHints = [];
  (xchh.diZhiHe || []).forEach(function(h) {
    var key = (h.zhis[0] || '') + (h.zhis[1] || '');
    var hua = LIU_HE_HUA[key] || '';
    zhiHints.push(h.description + (hua ? '可合' + hua : ''));
  });
  html += '<div class="chart-hint-row"><span class="chart-hint-label">地支提示：</span>';
  html += zhiHints.length > 0 ? zhiHints.join('、') : '無';
  html += '</div>';

  html += '</div>';

  // 滴天髓
  html += '<div class="chart-hint-section">';
  html += '<div class="chart-hint-title">【命盤日元提示】</div>';
  html += '<div class="chart-hint-text chart-hint-indent"><span class="chart-hint-label">滴天髓：</span>' + (DI_TIAN_SUI[fp.day.gan] || '暫無') + '</div>';
  html += '</div>';

  // 用神
  var yongShenText = '';
  var tiaoHou2 = result.tiaoHou;
  if (tiaoHou2 && tiaoHou2.mainGan) {
    yongShenText = fp.month.zhi + '月用' + tiaoHou2.mainGan;
    if (tiaoHou2.auxGan) yongShenText += '，無' + tiaoHou2.mainGan + '用' + tiaoHou2.auxGan;
  }
  html += '<div class="chart-hint-section">';
  html += '<div class="chart-hint-title">【命盤日元提示】</div>';
  html += '<div class="chart-hint-text chart-hint-indent"><span class="chart-hint-label">用神：</span>' + (yongShenText || '暫無') + '</div>';
  html += '</div>';

  html += '</div>'; // .chart-hints

  document.getElementById('chart-table-wrap').innerHTML = html;
}

// ==================== Tab 3: 细盘 ====================
function renderTabDetail(result) {
  var fp = result.fourPillars;
  var dy = result.daYun;
  var GAN_WX = BaziEngine._constants.GAN_WU_XING;
  var ZHI_WX = BaziEngine._constants.ZHI_WU_XING;
  var CANG_GAN = BaziEngine._constants.ZHI_CANG_GAN;
  var ss = result.shiShen;
  var currentYear = new Date().getFullYear();

  if (_selectedDaYunIdx === null) {
    _selectedDaYunIdx = dy.daYunList.findIndex(function(d) { return currentYear >= d.startYear && currentYear <= d.endYear; });
    if (_selectedDaYunIdx < 0) _selectedDaYunIdx = 0;
  }

  var beforeQiYun = currentYear < dy.qiYunYear;
  var isXiaoYunMode = (_selectedDaYunIdx === -1);
  var selDaYun = isXiaoYunMode ? null : (dy.daYunList[_selectedDaYunIdx] || null);
  var dyData = {};
  var dyHeader = isXiaoYunMode ? '小運' : '大運';
  var selLiuNian = null;
  var lnData = {};
  var lnYear = _selectedLiuNianYear || currentYear;

  if (isXiaoYunMode) {
    var xiaoYunList2 = result.xiaoYun || [];
    var tg2 = BaziEngine._constants.TIAN_GAN;
    var dz2 = BaziEngine._constants.DI_ZHI;
    // 流年：优先用选中的年份
    var lnYear2 = _selectedLiuNianYear || currentYear;
    selLiuNian = { gan: tg2[(lnYear2 - 4) % 10], zhi: dz2[(lnYear2 - 4) % 12], year: lnYear2 };
    // 小运：根据流年与出生年的差值找到对应小运（0岁=出生年=时柱）
    var birthYear2 = result.birthInfo.year;
    // 小运：1岁=时柱下一干支（顺行）或上一干支（逆行），按虚岁=lnYear-birthYear+1匹配
    var matchedXY = null;
    var targetAge = lnYear2 - birthYear2 + 1;
    for (var xi = 0; xi < xiaoYunList2.length; xi++) {
      if (xiaoYunList2[xi].age === targetAge) { matchedXY = xiaoYunList2[xi]; break; }
    }
    if (!matchedXY) matchedXY = xiaoYunList2[0] || null;
    if (matchedXY) {
      dyData = { gan: matchedXY.gan, zhi: matchedXY.zhi, startAge: targetAge, startYear: matchedXY.year || lnYear2 };
    }
  } else if (selDaYun) {
    dyData = selDaYun;
    if (selDaYun.liuNian && selDaYun.liuNian.length > 0) {
      selLiuNian = selLiuNianFromYear(selDaYun, lnYear) || selLiuNianFromYear(selDaYun, currentYear) || selDaYun.liuNian[0];
    }
  }
  lnData = selLiuNian || {};

  var qianKun = result.birthInfo.gender === '男' ? '乾' : '坤';
  var dayLabel = qianKun === '乾' ? '元男' : '元女';
  var pillars = [fp.year, fp.month, fp.day, fp.hour];
  var posKeys = ['year','month','day','hour'];
  var allCols = pillars.concat([dyData, lnData]);
  var headers = ['年柱', '月柱', '日柱', '時柱', dyHeader, '流年'];

  // 流月
  var liuYueList = [];
  if (selLiuNian && BaziEngine.calcLiuYue) {
    liuYueList = BaziEngine.calcLiuYue(selLiuNian.gan) || [];
  }

  // 构建表格
  var html = '<div class="xipan-table-wrap"><table class="xipan-table">';

  // 表头
  html += '<thead><tr class="xipan-header-row"><th class="xipan-label-col"></th>';
  for (var h = 0; h < 6; h++) {
    var hCls = h === 2 ? ' xipan-col-day' : '';
    html += '<th class="' + hCls + '">' + headers[h] + '</th>';
  }
  html += '</tr></thead><tbody>';

  // Row 1: 歲年（前四柱显示提示文字）
  html += '<tr class="xipan-row-alt">';
  html += '<td class="xipan-row-label">歲年</td>';
  html += '<td colspan="4" class="xipan-click-hint-cell">點擊六柱干支可看提示</td>';
  var displayAge = isXiaoYunMode ? dyData.startAge : (dyData.startAge !== undefined ? dyData.startAge + 1 : undefined);
  html += '<td>' + (displayAge !== undefined ? displayAge + '歲 ' + dyData.startYear : '—') + '</td>';
  html += '<td>' + (selLiuNian ? selLiuNian.year : '—') + '</td>';
  html += '</tr>';

  // Row 2: 天干
  html += '<tr>';
  html += '<td class="xipan-row-label">天干</td>';
  for (c = 0; c < 6; c++) {
    col = allCols[c];
    var gan = col.gan || '';
    var wxGan = GAN_WX[gan] || '';
    var ssGan = '';
    if (c < 4) ssGan = (c === 2 ? dayLabel : ss[posKeys[c]].gan);
    else if (c === 4 && dyData.gan) ssGan = calcDaYunShiShen(result, dyData);
    else if (c === 5 && lnData.gan) ssGan = calcDaYunShiShen(result, lnData);
    var ssShort = { '比肩':'比','劫财':'劫','食神':'食','伤官':'傷','偏财':'才','正财':'財','偏官':'殺','正官':'官','偏印':'梟','正印':'印' };
    var ssLabel = c === 2 ? dayLabel : (ssShort[ssGan] || ssGan);
    var ssCls = c === 2 ? ' xipan-ss-day' : '';
    var ssDisplay = c === 2 ? dayLabel.replace('元', '元<br>') : ssLabel;
    html += '<td class="xipan-cell-tag">' +
      (ssLabel ? '<span class="xipan-ss-tag' + ssCls + '">' + ssDisplay + '</span>' : '') +
      '<span class="xipan-gan ' + WX_CLASS[wxGan] + '">' + gan + '</span>' +
      '</td>';
  }
  html += '</tr>';

  // Row 3: 地支
  html += '<tr class="xipan-row-alt">';
  html += '<td class="xipan-row-label">地支</td>';
  for (c = 0; c < 6; c++) {
    col = allCols[c];
    var zhi = col.zhi || '';
    var wxZhi = ZHI_WX[zhi] || '';
    // 地支十神（全部藏干）
    var zhiSSLabels = [];
    if (c < 4 && ss[posKeys[c]].zhi) {
      ss[posKeys[c]].zhi.forEach(function(zItem) {
        var zss = zItem.shiShen;
        zhiSSLabels.push(ssShort[zss] || zss);
      });
    }
    html += '<td class="xipan-cell-tag">' +
      (zhiSSLabels.length > 0 ? '<span class="xipan-ss-tag xipan-ss-stack">' + zhiSSLabels.join('<br>') + '</span>' : '') +
      '<span class="xipan-zhi ' + WX_CLASS[wxZhi] + '">' + zhi + '</span>' +
      '</td>';
  }
  html += '</tr>';

  // Row 4: 流月（五虎遁起寅月，从当前月开始，干上支下，横跨全部六柱）
  html += '<tr>';
  html += '<td class="xipan-row-label">流月</td>';
  if (liuYueList.length > 0) {
    html += '<td colspan="6" class="xipan-liuyue-cell"><div class="xipan-liuyue-flex">';
    liuYueList.forEach(function(ly) {
      html += '<div class="xipan-liuyue-pair">' +
        '<span class="' + WX_CLASS[GAN_WX[ly.gan]] + '">' + ly.gan + '</span>' +
        '<span class="' + WX_CLASS[ZHI_WX[ly.zhi]] + '">' + ly.zhi + '</span>' +
        '</div>';
    });
    html += '</div></td>';
  } else {
    html += '<td colspan="6">—</td>';
  }
  html += '</tr>';

  // Row 5: 星運自坐
  html += '<tr class="xipan-row-alt">';
  html += '<td class="xipan-row-label">星運<br>自坐</td>';
  for (c = 0; c < 6; c++) {
    col = allCols[c];
    var xingYun = c < 4 ? result.changSheng[posKeys[c]] : getChangShengForGanZhi(fp.day.gan, col.zhi || '');
    var ziZuo = c < 4 ? result.ziZuo[posKeys[c]] : getChangShengForGanZhi(col.gan || '', col.zhi || '');
    html += '<td class="xipan-xingyun-cell">' +
      '<span class="xipan-cs">' + (xingYun || '') + '</span>' +
      '<span class="xipan-zz">' + (ziZuo || '') + '</span>' +
      '</td>';
  }
  html += '</tr>';

  // Row 6: 空亡（全部六柱）
  html += '<tr>';
  html += '<td class="xipan-row-label">空亡</td>';
  for (c = 0; c < 6; c++) {
    col = allCols[c];
    var kw = getKongWangForGanZhi(col.gan || '', col.zhi || '');
    html += '<td class="xipan-kw-cell">' + (kw || '—') + '</td>';
  }
  html += '</tr>';

  // Row 7: 納音（全部六柱）
  var NA_YIN = BaziEngine._constants.NA_YIN || {};
  html += '<tr class="xipan-row-alt">';
  html += '<td class="xipan-row-label">納音</td>';
  for (c = 0; c < 6; c++) {
    col = allCols[c];
    var gz = (col.gan || '') + (col.zhi || '');
    var nayin = col.naYin || NA_YIN[gz] || '—';
    html += '<td class="xipan-nayin-cell">' + nayin + '</td>';
  }
  html += '</tr>';

  html += '</tbody></table></div>';
  document.getElementById('xipan-table').innerHTML = html;

  // 下方区：大运/流年/五行/提示
  renderXipanDayun(result);
}

// ========== 细盘 - 大运流年 + 五行旺相 + 刑冲提示 ==========
function renderXipanDayun(result) {
  var dy = result.daYun;
  var fp = result.fourPillars;
  var currentYear = new Date().getFullYear();
  var GAN_WX = BaziEngine._constants.GAN_WU_XING;
  var ZHI_WX = BaziEngine._constants.ZHI_WU_XING;

  if (_selectedDaYunIdx === null) {
    _selectedDaYunIdx = dy.daYunList.findIndex(function(d) { return currentYear >= d.startYear && currentYear <= d.endYear; });
    if (_selectedDaYunIdx < 0) _selectedDaYunIdx = 0;
  }

  var html = '';

  // 起运信息
  html += '<div class="xipan-info-row">' +
    '<span class="xipan-info-label">起運</span>' +
    '<span class="xipan-info-value">' + dy.direction + ' · ' + dy.qiYunAge + '歲起運（' + dy.qiYunYear + '年）</span>' +
    '</div>';

  // 提示
  html += '<div class="xipan-hint-text" style="text-align:center;padding:4px 0;color:var(--text-dim);font-size:11px;">【點擊大運和流年的干支可切換到上面】</div>';

  // ---- 大运/小运/流年 + 五行旺衰 ----
  var daYunList8 = dy.daYunList.slice(0, 8);
  if (_selectedDaYunIdx >= daYunList8.length) _selectedDaYunIdx = 0;
  var selDaYunLN = daYunList8[_selectedDaYunIdx] || null;
  var liuNianList = selDaYunLN ? (selDaYunLN.liuNian || []) : [];
  html += renderDaYunLiuNian({
    daYunList: daYunList8,
    liuNianList: liuNianList,
    xiaoYunList: result.xiaoYun || [],
    selectedDaYunIdx: _selectedDaYunIdx,
    selectedXiaoYunIdx: _selectedXiaoYunIdx,
    currentYear: currentYear,
    monthZhiWx: ZHI_WX[fp.month.zhi],
    qiYunAge: dy.qiYunAge
  });

  // ---- 刑冲合害提示 ----
  var tipDaYun = dy.daYunList[_selectedDaYunIdx];
  var tipLiuNian = tipDaYun ? selLiuNianFromYear(tipDaYun, _selectedLiuNianYear || currentYear) : null;
  var tipCols = [
    { gan: fp.year.gan, zhi: fp.year.zhi },
    { gan: fp.month.gan, zhi: fp.month.zhi },
    { gan: fp.day.gan, zhi: fp.day.zhi },
    { gan: fp.hour.gan, zhi: fp.hour.zhi }
  ];
  if (tipDaYun) tipCols.push({ gan: tipDaYun.gan, zhi: tipDaYun.zhi });
  if (tipLiuNian) tipCols.push({ gan: tipLiuNian.gan, zhi: tipLiuNian.zhi });

  var ganTips = analyzeGanHeTips(tipCols);
  var zhiTips = analyzeZhiTips(tipCols);

  html += '<div class="chart-hint-section" style="margin:10px 8px;">';
  html += '<div class="chart-hint-title">【細盤六柱提示】</div>';
  function wrapTips(str) {
    if (!str) return '<span class="hint-nowrap">無</span>';
    return str.split('；').map(function(s) { return '<span class="hint-nowrap">' + s + '</span>'; }).join('；');
  }
  html += '<div class="chart-hint-indent"><span class="chart-hint-label">天干提示：</span><span class="chart-hint-body">' + wrapTips(ganTips) + '</span></div>';
  html += '<div class="chart-hint-indent"><span class="chart-hint-label">地支提示：</span><span class="chart-hint-body">' + wrapTips(zhiTips) + '</span></div>';
  html += '</div>';

  document.getElementById('xipan-dayun-section').innerHTML = html;
  document.getElementById('xipan-tips-section').innerHTML = '';
}

function selLiuNianFromYear(daYunPeriod, year) {
  return daYunPeriod.liuNian.find(function(l) { return l.year === year; }) || null;
}

function getChangShengForGanZhi(gan, zhi) {
  // 复刻引擎 getChangSheng(gan, zhi) 的逻辑
  var CHANG_SHENG_QI = { '甲':'亥','乙':'午','丙':'寅','丁':'酉','戊':'寅','己':'酉','庚':'巳','辛':'子','壬':'申','癸':'卯' };
  var SHI_ER_CS = ['长生','沐浴','冠带','临官','帝旺','衰','病','死','墓','绝','胎','养'];
  var GAN_YY = { '甲':'陽','乙':'陰','丙':'陽','丁':'陰','戊':'陽','己':'陰','庚':'陽','辛':'陰','壬':'陽','癸':'陰' };
  var DI_ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  var startZhi = CHANG_SHENG_QI[gan];
  if (!startZhi || !zhi) return '';
  var startIdx = DI_ZHI.indexOf(startZhi);
  var zhiIdx = DI_ZHI.indexOf(zhi);
  var yy = GAN_YY[gan];
  var offset;
  if (yy === '陽') {
    offset = (zhiIdx - startIdx + 12) % 12;
  } else {
    offset = (startIdx - zhiIdx + 12) % 12;
  }
  return SHI_ER_CS[offset];
}

function getKongWangForGanZhi(gan, zhi) {
  var TIAN_GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  var DI_ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  var ganIdx = TIAN_GAN.indexOf(gan);
  var zhiIdx = DI_ZHI.indexOf(zhi);
  if (ganIdx < 0 || zhiIdx < 0) return '';
  var xunStartZhi = (zhiIdx - ganIdx + 12) % 12;
  var kong1 = DI_ZHI[(xunStartZhi + 10) % 12];
  var kong2 = DI_ZHI[(xunStartZhi + 11) % 12];
  return kong1 + kong2;
}

function calcWangXiang(monthWx) {
  // 旺: 同月令; 相: 月令所生(我生); 休: 生月令(生我); 囚: 克月令(克我); 死: 月令所克(我克)
  var order = ['木','火','土','金','水'];
  var result = {};
  var idx = order.indexOf(monthWx);
  if (idx < 0) return result;
  // 我生者相 (monthWx generates → 相)
  var xiangIdx = (idx + 1) % 5;
  // 生我者休 (generates monthWx → 休)
  var xiuIdx = (idx + 4) % 5;
  // 克我者囚 (kills monthWx → 囚) = (idx + 3) % 5
  var qiuIdx = (idx + 3) % 5;
  // 我克者死 (monthWx kills → 死) = (idx + 2) % 5
  var siIdx = (idx + 2) % 5;
  result[order[idx]] = '旺';
  result[order[xiangIdx]] = '相';
  result[order[xiuIdx]] = '休';
  result[order[qiuIdx]] = '囚';
  result[order[siIdx]] = '死';
  return result;
}

function calcDaYunShiShen(result, daYun) {
  var dayGan = result.fourPillars.day.gan;
  var GAN_WX = BaziEngine._constants.GAN_WU_XING;
  var dayWx = GAN_WX[dayGan];
  var dyWx = GAN_WX[daYun.gan];
  var dayYinYang = { '甲':1,'乙':-1,'丙':1,'丁':-1,'戊':1,'己':-1,'庚':1,'辛':-1,'壬':1,'癸':-1 }[dayGan] || 0;
  var dyYinYang = { '甲':1,'乙':-1,'丙':1,'丁':-1,'戊':1,'己':-1,'庚':1,'辛':-1,'壬':1,'癸':-1 }[daYun.gan] || 0;
  var sameYinYang = (dayYinYang === dyYinYang);
  var SHENG = { '木':'火','火':'土','土':'金','金':'水','水':'木' };
  var KE = { '木':'土','火':'金','土':'水','金':'木','水':'火' };
  var names = [];
  if (dayWx === dyWx) names = sameYinYang ? ['比肩'] : ['劫财'];
  else if (SHENG[dayWx] === dyWx) names = sameYinYang ? ['食神'] : ['伤官'];
  else if (SHENG[dyWx] === dayWx) names = sameYinYang ? ['偏印'] : ['正印'];
  else if (KE[dayWx] === dyWx) names = sameYinYang ? ['偏财'] : ['正财'];
  else if (KE[dyWx] === dayWx) names = sameYinYang ? ['偏官'] : ['正官'];
  return names[0] || '';
}

function analyzeGanHeTips(cols) {
  var heMap = { '甲':'己','乙':'庚','丙':'辛','丁':'壬','戊':'癸','己':'甲','庚':'乙','辛':'丙','壬':'丁','癸':'戊' };
  var heNames = { '甲己':'土','乙庚':'金','丙辛':'水','丁壬':'木','戊癸':'火' };
  var tips = [];
  var gans = cols.map(function(c, i) { return c.gan; }).filter(function(g) { return g; });
  for (var i = 0; i < gans.length; i++) {
    for (var j = i + 1; j < gans.length; j++) {
      if (heMap[gans[i]] === gans[j]) {
        var key = [gans[i], gans[j]].sort().join('');
        tips.push(gans[i] + gans[j] + '合可化' + (heNames[key] || ''));
      }
    }
  }
  return tips.join('；') || '';
}

function analyzeZhiTips(cols) {
  var tips = [];
  var zhis = cols.map(function(c, i) { return c.zhi; }).filter(function(z) { return z; });
  // 三会
  var sanHui = { '寅卯辰':'東方木','巳午未':'南方火','申酉戌':'西方金','亥子丑':'北方水' };
  Object.keys(sanHui).forEach(function(key) {
    var parts = key.split('');
    if (parts.every(function(p) { return zhis.indexOf(p) >= 0; })) {
      tips.push(key.split('').join('') + '可會為' + sanHui[key]);
    }
  });
  // 三合
  var sanHe = { '申子辰':'水局','亥卯未':'木局','寅午戌':'火局','巳酉丑':'金局' };
  Object.keys(sanHe).forEach(function(key) {
    var parts = key.split('');
    if (parts.every(function(p) { return zhis.indexOf(p) >= 0; })) {
      tips.push(parts.join('') + '可三合' + sanHe[key]);
    }
  });
  // 六合
  var liuHe = { '子丑':'土','寅亥':'木','卯戌':'火','辰酉':'金','巳申':'水','午未':'火' };
  var liuHeRev = {};
  Object.keys(liuHe).forEach(function(k) {
    var parts = k.split('');
    liuHeRev[parts[0]] = parts[1];
    liuHeRev[parts[1]] = parts[0];
  });
  var seenHe = {};
  zhis.forEach(function(z1, i) {
    zhis.forEach(function(z2, j) {
      if (i >= j) return;
      if (liuHeRev[z1] === z2) {
        var key = [z1, z2].sort().join('');
        if (!seenHe[key]) {
          seenHe[key] = true;
          tips.push(z1 + z2 + '可合' + (liuHe[key] || liuHe[z2+z1] || ''));
        }
      }
    });
  });
  // 刑
  var xing = { '寅巳':'無恩之刑','巳申':'無恩之刑','丑戌':'恃勢之刑','戌未':'恃勢之刑','子卯':'無禮之刑' };
  var xingPairs = [];
  zhis.forEach(function(z1, i) {
    zhis.forEach(function(z2, j) {
      if (i >= j) return;
      var key = z1 + z2;
      var keyR = z2 + z1;
      if (xing[key] || xing[keyR]) {
        xingPairs.push(key + '可' + (xing[key] || xing[keyR]));
      }
    });
  });
  tips = tips.concat(xingPairs);
  // 冲
  var chong = { '子午':true,'丑未':true,'寅申':true,'卯酉':true,'辰戌':true,'巳亥':true };
  zhis.forEach(function(z1, i) {
    zhis.forEach(function(z2, j) {
      if (i >= j) return;
      if (chong[z1+z2] || chong[z2+z1]) tips.push(z1 + z2 + '可相沖');
    });
  });
  // 害
  var hai = { '子未':true,'丑午':true,'寅巳':true,'卯辰':true,'申亥':true,'酉戌':true };
  zhis.forEach(function(z1, i) {
    zhis.forEach(function(z2, j) {
      if (i >= j) return;
      if (hai[z1+z2] || hai[z2+z1]) tips.push(z1 + z2 + '可相害');
    });
  });
  // 破
  var po = { '子酉':true,'寅亥':true,'辰丑':true,'午卯':true,'申巳':true,'戌未':true };
  zhis.forEach(function(z1, i) {
    zhis.forEach(function(z2, j) {
      if (i >= j) return;
      if (po[z1+z2] || po[z2+z1]) tips.push(z1 + z2 + '可相破');
    });
  });
  return tips.join('；') || '';
}

// ========== 细盘交互 ==========
function onXipanClickGan(gan, wx, ssName) {
  alert(gan + '（' + wx + '）· 十神：' + ssName);
}

function onXipanClickZhi(zhi, wx) {
  var CANG_GAN = BaziEngine._constants.ZHI_CANG_GAN;
  var cg = CANG_GAN[zhi] || [];
  var GAN_WX = BaziEngine._constants.GAN_WU_XING;
  var info = cg.map(function(g) { return g + '(' + GAN_WX[g] + ')'; }).join('、');
  alert(zhi + '（' + wx + '）\n藏干：' + (info || '无'));
}

function onXipanSelectLiuNian(year) {
  _selectedLiuNianYear = year;
  renderTabDetail(currentResult);
}

var _selectedLiuNianYear = null;

// ========== 渲染大运/流年/五行 ==========
function renderDaYunLiuNian(opts) {
  var GAN_WX = BaziEngine._constants.GAN_WU_XING;
  var ZHI_WX = BaziEngine._constants.ZHI_WU_XING;
  var DY = opts.daYunList;
  var LN = opts.liuNianList;
  var XY = opts.xiaoYunList || [];
  var selDY = opts.selectedDaYunIdx;
  var selXY = opts.selectedXiaoYunIdx;
  var isXiaoYunMode = (selDY === -1);
  var cur = opts.currentYear;
  var h = '';

  // ===== 大运/小运 表格（第一列为小运） =====
  var qiYunCeil = Math.ceil(opts.qiYunAge || (DY.length > 0 ? DY[0].startAge : 3));
  h += '<div class="xipan-scroll-row"><table class="xipan-dy-table xipan-dy-full"><thead><tr><th></th>';
  // 小运列头（起运前岁数）
  h += '<th class="' + (isXiaoYunMode ? ' xipan-dy-sel' : '') + '">1-' + (qiYunCeil - 1) + '歲</th>';
  // 大运列头
  for (var i = 0; i < DY.length; i++) {
    var d = DY[i];
    var curDY = !isXiaoYunMode && cur >= d.startYear && cur <= d.endYear;
    var sel = !isXiaoYunMode && i === selDY;
	    var dyAge = qiYunCeil + i * 10;
    h += '<th class="' + (curDY ? ' xipan-dy-cur' : '') + (sel ? ' xipan-dy-sel' : '') + '">' + dyAge + '歲<br>' + d.startYear + '</th>';
  }
  h += '</tr></thead><tbody>';

  // 干支行（干上支下，整体点击）
  h += '<tr><td class="xipan-dy-row-label">大<br>運</td>';
  h += '<td class="xipan-dy-row-label' + (isXiaoYunMode ? ' xipan-dy-sel' : '') + '" onclick="selectXiaoYun(0)">小<br>運</td>';
  for (i = 0; i < DY.length; i++) {
    d = DY[i];
    curDY = !isXiaoYunMode && cur >= d.startYear && cur <= d.endYear;
    sel = !isXiaoYunMode && i === selDY;
    var cl = (curDY ? ' xipan-dy-cur' : '') + (sel ? ' xipan-dy-sel' : '');
    h += '<td class="' + cl + '" onclick="selectDaYun(' + i + ')">' +
      '<span class="' + WX_CLASS[GAN_WX[d.gan]] + '">' + d.gan + '</span><br>' +
      '<span class="' + WX_CLASS[ZHI_WX[d.zhi]] + '">' + d.zhi + '</span>' +
      '</td>';
  }
  h += '</tr>';
  h += '</tbody></table></div>';

  // ===== 流年表格（小运模式显示起运前流年，大运模式显示10个流年，均可点击选择） =====
  var tg = BaziEngine._constants.TIAN_GAN;
  var dz = BaziEngine._constants.DI_ZHI;
  var lnList = [];
  if (isXiaoYunMode) {
    // 小运模式：从出生年到起运前一年的流年
    var birthYear = (XY.length > 0 && XY[0]) ? (XY[0].year - 1) : cur;
    var qiYunYear = DY.length > 0 ? DY[0].startYear : cur;
    for (var y = birthYear; y < qiYunYear; y++) {
      lnList.push({ gan: tg[(y - 4) % 10], zhi: dz[(y - 4) % 12], year: y });
    }
  } else {
    var selDYData = DY[selDY];
    lnList = (selDYData && selDYData.liuNian) ? selDYData.liuNian : [];
  }
  var selLN = _selectedLiuNianYear || cur;
  var MAX_LN = 10;
  if (lnList.length > 0) {
    h += '<div><table class="xipan-dy-table xipan-dy-full"><thead><tr><th></th>';
    for (var li = 0; li < MAX_LN; li++) {
      h += '<th>' + (li < lnList.length ? lnList[li].year : '') + '</th>';
    }
    h += '</tr></thead><tbody>';

    // 流年（干上支下，整体点击）
    h += '<tr><td class="xipan-dy-row-label">流<br>年</td>';
    for (li = 0; li < MAX_LN; li++) {
      if (li < lnList.length) {
        var ln = lnList[li];
        var isCurLn = ln.year === cur;
        var isSelLn = ln.year === selLN;
        h += '<td class="' + (isCurLn ? ' xipan-dy-cur' : '') + (isSelLn ? ' xipan-dy-sel' : '') + '" onclick="selectLiuNian(' + ln.year + ')">' +
          '<span class="' + WX_CLASS[GAN_WX[ln.gan]] + '">' + ln.gan + '</span><br>' +
          '<span class="' + WX_CLASS[ZHI_WX[ln.zhi]] + '">' + ln.zhi + '</span>' +
          '</td>';
      } else {
        h += '<td></td>';
      }
    }
    h += '</tr>';
    h += '</tbody></table></div>';
  }

  // 五行旺相休囚死
  var wangXiang = calcWangXiang(opts.monthZhiWx);
  var wxData = [
    { name: '火', color: '#d32f2f' },
    { name: '土', color: '#b87333' },
    { name: '木', color: '#388E3C' },
    { name: '水', color: '#1976D2' },
    { name: '金', color: '#E65100' }
  ];
  h += '<div class="xipan-wx-text">';
  wxData.forEach(function(w, idx) {
    if (idx > 0) h += ' ';
    var st = wangXiang[w.name] || '';
    h += '<span class="xipan-wx-badge" style="color:' + w.color + ';border-color:' + w.color + '">' + w.name + st + '</span>';
  });
  h += '</div>';

  return h;
}

// ==================== Tab 6: 提示（分析报告） ====================
function renderTabTips(result) {
  var report = BaziEngine.generateReport(result);
  var container = document.getElementById('tab-tips');
  if (!container) return;

  var sections = report.split(/━━━ [一二三四五六七八九]、/);
  var titleRe = /━━━ ([一二三四五六七八九])、(.+?) ━━━/g;
  var titles = [];
  var match;
  while ((match = titleRe.exec(report)) !== null) {
    titles.push({ num: match[1], title: match[2] });
  }

  var contents = sections.slice(1).map(function(s) {
    var endIdx = s.indexOf(' ━━━');
    var content = endIdx >= 0 ? s.substring(endIdx + 4).trim() : s.trim();
    return content
      .replace(/══+/g, '')
      .replace(/本报告.*$/gm, '')
      .replace(/深度解读.*$/gm, '')
      .trim();
  });

  var html = '';
  titles.forEach(function(t, i) {
    var bodyHtml = (contents[i] || '').split('\n').map(function(line) {
      line = line.trim();
      if (!line) return '';
      return '<p>' + line + '</p>';
    }).join('');

    html += '<div class="tip-section" onclick="this.classList.toggle(\'open\')">' +
      '<div class="tip-section-header">' +
      '<span class="tip-section-title">' + t.num + '、' + t.title + '</span>' +
      '<span class="tip-section-arrow">▼</span>' +
      '</div>' +
      '<div class="tip-section-body">' + bodyHtml + '</div>' +
      '</div>';
  });

  html += '<div class="tip-contact">' +
    '<div class="tip-contact-title">深度命理解讀</div>' +
    '<div class="tip-contact-text">如需一對一詳細解讀八字命盤，請添加微信諮詢</div>' +
    '<img src="qrcode.jpeg" class="tip-qrcode" alt="微信二维码">' +
    '<div class="tip-contact-note">（添加時請備註「命理解讀」）</div>' +
    '</div>';

  container.innerHTML = html;
  document.getElementById('tab-tips').classList.remove('placeholder-tab');
}

function selectDaYun(idx) {
  _selectedDaYunIdx = idx;
  _selectedXiaoYunIdx = undefined;
  _selectedLiuNianYear = null;
  renderTabDetail(currentResult);
}

function selectXiaoYun(idx) {
  _selectedDaYunIdx = -1;
  _selectedXiaoYunIdx = idx;
  _selectedLiuNianYear = null;
  renderTabDetail(currentResult);
}

function selectLiuNian(year) {
  _selectedLiuNianYear = year;
  renderTabDetail(currentResult);
}


// ========== 启动 ==========
document.addEventListener('DOMContentLoaded', initForm);
