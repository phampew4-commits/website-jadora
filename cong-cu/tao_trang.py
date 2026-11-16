#!/usr/bin/env python3
"""Sinh các trang nội dung của Jadora từ một khung chung.
Chạy:  python3 cong-cu/tao_trang.py   (rồi chạy tang_phien_ban.py)
Sửa NỘI DUNG từng trang ngay trong file này (mục TRANG) rồi chạy lại — đừng sửa tay file .html sinh ra."""
import os
GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

KHUNG = '''<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>@TEN@ · Jadora</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Be+Vietnam+Pro:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css?v=1">
<link rel="stylesheet" href="css/hieu-ung.css?v=1">
<link rel="stylesheet" href="css/dau.css?v=1">
<link rel="stylesheet" href="css/trang.css?v=1">
@CSS@</head>
<body>
<div id="dau"></div>

<main>
@THAN@
</main>

<div id="chan"></div>

<script src="js/chung.js?v=1"></script>
<script src="js/hieu-ung.js?v=1"></script>
<script src="js/dau.js?v=1"></script>
<script src="js/khach.js?v=1"></script>
<script>
@JS@
</script>
</body>
</html>
'''

HD = [('do-co-tay.html', 'Đo cỡ tay & cỡ nhẫn'), ('bao-quan.html', 'Bảo quản ngọc'), ('kien-thuc.html', 'Kiến thức về ngọc'), ('hoi-dap.html', 'Hỏi đáp')]
CS = [('giao-hang.html', 'Giao hàng & thanh toán'), ('doi-tra.html', 'Đổi trả & bảo hành'), ('tra-cuu-don.html', 'Tra cứu đơn hàng'), ('bao-mat.html', 'Chính sách bảo mật'), ('dieu-khoan.html', 'Điều khoản sử dụng')]

def ben(file):
    def nhom(td, ds):
        return '<div><b>' + td + '</b>' + ''.join('<a%s href="%s">%s</a>' % (' class="chon"' if f == file else '', f, t) for f, t in ds) + '</div>'
    return '<aside class="tr-ben">' + nhom('Hướng dẫn', HD) + nhom('Chính sách', CS) + '</aside>'

def dau(nhan, td, mo=''):
    return ('<div class="bb tr-dau"><p class="nhan">%s</p><h1>%s</h1>' % (nhan, td)) + ('<p class="tr-mo">%s</p>' % mo if mo else '') + '</div>'

def hai(file, than):
    return '<div class="bb tr-hai">' + ben(file) + '<div class="tr-than">' + than + '</div></div>'

def cho(td='Trang đang soạn nội dung', chu='Phần này sẽ được viết kỹ sau. Trong lúc chờ, bạn cứ nhắn cho Jadora — có người thật trả lời.'):
    return '<div class="tr-cho"><div><b>%s</b>%s</div></div>' % (td, chu)

NHAN_TIN = '<div class="tr-nut"><a class="nut toi" data-zalo href="lien-he.html">Nhắn Zalo</a><a class="nut vien" href="lien-he.html">Các kênh liên hệ</a></div>'
JS_ZALO = "khoiDong(function(){var L=CH.lienHe||{}; $$('[data-zalo]').forEach(function(a){a.href='https://zalo.me/'+(L.zalo||L.sdt); a.target='_blank'; a.rel='noopener'}); @THEM@});"

def js(them=''): return JS_ZALO.replace('@THEM@', them)

TRANG = {}
JS_CS = "var C=CH.chinhSach||{}; $$('[data-cs]').forEach(function(u){var ds=C[u.dataset.cs]; if(ds&&ds.length) u.innerHTML=ds.map(function(x){return '<li>'+e(x)+'</li>'}).join('')}); $$('[data-cs1]').forEach(function(u){var ds=C[u.dataset.cs1]; if(ds&&ds.length) u.textContent=ds.join(' ')}); if(C.banNhap===false) $$('.tr-cho').forEach(function(x){x.remove()});"
def trang(file, ten, than, js_=None, css=''): TRANG[file] = (ten, than, js_ if js_ is not None else js(), css)

# ---------------------------------------------------------------- GIAO HÀNG & THANH TOÁN
trang('giao-hang.html', 'Giao hàng & thanh toán',
  dau('Chính sách', 'Giao hàng &amp; <em>thanh toán</em>', 'Mỗi món được quay video trước khi gửi và bạn được mở hộp kiểm tra khi nhận.') +
  hai('giao-hang.html', cho('Bản nháp', 'Nội dung lấy từ chính sách đang dùng ở cửa hàng, chờ duyệt lại cho Jadora.') + '''
<section class="len"><h2>Giao hàng</h2><ul data-cs="giao">
  <li>Giao toàn quốc qua Vietnam Post. Nội thành Bắc Ninh có thể giao trong ngày, hoặc bạn ghé lấy tại cửa hàng.</li>
  <li>Miền Bắc 2–3 ngày; miền Trung và miền Nam 3–5 ngày.</li>
  <li>Mỗi món được đóng hộp, chèn chống sốc cẩn thận.</li>
  <li>Trước khi gửi, cửa hàng quay video món hàng để bạn xem lại.</li>
</ul></section>
<section class="len"><h2>Phí giao hàng</h2><ul>
  <li id="ghi-ship">Miễn phí giao hàng khi chuyển khoản trước toàn bộ và hoá đơn trên 1.500.000đ.</li>
</ul><ul data-cs="phi"><li>Các trường hợp khác, phí ship tính theo đơn vị giao hàng.</li></ul></section>
<section class="len"><h2>Thanh toán</h2><ul data-cs="thanhToan">
  <li><b>Nhận hàng trả tiền (COD):</b> được kiểm tra hàng trước khi thanh toán. Với đơn giá trị cao, cửa hàng xin bạn cọc trước.</li>
  <li><b>Chuyển khoản:</b> thông tin tài khoản hiện ở bước đặt hàng và được cửa hàng xác nhận lại qua tin nhắn.</li>
</ul>''' + NHAN_TIN + '</section>'),
  js("var V=CH.vanChuyen||{}; if(V.ghiChu) $('#ghi-ship').textContent=V.ghiChu; " + JS_CS))

