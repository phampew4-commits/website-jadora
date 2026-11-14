/* ===== JADORA — chuyển động theo mẫu v2 =====
   Gọi hieuUng() sau khi nội dung trang đã vẽ xong. */
var TINH = matchMedia('(prefers-reduced-motion: reduce)').matches;
function kep(v, a, b) { return Math.min(b, Math.max(a, v)); }

/* 1. Cuộn mượt bằng con lăn chuột (chỉ máy có chuột) */
function cuonMuot() {
  if (TINH || !matchMedia('(pointer: fine)').matches || window.__cuonMuot) return;
  window.__cuonMuot = true;
  document.documentElement.style.scrollBehavior = 'auto';
  var dich = scrollY, hien = scrollY, khung = 0, truoc = 0;
  function toiDa() { return document.documentElement.scrollHeight - innerHeight; }
  function cuonRieng(nut, d) {
    for (var el = nut; el && el !== document.body && el !== document.documentElement; el = el.parentElement) {
      if (!(el instanceof HTMLElement)) continue;
      var s = getComputedStyle(el);
      if (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight &&
          (d < 0 ? el.scrollTop > 0 : el.scrollTop + el.clientHeight < el.scrollHeight - 1)) return true;
    }
    return false;
  }
  function dung() { cancelAnimationFrame(khung); khung = 0; }
  function nhip(now) {
    var dt = Math.min((now - truoc) / 1000, .05) || 1 / 60; truoc = now;
    hien += (dich - hien) * (1 - Math.exp(-dt / .11));
    if (Math.abs(dich - hien) < .5) hien = dich;
    scrollTo({ top: hien, behavior: 'instant' });
    khung = hien === dich ? 0 : requestAnimationFrame(nhip);
  }
  addEventListener('wheel', function (ev) {
    if (ev.ctrlKey || ev.defaultPrevented || Math.abs(ev.deltaX) > Math.abs(ev.deltaY)) return;
    var d = ev.deltaY; if (ev.deltaMode === 1) d *= 16; else if (ev.deltaMode === 2) d *= innerHeight;
    if (cuonRieng(ev.target, d)) return;
    if (!khung && (Math.abs(d) < 50 || d % 1 !== 0)) return;   /* bàn rê: để trình duyệt tự cuộn */
    ev.preventDefault();
    if (!khung) { hien = scrollY; dich = hien; truoc = performance.now(); }
    dich = kep(dich + d, 0, toiDa());
    if (!khung) khung = requestAnimationFrame(nhip);
  }, { passive: false });
  ['keydown', 'pointerdown', 'touchstart'].forEach(function (t) { addEventListener(t, dung, { passive: true }); });
}

/* tiện ích: chạy một hàm mỗi khi cuộn / đổi cỡ, gộp theo khung hình */
function theoCuon(ham) {
  var cho = 0;
  function xep() { if (!cho) cho = requestAnimationFrame(function () { cho = 0; ham(); }); }
  addEventListener('scroll', xep, { passive: true });
  addEventListener('resize', xep, { passive: true });
  ham();
}

/* 2. Ảnh bìa: ảnh trôi + phóng, chữ trôi nhanh hơn rồi mờ dần, lớp phủ tối dần */
function biaSau(hero) {
  if (!hero || TINH) return;
  var anh = [],   /* ảnh nền giờ trôi bằng CSS, không tính lại mỗi khung hình */ chu = hero.querySelectorAll('.chu'),
      phu = hero.querySelector('.phu'), p = 0, khung = 0, truoc = 0;
  anh.forEach(function (a) { a.style.transformOrigin = 'center top'; });
  function dich() { var r = hero.getBoundingClientRect(); return kep(-r.top / Math.max(r.height, 1), 0, 1); }
  function ve() {
    anh.forEach(function (a) { a.style.transform = 'translate3d(0,' + (p * 22).toFixed(2) + '%,0) scale(' + (1 + p * .14).toFixed(4) + ')'; });
    if (phu) phu.style.opacity = (p * .65).toFixed(3);
    var h = hero.offsetHeight;
    [].forEach.call(chu, function (c) {
      c.style.transform = 'translate3d(0,' + (p * h * .38).toFixed(1) + 'px,0)';
      c.style.opacity = Math.max(0, 1 - p * 1.6).toFixed(3);
    });
  }
  function nhip(now) {
    var dt = Math.min((now - truoc) / 1000, .05) || 1 / 60; truoc = now;
    var d = dich(); p += (d - p) * (1 - Math.exp(-dt / .12));
    if (Math.abs(d - p) < 5e-4) p = d;
    ve(); khung = p === d ? 0 : requestAnimationFrame(nhip);
  }
  function bat() { if (khung || (p >= 1 && dich() >= 1)) return; truoc = performance.now(); khung = requestAnimationFrame(nhip); }
  addEventListener('scroll', bat, { passive: true }); addEventListener('resize', bat, { passive: true });
  p = dich(); ve();
}

