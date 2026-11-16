# Font riêng của Jadora

Web mẫu cozyleigh.studio dùng **larken** (tiêu đề) và **futura-pt** (chữ thường). Cả hai là font
thuê bao Adobe, không có ký tự tiếng Việt, và giấy phép không cho tải về sửa. Vì vậy Jadora dùng
hai font tự dựng từ font mã nguồn mở, chỉnh cho sát dáng font mẫu nhất có thể:

| Font | Dựng từ | Giấy phép | Thay cho |
|---|---|---|---|
| **Jadora Serif** | Lora (The Lora Project Authors) | SIL OFL 1.1 — `OFL-Lora.txt` | larken |
| **Jadora Sans** | Afacad (The Afacad Project Authors) | SIL OFL 1.1 — `OFL-Afacad.txt` | futura-pt |

"Lora" là Reserved Font Name nên bản đã sửa bắt buộc mang tên khác — đó là lý do có tên Jadora Serif.

## Chọn font gốc thế nào
Vẽ từng chữ `abdeghmnoprstyHJS` của font mẫu và của ~20 font có tiếng Việt ra canvas, chấm độ
trùng khớp hình dáng (IoU), độ lệch tỉ lệ ngang/dọc và độ đậm. Lora khớp larken nhất, Afacad khớp
futura-pt nhất.

## Đã chỉnh gì (cùng một phép biến đổi cho mọi chữ, nét gốc giữ nguyên)
| Bản | Gốc | Co ngang nét | Khoảng chữ | Chữ HOA cao thêm |
|---|---|---|---|---|
| jadora-serif-400 / 400i | Lora wght 475 | 0,94 | khép 0,0126 em | ×1,029 |
| jadora-serif-500 / 500i | Lora wght 575 | 0,97 | khép 0,0177 em | ×1,029 |
| jadora-sans-400 / 400i | Afacad wght 400 | 0,93 | nới 0,0202 em | ×1,067 |
| jadora-sans-500 | Afacad wght 450 | 0,93 | nới 0,0207 em | ×1,067 |

Dấu trên chữ hoa được đẩy lên theo; dấu ghép, kerning trong GPOS biến đổi cùng. Bộ ký tự cắt gọn
về Latin + tiếng Việt.

## Kết quả đo (16/11/2026, Chrome, cỡ 200px)
| | Font mẫu | Trước | Jadora mới |
|---|---|---|---|
| Tiêu đề: độ rộng câu "Handmade Jewelry Shop the ecosystem" | 3489 | Fraunces 3055 | **3489** |
| Tiêu đề: cao chữ hoa / cao chữ x | 144 / 100 | 140 / 87 | **144 / 100** |
| Tiêu đề: trùng khớp hình dáng chữ | — | 67,5 % | **73,1 %** |
| Chữ thường: độ rộng câu "Free shipping on orders over fifty dollars" | 3106 | Be Vietnam Pro 3913 | **3101** |
| Chữ thường: cao chữ hoa / cao chữ x | 133 / 83 | 148 / 106 | **133 / 83** |
| Chữ thường: trùng khớp hình dáng chữ | — | 79,7 % | **85,4 %** |

Phần còn khác là nét riêng của từng chữ (ví dụ thân chữ hơi nghiêng của larken) — muốn giống hơn
nữa thì phải vẽ tay lại từng chữ.

## Dựng lại
`pip install "fonttools[woff]" brotli`, tải `ofl/lora` và `ofl/afacad` từ repo google/fonts
(đặt tên `lora__…ttf`, `afacad__…ttf`), rồi `python dung_font.py <thư mục nguồn> <thư mục ra>`.
Số liệu chỉnh nằm trong bảng `BAN` đầu script.
