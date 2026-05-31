// ========== 页面切换 ==========
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  window.scrollTo(0, 0);
}

// ========== 五行颜色映射 ==========
var WX_CLASS = { '木': 'wx-wood', '火': 'wx-fire', '土': 'wx-earth', '金': 'wx-metal', '水': 'wx-water' };
var WX_COLOR = { '木': '#4CAF50', '火': '#F44336', '土': '#7b5e3b', '金': '#d4a852', '水': '#2196F3' };

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
var _calMode = 'solar';
var _lunarYear = 0, _lunarMonth = 0, _lunarDay = 0;
var _isLeap = false;
var _calMode = 'solar'; // 当前日历模式（全局）
var _lunarYear = 0, _lunarMonth = 0, _lunarDay = 0; // 农历输入值

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

  // 填充年份，默认选中当前年（覆盖四柱查找范围 1911-2100）
  for (var y = 2100; y >= 1911; y--) {
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
    // 农历模式：将农历输入转为公历
    if (_calMode === 'lunar' && _lunarYear && _lunarMonth && _lunarDay) {
      var ly = _lunarYear;
      var lm = _lunarMonth;
      var ld = _lunarDay;
      if (BaziEngine && BaziEngine.solarToLunar) {
        // 搜索匹配的公历日期（农历→公历）
        var found = false;
        for (var sy = ly - 1; sy <= ly + 2 && !found; sy++) {
          if (sy < 1900 || sy > 2100) continue;
          for (var sm = 1; sm <= 12 && !found; sm++) {
            var maxDay = new Date(sy, sm, 0).getDate();
            for (var sd = 1; sd <= maxDay && !found; sd++) {
              var lunar = BaziEngine.solarToLunar(sy, sm, sd);
              var matchLeap = _isLeap ? lunar.isLeap : !lunar.isLeap;
              if (lunar.year === ly && lunar.month === lm && lunar.day === ld && matchLeap) {
                document.getElementById('birth-year').value = sy;
                document.getElementById('birth-month').value = sm;
                document.getElementById('birth-day').value = sd;
                found = true;
              }
            }
          }
        }
        if (!found) {
          if (_isLeap) alert('該年無此閏月，請重新選擇');
          closePicker();
          return;
        }
      }
    }
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
        if (_calMode === 'lunar') {
          if (val >= 1900 && val <= 2100) _lunarYear = val;
        } else if (val >= 1940 && val <= new Date().getFullYear()) {
          yearSel.value = val;
          updateDayOptions();
        }
      } else if (field === 'month') {
        if (_calMode === 'lunar') {
          if (val >= 1 && val <= 12) _lunarMonth = val;
        } else if (val >= 1 && val <= 12) {
          monthSel.value = val;
          updateDayOptions();
        }
      } else if (field === 'day') {
        if (_calMode === 'lunar') {
          if (val >= 1 && val <= 30) _lunarDay = val;
        } else {
          var maxDay = new Date(parseInt(yearSel.value), parseInt(monthSel.value), 0).getDate();
          if (val >= 1 && val <= maxDay) daySel.value = val;
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
  var _isLeap = false;
  document.querySelectorAll('.cal-segmented:not(#leap-toggle) .pcal-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.cal-segmented:not(#leap-toggle) .pcal-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      _calMode = btn.dataset.pcal;
      var leapEl = document.getElementById('leap-toggle');
      if (_calMode === 'lunar') {
        updateLeapToggle();
        if (leapEl) leapEl.classList.add('show');
      } else {
        if (leapEl) leapEl.classList.remove('show');
        _isLeap = false;
      }
      if (leapEl) leapEl.querySelectorAll('.pcal-btn').forEach(function(b, i) { b.classList.toggle('active', i === 0); });
      updatePlineDisplay();
    });
  });
  // 查找该农历年是否有闰月（O(1)查表，不阻塞主线程）
  function updateLeapToggle() {
    var leapEl = document.getElementById('leap-toggle');
    if (!leapEl) return;
    var testYear = _lunarYear || new Date().getFullYear();
    var leapMonth = (BaziEngine && BaziEngine.getLeapMonth) ? BaziEngine.getLeapMonth(testYear) : 0;
    var leapBtns = leapEl.querySelectorAll('.pcal-btn');
    if (leapBtns.length > 1) {
      leapBtns[1].textContent = leapMonth > 0 ? '閏' + leapMonth + '月' : '閏月';
    }
    _isLeap = false;
    if (leapBtns.length > 0) leapBtns[0].classList.add('active');
    if (leapBtns.length > 1) leapBtns[1].classList.remove('active');
  }
  // 闰月切换
  document.querySelectorAll('#leap-toggle .pcal-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('#leap-toggle .pcal-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      _isLeap = btn.dataset.leap === '1';
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
    'tab-tips': '解讀'
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

  // 农历模式：显示用户输入的农历值或转换值
  if (_calMode === 'lunar') {
    if (_lunarYear) {
      if (elY) elY.textContent = _lunarYear + '年';
      if (elM) elM.textContent = (_lunarMonth || '—') + '月';
      if (elD) elD.textContent = (_lunarDay || '—') + '日';
    } else if (y && m && d && BaziEngine && BaziEngine.solarToLunar) {
      try {
        var lunar = BaziEngine.solarToLunar(parseInt(y), parseInt(m), parseInt(d));
        if (elY) elY.textContent = lunar.year + '年';
        if (elM) elM.textContent = (lunar.isLeap ? '閏' : '') + lunar.month + '月';
        if (elD) elD.textContent = lunar.day + '日';
      } catch(e) {
        if (elY) elY.textContent = '—';
      }
    }
  } else {
    if (elY) elY.textContent = (y ? y + '年' : '—');
    if (elM) elM.textContent = (m ? m + '月' : '—');
    if (elD) elD.textContent = (d ? d + '日' : '—');
  }
  if (elH) elH.textContent = (h || h === '0') ? h + '時' : '—';
}

// ========== 更新西曆/農曆显示 ==========
function updateDateDisplay() {
  var year = parseInt(document.getElementById('birth-year').value);
  var month = parseInt(document.getElementById('birth-month').value);
  var day = parseInt(document.getElementById('birth-day').value);
  var hourStr = document.getElementById('birth-hour').value;
  var hour = hourStr !== '' ? parseInt(hourStr) : -1;

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
var _szSelected = (function() {
  var now = new Date();
  var r = BaziEngine.paipan(now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), '男');
  return {
    year: { gan: r.fourPillars.year.gan, zhi: r.fourPillars.year.zhi },
    month: { gan: r.fourPillars.month.gan, zhi: r.fourPillars.month.zhi },
    day: { gan: r.fourPillars.day.gan, zhi: r.fourPillars.day.zhi },
    hour: { gan: r.fourPillars.hour.gan, zhi: r.fourPillars.hour.zhi }
  };
})();
var _szSearchResults = [];