/* 3. Ảnh bìa trượt: chữ trồi từng dòng, chấm có thanh chạy, hết thanh thì sang tấm sau */
function biaTruot(hero) {
  if (!hero) return;
  var tam = [].slice.call(hero.querySelectorAll('.tam')), cham = [].slice.call(hero.querySelectorAll('.cham button')), dang = 0;
  if (tam.length < 2) return;
  function chayLai(el) { el.getAnimations({ subtree: true }).forEach(function (a) { if (a instanceof CSSAnimation) { a.cancel(); a.play(); } }); }
  function doi(i, lai) {
    dang = (i + tam.length) % tam.length;
    tam.forEach(function (t, k) { var on = k === dang; t.classList.toggle('hien', on); t.inert = !on;
      var im = on && t.querySelector('img[data-src]'); if (im) { im.src = im.dataset.src; im.removeAttribute('data-src'); }
      var v = t.querySelector('video'); if (v) { if (on) { if (v.dataset.src) { v.src = v.dataset.src; v.removeAttribute('data-src'); } var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } else v.pause(); } if (on && lai) chayLai(t.querySelector('.chu')); });
    cham.forEach(function (c, k) { var on = k === dang; c.classList.toggle('chon', on); if (on) chayLai(c); });
  }
  cham.forEach(function (c, i) {
    c.addEventListener('click', function () { if (i !== dang) doi(i, true); });
    var thanh = c.querySelector('i');
    if (thanh) thanh.addEventListener('animationend', function () { doi(dang + 1, true); });
  });
  hero.addEventListener('pointerenter', function () { hero.classList.add('ngung'); });
  hero.addEventListener('pointerleave', function () { hero.classList.remove('ngung'); });
  document.addEventListener('visibilitychange', function () { hero.classList.toggle('ngung', document.hidden); });
  new IntersectionObserver(function (es) { hero.classList.toggle('khuat', !es[0].isIntersecting); }, { threshold: .2 }).observe(hero);
  doi(0, false);
}

