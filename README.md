# Jadora

Web bán hàng thử nghiệm của Jadora (ngọc phỉ thuý và đồ thủ công). Web tĩnh: HTML, CSS, JavaScript thuần, không cần cài đặt.

## Xem thử trên máy

```bash
python3 -m http.server 8791
```

Rồi mở http://localhost:8791

## Thư mục

- `index.html`, `san-pham.html`, `chi-tiet.html`, `gio-hang.html`, `dat-hang.html`, `tai-khoan.html`, `gioi-thieu.html`, `lien-he.html`: các trang
- `css/`, `js/`: giao diện và chức năng
- `data/cau-hinh.json`: tên thương hiệu, liên hệ, phí giao hàng, chữ trên trang
- `data/san-pham.json`: danh sách sản phẩm
- Ảnh sản phẩm không nằm trong kho: web chỉ giữ mã ảnh, Google phát ảnh thẳng từ Drive (giống web Ngọc Trầm)
- `video/`: video ảnh bìa

Bản thử: đơn hàng và tài khoản chỉ lưu trên máy của khách, chưa có máy chủ nhận đơn.