# ---------------------------------------------------------------- ĐỔI TRẢ & BẢO HÀNH
trang('doi-tra.html', 'Đổi trả & bảo hành',
  dau('Chính sách', 'Đổi trả &amp; <em>bảo hành</em>') +
  hai('doi-tra.html', cho('Bản nháp', 'Nội dung lấy từ chính sách đang dùng ở cửa hàng, chờ duyệt lại cho Jadora.') + '''
<section class="len"><h2>Đổi trả</h2><ul data-cs="doi">
  <li>Đổi trong vòng 1 ngày kể từ khi nhận hàng nếu món không đúng mô tả, khác ảnh hoặc bị lỗi do vận chuyển. Cửa hàng chịu phí ship hai chiều.</li>
  <li>Ngoài trường hợp trên, sản phẩm không áp dụng đổi trả.</li>
</ul></section>
<section class="len"><h2>Bảo hành</h2><ul data-cs="baoHanh">
  <li>Xâu lại dây miễn phí trong 12 tháng khi dây bị giãn hoặc đứt.</li>
  <li>Đánh bóng, làm sạch charm vàng miễn phí 1 lần mỗi năm.</li>
  <li>Không bảo hành ngọc bị nứt, vỡ do va đập hay rơi. Cửa hàng hỗ trợ tư vấn sửa với chi phí ưu đãi.</li>
  <li>Khi cần bảo hành, bạn nhắn Zalo kèm mã sản phẩm.</li>
</ul></section>
<section class="len"><h2>Lưu ý về charm vàng</h2>
  <p data-cs1="luuY">Charm vàng là charm trang sức, không phải vàng tích sản. Khi bán lại sẽ mất giá nhiều so với giá mua, bạn cân nhắc trước khi chọn nhé.</p>''' + NHAN_TIN + '</section>'),
  js(JS_CS))

# ---------------------------------------------------------------- HỎI ĐÁP
trang('hoi-dap.html', 'Hỏi đáp',
  dau('Hướng dẫn', 'Hỏi <em>đáp</em>', 'Những câu khách hay hỏi nhất. Chưa thấy câu của bạn thì cứ nhắn.') +
  hai('hoi-dap.html', '<div class="xep" id="hd"></div>' + NHAN_TIN),
  js("$('#hd').innerHTML=(CH.hoiDap||[]).map(function(h,i){return '<details'+(i?'':' open')+'><summary>'+e(h.hoi||h.q||'')+'</summary><div class=\"noi\"><p>'+e(h.dap||h.a||'')+'</p></div></details>'}).join('');"))

# ---------------------------------------------------------------- ĐO CỠ TAY & CỠ NHẪN
THUOC = ''.join('<line x1="%d" y1="0" x2="%d" y2="%d"/>' % (x, x, 12 if i % 5 == 0 else 7) for i, x in enumerate(range(0, 241, 8)))
# Hình minh hoạ: bàn tay vẽ nét mảnh (một đường viền liền), thước / giấy đo màu cam nổi lên trên.
MO = '<svg viewBox="0 0 240 260" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><g transform="translate(20 0)">'
DONG = '</g></svg>'
CHU = '<text x="%d" y="%d" text-anchor="%s" stroke="none" fill="currentColor" font-size="12">%s</text>'
NGON = 'L64 52C64 37 86 37 86 52L87 108L88 36C88 21 110 21 110 36L111 108L113 47C113 32 135 33 134 48L134 114L137 77C138 63 158 65 156 79L153 142C152 168 146 186 137 201C132 212 130 232 130 258'
TAY = '<path class="dc-tay" d="M74 258C74 226 72 204 66 188C58 172 44 160 32 142C24 130 17 117 20 106C23 96 35 96 41 107C47 119 55 129 64 134' + NGON + '"/>'
TAY_CHUM = ('<path class="dc-tay" d="M74 258C74 226 72 204 67 188C62 172 62 152 64 134' + NGON + '"/>'    # ngón cái gập vào lòng bàn tay
            '<path class="dc-nep dam" d="M70 196C74 176 88 158 112 146C122 142 128 152 120 160C106 172 96 184 90 200"/>')
NEP = '<path class="dc-nep" d="M70 150C86 138 112 136 150 146M72 176C92 160 118 158 146 168"/>'
SVG_CO_TAY = (MO + TAY + NEP + '<g class="dc-day"><path d="M62 222C72 215 132 215 142 222" stroke-width="2" stroke-dasharray="3 4"/><path d="M62 224C76 234 128 234 142 224" stroke-width="10"/></g>'
              '<path d="M150 226h12"/>' + CHU % (166, 230, 'start', 'cổ tay') + DONG)
SVG_NGANG = (MO + TAY + NEP + '<g class="dc-day"><path d="M64 126h92" stroke-width="2.6"/><path d="M64 116v20M156 116v20" stroke-width="2.6"/></g>'
             '<path d="M162 126h10"/>' + CHU % (176, 130, 'start', 'ngang') + DONG)
SVG_CHU_VI = (MO + TAY_CHUM + '<g class="dc-day"><path d="M56 150C66 139 150 139 162 150" stroke-width="2" stroke-dasharray="3 4"/><path d="M56 152C70 163 148 163 162 152" stroke-width="10"/></g>'
              '<path d="M168 154h8"/>' + CHU % (180, 158, 'start', 'chu vi') + DONG)
