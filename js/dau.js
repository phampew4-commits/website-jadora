/* ===== JADORA — thanh trên cùng + menu xổ lớn (kiểu cozyleigh.studio) và ảnh lấy từ app =====
   Tải sau chung.js: các hàm dưới đây thay cho bản cũ cùng tên. */

/* ---------- ảnh: giống web Ngọc Trầm — web chỉ giữ mã ảnh, Google phát ảnh thẳng từ Drive theo đúng cỡ cần ---------- */
function anh(id, w) {
  if (!id) return '';
  if (/[\/.]/.test(id)) return id;          /* ảnh có sẵn đường dẫn (dây trơn) */
  return 'https://lh3.googleusercontent.com/d/' + id + '=w' + (w || 600);
}

/* ---------- video xem nhanh: món nào có video (data/video.json) thì rê chuột vào thẻ sẽ chạy video ---------- */
var VIDEO = {};
fetch('data/video.json', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : {}; }).then(function (d) { VIDEO = d || {}; }).catch(function () {});
if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.addEventListener('pointerover', function (ev) {
    var the = ev.target.closest && ev.target.closest('.sp, .sp2'); if (!the || the._vao) return;
    the._vao = 1;
    var ma = the.dataset.ma, khung = the.querySelector('.sp-anh, .sp2-anh > a');
    if (ma && VIDEO[ma] && khung && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var v = khung.querySelector('video.re');
      if (!v) {
        v = document.createElement('video'); v.className = 're'; v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto'; v.src = VIDEO[ma];
        v.addEventListener('playing', function () { the.classList.add('co-video'); });
        khung.appendChild(v);
      }
      var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
    }
    the.addEventListener('pointerleave', function roi() {
      the.removeEventListener('pointerleave', roi); the._vao = 0; the.classList.remove('co-video');
      var v = the.querySelector('video.re'); if (v) { v.pause(); v.currentTime = 0; }
    });
  });
}

/* ---------- yêu thích ---------- */
function docThich() { try { return JSON.parse(localStorage.getItem('jadora_thich')) || {}; } catch (x) { return {}; } }
function veSoThich() { var n = Object.keys(docThich()).length; $$('.thich-so').forEach(function (el) { el.textContent = n; el.style.display = n ? 'grid' : 'none'; }); }
document.addEventListener('click', function (ev) { if (ev.target.closest('[data-thich]')) setTimeout(veSoThich, 0); });

var BT = {
  tim: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>',
  thich: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-9.6A4 4 0 0112 8a4 4 0 017 2.4C19 15.600 12 20 12 20z"/></svg>',
  tui: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 016 0v2"/></svg>',
  ig: '<svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".8"/></svg>',
  fb: '<svg viewBox="0 0 24 24"><path d="M14 8.500V7c0-.8.500-1.200 1.300-1.200H17V3h-2.400C12 3 10.500 4.600 10.500 7v1.500H8V11.500h2.500V21h3.500v-9.500h2.600l.4-3H14z"/></svg>',
  tt: '<svg viewBox="0 0 24 24"><path d="M14 3v11.500a3.200 3.200 0 11-3.200-3.200M14 3c.300 2.600 2 4.400 4.500 4.700"/></svg>',
  xuong: '<svg viewBox="0 0 12 12"><path d="M2.500 4.500L6 8l3.500-3.500"/></svg>',
  nguoi: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8.500" r="3.800"/><path d="M4.500 20c.800-3.600 3.800-5.500 7.500-5.500s6.700 1.900 7.500 5.500"/></svg>'
};

