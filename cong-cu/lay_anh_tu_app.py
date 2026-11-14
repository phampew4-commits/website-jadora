#!/usr/bin/env python3
"""Lấy ảnh sản phẩm từ app Ngọc Trầm (ảnh gốc lưu trên máy) sang web Jadora.

Mỗi ảnh trên web được nhận biết bằng mã Drive (id). App lưu ảnh gốc kèm link Drive
theo đúng thứ tự, nên ghép được: id Drive -> file ảnh trên máy.
Kết quả: img/sp/<id>-720.webp (thẻ, ảnh nhỏ) và img/sp/<id>-1600.webp (ảnh lớn),
cùng data/anh-thieu.json liệt kê id nào chưa có ảnh trên máy (web sẽ lấy từ Drive).

Chạy lại bất cứ lúc nào: ảnh đã có thì bỏ qua.
    python3 cong-cu/lay_anh_tu_app.py
"""
import json, os, re, shutil, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

WEB = Path(__file__).resolve().parent.parent
APP = WEB.parent / "charm-bot-ban-tho" / "data"
WEB_CU = WEB.parent / "website-ngoc-tram"
RA = WEB / "img" / "sp"
CO = [(720, 82), (1600, 84)]          # (cạnh dài tối đa, chất lượng webp) — đủ nét cho màn hình Retina
CWEBP = shutil.which("cwebp") or "/opt/homebrew/bin/cwebp"


def id_drive(link):
    m = re.search(r"/d/([\w-]{20,})|[?&]id=([\w-]{20,})", link or "")
    return (m.group(1) or m.group(2)) if m else ""


def ban_do():
    """id Drive -> đường dẫn ảnh gốc trên máy."""
    bd = {}
    # chuỗi mix, mặt dây, nhẫn, khuyên: <kho>.json có 'link' và 'anh' cùng thứ tự
    for ten, thu_muc in [("chuoi", "chuoi"), ("mon_matday", "mon_matday"), ("mon_nhan", "mon_nhan"), ("mon_khuyen", "mon_khuyen")]:
        f = APP / f"{ten}.json"
        if not f.exists():
            continue
        for khoa, v in json.loads(f.read_text(encoding="utf-8")).items():
            for link, anh in zip(v.get("link") or [], v.get("anh") or []):
                p = APP / thu_muc / khoa / anh
                if id_drive(link) and p.exists():
                    bd[id_drive(link)] = p
    # charm: anh_kho/<mã>/.links (mỗi dòng 1 link) ứng với kho_0.jpg, kho_1.jpg…
    for d in (APP / "anh_kho").iterdir():
        lk = d / ".links"
        if not lk.exists():
            continue
        for i, link in enumerate(x for x in lk.read_text(encoding="utf-8").splitlines() if x.strip()):
            p = d / f"kho_{i}.jpg"
            if id_drive(link) and p.exists():
                bd[id_drive(link)] = p
    return bd


def nen(viec):
    nguon, dich, canh, q = viec
    if dich.exists() and dich.stat().st_mtime >= nguon.stat().st_mtime:
        return 0
    # -resize W 0 giữ tỉ lệ; ảnh nhỏ hơn thì cwebp không phóng to nếu ta kiểm trước
    r = subprocess.run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(nguon)], capture_output=True, text=True).stdout
    w, h = (int(x) for x in re.findall(r"pixel(?:Width|Height): (\d+)", r))
    lenh = [CWEBP, "-quiet", "-q", str(q), "-m", "4"]
    if max(w, h) > canh:
        lenh += ["-resize", str(canh), "0"] if w >= h else ["-resize", "0", str(canh)]
    subprocess.run(lenh + [str(nguon), "-o", str(dich)], check=True)
    return 1


def main():
    RA.mkdir(parents=True, exist_ok=True)
    sp = json.loads((WEB / "data" / "san-pham.json").read_text(encoding="utf-8"))
    can = []
    for x in sp:
        for a in x.get("anh") or []:
            if not re.search(r"[/.]", a):
                can.append(a)
    can = list(dict.fromkeys(can))
    bd = ban_do()
    co = [a for a in can if a in bd]
    thieu = [a for a in can if a not in bd]
    viec = [(bd[a], RA / f"{a}-{c}.webp", c, q) for a in co for c, q in CO]
    with ThreadPoolExecutor(max_workers=6) as tp:
        moi = sum(tp.map(nen, viec))
    # dây trơn: ảnh đã nằm sẵn trong web cũ, chép sang cùng đường dẫn
    chep = 0
    for x in sp:
        for a in x.get("anh") or []:
            if re.search(r"[/.]", a):
                tu = WEB_CU / a.split("?")[0]
                den = WEB / a.split("?")[0]
                if tu.exists() and not den.exists():
                    den.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(tu, den); chep += 1
    (WEB / "data" / "anh-thieu.json").write_text(json.dumps(thieu), encoding="utf-8")
    nang = sum(f.stat().st_size for f in RA.glob("*.webp")) / 1e6
    print(f"ảnh trên web: {len(can)} | có trên máy: {len(co)} | thiếu (lấy từ Drive): {len(thieu)}")
    print(f"vừa nén: {moi} file | chép ảnh dây trơn: {chep} | thư mục img/sp: {nang:.0f} MB")


if __name__ == "__main__":
    main()