SVG_NHAN = '''<svg viewBox="0 0 320 170" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<g transform="translate(40 96)"><rect x="-6" y="0" width="252" height="44" rx="4" class="dc-nen"/>''' + THUOC + '''
<g stroke="none" fill="currentColor" font-size="11" text-anchor="middle"><text x="0" y="30">0</text><text x="40" y="30">1</text><text x="80" y="30">2</text><text x="120" y="30">3</text><text x="160" y="30">4</text><text x="200" y="30">5</text><text x="240" y="30">6</text></g></g>
<g class="dc-day"><circle cx="70" cy="66" r="30" stroke-width="5"/><path d="M62 30l8-12 8 12" stroke-width="2"/></g>
<path d="M40 22h60m-60 0 6-5m-6 5 6 5m54-5-6-5m6 5-6 5" stroke-width="1.2"/><path d="M40 28v60M100 28v60" stroke-width="1" stroke-dasharray="2 4"/>
<text x="118" y="27" stroke="none" fill="currentColor" font-size="13">đường kính trong</text></svg>'''
SVG_GIAY = (MO + TAY + NEP + '<g class="dc-day"><path d="M111 70l40-14" stroke-width="9" opacity=".55"/><path d="M86 70h26" stroke-width="9"/></g>'
            '<path d="M113 60v20" stroke-width="2.4"/><path d="M113 54V40h16"/>' + CHU % (133, 44, 'start', 'đánh dấu') + DONG)

def bang(cot, hang):
    return '<div class="dc-bang"><table><thead><tr>' + ''.join('<th>%s</th>' % c for c in cot) + '</tr></thead><tbody>' + \
        ''.join('<tr>' + ''.join('<td>%s</td>' % o for o in h) + '</tr>' for h in hang) + '</tbody></table></div>'

