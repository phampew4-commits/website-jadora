import os, sys
os.chdir(sys.argv[1])
p = 'js/tk/thiet-ke.js'
s = open('../website-ngoc-tram/js/thiet-ke.js', encoding='utf-8').read()
def thay(a, b, it=None):
    global s
    n = s.count(a)
    if not n or (it and n != it): print('LECH', n, a[:60])
    s = s.replace(a, b)

thay('Ngọc Trầm Store', 'Jadora')
thay('NGỌC TRẦM', 'JADORA')
thay('Ngọc Trầm', 'Jadora')
thay('thiet-ke-ngoc-tram.png', 'thiet-ke-jadora.png')
thay("'nt-thiet-ke'", "'jadora_thiet_ke'")
thay('"Lora"', '"Jadora Serif"')            # Jadora tự host font riêng (fonts/NGUON.md)
thay('"Be Vietnam Pro"', '"Jadora Sans"')
thay("'#f6f0e6'", "'#F6F1EA'")
thay("x.fillStyle = '#a8823a'", "x.fillStyle = '#587553'")
thay("x.fillStyle = '#1d3a46'", "x.fillStyle = '#2A2622'")
thay("'#fbf7f0'", "'#FFFDF8'"); thay("'#efe5d3'", "'#EEF0E3'")
thay('stroke="#a8823a"', 'stroke="#F59178"')
# tên lớp trùng với web Jadora
thay('<button class="dong" data-dong', '<button class="hg-dong" data-dong')
thay('<button type="button" class="dong" data-huy', '<button type="button" class="hg-dong" data-huy')
thay('<p class="rong">', '<p class="tk-rong">')
thay("$('#thanhTk').classList.remove('hien')", "$('#thanhTk').classList.remove('tk-hien')")
thay("$('#thanhTk').classList.add('hien')", "$('#thanhTk').classList.add('tk-hien')")
thay("hopGui.classList.add('mo')", "hopGui.classList.add('tk-mo')")
thay("hopGui.classList.remove('mo')", "hopGui.classList.remove('tk-mo')")
thay("hopLuu.classList.add('mo')", "hopLuu.classList.add('tk-mo')")
thay("hopLuu.classList.remove('mo')", "hopLuu.classList.remove('tk-mo')")
thay("mini.classList.toggle('hien',", "mini.classList.toggle('tk-hien',")
# ảnh: web Jadora có hàm hinh() khác thứ tự tham số
thay('hinh(d.anh, d.ten, 300)', 'tkHinh(d.anh, d.ten, 300)')
thay('hinh(c.anh, c.ten, 300)', 'tkHinh(c.anh, c.ten, 300)')
# Jadora chưa lưu thiết kế vào tài khoản (thiết kế tự lưu trên máy + trong link)
thay("(KHACH.bat ? '<button class=\"nut nut-luu-tk\" id=\"luuTk\">♡ Lưu vào tài khoản</button>' : '')", "''")
# báo cho trang biết mỗi lần vẽ lại (để cập nhật thanh bước)
thay("  dungTabVong(); bong(); tomTat(); luu(); capMini();\n", "  dungTabVong(); bong(); tomTat(); luu(); capMini();\n  dispatchEvent(new CustomEvent('tk-ve', {detail: {day: chon.day, vong: chon.vong, tay: chon.tay, charm: chon.gan.length, tong: uoc(tong())}}));\n")

dau = '''/* JADORA — bộ máy "Tự thiết kế chuỗi", chuyển từ web Ngọc Trầm (cong-cu/chuyen_thiet_ke.py sinh ra — đừng sửa tay).
   Chạy sau khi khoiDong() đã tải cấu hình. Gói trong một hàm để không đụng tên với mã của Jadora. */
(function () {
var L0 = CH.lienHe || {};
var GIAM = window.GIAM;
var CHINH_SACH = {luuY: [(CH.thietKe || {}).luuY || 'Charm vàng là charm trang sức, không phải vàng tích sản. Khi bán lại sẽ mất giá nhiều so với giá mua, bạn cân nhắc trước khi chọn nhé.']};
function taiJson(u) { return fetch(u, {cache: 'no-cache'}).then(function (r) { return r.json(); }); }
function baoTin(c) { bao(c); }
function tkHinh(id, alt, w) { return '<img src="' + anh(id, w) + '" alt="' + e(alt || '') + '" loading="lazy" decoding="async" referrerpolicy="no-referrer">'; }
function linkZalo() { return 'https://zalo.me/' + String(L0.zalo || L0.sdt || '').replace(/\\D/g, ''); }
function linkFb() { return !L0.messenger ? linkZalo() : (matchMedia('(pointer: coarse)').matches ? 'https://m.me/' : 'https://www.facebook.com/') + L0.messenger; }
'''
open(p, 'w', encoding='utf-8').write(dau + s + '\n})();\n')

