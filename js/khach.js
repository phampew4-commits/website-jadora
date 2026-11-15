/* ===== JADORA — đăng nhập bằng Google (Firebase Auth) =====
   - Cấu hình nằm ở data/cau-hinh.json › firebase (đây là khoá công khai của web, không phải mật khẩu).
   - Chỉ dùng để biết khách là ai (tên, email, ảnh đại diện). Thông tin nhận hàng và đơn vẫn lưu trên máy khách.
   - Thư viện đăng nhập (~120KB) chỉ tải khi cần: ở trang Tài khoản, lúc bấm đăng nhập, hoặc khi khách đã đăng nhập từ trước. */
var KHACH = { bat: false, user: null, nghe: [] };

(function () {
  var BAN = '10.12.2', goc = 'https://www.gstatic.com/firebasejs/' + BAN + '/firebase-';
  var CO = 'jadora_dn';   /* đánh dấu "đã từng đăng nhập" để lần sau tự tải thư viện và hiện ảnh đại diện */
  var san = null;

  function nap(src) { return new Promise(function (ok, loi) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = loi; document.head.appendChild(s); }); }

  function baoDoi() {
    veNutTaiKhoan();
    KHACH.nghe.forEach(function (f) { try { f(KHACH.user); } catch (x) {} });
  }

  /* tải thư viện + nghe trạng thái đăng nhập; gọi nhiều lần vẫn chỉ tải một lần */
  KHACH.moMay = function () {
    if (san) return san;
    var fb = (window.CH || {}).firebase || {};
    KHACH.bat = !!(fb.apiKey && fb.authDomain && fb.projectId && fb.appId) && ((window.CH || {}).tinhNang || {}).dangNhapGoogle !== false;
    if (!KHACH.bat) return (san = Promise.resolve(null));
    san = nap(goc + 'app-compat.js').then(function () { return nap(goc + 'auth-compat.js'); }).then(function () {
      firebase.initializeApp({ apiKey: fb.apiKey, authDomain: fb.authDomain, projectId: fb.projectId, appId: fb.appId });
      KHACH.auth = firebase.auth(); KHACH.auth.languageCode = 'vi';
      return new Promise(function (xong) {
        var dau = true;
        KHACH.auth.onAuthStateChanged(function (u) {
          KHACH.user = u;
          try { if (u) localStorage.setItem(CO, '1'); else localStorage.removeItem(CO); } catch (x) {}
          baoDoi();
          if (dau) { dau = false; xong(u); }
        });
      });
    }).catch(function () { KHACH.bat = false; san = null; return null; });
    return san;
  };

  /* đăng nhập bằng cửa sổ Google (cách chuyển trang không dùng được vì trình duyệt chặn cookie bên thứ ba) */
  KHACH.dangNhap = function () {
    return KHACH.moMay().then(function () {
      if (!KHACH.bat) throw new Error('chua-cau-hinh');
      var p = new firebase.auth.GoogleAuthProvider(); p.setCustomParameters({ prompt: 'select_account' });
      return KHACH.auth.signInWithPopup(p);
    }).then(function (kq) { bao('Xin chào ' + ((kq.user.displayName || '').split(' ').pop() || 'bạn')); return kq.user; })
      .catch(function (loi) {
        var m = (loi && loi.code) || (loi && loi.message) || '';
        if (/popup-closed|cancelled-popup/.test(m)) return null;
        bao(/popup-blocked/.test(m) ? 'Trình duyệt đang chặn cửa sổ đăng nhập. Hãy cho phép cửa sổ bật lên.'
          : /unauthorized-domain/.test(m) ? 'Tên miền này chưa được phép đăng nhập.'
          : /chua-cau-hinh/.test(m) ? 'Web chưa cấu hình đăng nhập.' : 'Chưa đăng nhập được. Bạn thử lại nhé.');
        return null;
      });
  };
  KHACH.dangXuat = function () { return KHACH.moMay().then(function () { return KHACH.auth && KHACH.auth.signOut(); }).then(function () { bao('Đã đăng xuất'); }); };

  /* nút tài khoản trên thanh: đã đăng nhập thì hiện ảnh đại diện */
  function veNutTaiKhoan() {
    var u = KHACH.user;
    [].forEach.call(document.querySelectorAll('.d-tk'), function (a) {
      var cu = a.querySelector('.d-anh'); if (cu) cu.remove();
      a.classList.toggle('da-dn', !!u);
      a.setAttribute('aria-label', u ? 'Tài khoản của ' + (u.displayName || u.email || '') : 'Tài khoản');
      if (!u) return;
      var h = document.createElement('span'); h.className = 'd-anh';
      if (u.photoURL) { var im = document.createElement('img'); im.src = u.photoURL; im.alt = ''; im.referrerPolicy = 'no-referrer'; h.appendChild(im); }
      else h.textContent = (u.displayName || u.email || '?').trim().charAt(0).toUpperCase();
      a.appendChild(h);
    });
  }
  KHACH.veNut = veNutTaiKhoan;

  /* gọi sau khi thanh trên cùng đã vẽ xong */
  KHACH.batDau = function () {
    var daTung = false; try { daTung = !!localStorage.getItem(CO); } catch (x) {}
    if (/tai-khoan/.test(location.pathname)) { KHACH.moMay(); return; }
    if (!daTung) return;
    function cho() { (window.requestIdleCallback || function (f) { setTimeout(f, 400); })(function () { KHACH.moMay(); }, { timeout: 2500 }); }
    if (document.readyState === 'complete') cho(); else addEventListener('load', cho, { once: true });
  };
})();