/* ---------- thẻ sản phẩm (trang Sản phẩm): thêm nút tim ---------- */
function theSp(x, i) {
  var a2 = x.anh && x.anh[1], th = docThich();
  return '<article class="sp" data-ma="' + e(x.ma) + '">' +
    '<a class="sp-anh" href="' + linkSp(x) + '">' +
      '<img class="truoc" src="' + anh(x.anh && x.anh[0], 480) + '" alt="' + e(x.ten) + '" loading="lazy" decoding="async" referrerpolicy="no-referrer">' +
      (a2 ? '<img class="sau" src="' + anh(a2, 480) + '" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">' : '') +
      '<span class="the">' + e((LOAI[x.loai] || {}).ngan || 'Khác') + '</span>' +
      '<span class="sp-them"><button class="nut toi rong them-gio" type="button" data-ma="' + e(x.ma) + '">Thêm vào giỏ</button></span>' +
    '</a>' +
    '<button class="sp-tim' + (th[x.ma] ? ' bat' : '') + '" type="button" data-thich="' + e(x.ma) + '" aria-label="Yêu thích">' + BT.thich + '</button>' +
    '<div class="sp-tt"><h3 class="sp-ten"><a href="' + linkSp(x) + '">' + e(x.ten) + '</a></h3>' +
    '<div class="sp-gia">' + gia(x.gia) + '</div></div></article>';
}
/* bấm tim ở bất cứ đâu: lưu trên máy khách */
document.addEventListener('click', function (ev) {
  var t = ev.target.closest('[data-thich]'); if (!t) return;
  ev.preventDefault();
  var th = docThich(), ma = t.dataset.thich;
  if (th[ma]) delete th[ma]; else th[ma] = 1;
  try { localStorage.setItem('jadora_thich', JSON.stringify(th)); } catch (x) {}
  $$('[data-thich="' + ma + '"]').forEach(function (b) { b.classList.toggle('bat', !!th[ma]); });
  bao(th[ma] ? 'Đã lưu vào yêu thích' : 'Đã bỏ khỏi yêu thích');
});

/* ---------- ngăn giỏ hàng trượt từ phải ---------- */
function veNganGio() {
  var o = $('.ng-than'); if (!o) return;
  var ds = monGio(), hang = tienHang(), V = CH.vanChuyen || {}, con = (V.mienPhiTu || 0) - hang;
  $('.ng-dau b').textContent = 'Giỏ hàng' + (ds.length ? ' (' + demGio() + ')' : '');
  if (!ds.length) { o.innerHTML = '<div class="ng-rong">' + BT.tui + '<b>Giỏ của bạn đang trống.</b><a class="nut dac" href="san-pham.html">Xem sản phẩm</a></div>'; $('.ng-chan').hidden = true; return; }
  o.innerHTML = ds.map(function (m) { var x = m.x;
    return '<div class="ng-mon" data-ma="' + e(x.ma) + '"><a href="' + linkSp(x) + '"><img src="' + anh(x.anh[0], 240) + '" alt="" referrerpolicy="no-referrer"></a>' +
      '<div><a class="ten" href="' + linkSp(x) + '">' + e(x.ten) + '</a><span>' + gia(x.gia) + '</span>' +
      '<div class="ng-sl"><button type="button" data-d="-1" aria-label="Bớt">−</button><i>' + m.sl + '</i><button type="button" data-d="1" aria-label="Thêm">+</button><button class="xoa" type="button">Xoá</button></div></div></div>'; }).join('');
  $('.ng-chan').hidden = false;
  $('.ng-tong span').textContent = gia(hang);
  $('.ng-ghi').textContent = con > 0 ? 'Mua thêm ' + gia(con) + ' để được miễn phí giao hàng.' : 'Đơn này được miễn phí giao hàng.';
}
function moGio() { var n = $('.ng'); if (!n) return; veNganGio(); n.classList.add('mo'); document.documentElement.classList.add('khoa-cuon'); }
function dongGio() { var n = $('.ng'); if (n) n.classList.remove('mo'); document.documentElement.classList.remove('khoa-cuon'); }
document.addEventListener('click', function (ev) { if (ev.target.closest('.them-gio')) setTimeout(moGio, 0); });