# vong-3d.js dùng biến GIAM toàn cục của web Ngọc Trầm
v = open('../website-ngoc-tram/js/vong-3d.js', encoding='utf-8').read()
# Jadora: cho cảnh ngoài (js/xuong-canh.js — bàn làm việc 3D ở trang chủ) gắn vào cùng một cảnh với chuỗi:
#  - V3D.xa: hệ số lùi máy ảnh ở chế độ thiết kế (mặc định 1 = như trang Tự thiết kế)
#  - V3D.THREE / canh / cam / R / nghieng / cv / chay: các phần của cảnh để thêm vật và bắt bấm chuột
for a, b in (("kc = 10 + kq.BKmax * 3.1,", "kc = (10 + kq.BKmax * 3.1) * (V.xaDeo || 1),"),   # V3D.xaDeo: lùi máy ảnh ở chế độ đeo thử
             # đeo thử: bản gốc nhìn chéo từ khuỷu tay (az -.62) khó thấy chuỗi → Jadora nhìn gần chính diện vào cổ tay, hơi từ trên xuống
             ("az = -.62, el = .42 + ngThem;", "az = (V.azDeo == null ? -.2 : V.azDeo), el = (V.elDeo == null ? .5 : V.elDeo) + ngThem;"),
             # Cỡ charm: mô hình đã được chuẩn hoá về mm thật (bảng số đo KT, cỡ ghi trong tên, hoặc ước theo ảnh).
             # Bản Ngọc Trầm thu nhỏ thêm cho "cân mắt" (xuyên ×0,8 · treo ×0,72); Jadora giữ ĐÚNG CỠ THẬT so với hạt.
             ("var CO_XUYEN = .8, CO_TREO = .72;", "var CO_XUYEN = 1, CO_TREO = 1;"),
             # Charm treo: bản gốc rủ theo chiều "xuống màn hình". Khi chuỗi nằm trên bàn 3D (js/xuong-canh.js đặt V3D.trongLuc = hướng
             # vuông góc xuống mặt bàn) thì charm phải rủ theo mặt bàn, và không được đung đưa vào phía trong (chỗ có trụ trưng bày).
             ("o.b.y -= 46 * dt * dt;", "if (V.trongLuc && !deo) o.b.addScaledVector(V.trongLuc, 46 * dt * dt); else o.b.y -= 46 * dt * dt;"),
             ("r3.copy(o.b).sub(Pw); r3.addScaledVector(Tw, -r3.dot(Tw)); if (r3.lengthSq() < 1e-6)",
              "r3.copy(o.b).sub(Pw); r3.addScaledVector(Tw, -r3.dot(Tw)); if (V.trongLuc && !deo) { vt.set(0, 0, 0); chua.localToWorld(vt); vt.subVectors(Pw, vt); vt.addScaledVector(V.trongLuc, -vt.dot(V.trongLuc)).normalize(); var huongVao = r3.dot(vt); if (huongVao < 0) r3.addScaledVector(vt, -huongVao); } if (r3.lengthSq() < 1e-6)"),
             ("cT.set(0, 0, 7 + Math.max(bk, 3.1) * 3.3);", "cT.set(0, 0, (7 + Math.max(bk, 3.1) * 3.3) * (V.xa || 1));"),
             ("var V = window.V3D = { ve: ve, viTri: viTri, anh: anh,", "var V = window.V3D = { THREE: THREE, canh: canh, cam: cam, R: R, nghieng: nghieng, cv: cv, chay: chay, ve: ve, viTri: viTri, anh: anh,")):
    if a not in v: print('LECH vong-3d', a[:50])
    v = v.replace(a, b)
open('js/tk/vong-3d.js', 'w', encoding='utf-8').write(v)
print('xong', len(s))
