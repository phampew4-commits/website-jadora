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
thay('"Noto Serif Display"', '"Fraunces"')
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
open('js/tk/vong-3d.js', 'w', encoding='utf-8').write(v)
print('xong', len(s))
