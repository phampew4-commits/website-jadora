/* ===== JADORA — phần dùng chung cho mọi trang ===== */
var CH = {}, DS = [], GIO = {};
var LOAI = {
  tron:   {ten:'Chuỗi ngọc trơn', ngan:'Chuỗi trơn'},
  chuoi:  {ten:'Chuỗi mix charm',  ngan:'Chuỗi mix'},
  charm:  {ten:'Charm vàng 18K',   ngan:'Charm'},
  nhan:   {ten:'Nhẫn',             ngan:'Nhẫn'},
  khuyen: {ten:'Khuyên tai',       ngan:'Khuyên'},
  matday: {ten:'Mặt dây',          ngan:'Mặt dây'}
};
var THU_TU = ['chuoi','charm','tron','matday','nhan','khuyen'];

/* ---------- tiện ích ---------- */
function $(s,g){return (g||document).querySelector(s)}
function $$(s,g){return [].slice.call((g||document).querySelectorAll(s))}
function e(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function nd(s){return e(s).replace(/\*(.+?)\*/g,'<em>$1</em>')}
function anh(id,w){return /[\/.]/.test(id)?id:'https://lh3.googleusercontent.com/d/'+id+'=w'+(w||600)}
function gia(n){return n? n.toLocaleString('vi-VN')+'đ' : 'Liên hệ'}
function boDau(s){return String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase()}
function ngaySo(s){var m=/(\d+)\/(\d+)\/(\d+)\s*(\d+)?:?(\d+)?/.exec(s||'');return m?+new Date(+m[3],m[2]-1,+m[1],+(m[4]||0),+(m[5]||0)):0}
function timSp(ma){for(var i=0;i<DS.length;i++) if(DS[i].ma===ma) return DS[i]; return null}
function linkSp(x){return 'chi-tiet.html?ma='+encodeURIComponent(x.ma)}

/* ---------- giỏ hàng (lưu trong máy khách) ---------- */
var KHOA_GIO='jadora_gio';
function docGio(){try{GIO=JSON.parse(localStorage.getItem(KHOA_GIO))||{}}catch(x){GIO={}} return GIO}
function luuGio(){try{localStorage.setItem(KHOA_GIO,JSON.stringify(GIO))}catch(x){} veSoGio()}
function themGio(ma,sl){GIO[ma]=(GIO[ma]||0)+(sl||1);luuGio();bao('Đã thêm vào giỏ')}
function datGio(ma,sl){if(sl<=0) delete GIO[ma]; else GIO[ma]=sl; luuGio()}
function xoaGio(ma){delete GIO[ma];luuGio()}
function demGio(){var n=0;for(var k in GIO) n+=GIO[k];return n}
function monGio(){var r=[];for(var k in GIO){var x=timSp(k); if(x) r.push({x:x,sl:GIO[k]})} return r}
function tienHang(){return monGio().reduce(function(t,m){return t+(m.x.gia||0)*m.sl},0)}
function phiShip(){var t=tienHang(); if(!t) return 0; var v=CH.vanChuyen||{}; return t>=(v.mienPhiTu||0)?0:(v.phi||0)}
function veSoGio(){$$('.gio-so').forEach(function(el){var n=demGio();el.textContent=n;el.style.display=n?'grid':'none'})}

/* ---------- báo nhỏ ---------- */
var hToast;
function bao(chu){
  var t=$('.toast'); if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}
  t.textContent=chu; t.classList.add('hien'); clearTimeout(hToast);
  hToast=setTimeout(function(){t.classList.remove('hien')},2200);
}

/* ---------- thẻ sản phẩm ---------- */
function theSp(x,i){
  var a2=x.anh&&x.anh[1];
  return '<article class="sp" style="animation-delay:'+((i||0)%12*35)+'ms" data-ma="'+e(x.ma)+'">'+
    '<a class="sp-anh" href="'+linkSp(x)+'">'+
      '<img class="truoc" src="'+anh(x.anh&&x.anh[0],500)+'" alt="'+e(x.ten)+'" loading="lazy" decoding="async" referrerpolicy="no-referrer">'+
      (a2?'<img class="sau" src="'+anh(a2,500)+'" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">':'')+
      '<span class="the">'+e((LOAI[x.loai]||{}).ngan||'Khác')+'</span>'+
      '<span class="sp-them"><button class="nut toi rong them-gio" type="button" data-ma="'+e(x.ma)+'">Thêm vào giỏ</button></span>'+
    '</a>'+
    '<div class="sp-tt"><h3 class="sp-ten"><a href="'+linkSp(x)+'">'+e(x.ten)+'</a></h3>'+
    '<div class="sp-gia">'+gia(x.gia)+'</div></div></article>';
}
document.addEventListener('click',function(ev){
  var b=ev.target.closest('.them-gio'); if(!b) return;
  ev.preventDefault(); ev.stopPropagation(); themGio(b.dataset.ma,1);
});

