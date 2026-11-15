/* =========================================================
   CẢNH 3D "BÀN LÀM VIỆC" cho khối Xưởng phối chuỗi ở trang chủ.
   Dựng ngay trong cảnh của bộ máy chuỗi 3D (js/tk/vong-3d.js): cùng máy ảnh, cùng ánh sáng với chuỗi,
   nên chuỗi nằm thật trên khay chứ không phải dán lên hình vẽ.
   Gồm: mặt bàn gỗ sáng, thảm, khay bát giác, giá treo có 5 chuỗi mẫu (bấm để chọn), thước dây, ống chỉ + kim,
   kéo, đĩa hạt, chậu cây, tường có cửa sổ, rèm, đèn lồng. Đơn vị: 1 = 1 cm.
   Gọi: XUONG_CANH(V3D, {maus, chon(i)}) → {chon(i), xong}
   ========================================================= */
window.XUONG_CANH = function (V, tuy) {
  var T = V.THREE, G = new T.Group(), PI = Math.PI, t0 = performance.now();
  var Y = -1.55;                                  // mặt bàn (chuỗi nằm quanh y = 0)
  V.nghieng.add(G);
  /* Cả cảnh thu nhỏ còn 62% so với chuỗi (chuỗi giữ cỡ thật) → chuỗi chính to, nổi bật giữa bàn.
     Mặt lòng khay nằm ở y = -1,9: chuỗi không đặt sát khay mà ôm quanh một TRỤ TRƯNG BÀY bằng gỗ,
     nên charm treo rủ tự do bên ngoài trụ, không đâm xuống mặt khay. */
  var TL = .62, Y_KHAY = -1.9;
  G.scale.setScalar(TL); G.position.y = Y_KHAY - (-1.55 + .12 + 1.2 * 1.25) * TL;

  /* ---------- vật liệu ---------- */
  function vai(w, h, ve) { var c = document.createElement('canvas'); c.width = w; c.height = h; ve(c.getContext('2d'), w, h);
    var t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; return t; }
  function go(nen, van, soVan) { return vai(1024, 512, function (g, w, h) { g.fillStyle = nen; g.fillRect(0, 0, w, h);
    for (var i = 0; i < soVan; i++) { var y = Math.random() * h; g.strokeStyle = van; g.globalAlpha = .05 + Math.random() * .16; g.lineWidth = .6 + Math.random() * 2.2;
      g.beginPath(); g.moveTo(0, y); for (var x = 0; x <= w; x += 64) g.lineTo(x, y + Math.sin(x * .011 + i) * 5 + (Math.random() - .5) * 3); g.stroke(); }
    g.globalAlpha = 1; }); }
  var tGo = go('#EBCFA2', '#A9773F', 150); tGo.wrapS = tGo.wrapT = T.RepeatWrapping;
  var tGo2 = go('#F1DBB5', '#B58A55', 70); tGo2.wrapS = tGo2.wrapT = T.RepeatWrapping;
  function M(mau, nham, them) { return new T.MeshStandardMaterial(Object.assign({ color: mau, roughness: nham == null ? .7 : nham, metalness: 0 }, them || {})); }
  var mBan = M(0xffffff, .62, { map: tGo, emissive: 0x6b5330, emissiveIntensity: .35 }), mGo = M(0xffffff, .5, { map: tGo2 }), mGoDam = M(0xD9B786, .55),
      mTham = M(0xD3DDC0, .95), mKem = M(0xFFFDF8, .5), mDat = M(0xD9895F, .85), mLa = M(0x587553, .7, { side: T.DoubleSide }), mLa2 = M(0x7E9A72, .7, { side: T.DoubleSide }),
      mThep = M(0xD5DADF, .25, { metalness: .9 }), mVang = M(0xD6A65A, .3, { metalness: .85 }), mChi = M(0xF59178, .8), mThuoc = M(0xF2C55C, .6), mTuong = new T.MeshBasicMaterial({ color: 0xFBF1DF, toneMapped: false });
  function them(geo, mat, x, y, z, cha) { var m = new T.Mesh(geo, mat); m.position.set(x || 0, y || 0, z || 0); (cha || G).add(m); return m; }

  /* bóng mềm dưới vật (ảnh tròn mờ dần) */
  var tBong = vai(128, 128, function (g) { var r = g.createRadialGradient(64, 64, 4, 64, 64, 64); r.addColorStop(0, 'rgba(70,45,15,.5)'); r.addColorStop(1, 'rgba(70,45,15,0)'); g.fillStyle = r; g.fillRect(0, 0, 128, 128); });
  var mBong = new T.MeshBasicMaterial({ map: tBong, transparent: true, depthWrite: false, toneMapped: false });
  function bong(x, z, rx, rz, y) { var m = them(new T.PlaneGeometry(1, 1), mBong, x, (y == null ? Y : y) + .02, z); m.rotation.x = -PI / 2; m.scale.set(rx * 2, rz * 2, 1); m.renderOrder = 1; return m; }

  /* ---------- bàn, thảm, khay ---------- */
  tGo.repeat.set(3, 2.4);
  var ban = them(new T.PlaneGeometry(150, 46), mBan, 0, Y, -1); ban.rotation.x = -PI / 2;
  them(new T.BoxGeometry(150, 2.4, .6), mGoDam, 0, Y - 1.2, 22);                         // mép bàn phía trước
  var hinhTham = new T.Shape(); (function (s, w, h, r) { s.moveTo(-w + r, -h); s.lineTo(w - r, -h); s.quadraticCurveTo(w, -h, w, -h + r); s.lineTo(w, h - r); s.quadraticCurveTo(w, h, w - r, h);
    s.lineTo(-w + r, h); s.quadraticCurveTo(-w, h, -w, h - r); s.lineTo(-w, -h + r); s.quadraticCurveTo(-w, -h, -w + r, -h); })(hinhTham, 17, 10.5, .8);
  var tham = them(new T.ExtrudeGeometry(hinhTham, { depth: .12, bevelEnabled: false }), mTham, 1.5, Y + .12, 2.5); tham.rotation.x = PI / 2;
  bong(1.5, 2.8, 18.5, 12);
  /* khay gỗ bát giác: thân + lòng khay lõm */
  var khay = new T.Group(); khay.position.set(0, Y + .12, 0); khay.scale.setScalar(1.25); G.add(khay);
  var kThan = them(new T.CylinderGeometry(5.5, 5.5, .9, 8), mGo, 0, .75, 0, khay); kThan.rotation.y = PI / 8;
  var kLong = them(new T.CylinderGeometry(4.75, 4.75, .06, 8), mGoDam, 0, 1.2, 0, khay); kLong.rotation.y = PI / 8;
  [[-3.4, 2.6], [3.4, 2.6], [-3.4, -2.6], [3.4, -2.6]].forEach(function (p) { them(new T.BoxGeometry(1.5, .32, 1), mGoDam, p[0], .16, p[1], khay); });
  bong(0, .5, 8.2, 7.8, Y + .14);
  /* trụ trưng bày (đơn vị thật, không thu nhỏ): chuỗi ôm quanh đầu trụ */
  var tru0 = new T.Group(); V.nghieng.add(tru0);
  them(new T.CylinderGeometry(2.26, 2.42, .3 - Y_KHAY, 56), mGo, 0, (Y_KHAY + .3) / 2, 0, tru0);
  var mat0 = them(new T.CircleGeometry(2.05, 56), mTham, 0, .305, 0, tru0); mat0.rotation.x = -PI / 2;
  var bongTru = new T.Mesh(new T.PlaneGeometry(1, 1), mBong); bongTru.rotation.x = -PI / 2; bongTru.position.set(0, Y_KHAY + .02, .3); bongTru.scale.set(7.4, 7, 1); bongTru.renderOrder = 1; tru0.add(bongTru);
  /* bóng mềm của bộ máy nằm lơ lửng giữa trụ → tắt */
  var ve0 = V.ve;
  V.ve = function (tt) { var r = tt.n * tt.co / 10 / (2 * PI), k = Math.max(.6, (r - tt.co / 20 - .06) / 2.26); tru0.scale.set(k, 1, k); return ve0(tt); };
  V.nghieng.traverse(function (o) { if (o.isMesh && o.geometry.type === 'PlaneGeometry' && Math.abs(o.position.y + .62) < .01 && o.material.opacity === .5) o.material.opacity = 0; });

  /* ---------- giá treo trang sức ---------- */
  var gia = new T.Group(); gia.position.set(8.5, Y, -9.5); G.add(gia); gia.visible = tuy.gia !== false;
  them(new T.BoxGeometry(17, 1.5, 6.4), mGo, 0, .75, 0, gia);
  them(new T.BoxGeometry(15.6, .1, 5.2), mGoDam, 0, 1.51, 0, gia);
  function tru(x, cao) { them(new T.BoxGeometry(1.05, cao, 1.05), mGo, x, 1.5 + cao / 2, -.6, gia); }
  tru(-6.6, 12.2); tru(6.4, 7.6);
  function thanh(x1, x2, y) { var m = them(new T.CylinderGeometry(.5, .5, x2 - x1, 20), mGo, (x1 + x2) / 2, y, -.6, gia); m.rotation.z = PI / 2; return m; }
  thanh(-7.4, 7.8, 13.2); thanh(-1.4, 7.2, 8.6);
  bong(8.5, -9.2, 10, 4.6).visible = tuy.gia !== false;

  /* các chuỗi mẫu treo trên giá: mỗi chuỗi là một vòng hạt nhỏ treo đứng, đung đưa nhẹ */
  var R_MINI = 1.2, TREO = [[-4.2, 13.2], [-.6, 13.2], [3, 13.2], [1.3, 8.6], [4.9, 8.6]], minis = [];
  (tuy.maus || []).forEach(function (m, i) {
    /* bản thu nhỏ đúng tỉ lệ của chuỗi thật: cùng số hạt, hạt to nhỏ đúng theo cỡ ly → lúc chuỗi thật bay về giá / rời giá, hai hình khớp nhau */
    var nhom = new T.Group(), xoay = new T.Group(), co = m.co || 8, n = Math.max(16, Math.round(16.5 * 10 / co)), rThat = n * co / 10 / (2 * PI), rHat = R_MINI * (co / 20) / rThat;
    /* chuỗi MẮC QUA thanh: hạt trên cùng tì lên lưng thanh gỗ, thanh luồn qua lòng vòng; vòng xoay chéo ~60° để nhìn rõ hình tròn */
    var lech = new T.Group(); lech.rotation.y = (i % 2 ? -1 : 1) * 1.05;
    nhom.position.set(TREO[i][0], TREO[i][1] + .5 + rHat, -.6); gia.add(nhom); nhom.add(xoay); xoay.add(lech);
    var mat = new T.MeshPhysicalMaterial({ color: new T.Color(m.mau[0]).lerp(new T.Color(m.mau[1]), .45), roughness: .12, clearcoat: 1, clearcoatRoughness: .05 }), geo = new T.SphereGeometry(rHat, 18, 12);
    for (var k = 0; k < n; k++) { var a = k * 2 * PI / n; them(geo, mat, R_MINI * Math.sin(a), -R_MINI + R_MINI * Math.cos(a), 0, lech); }
    var vung = them(new T.SphereGeometry(R_MINI + .5, 8, 6), new T.MeshBasicMaterial({ visible: false }), 0, -R_MINI, 0, xoay);   // vùng bấm rộng hơn hạt
    vung.userData.mau = i;
    minis.push({ nhom: nhom, xoay: xoay, lech: lech, i: i, pha: i * 1.7, rThat: rThat, an: false });
  });

  /* ---------- đồ nghề ---------- */
  /* thước dây: cuộn xoắn ốc dựng cạnh + đoạn thả ra uốn lượn */
  (function () {
    var d = [], i, a;
    for (i = 0; i <= 200; i++) { a = i / 200 * PI * 2 * 3.4; var r = .5 + i / 200 * 1.7; d.push(new T.Vector3(r * Math.cos(a), 0, r * Math.sin(a))); }
    var c = d[d.length - 1];
    for (i = 1; i <= 60; i++) { var u = i / 60; d.push(new T.Vector3(c.x + u * 7.5, 0, c.z + Math.sin(u * 5) * 1.1 + u * 1.5)); }
    var ong = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(d), 420, .07, 6), mThuoc); ong.scale.y = 9;   // ống dẹt → dải băng dựng cạnh
    var g = new T.Group(); g.add(ong); g.position.set(-10.5, Y + .12 + .75, 7.2); g.rotation.y = .5; G.add(g);
    bong(-10.3, 7.4, 3, 2.8, Y + .14);
  })();
  /* ống chỉ + kim có sợi chỉ */
  (function () {
    var g = new T.Group(); g.position.set(11.5, Y + .24, 3.4); G.add(g);
    them(new T.CylinderGeometry(1.25, 1.25, .22, 28), mGo, 0, .11, 0, g); them(new T.CylinderGeometry(.95, .95, 2.1, 28), mChi, 0, 1.27, 0, g);
    them(new T.CylinderGeometry(1.25, 1.25, .22, 28), mGo, 0, 2.43, 0, g); them(new T.CylinderGeometry(.3, .3, .24, 14), mGoDam, 0, 2.45, 0, g);
    var c = new T.CatmullRomCurve3([new T.Vector3(.95, 1.4, .1), new T.Vector3(2.2, .5, 1), new T.Vector3(1.4, .04, 2.6), new T.Vector3(-1, .04, 3.4), new T.Vector3(-3.6, .04, 2.2), new T.Vector3(-5.2, .06, 3.2)]);
    them(new T.TubeGeometry(c, 90, .035, 6), mChi, 0, 0, 0, g);
    var kim = them(new T.CylinderGeometry(.045, .012, 4.6, 8), mThep, -7.2, .07, 4.2, g); kim.rotation.set(PI / 2, 0, 1.05);
    bong(11.5, 3.6, 1.9, 1.7, Y + .14);
  })();
  /* kéo */
  (function () {
    var g = new T.Group(); g.position.set(6.4, Y + .3, 6.9); g.rotation.y = .5; G.add(g);
    [-1, 1].forEach(function (s) {
      var n = new T.Group(); n.rotation.y = s * .2; g.add(n);
      var luoi = them(new T.BoxGeometry(4.6, .07, .55), mThep, 2.5, 0, 0, n); luoi.geometry.translate(0, 0, s * .12);
      var tay = them(new T.TorusGeometry(.82, .15, 10, 28), mVang, -2.4, 0, s * .95, n); tay.rotation.x = PI / 2;
      them(new T.BoxGeometry(1.9, .16, .3), mVang, -.9, 0, s * .42, n).rotation.y = -s * .5;
    });
    them(new T.CylinderGeometry(.16, .16, .14, 12), mVang, .2, .06, 0, g);
    bong(6.8, 7.2, 3.6, 1.8, Y + .14);
  })();
  /* đĩa sứ đựng hạt ngọc + vài hạt rơi */
  var mNgoc = new T.MeshPhysicalMaterial({ color: 0x8FBF9F, roughness: .12, clearcoat: 1, clearcoatRoughness: .05 });
  (function () {
    var g = new T.Group(); g.position.set(-9.5, Y + .12, -1.5); G.add(g);
    var h = [new T.Vector2(0, 0), new T.Vector2(1.9, 0), new T.Vector2(2.7, .5), new T.Vector2(2.8, .62), new T.Vector2(2.6, .62), new T.Vector2(1.8, .16), new T.Vector2(0, .16)];
    them(new T.LatheGeometry(h, 40), mKem, 0, 0, 0, g);
    [[-.7, -.3, .5], [.5, -.6, .46], [.9, .5, .52], [-.3, .7, .44], [.1, 0, .4], [-1.1, .6, .36]].forEach(function (p) { them(new T.SphereGeometry(p[2], 20, 14), mNgoc, p[0], .16 + p[2], p[1], g); });
    bong(-9.5, -1.3, 3.4, 3.1, Y + .14);
    [[-5.8, 5.4, .42], [-6.9, 4.4, .34], [6.4, 4.2, .38], [-12.4, 3, .4]].forEach(function (p) { them(new T.SphereGeometry(p[2], 20, 14), mNgoc, p[0], Y + .24 + p[2], p[1]); });
  })();

  /* ---------- chậu cây, sách ---------- */
  var laDS = [];
  function cay(x, z, co, soLa, mat, matChau) {
    var g = new T.Group(); g.position.set(x, Y, z); g.scale.setScalar(co); G.add(g);
    them(new T.CylinderGeometry(2.7, 2, 4.4, 28), matChau, 0, 2.2, 0, g);
    /* vành chậu là ống rỗng (không có nắp) + viền trên, mặt đất nằm thấp hơn miệng chậu → không còn hai mặt trùng nhau gây sọc nhấp nháy */
    var vanh = them(new T.CylinderGeometry(2.9, 2.9, .7, 36, 1, true), matChau, 0, 4.4, 0, g); vanh.material = matChau.clone(); vanh.material.side = T.DoubleSide;
    var vien = them(new T.RingGeometry(2.62, 2.9, 36), matChau, 0, 4.752, 0, g); vien.rotation.x = -PI / 2;
    var dat = them(new T.CircleGeometry(2.7, 36), M(0x5A4636, 1), 0, 4.5, 0, g); dat.rotation.x = -PI / 2;
    for (var i = 0; i < soLa; i++) {
      var la = new T.Group(), a = i / soLa * PI * 2 + (i % 2) * .4, ngh = .28 + (i % 3) * .2;
      la.position.y = 4.6; la.rotation.set(0, a, 0); g.add(la);
      var hinh = new T.Shape(); hinh.moveTo(0, 0); hinh.bezierCurveTo(1.6, 2.4, 1.7, 6, 0, 9.5 - (i % 3)); hinh.bezierCurveTo(-1.7, 6, -1.6, 2.4, 0, 0);
      var m = new T.Mesh(new T.ShapeGeometry(hinh, 10), mat), tr = new T.Group(); tr.rotation.x = ngh; tr.add(m); la.add(tr);
      laDS.push({ o: tr, goc: ngh, pha: i * 1.3 + x });
    }
    bong(x, z + .3, 4.4 * co, 3.8 * co);
  }
  cay(21, -10.5, 1.25, 9, mLa, mDat);
  cay(-15.5, 8.5, .55, 5, mLa2, mKem);
  them(new T.BoxGeometry(6.4, .8, 4.6), M(0x587553, .8), -22.5, Y + .4, 3).rotation.y = .18;
  them(new T.BoxGeometry(6, .7, 4.3), M(0xF59178, .8), -22.4, Y + 1.15, 3.1).rotation.y = .05;
  bong(-22.4, 3.3, 4.2, 3.2);

  /* ---------- tường, cửa sổ nhìn ra cây, rèm, đèn lồng ---------- */
  var ZT = -14.5;
  them(new T.PlaneGeometry(150, 70), mTuong, 0, Y + 35, ZT);
  var tCay = vai(256, 320, function (g, w, h) { var l = g.createLinearGradient(0, 0, 0, h); l.addColorStop(0, '#F4F4DD'); l.addColorStop(.55, '#D7E6C6'); l.addColorStop(1, '#B9D0A6'); g.fillStyle = l; g.fillRect(0, 0, w, h);
    g.filter = 'blur(9px)'; [[40, 110, 95, '#7FA06E'], [205, 70, 110, '#587553'], [130, 285, 120, '#93B383'], [190, 185, 62, '#45603F'], [60, 230, 58, '#7FA06E']].forEach(function (b) { g.fillStyle = b[3]; g.beginPath(); g.arc(b[0], b[1], b[2], 0, 7); g.fill(); }); });
  var cs = new T.Group(); cs.position.set(-4.5, Y + 16.5, ZT + .1); G.add(cs);
  var kinh = them(new T.PlaneGeometry(15, 19), new T.MeshBasicMaterial({ map: tCay, toneMapped: false }), 0, 0, 0, cs);
  var mKhung = M(0x2A2622, .6);
  [[0, 9.5, 15.8, .5], [0, -9.5, 15.8, .5], [0, -1.2, 15, .4]].forEach(function (k) { them(new T.BoxGeometry(k[2], k[3], .5), mKhung, k[0], k[1], .2, cs); });
  [[-7.65, 0], [7.65, 0]].forEach(function (k) { them(new T.BoxGeometry(.5, 19.5, .5), mKhung, k[0], k[1], .2, cs); });
  them(new T.CylinderGeometry(.14, .14, 27, 10), mKhung, 0, 10.9, .9, cs).rotation.z = PI / 2;
  var remDS = [];
  [-10.2, 10.2].forEach(function (x, i) { var geo = new T.PlaneGeometry(5.4, 23, 22, 1), m = them(geo, M(0xFBF3E3, .95, { side: T.DoubleSide, emissive: 0xE9DCC2, emissiveIntensity: .55 }), x, -.6, .9, cs);
    remDS.push({ geo: geo, goc: geo.attributes.position.array.slice(), pha: i * 2 }); });
  var den = new T.Group(); den.position.set(1.5, Y + 37, -6); G.add(den);
  them(new T.CylinderGeometry(.05, .05, 12, 6), mKhung, 0, -6, 0, den);
  var qua = them(new T.SphereGeometry(3.3, 32, 20), new T.MeshBasicMaterial({ color: 0xFBD9B8, toneMapped: false }), 0, -14.6, 0, den); qua.scale.y = .86;
  var tSang = vai(128, 128, function (g) { var r = g.createRadialGradient(64, 64, 6, 64, 64, 64); r.addColorStop(0, 'rgba(255,224,186,.75)'); r.addColorStop(1, 'rgba(255,224,186,0)'); g.fillStyle = r; g.fillRect(0, 0, 128, 128); });
  var sang = new T.Sprite(new T.SpriteMaterial({ map: tSang, transparent: true, depthWrite: false, toneMapped: false })); sang.scale.set(15, 15, 1); sang.position.y = -14.6; den.add(sang);

  /* vệt nắng trên mặt bàn + bụi nắng */
  var tNang = vai(256, 256, function (g, w, h) { g.translate(w / 2, h / 2); g.rotate(-.5); for (var i = -6; i < 6; i++) { g.fillStyle = 'rgba(255,240,205,' + (i % 2 ? .0 : .5) + ')'; g.fillRect(i * 34, -h, 20, h * 2); } });
  var nang = them(new T.PlaneGeometry(46, 30), new T.MeshBasicMaterial({ map: tNang, transparent: true, opacity: .22, depthWrite: false, toneMapped: false, blending: T.AdditiveBlending }), 2, Y + .3, 0); nang.rotation.x = -PI / 2; nang.renderOrder = 2;
  var soBui = 46, viTri = new Float32Array(soBui * 3), buiGoc = [];
  for (var b = 0; b < soBui; b++) { buiGoc.push([(Math.random() - .5) * 44, Math.random() * 20, (Math.random() - .5) * 26 - 2, Math.random() * 6]); }
  var buiGeo = new T.BufferGeometry(); buiGeo.setAttribute('position', new T.BufferAttribute(viTri, 3));
  var bui = new T.Points(buiGeo, new T.PointsMaterial({ color: 0xFFF4D6, size: .16, transparent: true, opacity: .8, depthWrite: false, toneMapped: false })); bui.position.y = Y; G.add(bui);

  /* ---------- chọn chuỗi trên giá: bấm → chuỗi rời giá bay ra khay ---------- */
  /* Chuỗi chính của bộ máy nằm trong nhóm "quay". Bọc nó trong nhóm "boc" để tự do dời / xoay / thu phóng cả chuỗi (kèm charm)
     mà bộ máy không hay biết. Đổi chuỗi = đúng động tác thật, không có bước đổi hình:
       pha 1: chuỗi đang xem nhấc khỏi trụ, bay vòng cung về đúng chỗ treo của nó trên giá, nhỏ dần và dựng đứng → thành chuỗi treo
       pha 2: chuỗi được chọn (đã là chuỗi thật, đủ charm) rời giá, bay xuống, lớn dần và ngả nằm quanh trụ. */
  var quayChinh = V.nghieng.children[0], boc = new T.Group(); V.nghieng.add(boc); boc.add(quayChinh);
  var tia = new T.Raycaster(), nd = new T.Vector2(), bay = null, dangChon = 0, vung = minis.map(function (m) { return m.xoay.children[m.xoay.children.length - 1]; });
  var NHA = { p: new T.Vector3(), q: new T.Quaternion(), s: 1 }, TRUC_Y = new T.Vector3(0, 1, 0);
  function tuThe(m) {   // vị trí, hướng, cỡ của chuỗi thật khi nó trùng khít với chuỗi treo m (toạ độ trong nhóm nghiêng)
    V.nghieng.updateMatrixWorld(true);
    var tam = V.nghieng.worldToLocal(m.lech.localToWorld(new T.Vector3(0, -R_MINI, 0)));
    var phap = new T.Vector3(0, 0, 1).transformDirection(m.lech.matrixWorld).applyQuaternion(V.nghieng.getWorldQuaternion(new T.Quaternion()).invert());
    return { p: tam, q: new T.Quaternion().setFromUnitVectors(TRUC_Y, phap), s: R_MINI * TL / m.rThat };
  }
  function trung(ev) { var r = V.cv.getBoundingClientRect(); nd.set((ev.clientX - r.left) / r.width * 2 - 1, -(ev.clientY - r.top) / r.height * 2 + 1); tia.setFromCamera(nd, V.cam);
    if (!gia.visible) return -1;
    var k = tia.intersectObjects(vung.filter(function (v, i) { return !minis[i].an; }), false)[0]; return k ? k.object.userData.mau : -1; }
  function chon(i) {
    if (i === dangChon || bay || !minis[i]) return;
    bay = { pha: 1, t: performance.now(), tu: NHA, den: tuThe(minis[dangChon]), moi: i };
  }
  if (minis[0]) { minis[0].an = true; minis[0].nhom.visible = false; }
  var xuong = null;
  V.cv.addEventListener('pointerdown', function (ev) { xuong = [ev.clientX, ev.clientY]; });
  V.cv.addEventListener('click', function (ev) { if (xuong && Math.abs(ev.clientX - xuong[0]) + Math.abs(ev.clientY - xuong[1]) > 6) return; var i = trung(ev); if (i >= 0) chon(i); });
  V.cv.addEventListener('pointermove', function (ev) { if (ev.buttons || !G.visible) return; var i = trung(ev); V.cv.classList.toggle('tro-chuoi', i >= 0); V.cv.title = i >= 0 ? 'Chuỗi ' + tuy.maus[i].ten + ' — bấm để xem' : ''; });

  /* ---------- chuyển động từng khung hình ---------- */
  var khungCu = V.khi.khung;
  V.khi.khung = function () {
    if (khungCu) khungCu();
    var t = (performance.now() - t0) / 1000, i;
    for (i = 0; i < minis.length; i++) { var m = minis[i]; if (!bay) m.xoay.rotation.x = Math.sin(t * 1.1 + m.pha) * .1; }   // đung đưa quanh thanh gỗ (đứng yên lúc đang đổi chuỗi để hai hình khớp nhau)
    if (bay) {
      var dai = bay.pha === 1 ? 620 : 820, u2 = Math.min(1, (performance.now() - bay.t) / dai), e = u2 < .5 ? 4 * u2 * u2 * u2 : 1 - Math.pow(-2 * u2 + 2, 3) / 2;
      boc.position.lerpVectors(bay.tu.p, bay.den.p, e); boc.position.y += Math.sin(e * PI) * 2.6;        // bay theo vòng cung
      boc.quaternion.slerpQuaternions(bay.tu.q, bay.den.q, e); boc.scale.setScalar(bay.tu.s + (bay.den.s - bay.tu.s) * e);
      if (u2 >= 1) {
        if (bay.pha === 1) {   // chuỗi cũ đã về giá: hiện lại chuỗi treo của nó, giấu chuỗi treo mới và cho chuỗi thật "hoá" thành chuỗi mới ngay tại giá
          var cu = minis[dangChon], mm = minis[bay.moi]; cu.an = false; cu.nhom.visible = true; mm.an = true; mm.nhom.visible = false; dangChon = bay.moi;
          tuy.chon(bay.moi, true);
          var tt2 = tuThe(mm); boc.position.copy(tt2.p); boc.quaternion.copy(tt2.q); boc.scale.setScalar(tt2.s);
          bay = { pha: 2, t: performance.now(), tu: tt2, den: NHA, moi: bay.moi };
        } else { boc.position.set(0, 0, 0); boc.quaternion.identity(); boc.scale.setScalar(1); bay = null; }
      }
    }
    for (i = 0; i < laDS.length; i++) laDS[i].o.rotation.x = laDS[i].goc + Math.sin(t * .9 + laDS[i].pha) * .05;
    for (i = 0; i < remDS.length; i++) { var r = remDS[i], p = r.geo.attributes.position, g0 = r.goc;
      for (var k = 0; k < p.count; k++) { var x = g0[k * 3], y = g0[k * 3 + 1], lac = (11.5 - y) / 23; p.array[k * 3 + 2] = Math.sin(x * 4.2) * .32 + Math.sin(t * .8 + r.pha + x) * .22 * lac; p.array[k * 3] = x + Math.sin(t * .6 + r.pha) * .25 * lac; }
      p.needsUpdate = true; }
    den.rotation.z = Math.sin(t * .7) * .03; sang.material.opacity = .78 + Math.sin(t * 1.3) * .14;
    nang.material.opacity = .2 + Math.sin(t * .4) * .06; nang.position.x = 2 + Math.sin(t * .13) * 1.6;
    for (i = 0; i < soBui; i++) { var q = buiGoc[i], yy = (q[1] + t * (.25 + q[3] * .05)) % 20; viTri[i * 3] = q[0] + Math.sin(t * .3 + q[3]) * .8; viTri[i * 3 + 1] = yy; viTri[i * 3 + 2] = q[2]; }
    buiGeo.attributes.position.needsUpdate = true;
  };
  V.chay();
  return { nhom: G, chon: chon };
};