function veDau() {
  var el = $('#dau'); if (!el) return;
  var T = CH.thuongHieu || {}, L = CH.lienHe || {}, V = CH.vanChuyen || {};
  var trang = location.pathname.split('/').pop() || 'index.html';
  var moi = DS.slice().sort(function (a, b) { return ngaySo(b.ngay) - ngaySo(a.ngay); });
  var theo = {}; THU_TU.forEach(function (k) { theo[k] = moi.filter(function (x) { return x.loai === k; }); });
  function a2(x) { return x.anh[1] || x.anh[0]; }
  function hinh(id, w, alt) { return '<img src="' + anh(id, w) + '" alt="' + e(alt || '') + '" loading="lazy" decoding="async" referrerpolicy="no-referrer">'; }

  /* dải thông báo */
  var tb = (CH.thanhBao && CH.thanhBao.length ? CH.thanhBao : [{ chu: V.ghiChu || '', link: 'san-pham.html' }]).filter(function (t) { return t.chu; });
  var xh = [['Instagram', L.instagram, BT.ig], ['TikTok', L.tiktok, BT.tt], ['Facebook', L.facebook, BT.fb]].filter(function (s) { return s[1]; });
  var dai = '<div class="tb"><div class="tb-trong">' +
    '<div class="tb-xh">' + xh.map(function (s) { return '<a href="' + e(s[1]) + '" target="_blank" rel="noopener" aria-label="' + s[0] + '">' + s[2] + '</a>'; }).join('') + '</div>' +
    '<div class="tb-giua">' + (tb.length > 1 ? '<button class="tb-mt" type="button" data-d="-1" aria-label="Trước">‹</button>' : '') +
      '<div class="tb-ds">' + tb.map(function (t, i) { return '<a class="tb-cau' + (i ? '' : ' bat') + '" href="' + e(t.link || 'san-pham.html') + '">' + e(t.chu) + ' →</a>'; }).join('') + '</div>' +
      (tb.length > 1 ? '<button class="tb-mt" type="button" data-d="1" aria-label="Sau">›</button>' : '') + '</div>' +
    '<div class="tb-phai">' + (L.sdt ? '<a href="tel:' + e(L.sdt) + '">' + e(L.sdt) + '</a>' : '') + '</div>' +
  '</div></div>';

  /* menu xổ 1: Chuỗi — ô sản phẩm có ảnh */
  var o1 = (function (ds) { var co = {}, r = []; ds.forEach(function (x) { if (!co[x.ten] && r.length < 4) { co[x.ten] = 1; r.push(x); } }); return r; })(theo.chuoi);
  var xo1 = '<div class="mg"><div class="mg-o">' + o1.map(function (x) {
      return '<a class="mg-sp" href="' + linkSp(x) + '"><span class="mg-anh">' + hinh(x.anh[0], 480, x.ten) + '<span class="sau">' + hinh(a2(x), 480) + '</span></span>' +
        '<span class="mg-ten">' + e(x.ten) + '</span><span class="mg-gia">' + gia(x.gia) + '</span></a>'; }).join('') + '</div>' +
    '<div class="mg-chan"><a class="mg-lk" href="san-pham.html?loai=chuoi">Xem tất cả chuỗi →</a><a class="mg-lk" href="lien-he.html">Phối chuỗi riêng →</a>' +
    '<span class="mg-qua"><span>Miễn phí giao hàng</span> ' + e((V.ghiChu || '').replace(/^.*?(cho )?đơn/i, 'Đơn')) + '</span></div></div>';

  /* menu xổ 2: Cửa hàng — các cột liên kết + 2 ô ảnh */
  function khacTen(ds, n) { var co = {}, r = []; ds.forEach(function (x) { if (!co[x.ten] && r.length < n) { co[x.ten] = 1; r.push(x); } }); return r; }
  function cot(td, lk, ds) {
    ds = khacTen(ds, 4);
    return '<div class="mg-cot"><a class="mg-td" href="' + lk + '">' + td + '</a><ul>' + ds.map(function (x, i) {
      return '<li><a href="' + linkSp(x) + '">' + e(x.ten.length > 30 ? x.ten.slice(0, 29) + '…' : x.ten) + (i < 2 ? '<span class="mg-moi">Mới</span>' : '') + '</a></li>'; }).join('') + '</ul></div>';
  }
  var khac = moi.filter(function (x) { return x.loai === 'matday' || x.loai === 'nhan' || x.loai === 'khuyen'; });
  var cl = [['Phỉ thuý', 'phi thuy'], ['Ngọc hoà điền', 'hoa dien'], ['Lam ngọc', 'lam ngoc'], ['Vàng 18K', '18k']].filter(function (c) {
    return DS.some(function (x) { return boDau(x.ten).indexOf(c[1]) >= 0; }); });
  function oAnh(x, nhan, chu, lk) {
    return x ? '<a class="mg-cta" href="' + lk + '"><span class="mg-cta-anh">' + hinh(a2(x), 480) + '</span><span class="mg-cta-chu"><small>' + nhan + '</small><b>' + chu + ' →</b></span></a>' : '';
  }
  var xo2 = '<div class="mg"><div class="mg-cotds">' +
      cot('Chuỗi mix charm', 'san-pham.html?loai=chuoi', theo.chuoi.slice(0, 40)) +
      cot('Charm vàng 18K', 'san-pham.html?loai=charm', theo.charm.slice(0, 40)) +
      (khac.length ? cot('Mặt dây · Nhẫn · Khuyên', 'san-pham.html?loai=matday', khac.slice(0, 40)) : '') +
      '<div class="mg-cot"><span class="mg-td">Theo chất liệu</span><ul>' + cl.map(function (c) { return '<li><a href="san-pham.html?tim=' + encodeURIComponent(c[0]) + '">' + c[0] + '</a></li>'; }).join('') +
        '<li class="mg-het"><a href="san-pham.html">Xem tất cả →</a></li></ul></div>' +
    '</div>' +
    '<div class="mg-ctads">' + oAnh(theo.chuoi[1], 'Chuỗi mix charm', 'Xem các chuỗi', 'san-pham.html?loai=chuoi') + oAnh(theo.charm[0], 'Charm vàng 18K', 'Xem các charm', 'san-pham.html?loai=charm') + '</div>' +
    '<a class="mg-dong" href="san-pham.html"><b>' + DS.length + '</b> món đang có · ảnh thật của từng món <span>Xem tất cả →</span></a></div>';

  var mn = [
    { ten: 'Mới về', lk: 'san-pham.html', the: 'Mới' },
    { ten: 'Chuỗi', lk: 'san-pham.html?loai=chuoi', xo: xo1 },
    { ten: 'Cửa hàng', lk: 'san-pham.html', xo: xo2, trang: 'san-pham.html' },
    { ten: 'Câu chuyện', lk: 'gioi-thieu.html', trang: 'gioi-thieu.html' },
    { ten: 'Liên hệ', lk: 'lien-he.html', trang: 'lien-he.html' }
  ];

  el.innerHTML = dai +
    '<header class="dau2"><div class="dau2-trong">' +
      '<button class="d-nut d-menu" type="button" aria-label="Menu"><span></span><span></span><span></span></button>' +
      '<a class="d-logo" href="index.html">' + e(T.ten || 'Jadora') + '</a>' +
      '<nav class="d-nav"><ul>' + mn.map(function (m) {
        return '<li class="' + (m.xo ? 'co-xo' : '') + '"><a class="d-lk' + (m.trang === trang ? ' chon' : '') + '" href="' + m.lk + '">' + m.ten +
          (m.the ? '<span class="d-the">' + m.the + '</span>' : '') + (m.xo ? BT.xuong : '') + '</a>' + (m.xo || '') + '</li>'; }).join('') + '</ul></nav>' +
      '<div class="d-phai">' +
        '<button class="d-nut d-tim" type="button" aria-label="Tìm kiếm">' + BT.tim + '</button>' +
        '<a class="d-nut d-tk" href="tai-khoan.html" aria-label="Tài khoản">' + BT.nguoi + '</a>' +
        '<a class="d-nut" href="san-pham.html?thich=1" aria-label="Yêu thích">' + BT.thich + '<span class="d-so thich-so">0</span></a>' +
        '<a class="d-nut d-gio" href="gio-hang.html" aria-label="Giỏ hàng">' + BT.tui + '<span class="d-so gio-so">0</span></a>' +
      '</div>' +
    '</div>' +
    '<div class="d-timo"><form action="san-pham.html" method="get" role="search">' + BT.tim + '<input name="tim" type="search" placeholder="Tìm tên món hoặc mã…" autocomplete="off"><button class="nut dac" type="submit">Tìm</button></form>' +
      '<div class="d-goi"></div></div>' +
    '</header>' +
    '<aside class="ng" aria-label="Giỏ hàng"><div class="ng-hop">' +
      '<div class="ng-dau"><b>Giỏ hàng</b><button type="button" class="ng-dong" aria-label="Đóng">✕</button></div>' +
      '<div class="ng-than"></div>' +
      '<div class="ng-chan"><p class="ng-ghi"></p><div class="ng-tong">Tiền hàng <span></span></div>' +
        '<a class="nut dac rong" href="dat-hang.html">Đặt hàng</a><a class="nut vien rong" href="gio-hang.html">Xem giỏ hàng</a></div>' +
    '</div></aside>' +
    '<div class="d-keo"><div class="d-keo-trong">' +
      '<a href="index.html">Trang chủ</a><a href="san-pham.html">Mới về</a>' +
      THU_TU.filter(function (k) { return theo[k].length; }).map(function (k) { return '<a class="nho" href="san-pham.html?loai=' + k + '">' + LOAI[k].ten + '<span>' + theo[k].length + '</span></a>'; }).join('') +
      '<a href="gioi-thieu.html">Câu chuyện</a><a href="lien-he.html">Liên hệ</a>' +
      (L.sdt ? '<a class="nho" href="tel:' + e(L.sdt) + '">Gọi ' + e(L.sdt) + '</a>' : '') +
    '</div></div>';

  /* thông báo tự đổi */
  var cau = $$('.tb-cau', el), ic = 0, hc = 0;
  function doiCau(i) { ic = (i + cau.length) % cau.length; cau.forEach(function (c, k) { c.classList.toggle('bat', k === ic); c.inert = k !== ic; });
    clearInterval(hc); if (cau.length > 1) hc = setInterval(function () { doiCau(ic + 1); }, 5000); }
  $$('.tb-mt', el).forEach(function (b) { b.onclick = function () { doiCau(ic + +b.dataset.d); }; });
  doiCau(0);

  /* tìm kiếm + menu điện thoại */
  var dau = $('.dau2', el), keo = $('.d-keo', el);
  $('.d-tim', el).onclick = function () { dau.classList.toggle('mo-tim'); if (dau.classList.contains('mo-tim')) $('.d-timo input', el).focus(); };
  $('.d-menu', el).onclick = function () { var mo = keo.classList.toggle('mo'); this.classList.toggle('mo', mo); document.documentElement.classList.toggle('khoa-cuon', mo); };
  keo.addEventListener('click', function (ev) { if (ev.target === keo || ev.target.closest('a')) { keo.classList.remove('mo'); $('.d-menu', el).classList.remove('mo'); document.documentElement.classList.remove('khoa-cuon'); } });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') { dau.classList.remove('mo-tim'); keo.classList.remove('mo'); dongGio(); } });

  /* gợi ý khi gõ tìm kiếm */
  var oTim = $('.d-timo input', el), goi = $('.d-goi', el), hg = 0;
  oTim.addEventListener('input', function () {
    clearTimeout(hg); hg = setTimeout(function () {
      var t = boDau(oTim.value.trim());
      if (t.length < 2) { goi.innerHTML = ''; return; }
      var kq = DS.filter(function (x) { return boDau(x.ten + ' ' + x.ma).indexOf(t) >= 0; });
      goi.innerHTML = kq.length ? kq.slice(0, 6).map(function (x) {
          return '<a href="' + linkSp(x) + '">' + hinh(x.anh[0], 240, x.ten) + '<span><b>' + e(x.ten) + '</b>' + gia(x.gia) + '</span></a>'; }).join('') +
          (kq.length > 6 ? '<a class="het" href="san-pham.html?tim=' + encodeURIComponent(oTim.value.trim()) + '">Xem cả ' + kq.length + ' món →</a>' : '')
        : '<p>Không tìm thấy món nào khớp.</p>';
    }, 140);
  });

  /* ngăn giỏ hàng: bấm biểu tượng giỏ thì mở, trừ khi đang ở trang giỏ / đặt hàng */
  var ngan = $('.ng', el);
  if (trang !== 'gio-hang.html' && trang !== 'dat-hang.html') $('.d-gio', el).addEventListener('click', function (ev) { ev.preventDefault(); moGio(); });
  ngan.addEventListener('click', function (ev) {
    if (ev.target === ngan || ev.target.closest('.ng-dong')) { dongGio(); return; }
    var mon = ev.target.closest('.ng-mon'); if (!mon) return;
    var ma = mon.dataset.ma, b = ev.target.closest('[data-d]');
    if (ev.target.closest('.xoa')) xoaGio(ma); else if (b) datGio(ma, Math.min(99, (GIO[ma] || 0) + +b.dataset.d)); else return;
    veNganGio();
  });
  veSoGio(); veSoThich();
}