trang('do-co-tay.html', 'Đo cỡ tay & cỡ nhẫn',
  dau('Hướng dẫn', 'Đo cỡ tay &amp; <em>cỡ nhẫn</em>', 'Chỉ cần một sợi thước dây, hoặc một mẩu giấy và cây thước kẻ. Chọn đúng món bạn định mua:') +
  '<div class="bb"><nav class="dc-chon" id="dc-chon"><button type="button" class="chon" data-o="chuoi"><b>Chuỗi hạt</b><small>đo cổ tay</small></button><button type="button" data-o="vong"><b>Vòng tay liền</b><small>đo lòng bàn tay</small></button><button type="button" data-o="nhan"><b>Nhẫn</b><small>đo ngón tay</small></button></nav></div>' +
  '<div class="bb dc" id="dc">' + '''
<section class="dc-o chon" data-o="chuoi">
  <div class="dc-hai"><figure class="dc-hinh">''' + SVG_CO_TAY + '''<figcaption>Quấn thước dây quanh cổ tay</figcaption></figure>
  <div><h2>Chuỗi hạt: <em>đo cổ tay</em></h2>
    <ol class="tr-buoc">
      <li><div><b>Quấn thước dây quanh cổ tay</b>Đặt ở chỗ bạn hay đeo, quấn sát da nhưng đừng siết.</div></li>
      <li><div><b>Đọc số đo</b>Ví dụ 15 cm. Không có thước dây thì quấn một mẩu giấy, đánh dấu rồi đo bằng thước kẻ.</div></li>
      <li><div><b>Gửi đúng số đo sát tay</b>Bạn không cần cộng thêm — khi xâu, cửa hàng tự cộng độ rộng để chuỗi đeo vừa.</div></li>
    </ol>
    <div class="dc-tinh"><label for="dc-tay">Cổ tay của bạn</label><output id="dc-so">15 cm</output>
      <input type="range" id="dc-tay" min="12" max="20" step="0.5" value="15">
      <p id="dc-kq"></p></div>
    <div class="tr-nut"><a class="nut toi" href="tu-thiet-ke.html" id="dc-tk">Thử phối chuỗi với cỡ này</a></div>
  </div></div>
</section>

<section class="dc-o" data-o="vong">
  <div class="dc-hai"><div class="dc-doi"><figure class="dc-hinh">''' + SVG_NGANG + '''<figcaption>Cách 1 · đo chiều ngang lòng bàn tay</figcaption></figure>
    <figure class="dc-hinh">''' + SVG_CHU_VI + '''<figcaption>Cách 2 · chụm các ngón, đo chu vi bàn tay</figcaption></figure></div>
  <div><h2>Vòng tay liền: <em>đo lòng bàn tay</em></h2>
    <p>Vòng liền phải lọt qua bàn tay, nên đo bàn tay chứ không đo cổ tay. Chọn một trong hai cách:</p>
    <ul><li><b>Chiều ngang:</b> xoè tay, đo ngang lòng bàn tay ở chỗ rộng nhất, không tính ngón cái.</li>
        <li><b>Chu vi:</b> chụm các ngón lại như lúc luồn vòng, quấn thước quanh chỗ to nhất của bàn tay.</li></ul>
    <p>Rồi đối chiếu với bảng dưới để ra cỡ vòng (đường kính trong).</p></div></div>
  ''' + bang(['Chiều ngang', 'Chu vi', 'Cỡ vòng'], [('60–64 mm', '16–17 cm', '50–52 mm'), ('64–68 mm', '17–18 cm', '52–54 mm'), ('68–72 mm', '18–19 cm', '54–56 mm'), ('72–76 mm', '19–20 cm', '56–58 mm'), ('76–80 mm', '20–21 cm', '58–60 mm')]) + '''
  <p class="dc-vd">Ví dụ: chiều ngang lòng bàn tay 60 mm → chọn vòng cỡ 50 hoặc 52 mm.</p>
</section>

<section class="dc-o" data-o="nhan">
  <div class="dc-hai"><div class="dc-doi"><figure class="dc-hinh">''' + SVG_NHAN + '''<figcaption>Cách 1 · đo chiếc nhẫn đang đeo vừa</figcaption></figure>
    <figure class="dc-hinh">''' + SVG_GIAY + '''<figcaption>Cách 2 · quấn giấy quanh ngón tay</figcaption></figure></div>
  <div><h2>Nhẫn: <em>đo ngón tay</em></h2>
    <h3>Cách 1 — Đo nhẫn có sẵn</h3>
    <p>Đặt chiếc nhẫn bạn đang đeo vừa lên thước, đo đường kính <b>bên trong</b> (không tính đai nhẫn). 15 mm là cỡ 15.</p>
    <h3>Cách 2 — Đo bằng giấy</h3>
    <ol class="tr-buoc">
      <li><div><b>Cắt một mẩu giấy dài, mảnh</b></div></li>
      <li><div><b>Quấn sát quanh ngón tay</b>Ở đốt bạn muốn đeo nhẫn.</div></li>
      <li><div><b>Đánh dấu điểm giao nhau</b></div></li>
      <li><div><b>Đo đoạn giấy, lấy độ dài chia 3,14</b>Kết quả là đường kính. Hoặc tra thẳng chu vi ở bảng dưới.</div></li>
    </ol>
    <div class="dc-tinh"><label for="dc-cv">Chu vi ngón tay đo được</label><output id="dc-cvso">5,3 cm</output>
      <input type="range" id="dc-cv" min="4.4" max="6.6" step="0.1" value="5.3">
      <p id="dc-cvkq"></p></div>
  </div></div>
  ''' + bang(['Cỡ nhẫn', 'Chu vi ngón tay', 'Đường kính trong'], [('15', '4,6 – 4,9 cm', '15 mm'), ('16', '5,0 – 5,2 cm', '16 mm'), ('17', '5,3 – 5,5 cm', '17 mm'), ('18', '5,6 – 5,8 cm', '18 mm'), ('19', '5,9 – 6,1 cm', '19 mm'), ('20', '6,2 – 6,4 cm', '20 mm')]) + '''
  <p class="dc-vd">Số đo nằm giữa hai cỡ thì chọn cỡ lớn hơn. Nên đo vào cuối ngày, lúc ngón tay nở nhất.</p>
</section>''' + '</div>' +
  '<div class="bb" style="padding-bottom:clamp(70px,9vw,120px)"><div class="tr-cho"><div><b>Chưa chắc cỡ?</b>Gửi số đo hoặc ảnh chụp cho Jadora, chúng tôi xem giúp trước khi bạn đặt.' + NHAN_TIN + '</div></div></div>',
  js('''
  function mo(o){ $$('#dc-chon button').forEach(function(b){b.classList.toggle('chon',b.dataset.o===o)}); $$('#dc .dc-o').forEach(function(s){s.classList.toggle('chon',s.dataset.o===o)}); history.replaceState(null,'','#'+o) }
  $('#dc-chon').onclick=function(ev){var b=ev.target.closest('button'); if(b) mo(b.dataset.o)};
  if(/^#(chuoi|vong|nhan)$/.test(location.hash)) mo(location.hash.slice(1));
  function so(n){return String(n).replace('.',',')}
  function tay(){ var t=+$('#dc-tay').value; $('#dc-so').textContent=so(t)+' cm';
    $('#dc-kq').innerHTML='Chuỗi được xâu dài khoảng <b>'+so(t+1.5)+' cm</b>: chừng <b>'+Math.round((t+1.5)*10/6)+' hạt 6 ly</b> hoặc <b>'+Math.round((t+1.5)*10/8)+' hạt 8 ly</b> mỗi vòng.';
    $('#dc-tk').href='tu-thiet-ke.html#t='+t }
  $('#dc-tay').oninput=tay; tay();
  function nhan(){ var c=+$('#dc-cv').value, d=c*10/Math.PI, co=Math.min(20,Math.max(15,Math.ceil(d-0.35))); $('#dc-cvso').textContent=so(c.toFixed(1))+' cm';
    $('#dc-cvkq').innerHTML='Đường kính khoảng '+so(d.toFixed(1))+' mm → <b>nhẫn cỡ '+co+'</b>'+(d<14.3||d>20.4?' (ngoài bảng, nhắn Jadora để đặt riêng)':'')+'.' }
  $('#dc-cv').oninput=nhan; nhan();'''),
  '<link rel="stylesheet" href="css/do-co.css?v=1">\n')

# ---------------------------------------------------------------- CÁC TRANG ĐANG SOẠN
def soan(file, nhan, td, mo, muc):
    trang(file, td.replace('<em>', '').replace('</em>', '').replace('&amp;', '&'),
      dau(nhan, td, mo) + hai(file, cho() + ''.join('<section class="len"><h2>%s</h2><p class="tr-trong">Đang soạn.</p></section>' % m for m in muc) + NHAN_TIN))
soan('bao-quan.html', 'Hướng dẫn', 'Bảo quản <em>ngọc</em>', 'Cách đeo, lau và cất để món ngọc của bạn bền đẹp.', ['Khi đeo hằng ngày', 'Làm sạch', 'Cất giữ', 'Charm vàng'])
soan('kien-thuc.html', 'Hướng dẫn', 'Kiến thức <em>về ngọc</em>', 'Những điều nên biết trước khi chọn một món ngọc.', ['Phỉ thuý là gì', 'Các nước ngọc và màu', 'Ngọc tự nhiên và ngọc xử lý', 'Cách xem ảnh và video ngọc'])
soan('bao-mat.html', 'Chính sách', 'Chính sách <em>bảo mật</em>', 'Jadora thu thông tin gì của bạn và dùng vào việc gì.', ['Thông tin chúng tôi thu', 'Mục đích sử dụng', 'Đăng nhập bằng Google', 'Quyền của bạn'])
soan('dieu-khoan.html', 'Chính sách', 'Điều khoản <em>sử dụng</em>', 'Các điều kiện khi bạn xem và đặt hàng trên web.', ['Đặt hàng và xác nhận đơn', 'Giá và thanh toán', 'Hình ảnh sản phẩm', 'Liên hệ'])

