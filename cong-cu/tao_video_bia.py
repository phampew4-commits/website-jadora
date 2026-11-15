#!/usr/bin/env python3
"""Dựng lại video ảnh bìa trang chủ (video/bia-N.mp4) từ video gốc của app, nét nhất có thể.

Video bìa chiếu kín màn hình nên bản 720p của app bị kéo giãn nhiều. Ở đây phóng lên 1080p bằng
bộ lọc lanczos + làm nét nhẹ (unsharp) rồi nén nhẹ (crf 22, tối đa 4 Mbps), nên nhìn sắc cạnh hơn hẳn bản cũ.
Không thêm được chi tiết mà clip gốc không có — muốn nét thật thì cần clip gốc từ điện thoại.

Mã món của từng tấm bìa lấy trong data/cau-hinh.json › bia. Chạy:  python3 cong-cu/tao_video_bia.py
"""
import json, subprocess
from pathlib import Path

WEB = Path(__file__).resolve().parent.parent
APP = WEB.parent / "charm-bot-ban-tho" / "data"
KHO = ["chuoi", "mon_matday", "mon_nhan", "mon_khuyen", "anh_kho"]

bia = json.loads((WEB / "data" / "cau-hinh.json").read_text(encoding="utf-8")).get("bia", [])
for i, b in enumerate(bia, 1):
    nguon = next((APP / k / str(b.get("ma")) / "video.mp4" for k in KHO if (APP / k / str(b.get("ma")) / "video.mp4").exists()), None)
    dich = WEB / "video" / f"bia-{i}.mp4"
    if not nguon:
        print(f"bìa {i}: món {b.get('ma')} không có video trong app — giữ nguyên"); continue
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(nguon), "-t", "8", "-an",
                    "-vf", "scale=1080:-2:flags=lanczos,unsharp=5:5:0.7:5:5:0.0",
                    "-c:v", "libx264", "-preset", "slow", "-crf", "22", "-maxrate", "4M", "-bufsize", "8M", "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(dich)], check=True)
    print(f"bìa {i}: {b.get('ma')} → {dich.name} {dich.stat().st_size / 1e6:.1f} MB")