/* 4. Ảnh bay theo con trỏ khi rê qua danh mục */
function anhTheoChuot(khoi) {
  if (!khoi || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  var the = khoi.querySelector('.xem-truoc'), img = the && the.querySelector('img'); if (!img) return;
  var x = 0, y = 0, cx = 0, cy = 0, khung = 0;
  function nhip() {
    var k = TINH ? 1 : .14, dx = x - cx; cx += dx * k; cy += (y - cy) * k;
    the.style.translate = cx + 'px ' + cy + 'px';
    the.style.rotate = kep(dx * .08, -10, 10) + 'deg';
    khung = Math.abs(dx) + Math.abs(y - cy) > .3 ? requestAnimationFrame(nhip) : 0;
  }
  khoi.addEventListener('pointermove', function (ev) {
    var b = khoi.getBoundingClientRect(); x = ev.clientX - b.left; y = ev.clientY - b.top;
    var mon = ev.target.closest('[data-anh]');
    if (!mon) { the.classList.remove('bat'); return; }
    if (img.getAttribute('src') !== mon.dataset.anh) img.src = mon.dataset.anh;
    if (!the.classList.contains('bat')) { cx = x; cy = y; the.classList.add('bat'); }
    if (!khung) khung = requestAnimationFrame(nhip);
  }, { passive: true });
  khoi.addEventListener('pointerleave', function () { the.classList.remove('bat'); }, { passive: true });
}

/* 5. Khối ghim nhiều bước: cuộn tới đâu đổi ảnh + chữ tới đó */
function buocCuon(khoi) {
  if (!khoi) return;
  var so = +khoi.dataset.buoc || 3, mon = [].slice.call(khoi.querySelectorAll('[data-b]')), dang = -1;
  theoCuon(function () {
    var b = khoi.getBoundingClientRect(), di = Math.max(1, b.height - innerHeight),
        p = kep(-b.top / di, 0, 1), buoc = Math.min(so - 1, Math.floor(p * so));
    if (b.bottom > -200 && b.top < innerHeight + 200) khoi.style.setProperty('--pc', (p * so - buoc - .5).toFixed(3));   /* vị trí trong bước hiện tại: -0.5 … 0.5, cho ảnh trôi lệch nhau */
    if (buoc === dang) return; dang = buoc;
    mon.forEach(function (el) { el.classList.toggle('bat', +el.dataset.b === buoc); });
  });
}

/* 6. Ảnh giữa dòng chữ chạy phóng to dần khi cuộn */
function phongCuon(khoi) {
  if (!khoi || TINH) { if (khoi) khoi.style.setProperty('--phong', 1); return; }
  var hien = 0, khung = 0;
  function dich() { var r = khoi.getBoundingClientRect(), tam = Math.max(1, (r.height - innerHeight) * .8); return kep(-r.top / tam, 0, 1); }
  function nhip() {
    khung = 0; var d = dich(); hien += (d - hien) * .14; if (Math.abs(d - hien) < .001) hien = d;
    khoi.style.setProperty('--phong', hien.toFixed(4));
    if (hien !== d) xep();
  }
  function xep() { if (!khung) khung = requestAnimationFrame(nhip); }
  addEventListener('scroll', xep, { passive: true }); addEventListener('resize', xep, { passive: true });
  hien = dich(); khoi.style.setProperty('--phong', hien.toFixed(4));
}

/* 7. Dòng thời gian: đường kẻ tô màu dần, bước nào tới thì sáng lên */
function dongThoiGian(khoi) {
  if (!khoi) return;
  var buoc = [].slice.call(khoi.querySelectorAll('.tg-mon'));
  if (TINH) { buoc.forEach(function (b) { b.classList.add('bat'); b.style.setProperty('--p', 1); }); return; }
  khoi.classList.add('san');
  theoCuon(function () {
    var vach = innerHeight * .6;
    buoc.forEach(function (b) {
      var r = b.getBoundingClientRect();
      b.style.setProperty('--p', kep((vach - r.top) / Math.max(r.height, 1), 0, 1).toFixed(3));
      b.classList.toggle('bat', r.top <= vach);
    });
  });
}

/* 8. Chữ sáng dần từng từ theo vị trí cuộn */
function chuSangDan(el) {
  if (!el || TINH) return;
  var tu = [];
  (function tach(nut) {
    [].slice.call(nut.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var f = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (m) {
          if (!m.trim()) { f.appendChild(document.createTextNode(m)); return; }
          var s = document.createElement('span'); s.className = 'tu'; s.textContent = m; f.appendChild(s); tu.push(s);
        });
        nut.replaceChild(f, n);
      } else if (n.nodeType === 1) tach(n);
    });
  })(el);
  theoCuon(function () {
    var r = el.getBoundingClientRect(); if (r.bottom < -100 || r.top > innerHeight + 100) return;
    var p = kep((innerHeight * .85 - r.top) / (innerHeight * .5 + r.height), 0, 1), n = tu.length;
    tu.forEach(function (s, i) { var v = kep((p * 1.35 * n - i) / 2.5, .22, 1).toFixed(2); if (s._v !== v) { s._v = v; s.style.opacity = v; } });
  });
}