# ---------------------------------------------------------------- TRA CỨU ĐƠN
trang('tra-cuu-don.html', 'Tra cứu đơn hàng',
  dau('Đơn hàng', 'Tra cứu <em>đơn hàng</em>', 'Nhập mã đơn (dạng JD1511-AB12) bạn nhận được sau khi đặt.') +
  hai('tra-cuu-don.html', '''<form class="tc-form" id="tc"><input name="ma" placeholder="Mã đơn hàng" autocomplete="off" required><button class="nut toi" type="submit">Tra cứu</button></form>
<div id="tc-kq"></div>''' + cho('Bản thử nghiệm', 'Hiện web mới tra được các đơn đặt trên chính thiết bị này. Đơn đặt ở máy khác, bạn nhắn mã đơn cho Jadora để được báo tình trạng.') + NHAN_TIN),
  js('''
  function tim(ma){ var don=[]; try{don=JSON.parse(localStorage.getItem('jadora_don'))||[]}catch(x){}
    var d=don.filter(function(x){return x.ma.toUpperCase()===ma.toUpperCase().trim()})[0];
    $('#tc-kq').innerHTML=d? '<div class="tk-don"><b>'+e(d.ma)+'</b><small>Đặt ngày '+new Date(d.luc).toLocaleDateString('vi-VN')+' · '+e(d.ten)+'</small><ul>'+d.mon.map(function(m){return '<li>'+e(m.ten)+' × '+m.sl+'</li>'}).join('')+'</ul><div class="tong"><span>'+(d.tt==='ck'?'Chuyển khoản':'Nhận hàng trả tiền')+'</span><span>'+gia(d.tong)+'</span></div></div><p>Cửa hàng xác nhận và báo tình trạng giao qua Zalo/điện thoại bạn đã để lại.</p>'
      : '<p>Không thấy đơn <b>'+e(ma)+'</b> trên thiết bị này.</p>' }
  $('#tc').onsubmit=function(ev){ev.preventDefault(); tim(this.ma.value)};
  var q=new URLSearchParams(location.search).get('ma'); if(q){$('#tc').ma.value=q; tim(q)}'''))

# ---------------------------------------------------------------- CẢM NHẬN KHÁCH HÀNG
trang('cam-nhan.html', 'Cảm nhận khách hàng',
  dau('Khách nói gì', 'Cảm nhận <em>khách hàng</em>', 'Chỉ đăng cảm nhận thật của khách đã mua.') +
  '<div class="bb" style="padding-bottom:clamp(70px,9vw,120px)"><div id="cn"></div></div>',
  js('''
  var ds=CH.camNhan||[];
  $('#cn').innerHTML=ds.length? '<div class="tr-cn">'+ds.map(function(c){return '<figure class="len"><blockquote>'+e(c.chu||'')+'</blockquote><figcaption>'+e(c.ten||'Khách hàng')+(c.mon?' · '+e(c.mon):'')+'</figcaption></figure>'}).join('')+'</div>'
    : '<div class="tr-sap"><p class="nhan">Chưa có cảm nhận</p><h2>Trang này đang <em>chờ những dòng đầu tiên</em></h2><p>Jadora không tự viết cảm nhận. Khi có khách gửi nhận xét thật, chúng tôi sẽ đăng ở đây.</p><div class="tr-nut"><a class="nut vien" href="san-pham.html">Xem sản phẩm</a></div></div>';'''))

# ---------------------------------------------------------------- ĐỒ THỦ CÔNG
trang('thu-cong.html', 'Đồ thủ công',
  dau('Sắp ra mắt', 'Đồ <em>thủ công</em>') +
  '<div class="bb"><div class="tr-sap len"><p class="nhan">Đang chuẩn bị</p><h2>Một dòng đồ <em>làm tay</em></h2><p>Bên cạnh phỉ thuý, Jadora đang chuẩn bị các món làm tay. Khi có món đầu tiên, trang này sẽ mở.</p><div class="tr-nut"><a class="nut vien" data-zalo href="lien-he.html">Nhắn để được báo khi mở</a></div></div></div>')

# ---------------------------------------------------------------- QUÀ TẶNG
trang('qua-tang.html', 'Quà tặng',
  dau('Quà tặng', 'Chọn quà <em>theo ngân sách</em>', 'Chọn một mức giá, Jadora lọc ra các món đang có.') +
  '<div class="bb" style="padding-bottom:clamp(70px,9vw,120px)"><div class="qt-muc" id="qt-muc"></div><div class="luoi sat" id="qt-luoi"></div><p class="tr-nut" style="justify-content:center;margin-top:34px"><button class="nut vien" id="qt-them" type="button">Xem thêm</button></p></div>',
  js('''
  var MUC=[['Dưới 500k',0,5e5],['500k – 1 triệu',5e5,1e6],['1 – 3 triệu',1e6,3e6],['Trên 3 triệu',3e6,1e12]], im=1, hien=0;
  function loc(i){return DS.filter(function(x){return x.gia>=MUC[i][1]&&x.gia<MUC[i][2]}).sort(function(a,b){return a.gia-b.gia})}
  $('#qt-muc').innerHTML=MUC.map(function(m,i){return '<button type="button" data-i="'+i+'"><b>'+m[0]+'</b><span>'+loc(i).length+' món</span></button>'}).join('');
  function ve(lai){ var ds=loc(im); if(lai){hien=0; $('#qt-luoi').innerHTML=''}
    $('#qt-luoi').insertAdjacentHTML('beforeend',ds.slice(hien,hien+12).map(theSp).join('')); hien+=12;
    $('#qt-them').style.display=hien<ds.length?'':'none';
    $$('#qt-muc button').forEach(function(b){b.classList.toggle('chon',+b.dataset.i===im)}) }
  $('#qt-muc').onclick=function(ev){var b=ev.target.closest('button'); if(b){im=+b.dataset.i; ve(true)}};
  $('#qt-them').onclick=function(){ve(false)}; ve(true);'''))

