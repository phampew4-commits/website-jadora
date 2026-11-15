#!/usr/bin/env python3
"""Lấy video sản phẩm từ app Ngọc Trầm sang web, giữ nguyên chất lượng của app.

Mỗi món có video trong app (data/<kho>/<mã>/video.mp4) được chép thành
video/goc/<mã>.mp4: chép nguyên luồng hình (không nén lại), chỉ bỏ tiếng.
Danh sách món có video ghi vào data/video.json để web biết món nào có video.

Chạy lại bất cứ lúc nào: video đã có thì bỏ qua.
    python3 cong-cu/lay_video_tu_app.py
"""
import json, subprocess
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

WEB = Path(__file__).resolve().parent.parent
APP = WEB.parent / "charm-bot-ban-tho" / "data"
RA = WEB / "video" / "sp"
GOC = WEB / "video" / "goc"      # bản gốc của app (720p), chép nguyên không nén lại — dùng ở trang chi tiết
KHO = ["chuoi", "mon_matday", "mon_nhan", "mon_khuyen", "anh_kho"]


def nen(viec):
    nguon, dich = viec
    if dich.exists() and dich.stat().st_mtime >= nguon.stat().st_mtime:
        return 0
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(nguon), "-t", "6", "-an",
                    "-vf", "scale=540:-2", "-c:v", "libx264", "-preset", "slow", "-crf", "29",
                    "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(dich)], check=True)
    return 1


def chep(viec):
    nguon, dich = viec
    if dich.exists() and dich.stat().st_mtime >= nguon.stat().st_mtime:
        return 0
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(nguon), "-an", "-c:v", "copy",
                    "-movflags", "+faststart", str(dich)], check=True)
    return 1


def main():
    RA.mkdir(parents=True, exist_ok=True); GOC.mkdir(parents=True, exist_ok=True)
    ma_web = {x["ma"] for x in json.loads((WEB / "data" / "san-pham.json").read_text(encoding="utf-8"))}
    viec, co = [], {}
    for kho in KHO:
        d = APP / kho
        if not d.is_dir():
            continue
        for m in sorted(d.iterdir()):
            v = m / "video.mp4"
            if v.exists() and m.name in ma_web and m.name not in co:
                co[m.name] = f"video/goc/{m.name}.mp4"      # web dùng thẳng bản của app, không nén thêm
                viec.append((v, RA / f"{m.name}.mp4"))
    with ThreadPoolExecutor(max_workers=4) as tp:
        moi = 0      # không tạo bản nén nhỏ nữa: mọi chỗ trên web dùng bản gốc của app
        moi_goc = sum(tp.map(chep, [(v, GOC / d.name) for v, d in viec]))
    (WEB / "data" / "video.json").write_text(json.dumps(co, ensure_ascii=False), encoding="utf-8")
    nang = sum(f.stat().st_size for f in RA.glob("*.mp4")) / 1e6
    nang_goc = sum(f.stat().st_size for f in GOC.glob("*.mp4")) / 1e6
    print(f"món có video: {len(co)} | vừa nén: {moi} | thư mục video/sp: {nang:.1f} MB")
    print(f"bản gốc vừa chép: {moi_goc} | thư mục video/goc: {nang_goc:.1f} MB")


if __name__ == "__main__":
    main()