function initSizhuPicker() {
  var TIAN_GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  var DI_ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  var PILLARS = ['year', 'month', 'day', 'hour'];

  // 构建轮盘选项（点击弹出选择框）
  function buildWheel(wheelId, items, selectedVal) {
    var wheel = document.getElementById(wheelId);
    if (!wheel) return;
    wheel.innerHTML = '<div class="sz-wheel-val">' + selectedVal + '</div>';
    wheel.dataset.items = JSON.stringify(items);
    wheel.addEventListener('click', function() {
      showSzPicker(wheelId, items, selectedVal);
    });
  }

  var YANG_GAN = ['甲','丙','戊','庚','壬'];
  var YANG_ZHI = ['子','寅','辰','午','申','戌'];

  function isYang(gz) { return YANG_GAN.indexOf(gz) >= 0 || YANG_ZHI.indexOf(gz) >= 0; }

  // 根据已选内容过滤可选干支
  function getFilteredItems(wheelId, allItems, applyFull) {
    var parts = wheelId.replace('sz-wheel-', '').split('-');
    var pillar = parts[0], type = parts[1];
    // 第一次点天干：全部可选；第一次点地支：按当前天干阴阳过滤
    if (!applyFull) {
      if (type === 'zhi') {
        var g = (_szSelected[pillar] && _szSelected[pillar].gan) || '';
        if (g) return allItems.filter(function(z) { return isYang(g) === isYang(z); });
      }
      return allItems; // 天干全部可选
    }
    // 手动选择后：地支遵循阳对阳/阴对阴，天干不受地支阴阳限制
    if (type === 'zhi') {
      var pg = (_szSelected[pillar] && _szSelected[pillar].gan) || '';
      if (pg) return allItems.filter(function(z) { return isYang(pg) === isYang(z); });
    }
    // 月干/时干按五虎遁/五鼠遁锁定序列
    if (pillar === 'month' && type === 'gan') {
      var yearGan = (_szSelected.year && _szSelected.year.gan) || '';
      if (yearGan) {
        var startMap = {'甲':'丙','乙':'戊','丙':'庚','丁':'壬','戊':'甲','己':'丙','庚':'戊','辛':'庚','壬':'壬','癸':'甲'};
        var startGan = startMap[yearGan];
        if (startGan) { var startIdx = TIAN_GAN.indexOf(startGan); var f = []; for (var i = 0; i < TIAN_GAN.length; i++) f.push(TIAN_GAN[(startIdx + i) % 10]); return f; }
      }
    }
    if (pillar === 'hour' && type === 'gan') {
      var dayGan = (_szSelected.day && _szSelected.day.gan) || '';
      if (dayGan) {
        var startMap2 = {'甲':'甲','乙':'丙','丙':'戊','丁':'庚','戊':'壬','己':'甲','庚':'丙','辛':'戊','壬':'庚','癸':'壬'};
        var startGan2 = startMap2[dayGan];
        if (startGan2) { var startIdx2 = TIAN_GAN.indexOf(startGan2); var f2 = []; for (var i = 0; i < TIAN_GAN.length; i++) f2.push(TIAN_GAN[(startIdx2 + i) % 10]); return f2; }
      }
    }
    return allItems;
  }

  // 弹出顺序：年干→年支→月干→月支→日干→日支→时干→时支
  var SZ_SEQUENCE = [
    'sz-wheel-year-gan','sz-wheel-year-zhi',
    'sz-wheel-month-gan','sz-wheel-month-zhi',
    'sz-wheel-day-gan','sz-wheel-day-zhi',
    'sz-wheel-hour-gan','sz-wheel-hour-zhi'
  ];

  function autoOpenNext(currentWheelId) {
    var idx = SZ_SEQUENCE.indexOf(currentWheelId);
    if (idx < 0 || idx >= SZ_SEQUENCE.length - 1) return;
    var nextId = SZ_SEQUENCE[idx + 1];
    var nextWheel = document.getElementById(nextId);
    if (!nextWheel) return;
    var nextVal = nextWheel.querySelector('.sz-wheel-val');
    if (!nextVal) return;
    var curText = nextVal.textContent;
    // Determine items for next wheel
    var parts = nextId.replace('sz-wheel-', '').split('-');
    var items = (parts[1] === 'gan') ? TIAN_GAN : DI_ZHI;
    setTimeout(function() { showSzPicker(nextId, items, curText); }, 200);
  }

  var _szHasSelection = false;

  function showSzPicker(wheelId, items, currentVal) {
    var oldPicker = document.querySelector(".sz-inline-picker");
    if (oldPicker) oldPicker.remove();
    var filteredItems = getFilteredItems(wheelId, items, _szHasSelection);
    var container = document.querySelector(".sizhu-select-area");
    if (!container) return;

    // 计算三角箭头位置：指向被点击的轮盘中心
    var wheel = document.getElementById(wheelId);
    var arrowLeft = '50%';
    if (wheel) {
      var wheelRect = wheel.getBoundingClientRect();
      var containerRect = container.getBoundingClientRect();
      var wheelCenter = wheelRect.left + wheelRect.width / 2;
      // 箭头相对于picker定位，picker距容器左边18px
      arrowLeft = (wheelCenter - containerRect.left - 18) + 'px';
    }

    var colsClass = items.length === 10 ? ' cols-5' : ' cols-6';
    var html = '<div class="sz-inline-picker"><div class="sz-picker-arrow" style="left:' + arrowLeft + '"></div><div class="sz-picker-grid' + colsClass + '">';
    for (var i = 0; i < filteredItems.length; i++) {
      html += '<div class="sz-pick-item' + (filteredItems[i] === currentVal ? ' selected' : '') + '" data-val="' + filteredItems[i] + '">' + filteredItems[i] + '</div>';
    }
    html += '</div></div>';
    container.insertAdjacentHTML("beforeend", html);
    var picker = container.querySelector(".sz-inline-picker");
    picker.querySelectorAll(".sz-pick-item").forEach(function(item) {
      item.addEventListener("click", function() {
        var val = this.dataset.val;
        var w = document.getElementById(wheelId);
        if (w) {
          var vEl = w.querySelector(".sz-wheel-val");
          vEl.textContent = val;
          vEl.style.background = "#4a90d9";
          vEl.style.color = "#fff";
          w.dataset.selected = val;
        }
        _szHasSelection = true;
        updateSzSelection();
        updateSzDisplay();
        picker.remove();
        autoOpenNext(wheelId);
      });
    });
  }

  function updateWheelSelection(wheel, inner, items) {
    // 不再需要滚动检测，保留函数签名兼容
  }

  function updateSzSelection() {
    var wheels = document.querySelectorAll('.sz-wheel');
    wheels.forEach(function(w) {
      var valEl = w.querySelector('.sz-wheel-val');
      if (!valEl) return;
      var val = valEl.textContent;
      var id = w.id;
      var parts = id.replace('sz-wheel-', '').split('-');
      var pillar = parts[0];
      var type = parts[1];
      if (_szSelected[pillar]) {
        _szSelected[pillar][type] = val;
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
          document.getElementById('birth-hour').value = r.hour;
          // 先更新日选项，再设日值（确保选项存在）
          updateDayOptions();
          document.getElementById('birth-day').value = r.day;
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
  // 取消弹窗按钮（关闭干支选择弹窗）
  document.getElementById('sizhu-cancel-btn').addEventListener('click', function() {
    var picker = document.querySelector('.sz-inline-picker');
    if (picker) picker.remove();
  });

  // 点击弹窗下方空白区域取消弹窗
  document.querySelector('.sizhu-select-area').addEventListener('click', function(e) {
    var picker = document.querySelector('.sz-inline-picker');
    if (!picker) return;
    // 排除弹窗内部和轮盘的点击
    if (e.target.closest('.sz-inline-picker') || e.target.closest('.sz-wheel')) return;
    picker.remove();
  });

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

// 跳转到细盘tab，强制刷新为当前大运/流年
function switchToDetailTab() {
  _selectedDaYunIdx = null;
  _selectedLiuNianYear = null;
  _selectedXiaoYunIdx = undefined;
  renderTabDetail(currentResult);
  document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
  document.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });
  var detailBtn = document.querySelector('.tab-btn[data-tab="tab-detail"]');
  if (detailBtn) detailBtn.classList.add('active');
  var detailTab = document.getElementById('tab-detail');
  if (detailTab) detailTab.classList.add('active');
  document.getElementById('result-header-title').textContent = (currentResult._name || '') + ' 細盤信息';
}

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
    _selectedLiuNianYear = null;

    renderResult(currentResult);
    showPage('result');
    switchToDetailTab();
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
    switchToDetailTab();
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

  // 分隔栏
  rows.push(rowSection('&nbsp;'));
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
    rows.push(rowNormal('提示', '<div class="bval-poem">' + poemLines + '</div>', true));
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

  // 渲染（自动交替白/米色）
  var html = '';
  var rowIdx = 0;
  rows.forEach(function(r, i) {
    // 跳过section标题行，不计入交替
    if (r.indexOf('basic-section-title') >= 0) {
      html += r;
      rowIdx = 0;
      return;
    }
    // 交替白/米色
    if (rowIdx % 2 === 1 && r.indexOf('row-gray') < 0) {
      r = r.replace('basic-info-row', 'basic-info-row row-gray');
    }
    html += r;
    rowIdx++;
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
  var md = month * 100 + day;
  if (md >= 1222 || md <= 119) return '摩羯座';
  if (md <= 218) return '水瓶座';
  if (md <= 320) return '双鱼座';
  if (md <= 419) return '白羊座';
  if (md <= 520) return '金牛座';
  if (md <= 621) return '双子座';
  if (md <= 722) return '巨蟹座';
  if (md <= 822) return '狮子座';
  if (md <= 922) return '处女座';
  if (md <= 1023) return '天秤座';
  if (md <= 1121) return '天蝎座';
  if (md <= 1221) return '射手座';
  return '摩羯座';
}

function getZodiacEn(month, day) {
  var md = month * 100 + day;
  if (md >= 1222 || md <= 119) return 'Capricorn';
  if (md <= 218) return 'Aquarius';
  if (md <= 320) return 'Pisces';
  if (md <= 419) return 'Aries';
  if (md <= 520) return 'Taurus';
  if (md <= 621) return 'Gemini';
  if (md <= 722) return 'Cancer';
  if (md <= 822) return 'Leo';
  if (md <= 922) return 'Virgo';
  if (md <= 1023) return 'Libra';
  if (md <= 1121) return 'Scorpio';
  if (md <= 1221) return 'Sagittarius';
  return 'Capricorn';
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
  var jieNames = ['小寒','立春','驚蟄','清明','立夏','芒種','小暑','立秋','白露','寒露','立冬','大雪'];
  var qiNames = ['大寒','雨水','春分','穀雨','小滿','夏至','大暑','處暑','秋分','霜降','小雪','冬至'];
  var idx = month - 1;
  // 使用引擎精确计算节气时间
  if (BaziEngine && BaziEngine.calcJieQiDate) {
    try {
      var jieIdx = idx * 2;       // 0=小寒,2=立春,4=惊蛰...
      var qiIdx = jieIdx + 1;      // 1=大寒,3=雨水,5=春分...
      var jieDate = BaziEngine.calcJieQiDate(year, jieIdx);
      var qiDate = BaziEngine.calcJieQiDate(year, qiIdx);
      var pad2 = function(n) { return n < 10 ? '0' + n : '' + n; };
      var fmtTime = function(d) {
        return d.getMonth() + 1 + '月' + d.getDate() + '日 ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes());
      };
      return '<div>' + jieNames[idx] + '：' + fmtTime(jieDate) + '</div><div style="color:var(--text-dim);font-size:13px;">' + qiNames[idx] + '：' + fmtTime(qiDate) + '</div>';
    } catch(e) {}
  }
  // fallback: 近似日期
  var jieDays = [5,4,6,5,6,6,7,7,8,8,7,7];
  var qiDays = [20,19,21,20,21,21,23,23,23,24,22,22];
  return '<div>' + jieNames[idx] + ' ' + padNum(jieDays[idx]) + '日</div><div style="color:var(--text-dim);font-size:13px;">' + qiNames[idx] + ' ' + padNum(qiDays[idx]) + '日</div>';
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
  var SHENSHA_XIONG = ['羊刃','孤辰','寡宿','亡神','劫煞','丧门','吊客','灾煞','飞刃','元辰','勾绞','天罗','地网'];

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
    yongShenText = fp.month.zhi + '月喜' + tiaoHou2.mainGan;
    if (tiaoHou2.auxGan) {
      yongShenText += '、' + tiaoHou2.auxGan.split('').join('、');
    }
    yongShenText += '。';
    if (tiaoHou2.description) yongShenText += tiaoHou2.description + '。';
  }
  html += '<div class="chart-hint-section">';
  html += '<div class="chart-hint-title">【命盤日元提示】</div>';
  html += '<div class="chart-hint-text chart-hint-indent-yongshen"><span class="chart-hint-label">用神：</span>' + (yongShenText || '暫無') + '</div>';
  html += '</div>';

  html += '</div>'; // .chart-hints

  document.getElementById('chart-table-wrap').innerHTML = html;
}

// ==================== 理论参考区 ====================
// ========== 窮通寶鑑資料庫（日干+月令 → 詳細論述） ==========
var QIONGTONG_TEXT = {
  '甲寅': '甲木生寅月，建祿格。初春餘寒未盡，先取丙火解凍，次取癸水滋潤。丙癸兩透，富貴雙全。若丙透癸藏，不失儒秀。無丙無癸，平庸之輩。支成火局，洩身太過，須壬水製火扶身。',
  '甲卯': '甲木生卯月，陽刃格。木氣旺盛，首取庚金七殺製刃。庚金需戊土生之，庚戊兩透，大貴之格。無庚用辛，力薄。若丙丁並透，食傷洩秀，文人雅士。水多木浮，非貧即夭。',
  '甲辰': '甲木生辰月，衰地。辰為水庫，土濕木寒，先取丙火照暖，次取癸水滋潤。丙癸雙透，科甲有望。土重木折，須以庚金劈甲引丁。財多身弱，比劫為先。',
  '甲巳': '甲木生巳月，食神泄身。火旺木焚，首取壬水調候為急。庚金發水源，壬庚兩透，富貴顯達。無壬用癸，力薄終為下格。火炎土燥，非壬無解。',
  '甲午': '甲木生午月，傷官當令。火勢猛烈，木被焚燒，先取壬水調候，次取庚金助水源。壬庚通透，功名顯達。無壬用癸，終難發達。火土並透，燥烈難醫。',
  '甲未': '甲木生未月，墓庫之地。未為燥土，木氣衰弱。先取癸水潤土生木，次取庚金劈木疏通。癸庚兩透，名利雙收。火土過旺，需壬水解厄。',
  '甲申': '甲木生申月，七殺當令。秋金剋木，先取丁火製殺護身。丁火需甲木為引，丁甲通透，權威顯赫。無丁用丙，終欠貴氣。金多水寒，非貧即賤。',
  '甲酉': '甲木生酉月，正官當令。秋金銳利，木氣凋零。先取丁火製金護木，次取壬水洩金之銳。丁壬兩透，文武雙全。無丁無壬，虛名虛利。',
  '甲戌': '甲木生戌月，雜氣財官。戌為火庫燥土，先取壬水潤澤，次取庚金劈木。壬庚通透，可致顯貴。火炎土燥，終身勞碌。木弱需甲比助。',
  '甲亥': '甲木生亥月，長生之地。亥中壬水為印，木得水生。先取丙火照暖，次取戊土制水。丙戊雙透，富貴可取。水多木浮，需戊土堤防。',
  '甲子': '甲木生子月，正印當令。天寒地凍，木不受生。先取丙火解凍為急，次取戊土制水護火。丙戊兩透，功名成就。無丙火，雖有才智難伸。',
  '甲丑': '甲木生丑月，財庫之地。丑為濕土，冬寒未解。先取丙火暖局，次取庚金劈木引丁。丙庚通透，富貴可期。財多身弱，比劫為助。',
  '乙寅': '乙木生寅月，建祿格。初春猶寒，取丙火解凍為先，癸水次之。丙癸相濟，富貴雙美。丙多火炎，需水潤澤。木多成林，庚金修剪。',
  '乙卯': '乙木生卯月，建祿得祿。仲春木旺，先取丙火洩秀，次取癸水滋潤。丙癸雙透，聰明俊秀。木氣太盛，庚金斲伐為權。無丙無癸，庸常之命。',
  '乙辰': '乙木生辰月，餘氣猶存。辰土濕潤，木有餘根。取癸水潤土生木，丙火照暖次之。癸丙兩全，名利有成。土重木折，需甲木疏土。',
  '乙巳': '乙木生巳月，傷官當令。火旺洩身，乙木枯焦。首取壬水解炎為急，次取庚金發水源。壬水透干，富貴有準。無壬用癸，終為偏枯。',
  '乙午': '乙木生午月，食神泄身。火勢炎炎，乙木自焚。先取壬水解炎護木，次取庚金助水。壬庚通透，名利裕如。無壬用癸，僅免飢寒。',
  '乙未': '乙木生未月，墓庫之地。未為燥土，木根枯槁。先取癸水潤土養木，次取庚金劈甲引丁。癸庚通透，有名有利。土燥木枯，終身勞苦。',
  '乙申': '乙木生申月，官殺混雜。秋金剋木，乙木凋傷。先取丙火合辛製庚，次取癸水洩金生木。丙癸通透，富貴雙全。金多無制，夭賤之命。',
  '乙酉': '乙木生酉月，七殺當令。秋金銳利，乙木受剋。先取丁火製殺護身，次取癸水洩金之氣。丁癸兩透，權貴顯達。無丁無癸，虛而不實。',
  '乙戌': '乙木生戌月，雜氣財官。戌為火庫燥土，先取癸水潤澤，次取丙火暖局。癸丙相濟，名利可得。燥土傷根，非癸不能解。',
  '乙亥': '乙木生亥月，正印長生。亥中壬水為印，寒水浸木。先取丙火解凍為急，次取戊土制水。丙戊通透，富貴可期。水多無制，飄蕩之命。',
  '乙子': '乙木生子月，偏印當令。嚴冬水冷，乙木不生。先取丙火暖局為急，次取戊土制水。丙戊雙透，功名有望。無丙火則寒儒之命。',
  '乙丑': '乙木生丑月，財庫濕土。冬末猶寒，先取丙火照暖。濕土培根，不需癸水。丙火透干，名利可成。無丙則下格。',
  '丙寅': '丙火生寅月，長生之位。寅中甲木為印，丙得長生。取壬水為用，庚金輔之。壬庚通透，富貴雙全。丙火太旺，需壬水調劑。',
  '丙卯': '丙火生卯月，沐浴之地。卯中乙木為印，木能生火。仍取壬水為尊，庚金發源。壬庚雙透，功名顯赫。無壬用癸，貴而不富。',
  '丙辰': '丙火生辰月，冠帶之位。辰為水庫濕土，晦火之光。取甲木疏土生火，壬水次之。甲壬通透，富貴可期。土重無甲，愚鈍之人。',
  '丙巳': '丙火生巳月，建祿之地。火勢炎烈，先取壬水解炎為急。壬水需庚金發源，庚壬兩透，功名富貴。無壬用癸，效力減半。',
  '丙午': '丙火生午月，陽刃之地。火勢猛烈，不可嚮邇。首取壬水調候，庚金助之。壬庚通透，將帥之才。無壬無癸，夭折之命。火炎土燥，禍不旋踵。',
  '丙未': '丙火生未月，衰地。未為燥土，洩火之光。取庚金生水，壬水調候。庚壬兩全，名利可期。土重晦火，甲木疏之。',
  '丙申': '丙火生申月，病地。申中壬水為殺，秋金耗火。先取甲木化殺生身，次取庚金劈甲引丁。甲庚通透，文武兼備。金多無制，貧寒之命。',
  '丙酉': '丙火生酉月，死地。酉中辛金正財，耗火之光。取甲木生火為急，乙木次之。甲木透干，富貴有準。無甲無乙，虛名而已。',
  '丙戌': '丙火生戌月，墓庫之地。戌為火庫燥土，丙有餘光。取甲木疏土生火，壬水次之。甲壬通透，可獲功名。土重無甲，愚頑之輩。',
  '丙亥': '丙火生亥月，絕地。亥中壬水七殺剋身，先取甲木化殺生火為急。甲木透干，絕處逢生。甲戊並透，富貴可期。無甲則凶。',
  '丙子': '丙火生子月，胎地。子中癸水正官，嚴冬火絕。先取甲木化水生火，次取戊土制水。甲戊兩透，功名顯達。無甲之火，燈燭之光。',
  '丙丑': '丙火生丑月，養地。丑為濕土，晦火之輝。取甲木疏土培火，戊土次之。甲木透干，名利可望。濕土無甲，終身貧寒。',
  '丁寅': '丁火生寅月，敗地。寅中甲木正印，木多火塞。取庚金劈甲引丁，壬水次之。庚壬通透，富貴可期。木多無庚，終為貧儒。',
  '丁卯': '丁火生卯月，病地。卯中乙木偏印，木能生火。取庚金劈木為先，甲木次之。庚甲通透，名利有望。木多火窒，需庚金疏通。',
  '丁辰': '丁火生辰月，衰地。辰為濕土水庫，晦丁之光。取甲木疏土生火，庚金劈甲。甲庚雙透，名利雙收。無甲則昏暗無光。',
  '丁巳': '丁火生巳月，帝旺之地。火勢炎上，取壬水調候為急。壬水需庚金發源，庚壬兩透，衣錦榮歸。無壬用癸，僅得小富。',
  '丁午': '丁火生午月，建祿得祿。火炎土燥，先取壬水解炎，庚金助之。庚壬通透，功名成就。無壬無癸，多為僧道。',
  '丁未': '丁火生未月，冠帶之位。未為燥土火庫，丁火有根。仍取庚金生水，壬水調候。庚壬通透，可致顯貴。土燥無水，終身碌碌。',
  '丁申': '丁火生申月，沐浴之地。申中壬水正官，秋金耗洩。取甲木生火化殺，庚金次之。甲庚通透，富貴可取。無甲則丁火微弱。',
  '丁酉': '丁火生酉月，長生之地。酉中辛金偏財，金旺火衰。取甲木生火為急，庚金劈甲次之。甲木透干，絕處逢生。無甲則虛花而已。',
  '丁戌': '丁火生戌月，墓庫之地。戌為火庫燥土，丁火存根。取甲木疏土生火，庚金次之。甲庚通透，名利可得。土重無甲，昏庸之人。',
  '丁亥': '丁火生亥月，胎地。亥中壬水正官，嚴冬火熄。取甲木化水生火為急，戊土制水次之。甲戊雙透，絕處逢生。無甲則夭。',
  '丁子': '丁火生子月，絕地。子中癸水七殺，寒水剋火。先取甲木化殺生身，次取戊土制水。甲戊通透，功名顯達。無甲無戊，貧賤孤寒。',
  '丁丑': '丁火生丑月，墓地。丑為濕土金庫，晦丁之光。取甲木疏土生火為先。甲木透干，名利可期。土濕無甲，終為下格。',
  '戊寅': '戊土生寅月，長生之地。寅中甲木七殺剋身，先取丙火化殺生身。丙火通透，富貴有準。甲木太旺，庚金制之。丙癸相濟為美。',
  '戊卯': '戊土生卯月，敗地。卯中乙木正官，木旺土虛。取丙火化木生土為急。丙火透干，富貴有望。無丙用丁，終欠力量。',
  '戊辰': '戊土生辰月，建祿之地。辰為水庫濕土，戊得強根。取甲木疏土為先，丙火次之。甲丙通透，功名事業皆有可觀。',
  '戊巳': '戊土生巳月，臨官之地。巳中丙火為印，火炎土燥。先取壬水解炎為急，甲木次之。壬甲通透，富貴可期。無壬則亢旱。',
  '戊午': '戊土生午月，帝旺之地。午中丁火正印，火旺土焦。取壬水調候為急，庚金發水源。壬庚通透，功名顯赫。火炎無水，夭貧之命。',
  '戊未': '戊土生未月，冠帶之地。未為燥土，戊有強根。取壬水解炎，庚金次之。壬庚通透，名利可期。土重無水，愚頑之輩。',
  '戊申': '戊土生申月，病地。申中庚金食神，金洩土氣。取丙火制金生身為急。丙火通透，富貴有準。無丙則土虛洩盡。',
  '戊酉': '戊土生酉月，死地。酉中辛金傷官，金旺土虛。取丙火制金生土為先。丙火透干，不失富貴。無丙用丁，終為偏枯。',
  '戊戌': '戊土生戌月，墓庫之地。戌為燥土火庫，戊得強根。取甲木疏土為先，丙火次之。甲丙通透，事業有成。土重無甲，閉塞不通。',
  '戊亥': '戊土生亥月，絕地。亥中壬水偏財，寒水浸土。取丙火暖局生身為急，甲木次之。丙甲通透，絕處逢生。無丙則凍土。',
  '戊子': '戊土生子月，胎地。子中癸水正財，嚴冬土凍。取丙火解凍為急，甲木疏土次之。丙甲雙透，功名可望。無丙則貧寒。',
  '戊丑': '戊土生丑月，養地。丑為濕土金庫，土氣尚存。取丙火暖局為先，甲木次之。丙甲通透，名利可成。濕土無火，終為貧寒。',
  '己寅': '己土生寅月，死地。寅中甲木正官剋身，先取丙火化官生身。丙火通透，富貴有準。木旺土傾，需火通關。',
  '己卯': '己土生卯月，病地。卯中乙木七殺剋身，木旺土虛。取丙火化殺生土為急。丙火透干，絕處逢生。無丙則貧夭。',
  '己辰': '己土生辰月，帝旺之地。辰為水庫濕土，己得強根。取丙火暖土為先，甲木疏土次之。丙甲通透，功名成就。',
  '己巳': '己土生巳月，臨官之地。巳中丙火正印，火炎土燥。取壬水解炎為急，甲木次之。壬甲通透，富貴可期。',
  '己午': '己土生午月，建祿得祿。午中丁火偏印，火旺土焦。先取壬水解炎調候，庚金發水源。壬庚通透，名利雙收。',
  '己未': '己土生未月，冠帶之地。未為燥土火庫，己土太旺。取壬水解炎，庚金助之。壬庚通透，功名可成。土燥無水，愚頑之命。',
  '己申': '己土生申月，沐浴之地。申中庚金傷官洩身，取丙火制金生土。丙火通透，富貴可期。無丙則土洩殆盡。',
  '己酉': '己土生酉月，長生之地。酉中辛金食神洩身，金旺土虛。取丙火制金生身為急。丙火透干，不失富貴。',
  '己戌': '己土生戌月，墓庫之地。戌為燥土火庫，己得強根。取甲木疏土，丙火次之。甲丙通透，事業有成。',
  '己亥': '己土生亥月，胎地。亥中壬水正財，寒水浸土。取丙火暖局生身為急。丙火透干，名利可望。無丙則凍土貧寒。',
  '己子': '己土生子月，絕地。子中癸水偏財，冬水泛濫。取丙火解凍為急，戊土制水次之。丙戊通透，功名有望。',
  '己丑': '己土生丑月，墓地。丑為濕土金庫，己得微根。取丙火暖局為先。丙火透干，富貴可期。濕土無火，寒儒而已。',
  '庚寅': '庚金生寅月，絕地。寅中甲木偏財，木旺金缺。取戊土生金為先，丙火煅金次之。戊丙通透，絕處逢生。木多金損，需土為救。',
  '庚卯': '庚金生卯月，胎地。卯中乙木正財，木盛金衰。取戊土生金為急，庚金比助次之。戊土透干，名利可成。無戊則金虛。',
  '庚辰': '庚金生辰月，養地。辰為濕土，能生庚金。取丙火煅金為先，甲木疏土次之。丙甲通透，功名顯達。土重埋金，甲木疏之。',
  '庚巳': '庚金生巳月，長生之地。巳中丙火七殺，火旺金熔。取壬水制火護金為急，戊土生金次之。壬戊通透，富貴雙全。',
  '庚午': '庚金生午月，沐浴之地。午中丁火正官，火旺鎔金。首取壬水制火為急，己土生金次之。壬己兩透，功名可望。',
  '庚未': '庚金生未月，冠帶之地。未為燥土，能脆庚金。取壬水潤土護金，己土次之。壬己通透，富貴可期。',
  '庚申': '庚金生申月，建祿之地。申為庚之祿，金氣旺盛。取丙丁火煅金為先，壬水次之。丙壬通透，文武全才。金多無火，頑鈍之輩。',
  '庚酉': '庚金生酉月，帝旺之地。酉為庚之刃，金氣極旺。取丙丁火煉金為急。丙火透干，可成大器。無火則頑金無用。',
  '庚戌': '庚金生戌月，衰地。戌為燥土火庫，脆金藏火。取壬水潤土護金為先。壬水透干，名利可期。土燥無水，金被埋沒。',
  '庚亥': '庚金生亥月，病地。亥中壬水食神，水冷金寒。取丙火暖局為急，戊土制水次之。丙戊通透，富貴可望。',
  '庚子': '庚金生子月，死地。子中癸水傷官，寒水洩金。取丙火解凍為急，戊土制水次之。丙戊雙透，功名顯達。無丙則寒儒。',
  '庚丑': '庚金生丑月，墓庫之地。丑為濕土金庫，庚得印生。取丙火暖局煅金為先。丙火透干，富貴有準。寒金無火，終難發達。',
  '辛寅': '辛金生寅月，胎地。寅中丙火正官，木旺火生。取壬水制火護金為先，己土生金次之。壬己通透，名利可期。',
  '辛卯': '辛金生卯月，絕地。卯中乙木偏財，木盛金衰。取己土生金為急，壬水次之。己土透干，絕處逢生。無己則金消。',
  '辛辰': '辛金生辰月，墓地。辰為濕土，能生辛金。取丙火煅金為先，壬水淘洗次之。丙壬通透，功名成就。土重埋金，甲木疏之。',
  '辛巳': '辛金生巳月，死地。巳中丙火正官剋金，火旺金熔。先取壬水制火護金為急，己土生金次之。壬己通透，富貴可期。',
  '辛午': '辛金生午月，病地。午中丁火七殺剋金，火熱金銷。取壬水制火為急，己土次之。壬己雙透，功名可望。無壬則危。',
  '辛未': '辛金生未月，衰地。未為燥土，脆金藏火。取壬水潤土護金為先。壬水透干，名利可成。土燥金脆，非壬不解。',
  '辛申': '辛金生申月，帝旺之地。申為庚之祿，辛得劫助。取丙火煅金為先，壬水淘洗次之。丙壬通透，富貴雙全。',
  '辛酉': '辛金生酉月，建祿之地。酉為辛之祿，金氣純粹。取壬水淘洗為先，丙火次之。壬丙通透，金清水白，文貴之命。',
  '辛戌': '辛金生戌月，冠帶之地。戌為燥土火庫，脆金。取壬水潤土為先。壬水透干，富貴可期。土燥無水，金脆無用。',
  '辛亥': '辛金生亥月，沐浴之地。亥中壬水傷官，水冷金寒。取丙火暖局為急，戊土次之。丙戊通透，名利有望。',
  '辛子': '辛金生子月，長生之地。子中癸水食神，寒水浸金。取丙火解凍為急，戊土制水次之。丙戊雙透，功名顯達。',
  '辛丑': '辛金生丑月，養地。丑為濕土金庫，辛得印生。取丙火暖局煅金為先。丙火透干，富貴有準。寒金無火，終難出頭。',
  '壬寅': '壬水生寅月，病地。寅中甲木食神洩水，取庚金發水源為先，戊土次之。庚戊通透，富貴可取。木多水涸，需金生助。',
  '壬卯': '壬水生卯月，死地。卯中乙木傷官洩水，木盛水衰。取庚金生水為急，辛金次之。庚金透干，名利可成。無金則水枯。',
  '壬辰': '壬水生辰月，墓庫之地。辰為水庫，壬得強根。取甲木疏土為先，庚金次之。甲庚通透，功名事業有成。',
  '壬巳': '壬水生巳月，絕地。巳中丙火偏財，火旺水乾。取庚金生水為急，壬水比助次之。庚壬通透，絕處逢生。火旺無金，貧夭。',
  '壬午': '壬水生午月，胎地。午中丁火正財，火炎水涸。取庚金發水源為急，癸水次之。庚癸通透，富貴有準。無庚則危。',
  '壬未': '壬水生未月，養地。未為燥土，剋水。取庚金生水為先，辛金次之。庚金透干，名利可期。土燥無金，終難發達。',
  '壬申': '壬水生申月，長生之地。申為壬之長生，金水相生。取戊土制水為先，丙火次之。戊丙通透，富貴可成。水多無制，泛濫。',
  '壬酉': '壬水生酉月，沐浴之地。酉中辛金正印，金能生水。取戊土制水為先，甲木次之。戊甲通透，功名可望。',
  '壬戌': '壬水生戌月，冠帶之地。戌為燥土火庫，剋水。取庚金生水為急。庚金透干，富貴可期。土燥無金，貧賤之命。',
  '壬亥': '壬水生亥月，建祿之地。亥為壬之祿，水性汪洋。取戊土堤防為急，丙火次之。戊丙雙透，功名顯赫。水多無戊，飄蕩。',
  '壬子': '壬水生子月，帝旺之地。子為壬之刃，水勢滔天。取戊土制水為急，丙火暖局次之。戊丙通透，富貴極品。無戊則泛濫成災。',
  '壬丑': '壬水生丑月，衰地。丑為濕土，能蓄水。取丙火暖局為先，甲木次之。丙甲通透，名利可成。寒水無火，凍結不流。',
  '癸寅': '癸水生寅月，沐浴之地。寅中甲木傷官洩水，取庚金生水為先。庚金透干，富貴可期。木多水涸，非金不救。',
  '癸卯': '癸水生卯月，長生之地。卯中乙木食神洩水，木盛水衰。取庚金生水為急，辛金次之。庚金透干，名利有望。',
  '癸辰': '癸水生辰月，墓庫之地。辰為水庫，癸得歸根。取甲木疏土為先，丙火次之。甲丙通透，功名事業可成。',
  '癸巳': '癸水生巳月，胎地。巳中丙火正財，火旺水乾。取庚金生水為急，辛金次之。庚金透干，絕處逢生。無金則涸。',
  '癸午': '癸水生午月，絕地。午中丁火偏財，烈日蒸水。取庚金發水源為急。庚金透干，富貴有準。無庚則水枯夭折。',
  '癸未': '癸水生未月，墓地。未為燥土剋水，癸水微弱。取庚金生水為急，辛金次之。庚金透干，名利可期。土燥無金則貧。',
  '癸申': '癸水生申月，死地。申中庚金正印，金能生水。取丙火暖局為先，甲木次之。丙甲通透，富貴可期。',
  '癸酉': '癸水生酉月，病地。酉中辛金偏印，金多水濁。取甲木洩水為先，丙火次之。甲丙通透，功名可望。',
  '癸戌': '癸水生戌月，衰地。戌為燥土火庫，剋水。取庚金生水為急。庚金透干，名利可成。土燥無金，貧賤之人。',
  '癸亥': '癸水生亥月，帝旺之地。亥為癸之刃，水勢浩大。取戊土制水為急，丙火暖局次之。戊丙通透，富貴雙全。',
  '癸子': '癸水生子月，建祿之地。子為癸之祿，水性純陰。取丙火暖局為急，戊土次之。丙戊通透，功名顯達。寒水無火，清冷。',
  '癸丑': '癸水生丑月，冠帶之地。丑為濕土，能蓄水養金。取丙火暖局為先，甲木次之。丙甲通透，名利可成。'
};

function renderTheorySection(result) {
  // 计算本八字透了哪些天干（四柱天干 + 全部藏干）
  var fp = result.fourPillars;
  var allGans = [fp.year.gan, fp.month.gan, fp.day.gan, fp.hour.gan];
  var CANG_GAN = BaziEngine._constants.ZHI_CANG_GAN;
  ['year','month','day','hour'].forEach(function(p) {
    (CANG_GAN[fp[p].zhi] || []).forEach(function(g) { allGans.push(g); });
  });

  // 窮通寶鑑解读
  var qiongtongHtml = '';
  if (result.tiaoHou && result.tiaoHou.mainGan) {
    var tiaoGans = [result.tiaoHou.mainGan];
    if (result.tiaoHou.auxGan) {
      var auxArr = result.tiaoHou.auxGan.split('');
      auxArr.forEach(function(g) { if (tiaoGans.indexOf(g) < 0) tiaoGans.push(g); });
    }
    var tiaoStr = tiaoGans.join('、');
    qiongtongHtml += '<div class="theory-tiaohou-title">調候用神提示：' + tiaoStr + '</div>';

    var appeared = [];
    tiaoGans.forEach(function(g) {
      if (allGans.indexOf(g) >= 0) appeared.push(g);
    });
    if (appeared.length > 0) {
      qiongtongHtml += '<div class="theory-tiaohou-body">本八字：透 ' + appeared.join('、') + '</div>';
    } else {
      qiongtongHtml += '<div class="theory-tiaohou-body">本八字：未透調候用神</div>';
    }

    // 論X生X月
    var key = fp.day.gan + fp.month.zhi;
    var qtText = QIONGTONG_TEXT[key] || '';
    qiongtongHtml += '<div class="theory-tiaohou-title" style="font-size:14px;margin-top:10px;">論' + fp.day.gan + '生' + fp.month.zhi + '月</div>';

    if (qtText) {
      // VIP锁定区
      qiongtongHtml += '<div class="vip-lock-wrap" id="vip-lock-' + key + '">';
      qiongtongHtml += '<div class="vip-lock-overlay">';
      qiongtongHtml += '<div class="vip-lock-icon">🔒</div>';
      qiongtongHtml += '<div class="vip-lock-text">開通VIP即可查看詳細論述</div>';
      qiongtongHtml += '<button class="vip-unlock-btn" onclick="unlockVip(\'' + key + '\')">開通VIP · 查看全部</button>';
      qiongtongHtml += '</div>';
      qiongtongHtml += '<div class="vip-content-hidden">' + qtText + '</div>';
      qiongtongHtml += '</div>';
    }
  } else {
    qiongtongHtml = '暫無數據。';
  }

  var theories = [
    { id: 'qiongtong', name: '窮通寶鑑', placeholder: qiongtongHtml },
    { id: 'ditian', name: '滴天髓',
      placeholder: DI_TIAN_SUI[result.fourPillars.day.gan] || '暫無數據。' },
    { id: 'sanming', name: '三命通會', icon: '📚',
      placeholder: '萬民英所著，集明代以前命理大成，論述格局、神煞、六親等。（更多內容敬請期待）' },
    { id: 'bazitiyao', name: '八字提要', icon: '📋',
      placeholder: '以日干配月令地支，取六十甲子日柱逐一解說。（更多內容敬請期待）' },
    { id: 'ziping', name: '子平真詮', icon: '📜',
      placeholder: '沈孝瞻著，以月令透干取格為核心。' + (result.geJu ? '此命為「' + result.geJu.type + '」，月令' + result.geJu.monthZhi + '。' : '暫無數據。') },
    { id: 'yuanhai', name: '淵海子平', icon: '📯',
      placeholder: '宋代徐子平所傳，為八字命理奠基之作，內外十八格體系。（更多內容敬請期待）' },
    { id: 'tianyuan', name: '天元咸巫', icon: '🔮',
      placeholder: '論述天元（天干）與地支的互動關係、咸池桃花等。（更多內容敬請期待）' },
    { id: 'shenfeng', name: '神峰通考', icon: '🏔️',
      placeholder: '張楠著，強調病藥理論，以八字之病取藥為用神。（更多內容敬請期待）' },
    { id: 'qianli', name: '千里命稿', icon: '📝',
      placeholder: '民國韋千里所著，以通俗語言解說命理，適合入門參考。（更多內容敬請期待）' },
    { id: 'wuxingji', name: '五行精紀', icon: '⭐',
      placeholder: '宋代廖中所著，論述五行精微之理，納音、神煞等詳解。（更多內容敬請期待）' },
    { id: 'lixuzhong', name: '李虛中命書', icon: '🔖',
      placeholder: '唐代李虛中所著，以年柱為主的早期命理經典。（更多內容敬請期待）' }
  ];

  var html = '<div class="theory-section">';

  // 可滑动古籍选择栏
  html += '<div class="theory-scroll" id="theory-scroll">';
  theories.forEach(function(t, i) {
    html += '<button class="theory-pill" data-theory="' + t.id + '" onclick="selectTheory(\'' + t.id + '\')">' + t.name + '</button>';
  });
  html += '</div>';

  // 解读内容区
  html += '<div class="theory-content" id="theory-content">';
  html += '<div class="theory-content-hint">點擊上方古籍名稱查看該古籍對本命盤的解讀</div>';
  html += '</div>';

  html += '</div>';

  // 存储理论数据
  window._theoryData = theories;

  return html;
}

// VIP解锁
function unlockVip(key) {
  var wrap = document.getElementById('vip-lock-' + key);
  if (wrap) {
    wrap.classList.add('unlocked');
  }
}

// 理论选择
function selectTheory(id) {
  // 更新pill选中态
  document.querySelectorAll('.theory-pill').forEach(function(p) {
    p.classList.toggle('selected', p.dataset.theory === id);
  });

  // 显示对应内容
  var data = window._theoryData || [];
  var found = null;
  for (var i = 0; i < data.length; i++) {
    if (data[i].id === id) { found = data[i]; break; }
  }

  var contentEl = document.getElementById('theory-content');
  if (!contentEl) return;

  if (found) {
    var bodyHtml = (found.id === 'qiongtong') ? found.placeholder :
      '<div class="theory-content-title">' + found.name + '</div><div class="theory-content-body">' + found.placeholder + '</div>';
    contentEl.innerHTML = bodyHtml;
  } else {
    contentEl.innerHTML = '<div class="theory-content-hint">暫無此理論數據</div>';
  }
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

  var beforeQiYun = currentYear < dy.qiYunYear;

  if (_selectedDaYunIdx === null) {
    if (beforeQiYun) {
      _selectedDaYunIdx = -1; // 未起运，显示小运
    } else {
      _selectedDaYunIdx = dy.daYunList.findIndex(function(d) { return currentYear >= d.startYear && currentYear <= d.endYear; });
      if (_selectedDaYunIdx < 0) _selectedDaYunIdx = 0;
    }
  }
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
  // 大运：仅起运岁数 / 年份，上下显示
  var dyAgeStr = '—';
  if (!isXiaoYunMode && dyData.startAge !== undefined) {
    dyAgeStr = '<span class="xipan-age-sm">' + dyData.startAge + '歲</span><span class="xipan-age-sm">' + dyData.startYear + '</span>';
  } else if (isXiaoYunMode && dyData.startAge !== undefined) {
    dyAgeStr = '<span class="xipan-age-sm">' + dyData.startAge + '歲</span><span class="xipan-age-sm">' + dyData.startYear + '</span>';
  }
  html += '<td>' + dyAgeStr + '</td>';
  // 流年：虚岁 / 年份，上下显示
  var lnAgeStr = '—';
  if (selLiuNian) {
    var lnAge = selLiuNian.year - result.birthInfo.year + 1;
    lnAgeStr = '<span class="xipan-age-sm">' + lnAge + '歲</span><span class="xipan-age-sm">' + selLiuNian.year + '</span>';
  }
  html += '<td>' + lnAgeStr + '</td>';
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
      '<span class="xipan-gan ' + WX_CLASS[wxGan] + '" onclick="showPillarPopup(' + c + ')">' + gan + '</span>' +
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
      '<span class="xipan-zhi ' + WX_CLASS[wxZhi] + '" onclick="showPillarPopup(' + c + ')">' + zhi + '</span>' +
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
    if (currentYear < dy.qiYunYear) {
      _selectedDaYunIdx = -1; // 未起运，显示小运
    } else {
      _selectedDaYunIdx = dy.daYunList.findIndex(function(d) { return currentYear >= d.startYear && currentYear <= d.endYear; });
      if (_selectedDaYunIdx < 0) _selectedDaYunIdx = 0;
    }
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
    qiYunAge: dy.qiYunAge,
    birthYear: result.birthInfo.year
  });

  // ---- 刑冲合害提示 ----
  var isXiaoYunTips = (_selectedDaYunIdx === -1);
  var tipDaYun = isXiaoYunTips ? null : dy.daYunList[_selectedDaYunIdx];
  var tipLiuNian = null;
  if (isXiaoYunTips) {
    var lnYear = _selectedLiuNianYear || currentYear;
    var tg = BaziEngine._constants.TIAN_GAN;
    var dz = BaziEngine._constants.DI_ZHI;
    tipLiuNian = { gan: tg[(lnYear - 4) % 10], zhi: dz[(lnYear - 4) % 12], year: lnYear };
  } else if (tipDaYun) {
    tipLiuNian = selLiuNianFromYear(tipDaYun, _selectedLiuNianYear || currentYear);
  }

  var tipCols = [
    { gan: fp.year.gan, zhi: fp.year.zhi },
    { gan: fp.month.gan, zhi: fp.month.zhi },
    { gan: fp.day.gan, zhi: fp.day.zhi },
    { gan: fp.hour.gan, zhi: fp.hour.zhi }
  ];
  // 小运模式：加入小运
  if (isXiaoYunTips) {
    var xiaoYunList = result.xiaoYun || [];
    var matchedXY = null;
    var targetAge = (tipLiuNian ? tipLiuNian.year : currentYear) - result.birthInfo.year + 1;
    for (var xi = 0; xi < xiaoYunList.length; xi++) {
      if (xiaoYunList[xi].age === targetAge) { matchedXY = xiaoYunList[xi]; break; }
    }
    if (!matchedXY && xiaoYunList.length > 0) matchedXY = xiaoYunList[0];
    if (matchedXY) tipCols.push({ gan: matchedXY.gan, zhi: matchedXY.zhi });
  }
  if (tipDaYun) tipCols.push({ gan: tipDaYun.gan, zhi: tipDaYun.zhi });
  if (tipLiuNian) tipCols.push({ gan: tipLiuNian.gan, zhi: tipLiuNian.zhi });

  var ganTips = analyzeGanHeTips(tipCols);
  var zhiTips = analyzeZhiTips(tipCols);

  html += '<div class="chart-hint-section" style="margin:10px 8px;">';
  var tipsTitle = isXiaoYunTips ? '【小運流年提示】' : '【細盤六柱提示】';
  html += '<div class="chart-hint-title">' + tipsTitle + '</div>';
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

// 流年天干与原局+大运的五合分析
function analyzeLiuNianGanHe(lnGan, cols) {
  var tips = [];
  var GAN_HE = { '甲己':'土','乙庚':'金','丙辛':'水','丁壬':'木','戊癸':'火' };
  var GAN_HE_REV = {};
  Object.keys(GAN_HE).forEach(function(k) {
    GAN_HE_REV[k[0]] = { gan: k[1], hua: GAN_HE[k] };
    GAN_HE_REV[k[1]] = { gan: k[0], hua: GAN_HE[k] };
  });
  var posNames = ['年','月','日','時','大運'];
  var refCols = cols.slice(0, cols.length - 1);

  refCols.forEach(function(col, i) {
    var g = col.gan;
    if (!g) return;
    var key = [lnGan, g].sort().join('');
    if (GAN_HE[key]) {
      tips.push('流年' + lnGan + '與' + posNames[i] + g + '五合化' + GAN_HE[key]);
    }
  });

  return tips.join('；') || '';
}

// 流年地支与原局+大运的合化分析
function analyzeLiuNianZhiHe(lnZhi, cols) {
  var tips = [];
  var LIU_HE = { '子丑':'土','寅亥':'木','卯戌':'火','辰酉':'金','巳申':'水','午未':'火' };
  var LIU_HE_REV = {};
  Object.keys(LIU_HE).forEach(function(k) {
    LIU_HE_REV[k[0]] = { zhi: k[1], hua: LIU_HE[k] };
    LIU_HE_REV[k[1]] = { zhi: k[0], hua: LIU_HE[k] };
  });
  var SAN_HE = { '申子辰':'水','亥卯未':'木','寅午戌':'火','巳酉丑':'金' };
  var CHONG = { '子午':1,'丑未':1,'寅申':1,'卯酉':1,'辰戌':1,'巳亥':1 };
  var XING = { '寅巳':'無恩','巳申':'無恩','丑戌':'恃勢','戌未':'恃勢','子卯':'無禮' };
  var HAI = { '子未':1,'丑午':1,'寅巳':1,'卯辰':1,'申亥':1,'酉戌':1 };
  var PO = { '子酉':1,'寅亥':1,'辰丑':1,'午卯':1,'申巳':1,'戌未':1 };

  // 只取原局4柱+大运（前5列 or 全部不含流年自身）
  var refCols = cols.slice(0, cols.length - 1); // 去掉最后一列（流年自身）
  var posNames = ['年','月','日','時','大運'];

  refCols.forEach(function(col, i) {
    var z = col.zhi;
    if (!z) return;
    var key = [lnZhi, z].sort().join('');
    // 六合
    if (LIU_HE[key]) {
      tips.push('流年' + lnZhi + '與' + posNames[i] + z + '六合' + LIU_HE[key]);
    }
    // 三合（检查是否同在三合局中）
    Object.keys(SAN_HE).forEach(function(sk) {
      if (sk.indexOf(lnZhi) >= 0 && sk.indexOf(z) >= 0 && lnZhi !== z) {
        if (tips.indexOf('流年' + lnZhi + '與' + posNames[i] + z + '三合' + SAN_HE[sk] + '局') < 0) {
          tips.push('流年' + lnZhi + '與' + posNames[i] + z + '三合' + SAN_HE[sk] + '局');
        }
      }
    });
    // 冲
    if (CHONG[key]) tips.push('流年' + lnZhi + '與' + posNames[i] + z + '相沖');
    // 刑
    var xKey = lnZhi + z, xKeyR = z + lnZhi;
    if (XING[xKey]) tips.push('流年' + lnZhi + '與' + posNames[i] + z + '相刑（' + XING[xKey] + '）');
    else if (XING[xKeyR]) tips.push('流年' + lnZhi + '與' + posNames[i] + z + '相刑（' + XING[xKeyR] + '）');
    // 害
    if (HAI[key]) tips.push('流年' + lnZhi + '與' + posNames[i] + z + '相害');
    // 破
    if (PO[key]) tips.push('流年' + lnZhi + '與' + posNames[i] + z + '相破');
  });

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

// ========== 干支神煞简算（用于大运流年，以日干/年干/年支为参照） ==========
function getGanZhiShenSha(colGan, zhi) {
  var result = [];
  var fp = (currentResult && currentResult.fourPillars) ? currentResult.fourPillars : null;
  if (!fp) return result;
  var dayGan = fp.day.gan, yearZhi = fp.year.zhi, dayZhi = fp.day.zhi;
  var refGans = [dayGan, fp.year.gan]; // 以日干、年干为参照

  // 天乙贵人（日干/年干 → 贵人地支）
  var TIANYI = { '甲':'丑未','乙':'子申','丙':'亥酉','丁':'亥酉','戊':'丑未','己':'子申','庚':'丑未','辛':'午寅','壬':'卯巳','癸':'卯巳' };
  for (var i = 0; i < refGans.length; i++) {
    var ty = TIANYI[refGans[i]] || '';
    if (ty.indexOf(zhi) >= 0) { result.push('天乙貴人'); break; }
  }
  // 文昌贵人
  var WENCHANG = { '甲':'巳','乙':'午','丙':'申','丁':'酉','戊':'申','己':'酉','庚':'亥','辛':'子','壬':'寅','癸':'卯' };
  if (WENCHANG[dayGan] === zhi) result.push('文昌貴人');
  // 禄神（日干临官位，大运/流年地支落于日干禄位）
  var LUSHEN = { '甲':'寅','乙':'卯','丙':'巳','丁':'午','戊':'巳','己':'午','庚':'申','辛':'酉','壬':'亥','癸':'子' };
  if (LUSHEN[dayGan] === zhi) result.push('祿神');
  // 羊刃（日干帝旺位）
  var YANGREN = { '甲':'卯','乙':'寅','丙':'午','丁':'巳','戊':'午','己':'巳','庚':'酉','辛':'申','壬':'子','癸':'亥' };
  if (YANGREN[dayGan] === zhi) result.push('羊刃');
  // 太极贵人
  var TAIJI = { '甲':'子午','乙':'子午','丙':'卯酉','丁':'卯酉','戊':'辰戌丑未','己':'辰戌丑未','庚':'寅亥','辛':'寅亥','壬':'巳申','癸':'巳申' };
  var tj = TAIJI[dayGan] || '';
  if (tj.indexOf(zhi) >= 0) result.push('太極貴人');
  // 金舆
  var JINYU = { '甲':'辰','乙':'巳','丙':'未','丁':'申','戊':'未','己':'申','庚':'戌','辛':'亥','壬':'丑','癸':'寅' };
  if (JINYU[dayGan] === zhi) result.push('金輿');
  // 学堂
  var XUETANG = { '甲':'亥','乙':'午','丙':'寅','丁':'酉','戊':'寅','己':'酉','庚':'巳','辛':'子','壬':'申','癸':'卯' };
  if (XUETANG[dayGan] === zhi) result.push('學堂');
  // 将星（地支三合帝旺）
  var JIANGXING = { '申':'子','子':'子','辰':'子','寅':'午','午':'午','戌':'午','巳':'酉','酉':'酉','丑':'酉','亥':'卯','卯':'卯','未':'卯' };
  if (JIANGXING[zhi] && JIANGXING[zhi] === zhi) {} // 每个支都是自己的将星?
  // 天德贵人（月支 → 天干）
  var TIANDE = { '寅':'丁','卯':'申','辰':'壬','巳':'辛','午':'亥','未':'甲','申':'癸','酉':'寅','戌':'丙','亥':'乙','子':'巳','丑':'庚' };
  if (TIANDE[fp.month.zhi] === colGan) result.push('天德貴人');
  // 月德贵人（月支三合局 → 天干）
  var YUEDE = { '寅':'丙','午':'丙','戌':'丙','亥':'甲','卯':'甲','未':'甲','申':'壬','子':'壬','辰':'壬','巳':'庚','酉':'庚','丑':'庚' };
  if (YUEDE[fp.month.zhi] === colGan) result.push('月德貴人');
  // 劫煞（年支/日支三合局绝地）
  var JIESHA_OF = { '申':'巳','子':'巳','辰':'巳','寅':'亥','午':'亥','戌':'亥','巳':'寅','酉':'寅','丑':'寅','亥':'申','卯':'申','未':'申' };
  // 灾煞（年支/日支三合局胎地）
  var ZAISHA_OF = { '申':'午','子':'午','辰':'午','寅':'卯','午':'卯','戌':'卯','巳':'酉','酉':'酉','丑':'酉','亥':'子','卯':'子','未':'子' };
  var refZhis = [yearZhi, dayZhi];
  var hasJie = false, hasZai = false;
  refZhis.forEach(function(rz) {
    if (rz && JIESHA_OF[rz] === zhi) hasJie = true;
    if (rz && ZAISHA_OF[rz] === zhi) hasZai = true;
  });
  if (hasJie) result.push('劫煞');
  if (hasZai) result.push('災煞');
  return result;
}

// ========== 细盘交互 ==========
// 六柱点击弹窗
function showPillarPopup(colIdx) {
  if (!currentResult) return;
  var fp = currentResult.fourPillars;
  var posNames = ['年柱', '月柱', '日柱', '時柱', '大運', '流年'];
  var posShort = ['年', '月', '日', '时'];
  var posKeys = ['year', 'month', 'day', 'hour'];
  var colName = posNames[colIdx] || '';

  // 该柱干支
  var ganzhi = '';
  if (colIdx < 4) {
    ganzhi = fp[posKeys[colIdx]].ganZhi;
  } else if (colIdx === 4) {
    var dy = currentResult.daYun;
    if (_selectedDaYunIdx >= 0 && dy.daYunList[_selectedDaYunIdx]) {
      ganzhi = dy.daYunList[_selectedDaYunIdx].ganZhi;
    }
  } else if (colIdx === 5) {
    var lnYear = _selectedLiuNianYear || new Date().getFullYear();
    var tg = BaziEngine._constants.TIAN_GAN;
    var dz = BaziEngine._constants.DI_ZHI;
    ganzhi = tg[(lnYear - 4) % 10] + dz[(lnYear - 4) % 12];
  }
  if (!ganzhi) ganzhi = '—';

  // 筛选该柱神煞
  var shenSha = currentResult.shenSha || [];
  var relatedNames = [];
  if (colIdx < 4) {
    // 年月日时：天干+地支神煞
    var posPrefix = posShort[colIdx];
    shenSha.forEach(function(s) {
      if (s.position === posPrefix + '干' || s.position === posPrefix + '支') {
        if (relatedNames.indexOf(s.name) < 0) relatedNames.push(s.name);
      }
    });
  } else {
    // 大运/流年：天干+地支神煞
    var colGan = ganzhi.charAt(0);
    var colZhi = ganzhi.charAt(1);
    if (colGan && colZhi) {
      relatedNames = getGanZhiShenSha(colGan, colZhi);
    }
  }

  var html = '<div class="pillar-popup-overlay" onclick="closePillarPopup()">' +
    '<div class="pillar-popup-card" data-col-idx="' + colIdx + '" onclick="event.stopPropagation()">' +
    '<div class="pillar-popup-title">' + colName + '【' + ganzhi + '】提示</div>';
  if (relatedNames.length > 0) {
    html += '<div class="pillar-popup-shensha">' + relatedNames.join('、') + '</div>';
  } else {
    html += '<div class="pillar-popup-shensha" style="color:#a09888">暫無神煞</div>';
  }

  html += '<button class="pillar-popup-close" onclick="closePillarPopup()">確定</button>' +
    '</div></div>';

  var old = document.querySelector('.pillar-popup-overlay');
  if (old) old.remove();
  document.body.insertAdjacentHTML('beforeend', html);
}

function closePillarPopup() {
  var el = document.querySelector('.pillar-popup-overlay');
  if (el) el.remove();
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
  var xyHeader = qiYunCeil <= 1 ? '1歲' : '1-' + qiYunCeil + '歲';
  h += '<th class="' + (isXiaoYunMode ? ' xipan-dy-sel' : '') + '">' + xyHeader + '</th>';
  // 大运列头
  for (var i = 0; i < DY.length; i++) {
    var d = DY[i];
    var curDY = !isXiaoYunMode && cur >= d.startYear && cur <= d.endYear;
    var sel = !isXiaoYunMode && i === selDY;
	    var dyAge = qiYunCeil + i * 10 + 1;
    var dyYear = d.startYear + 1;
    h += '<th class="' + (curDY ? ' xipan-dy-cur' : '') + (sel ? ' xipan-dy-sel' : '') + '">' + dyAge + '歲<br>' + dyYear + '</th>';
  }
  h += '</tr></thead><tbody>';

  // 干支行（干上支下，整体点击）
  h += '<tr><td class="xipan-dy-row-label">大運</td>';
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
    h += '<tr><td class="xipan-dy-row-label">流年</td>';
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

  // 五行旺相休囚死（固定顺序：旺→相→休→囚→死，只变五行）
  var wangXiang = calcWangXiang(opts.monthZhiWx);
  var WX_COLORS = { '木':'#388E3C','火':'#d32f2f','土':'#b87333','金':'#E65100','水':'#1976D2' };
  // 反向查找：每个状态对应哪个五行
  var stateWx = {};
  for (var wx in wangXiang) { stateWx[wangXiang[wx]] = wx; }
  var states = ['旺','相','休','囚','死'];
  h += '<div class="xipan-wx-text">';
  states.forEach(function(st, idx) {
    if (idx > 0) h += ' ';
    var wx = stateWx[st] || '—';
    var color = WX_COLORS[wx] || '#999';
    h += '<span class="xipan-wx-badge" style="color:' + color + ';border-color:' + color + '">' + wx + st + '</span>';
  });
  h += '</div>';

  return h;
}

// ==================== Tab 6: 解讀（分支：命盤總攬 / 古籍參考） ====================
function renderTabTips(result) {
  var container = document.getElementById('tab-tips');
  if (!container) return;

  // 分支切换按钮
  var html = '<div class="tip-branch-nav">' +
    '<button class="tip-branch-btn active" data-branch="overview" onclick="switchTipBranch(\'overview\')">命盤總攬</button>' +
    '<button class="tip-branch-btn" data-branch="deep" onclick="switchTipBranch(\'deep\')">古籍參考</button>' +
    '</div>';

  // 分支1：命盤總攬 — 分析报告
  html += '<div class="tip-branch-content active" id="tip-branch-overview">';
  var report = BaziEngine.generateReport(result);
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
  html += '</div>';

  // 分支2：古籍參考 — 经典参考（从命盘页移入）
  html += '<div class="tip-branch-content" id="tip-branch-deep">';
  html += renderTheorySection(result);
  html += '</div>';

  container.innerHTML = html;
  document.getElementById('tab-tips').classList.remove('placeholder-tab');
}

// 提示页分支切换
function switchTipBranch(name) {
  document.querySelectorAll('.tip-branch-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.branch === name);
  });
  document.querySelectorAll('.tip-branch-content').forEach(function(c) {
    c.classList.toggle('active', c.id === 'tip-branch-' + name);
  });
}

function selectDaYun(idx) {
  _selectedDaYunIdx = idx;
  _selectedXiaoYunIdx = undefined;
  _selectedLiuNianYear = null;
  renderTabDetail(currentResult);
  // 如果大运/流年弹窗已打开，实时刷新
  var popup = document.querySelector('.pillar-popup-overlay');
  if (popup) {
    var card = popup.querySelector('.pillar-popup-card');
    var colIdx = parseInt(card ? card.dataset.colIdx : '') || 0;
    if (colIdx >= 4) showPillarPopup(colIdx);
  }
}

function selectXiaoYun(idx) {
  _selectedDaYunIdx = -1;
  _selectedXiaoYunIdx = idx;
  _selectedLiuNianYear = null;
  renderTabDetail(currentResult);
  var popup = document.querySelector('.pillar-popup-overlay');
  if (popup) { closePillarPopup(); }
}

function selectLiuNian(year) {
  _selectedLiuNianYear = year;
  renderTabDetail(currentResult);
  // 如果流年弹窗已打开，实时刷新内容
  var popup = document.querySelector('.pillar-popup-overlay');
  if (popup) {
    var card = popup.querySelector('.pillar-popup-card');
    if (card && card.dataset.colIdx === '5') {
      showPillarPopup(5);
    }
  }
}


// ========== 启动 ==========
document.addEventListener('DOMContentLoaded', initForm);