# ---------------------------------------------------------------- BỘ SƯU TẬP (trang riêng từng dòng)
trang('bo-suu-tap.html', 'Bộ sưu tập',
  '<section class="bst-bia" id="bst-bia"></section><div class="bb" style="padding-bottom:clamp(70px,9vw,120px)"><div class="bst-thanh"><nav class="bst-dong" id="bst-dong"></nav><select id="bst-xep" class="xep-chon" aria-label="Sắp xếp"><option value="moi">Mới nhất</option><option value="re">Giá thấp trước</option><option value="mac">Giá cao trước</option></select></div><div class="luoi sat" id="bst-luoi"></div><p class="tr-nut" style="justify-content:center;margin-top:34px"><button class="nut vien" id="bst-them" type="button">Xem thêm</button></p></div>',
  js('''
  var MO={chuoi:'Chuỗi ngọc phối charm vàng 18K. Mỗi chuỗi một mã, ảnh của đúng chuỗi bạn nhận.',charm:'Charm vàng 18K và charm ngọc để gắn thêm vào chuỗi.',tron:'Chuỗi ngọc trơn — nền để bạn tự phối charm.',matday:'Mặt dây ngọc.',nhan:'Nhẫn ngọc.',khuyen:'Khuyên tai ngọc.'};
  var co=THU_TU.filter(function(k){return DS.some(function(x){return x.loai===k})}), k=new URLSearchParams(location.search).get('loai'); if(co.indexOf(k)<0) k=co[0];
  var ds=DS.filter(function(x){return x.loai===k}), hien=0, xep='moi';
  document.title=LOAI[k].ten+' · Jadora';
  var bia=ds.filter(function(x){return x.anh&&x.anh.length})[0];
  $('#bst-bia').innerHTML=(bia?'<img src="'+anh(bia.anh[1]||bia.anh[0],1600)+'" alt="" referrerpolicy="no-referrer">':'')+'<div class="bb"><p class="nhan">Bộ sưu tập · '+ds.length+' món</p><h1>'+e(LOAI[k].ten)+'</h1><p>'+e(MO[k]||'')+'</p></div>';
  $('#bst-dong').innerHTML=co.map(function(c){return '<a'+(c===k?' class="chon"':'')+' href="bo-suu-tap.html?loai='+c+'">'+LOAI[c].ngan+'</a>'}).join('')+(k==='chuoi'||k==='tron'||k==='charm'?'<a href="tu-thiet-ke.html">Tự thiết kế →</a>':'');
  function ve(lai){ var r=ds.slice(); if(xep==='re') r.sort(function(a,b){return a.gia-b.gia}); else if(xep==='mac') r.sort(function(a,b){return b.gia-a.gia}); else r.sort(function(a,b){return ngaySo(b.ngay)-ngaySo(a.ngay)});
    if(lai){hien=0; $('#bst-luoi').innerHTML=''} $('#bst-luoi').insertAdjacentHTML('beforeend',r.slice(hien,hien+16).map(theSp).join('')); hien+=16; $('#bst-them').style.display=hien<r.length?'':'none' }
  $('#bst-xep').onchange=function(){xep=this.value; ve(true)}; $('#bst-them').onclick=function(){ve(false)}; ve(true);'''))

# ---------------------------------------------------------------- 404
trang('404.html', 'Không tìm thấy trang',
  '<div class="bb tr-404"><b>404</b><h1>Trang này <em>không còn ở đây</em></h1><p>Có thể đường link đã cũ, hoặc món đó đã có chủ.</p><div class="tr-nut"><a class="nut toi" href="index.html">Về trang chủ</a><a class="nut vien" href="san-pham.html">Xem sản phẩm</a></div></div>')

