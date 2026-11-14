#!/usr/bin/env python3
"""Gắn số phiên bản (?v=…) vào đường dẫn css/js trong mọi trang .html,
để trình duyệt tải bản mới thay vì dùng bản cũ đã lưu.
Chạy sau mỗi lần sửa css hoặc js:
    python3 cong-cu/tang_phien_ban.py
"""
import re, time
from pathlib import Path

WEB = Path(__file__).resolve().parent.parent
v = time.strftime("%y%m%d%H%M%S")
n = 0
for f in sorted(WEB.glob("*.html")):
    s = f.read_text(encoding="utf-8")
    moi = re.sub(r'((?:href|src)="(?:css|js)/[\w.-]+\.(?:css|js))(?:\?v=\d+)?"', r'\1?v=' + v + '"', s)
    if moi != s:
        f.write_text(moi, encoding="utf-8"); n += 1
print(f"phiên bản {v} — đã cập nhật {n} trang")