/* ---------- header + footer ---------- */
function veDau(){
  var el=$('#dau'); if(!el) return;
  var trang=location.pathname.split('/').pop()||'index.html';
  var mn=[['index.html','Trang chủ'],['san-pham.html','Sản phẩm'],['gioi-thieu.html','Câu chuyện'],['lien-he.html','Liên hệ']];
  el.innerHTML=
   '<div class="bao">'+e((CH.vanChuyen||{}).ghiChu||'')+'</div>'+
   '<header class="dau'+(el.dataset.trong?' trong':'')+'"><div class="bb dau-trong">'+
     '<a class="logo" href="index.html">'+e((CH.thuongHieu||{}).ten||'Jadora')+'</a>'+
     '<nav class="menu">'+mn.map(function(m){return '<a href="'+m[0]+'"'+(m[0]===trang?' class="chon"':'')+'>'+m[1]+'</a>'}).join('')+'</nav>'+
     '<div class="cong-cu">'+
       '<a class="gio-nut" href="gio-hang.html">Giỏ <span class="gio-so">0</span></a>'+
       '<button class="nut-menu" type="button" aria-label="Menu">&#9776;</button>'+
     '</div>'+
   '</div></header>';
  $('.nut-menu').onclick=function(){$('.menu').classList.toggle('mo')};
  $$('.menu a').forEach(function(a){a.onclick=function(){$('.menu').classList.remove('mo')}});
  veSoGio();
  var h=$('.dau');
  if(el.dataset.trong) addEventListener('scroll',function(){h.classList.toggle('trong',scrollY<60)},{passive:true});
}
function veChan(){
  var el=$('#chan'); if(!el) return;
  var L=CH.lienHe||{}, T=CH.thuongHieu||{};
  var xh=[];
  if(L.facebook) xh.push(['Facebook',L.facebook,'<svg viewBox="0 0 24 24"><path d="M13 22v-8h3l1-4h-4V8c0-1.1.3-1.8 1.9-1.8H17V2.6C16.6 2.5 15.4 2.4 14 2.4c-2.9 0-4.9 1.8-4.9 5V10H6v4h3.1v8H13z"/></svg>']);
  if(L.instagram) xh.push(['Instagram',L.instagram,'<svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.6 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 4 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 3.1a6.7 6.7 0 1 0 0 13.4 6.7 6.7 0 0 0 0-13.4zm0 11a4.3 4.3 0 1 1 0-8.6 4.3 4.3 0 0 1 0 8.6zm6.9-11.2a1.6 1.6 0 1 1-3.2 0 1.6 1.6 0 0 1 3.2 0z"/></svg>']);
  if(L.tiktok) xh.push(['TikTok',L.tiktok,'<svg viewBox="0 0 24 24"><path d="M16.6 5.8a4.8 4.8 0 0 1-1.1-3.1h-3v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.5a5.7 5.7 0 1 0 4.8 5.6V9.4a7.8 7.8 0 0 0 4.5 1.4V7.8a4.8 4.8 0 0 1-3.4-2z"/></svg>']);
  el.innerHTML='<footer class="chan"><div class="bb">'+
    '<div class="chan-moi"><div><h2>Cần hỏi về một món?<br><em>Nhắn cho chúng tôi.</em></h2>'+
      '<div class="kenh"><a class="nut vien" target="_blank" rel="noopener" href="https://zalo.me/'+e(L.zalo||L.sdt)+'">Zalo</a>'+
      (L.messenger?'<a class="nut vien" target="_blank" rel="noopener" href="https://m.me/'+e(L.messenger)+'">Messenger</a>':'')+
      '<a class="nut vien" href="tel:'+e(L.sdt)+'">Gọi '+e(L.sdt)+'</a></div></div></div>'+
    '<div class="chan-luoi">'+
      '<div><a class="logo" href="index.html">'+e(T.ten||'Jadora')+'</a><p>'+e(T.moTaNgan||'')+'</p>'+
        '<div class="xh">'+xh.map(function(s){return '<a href="'+e(s[1])+'" target="_blank" rel="noopener" aria-label="'+s[0]+'">'+s[2]+'</a>'}).join('')+'</div></div>'+
      '<div><h4>Cửa hàng</h4><ul>'+THU_TU.map(function(k){return '<li><a href="san-pham.html?loai='+k+'">'+LOAI[k].ten+'</a></li>'}).join('')+'</ul></div>'+
      '<div><h4>Hỗ trợ</h4><ul><li><a href="gioi-thieu.html">Câu chuyện</a></li><li><a href="lien-he.html">Liên hệ</a></li><li><a href="lien-he.html#giao">Giao hàng</a></li><li><a href="lien-he.html#doi">Đổi trả</a></li></ul></div>'+
      '<div><h4>Liên hệ</h4><ul>'+
        '<li><a href="tel:'+e(L.sdt)+'">'+e(L.sdt)+'</a></li>'+
        '<li><a href="'+e(L.banDo||'#')+'" target="_blank" rel="noopener">'+e(L.diaChi||'')+'</a></li>'+
        '<li>'+e(L.gio||'')+'</li></ul></div>'+
    '</div>'+
    '<div class="chan-cuoi"><span>&copy; '+new Date().getFullYear()+' '+e(T.ten||'Jadora')+'. Bản thử nghiệm.</span><span>Ảnh và giá là của đúng món bạn nhận</span></div>'+
  '</div></footer>';
}

/* ---------- hiện dần khi cuộn ---------- */
function theoDoiLen(){
  var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('ra');io.unobserve(x.target)}})},{threshold:.12});
  $$('.len').forEach(function(el){io.observe(el)});
}

/* ---------- khởi động ---------- */
function khoiDong(cb){
  Promise.all([
    fetch('data/cau-hinh.json',{cache:'no-cache'}).then(function(r){return r.json()}),
    fetch('data/san-pham.json',{cache:'no-cache'}).then(function(r){return r.json()})
  ]).then(function(kq){
    CH=kq[0]; DS=kq[1].filter(function(x){return x && x.ten});
    docGio(); veDau(); veChan();
    if(cb) cb();
    if(window.cuonMuot) cuonMuot();
    theoDoiLen();
  }).catch(function(err){
    console.error(err);
    document.body.insertAdjacentHTML('afterbegin','<p style="padding:30px;text-align:center">Không đọc được dữ liệu. Hãy mở web qua máy chủ chứ đừng mở thẳng file.</p>');
  });
}