# ---------------------------------------------------------------- TỰ THIẾT KẾ CHUỖI
BT = {'deu': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="4" r="1.6" fill="currentColor"/><circle cx="19" cy="15.5" r="1.6" fill="currentColor"/><circle cx="5" cy="15.5" r="1.6" fill="currentColor"/></svg>',
      'gom': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="20" r="1.6" fill="currentColor"/><circle cx="8.2" cy="19" r="1.6" fill="currentColor"/><circle cx="15.8" cy="19" r="1.6" fill="currentColor"/></svg>',
      'xoa': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12"/></svg>',
      'link': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/></svg>'}
TRANG['tu-thiet-ke.html'] = ('Tự thiết kế chuỗi', '''<div class="xuong" id="tk">
  <div class="xg-san tk-san">
    <div class="xg-tren"><p class="nhan">Xưởng phối chuỗi · 3D</p><div class="tab-vong" id="tabVong"></div></div>
    <div class="san-trong">
      <svg id="vong" viewBox="0 0 400 400" aria-label="Hình chuỗi đang thiết kế"></svg>
      <div class="nhan-giua" id="nhanGiua"></div>
      <div class="bong-charm" id="bongCharm" hidden></div>
    </div>
    <div class="cong-cu">
      <button data-lam="deu">''' + BT['deu'] + '''Xếp đều</button>
      <button data-lam="gom">''' + BT['gom'] + '''Gom phía trước</button>
      <button data-lam="xoa">''' + BT['xoa'] + '''Bỏ hết charm</button>
      <button data-lam="link">''' + BT['link'] + '''Chép link</button>
    </div>
    <p class="goi-y goi-sua">Kéo nền để xoay · bấm charm để chọn · kéo charm để đổi chỗ</p>
    <p class="goi-y goi-deo">Kéo ngang để xoay tay, xem charm ở mọi phía</p>
    <div class="tk-thanh" id="thanhTk"></div>
  </div>

  <div class="xg-bang">
    <header class="xg-dau"><p class="nhan">Tự thiết kế</p><h1>Phối chuỗi <em>của riêng bạn</em></h1>
      <p>Bốn bước: chọn dây, chọn số vòng và cỡ tay, gắn charm, rồi gửi thiết kế. Jadora xâu đúng như bạn xếp.</p></header>
    <nav class="xg-buoc" id="xgBuoc">
      <button type="button" data-b="1" class="chon"><i>01</i><b>Dây ngọc</b><small id="xg1">chưa chọn</small></button>
      <button type="button" data-b="2"><i>02</i><b>Vòng &amp; cỡ</b><small id="xg2"></small></button>
      <button type="button" data-b="3"><i>03</i><b>Charm</b><small id="demCharm">0 charm</small></button>
      <button type="button" data-b="4"><i>04</i><b>Gửi</b><small id="xg4"></small></button>
    </nav>

    <section class="xg-o chon" data-b="1"><h2>Chọn <em>dây ngọc</em></h2><p class="xg-ghi">Dây nền quyết định màu và cỡ hạt của cả chuỗi.</p>
      <div class="ds-day" id="dsDay"></div></section>

    <section class="xg-o" data-b="2"><h2>Số vòng &amp; <em>cỡ tay</em></h2><p class="xg-ghi">Quấn nhiều vòng thì mỗi vòng thiết kế riêng ở thanh phía trên hình.</p>
      <div class="so-vong" id="soVong"></div>
      <div class="xg-tay"><span>Cỡ cổ tay</span><b class="gt" id="gtTay">15 cm</b></div>
      <input type="range" id="coTay" min="12" max="20" step="0.5" value="15" aria-label="Cỡ cổ tay (cm)">
      <div class="vach"><span>12 cm</span><span>Đo sát cổ tay, cửa hàng cộng thêm độ rộng khi xâu</span><span>20 cm</span></div>
      <a class="xg-do" href="do-co-tay.html" target="_blank">Cách đo cỡ tay →</a></section>

    <section class="xg-o" data-b="3"><h2>Gắn <em>charm</em></h2><p class="xg-ghi">Bấm một charm để gắn vào vòng đang thiết kế; bấm lần nữa để gắn thêm.</p>
      <div class="loc-charm">
        <div class="chip-nhom" id="chipNhom"></div>
        <div class="tim"><input id="timCharm" type="search" placeholder="Tìm charm…" aria-label="Tìm charm">
          <select id="xepCharm" aria-label="Sắp xếp"><option value="re">Giá thấp trước</option><option value="mac">Giá cao trước</option></select></div>
      </div>
      <div class="ds-charm" id="dsCharm"></div>
      <div class="them"><button class="nut vien" id="themCharm" type="button">Xem thêm charm</button></div></section>

    <section class="xg-o" data-b="4"><h2>Thiết kế <em>của bạn</em></h2><p class="xg-ghi">Kiểm tra lại rồi gửi cho Jadora qua kênh bạn tiện.</p>
      <div class="tom-tat" id="tomTat"></div></section>

    <div class="xg-di"><button type="button" class="lui" id="xgLui" hidden>← Quay lại</button><button type="button" class="toi2" id="xgToi">Tiếp tục →</button></div>
  </div>
</div>

<section class="xg-them xg-cach">
  <div class="bb">
    <div class="xg-tieu len"><p class="nhan">Sau khi bạn bấm gửi</p><h2>Từ bản thiết kế <em>đến cổ tay bạn</em></h2></div>
    <ol class="xg-4">
      <li class="len"><i>01</i><b>Bạn gửi thiết kế</b><p>Qua Zalo hoặc Messenger, kèm ảnh chuỗi và danh sách charm web tạo sẵn.</p></li>
      <li class="len"><i>02</i><b>Jadora báo giá chính xác</b><p>Tổng trên web chỉ là ước tính. Cửa hàng kiểm tra hàng còn, tính công xâu rồi báo lại.</p></li>
      <li class="len"><i>03</i><b>Xâu đúng như bạn xếp</b><p>Từng charm nằm đúng vị trí hạt bạn đã chọn trên từng vòng.</p></li>
      <li class="len"><i>04</i><b>Quay video rồi mới gửi</b><p>Bạn xem lại chuỗi thật trước khi cửa hàng đóng hộp giao đi.</p></li>
    </ol>
  </div>
</section>

<section class="xg-them xg-hoi">
  <div class="bb xg-hoi-luoi">
    <div class="xg-tieu len"><p class="nhan">Nên biết trước</p><h2>Vài điều <em>hay được hỏi</em></h2>
      <p>Chưa thấy câu của bạn? Nhắn cho Jadora, có người thật trả lời.</p>
      <div class="tr-nut"><a class="nut toi" data-zalo href="lien-he.html">Nhắn Zalo</a><a class="nut vien" href="bo-suu-tap.html?loai=chuoi">Xem chuỗi phối sẵn</a></div></div>
    <div class="xep len">
      <details open><summary>Giá trên web có phải giá cuối không?</summary><div class="noi"><p>Chưa. Tổng chỉ là giá xấp xỉ để bạn tham khảo. Giá chính xác cửa hàng báo lại sau khi xem thiết kế, kiểm tra hàng còn và tiền công xâu.</p></div></details>
      <details><summary>Tôi nên nhập cỡ tay thế nào?</summary><div class="noi"><p>Nhập đúng số đo sát cổ tay. Khi xâu, cửa hàng tự cộng thêm độ rộng để chuỗi đeo vừa. <a href="do-co-tay.html">Xem cách đo cỡ tay →</a></p></div></details>
      <details><summary>Thiết kế có được lưu lại không?</summary><div class="noi"><p>Có. Thiết kế tự lưu trên máy bạn và nằm ngay trong đường link của trang. Bấm “Chép link” ở cột nút bên phải hình để gửi cho bạn bè hoặc mở lại trên máy khác.</p></div></details>
      <details><summary>Chuỗi quấn nhiều vòng thì thiết kế ra sao?</summary><div class="noi"><p>Chọn số vòng ở bước 02. Mỗi vòng có một thẻ riêng phía trên hình để bạn gắn charm cho từng vòng; “Đeo thử trên tay” cho xem cả chuỗi quấn trên cổ tay.</p></div></details>
      <details><summary>Charm vàng có gì cần lưu ý?</summary><div class="noi"><p id="xg-luuy">Charm vàng là charm trang sức, không phải vàng tích sản. Khi bán lại sẽ mất giá nhiều so với giá mua, bạn cân nhắc trước khi chọn nhé.</p></div></details>
    </div>
  </div>
</section>''', '''
var GIAM=matchMedia('(prefers-reduced-motion: reduce)').matches;
khoiDong(function(){
  var L0=CH.lienHe||{}; $$('[data-zalo]').forEach(function(x){x.href='https://zalo.me/'+(L0.zalo||L0.sdt); x.target='_blank'; x.rel='noopener'});
  var ly=((CH.chinhSach||{}).luuY||[])[0]; if(ly) $('#xg-luuy').textContent=ly;
  /* bốn bước: mỗi lúc hiện một bước */
  var b=1;
  function mo(n){ b=Math.min(4,Math.max(1,n));
    $$('#xgBuoc button').forEach(function(x){x.classList.toggle('chon',+x.dataset.b===b); x.classList.toggle('roi',+x.dataset.b<b)});
    $$('.xg-o').forEach(function(x){x.classList.toggle('chon',+x.dataset.b===b)});
    $('#xgLui').hidden=b===1; $('#xgToi').hidden=b===4;
    $('.xg-bang').scrollTop=0 }
  $('#xgBuoc').onclick=function(ev){var x=ev.target.closest('button'); if(x) mo(+x.dataset.b)};
  $('#xgLui').onclick=function(){mo(b-1)}; $('#xgToi').onclick=function(){mo(b+1)};
  addEventListener('tk-ve',function(ev){ var d=ev.detail;
    $('#xg1').textContent=d.day? d.day.ten.replace(/\\s*\\d+([.,]\\d+)? ly/,'') : 'chưa chọn';
    $('#xg2').textContent=d.vong+' vòng · '+String(d.tay).replace('.',',')+' cm';
    $('#xg4').textContent=d.day? d.tong : '' });
  /* nạp bộ máy theo thứ tự (cần cấu hình đã tải xong) */
  var v=(document.querySelector('script[src*="js/chung.js"]').src.split('?v=')[1]||'1');
  /* khi bộ máy 3D sẵn sàng: dựng cảnh bàn làm việc quanh chuỗi (sau khi thiet-ke.js đã gắn xong các hàm của nó) */
  addEventListener('vong3d',function(){ setTimeout(function(){ var V=window.V3D; if(!V||!window.XUONG_CANH) return;
    try{ V.xa=2.05; $('.tk-san').classList.add('canh-3d');
      /* chuỗi nằm giữa phần bàn còn trống bên trái tấm thẻ chọn (màn hẹp thì thẻ nằm dưới, chuỗi ở giữa) */
      var dat=function(){ var w=V.cv.clientWidth,h=V.cv.clientHeight; if(!w||!h) return; var the=$('.xg-bang').getBoundingClientRect(), cv=V.cv.getBoundingClientRect(), trong=innerWidth>900? the.left-cv.left : w;
        V.cam.setViewOffset(w,h,w/2-trong/2,-h*.07,w,h); V.chay() };
      addEventListener('resize',dat);
      new ResizeObserver(dat).observe(V.cv); dat();
      XUONG_CANH(V,{gia:false,maus:[],chon:function(){}});
    }catch(er){ console.warn('xuong-canh',er); V.xa=1; V.cam.clearViewOffset(); $('.tk-san').classList.remove('canh-3d') } },0) });
  (function nap(ds){ if(!ds.length) return; var s=document.createElement('script'); s.src='js/'+ds[0]+'?v='+v; s.onload=function(){nap(ds.slice(1))}; document.body.appendChild(s) })
    (['tk/charm-v3.js','tk/charm-ve.js','tk/thiet-ke.js','tk/charm-3d.min.js','xuong-canh.js','tk/vong-3d.js']);
});''', '<link rel="stylesheet" href="css/trang.css?v=1">\n<link rel="stylesheet" href="css/xuong.css?v=1">\n<link rel="modulepreload" href="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js" crossorigin="anonymous">\n')

for file, (ten, than, js_, css) in TRANG.items():
    s = KHUNG.replace('@TEN@', ten).replace('@CSS@', css).replace('@THAN@', than).replace('@JS@', js_.strip())
    open(os.path.join(GOC, file), 'w', encoding='utf-8').write(s)
    print('đã ghi', file)