/* 9. Ảnh trôi nhẹ ngược chiều cuộn */
function troi(ds) {
  if (TINH || !ds.length) return;
  theoCuon(function () {
    ds.forEach(function (el) {
      var r = el.getBoundingClientRect(); if (r.bottom < -200 || r.top > innerHeight + 200) return;
      var p = kep((innerHeight - r.top) / (innerHeight + r.height), 0, 1);
      el.style.translate = '0 ' + ((.5 - p) * (+el.dataset.troi || 60)).toFixed(1) + 'px';
    });
  });
}

/* 10. Đếm số từ 0 lên khi khối hiện ra */
function demSo(ds) {
  if (!ds.length || TINH) return;
  function dang(el, v) { var le = +el.dataset.le || 0; return v.toLocaleString('vi-VN', { minimumFractionDigits: le, maximumFractionDigits: le }) + (el.dataset.sau || ''); }
  ds.forEach(function (el) { el.textContent = dang(el, 0); });
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (x) {
      if (!x.isIntersecting) return; io.unobserve(x.target);
      var el = x.target, dich = +el.dataset.dem || 0, t0 = performance.now(), dai = 1600, le = +el.dataset.le || 0;
      (function nhip(now) {
        var p = kep((now - t0) / dai, 0, 1), v = dich * (1 - Math.pow(1 - p, 3));
        el.textContent = dang(el, p < 1 ? (le ? Math.floor(v * 10) / 10 : Math.floor(v)) : dich);
        if (p < 1) requestAnimationFrame(nhip);
      })(t0);
    });
  }, { threshold: .5 });
  ds.forEach(function (el) { io.observe(el); });
}

/* 11. Mục xếp gập (<details>) trượt mở / trượt đóng thay vì bật tắt đột ngột — áp cho mọi trang */
document.addEventListener('click', function (ev) {
  var sm = ev.target.closest && ev.target.closest('summary'); if (!sm) return;
  var d = sm.parentElement; if (!d || d.tagName !== 'DETAILS') return;
  var noi = d.querySelector('.noi');
  if (TINH || !noi || !noi.animate) return;          /* không có chuyển động: để trình duyệt tự xử lý */
  ev.preventDefault();
  if (d._cd) { d._cd.onfinish = null; d._cd.cancel(); }
  var dem = getComputedStyle(noi).paddingBottom;
  noi.style.overflow = 'hidden';
  if (!d.open || d.classList.contains('dang-dong')) {
    d.classList.remove('dang-dong'); d.open = true;
    var cao = noi.offsetHeight;
    d._cd = noi.animate([{ height: '0px', paddingBottom: '0px', opacity: 0 }, { height: cao + 'px', paddingBottom: dem, opacity: 1 }],
      { duration: 460, easing: 'cubic-bezier(.22,1,.36,1)' });
    var cm = d._cd, xongMo = function () { if (d._cd !== cm) return; noi.style.overflow = ''; d._cd = null; };
    d._cd.onfinish = xongMo; setTimeout(xongMo, 520);   /* dự phòng khi trình duyệt không báo kết thúc */
  } else {
    var cao2 = noi.offsetHeight;
    d.classList.add('dang-dong');
    d._cd = noi.animate([{ height: cao2 + 'px', paddingBottom: dem, opacity: 1 }, { height: '0px', paddingBottom: '0px', opacity: 0 }],
      { duration: 320, easing: 'cubic-bezier(.4,0,.2,1)' });
    var cd = d._cd, xongDong = function () { if (d._cd !== cd) return; d.open = false; d.classList.remove('dang-dong'); noi.style.overflow = ''; d._cd = null; };
    d._cd.onfinish = xongDong; setTimeout(xongDong, 380);
  }
});

function hieuUng() {
  cuonMuot();
  var hero = document.querySelector('.hero2');
  biaSau(hero); biaTruot(hero);
  anhTheoChuot(document.querySelector('.dm-khoi'));
  buocCuon(document.querySelector('.buoc-cuon'));
  phongCuon(document.querySelector('.phong-cuon'));
  dongThoiGian(document.querySelector('.tg2-ds, .tg-ds'));
  [].forEach.call(document.querySelectorAll('[data-sang]'), chuSangDan);
  troi([].slice.call(document.querySelectorAll('[data-troi]')));
  demSo([].slice.call(document.querySelectorAll('[data-dem]')));
}
