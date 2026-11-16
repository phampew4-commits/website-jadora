# -*- coding: utf-8 -*-
"""Dựng 'Jadora Serif' (từ Lora, OFL) và 'Jadora Sans' (từ Afacad, OFL) cho sát dáng
web mẫu cozyleigh.studio (larken + futura-pt) nhưng có đủ tiếng Việt.

Mỗi bản = một font gốc (ghim độ đậm) + biến đổi hình học đồng nhất:
  - co ngang nét chữ theo hệ số sx (đo bằng độ trùng khớp từng chữ cái với font mẫu)
  - nới/khép khoảng chữ để câu mẫu rộng đúng bằng font mẫu
  - kéo cao riêng chữ HOA (chữ hoa của mẫu cao hơn), dấu trên chữ hoa được đẩy lên theo
Mọi chữ khác giữ nguyên nét của font gốc.

Cách chạy: python dung_jadora_v2.py <thư mục nguồn> <thư mục ra>
"""
import sys, os, unicodedata
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.misc.transform import Transform
from fontTools.subset import Subsetter, Options

SRC, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)

UNICODES = ("U+0000-00FF,U+0100-024F,U+0259,U+02BB-02BC,U+02C6,U+02DA,U+02DC,"
            "U+0300-036F,U+1E00-1EFF,U+2000-206F,U+20A0-20CF,U+2122,U+2212,U+FEFF,U+FFFD")

# (nguồn, wght gốc, sx, khoảng chữ đổi thêm (em, dương = khép lại), hệ số chữ hoa, họ, kiểu, nghiêng, file ra)
BAN = [
    ("lora__Lora[wght].ttf",          475, 0.94,  0.01257, 144/140, "Jadora Serif", "Regular",       False, "jadora-serif-400"),
    ("lora__Lora[wght].ttf",          575, 0.97,  0.01771, 144/140, "Jadora Serif", "Medium",        False, "jadora-serif-500"),
    ("lora__Lora-Italic[wght].ttf",   475, 0.94,  0.01257, 144/140, "Jadora Serif", "Italic",        True,  "jadora-serif-400i"),
    ("lora__Lora-Italic[wght].ttf",   575, 0.97,  0.01771, 144/140, "Jadora Serif", "Medium Italic", True,  "jadora-serif-500i"),
    ("afacad__Afacad[wght].ttf",      400, 0.93, -0.02024, 133.4/125, "Jadora Sans", "Regular",      False, "jadora-sans-400"),
    ("afacad__Afacad[wght].ttf",      450, 0.93, -0.02070, 133.4/125, "Jadora Sans", "Medium",       False, "jadora-sans-500"),
    ("afacad__Afacad-Italic[wght].ttf", 400, 0.93, -0.02024, 133.4/125, "Jadora Sans", "Italic",     True,  "jadora-sans-400i"),
]


def la_chu_hoa(cps):
    return any(unicodedata.category(chr(c)) == 'Lu' for c in cps)


def ve_glyph(font, gs, name, pen, tf):
    """Vẽ glyph (đã rã thành phần) qua phép biến đổi tf."""
    g = font['glyf'][name]
    if g.isComposite():
        for c in g.components:
            dx, dy = c.x, c.y
            if hasattr(c, 'transform'):
                (a, b), (cc, d) = c.transform
                t = Transform(a, b, cc, d, dx, dy)
            else:
                t = Transform(1, 0, 0, 1, dx, dy)
            ve_glyph(font, gs, c.glyphName, pen, tf.transform(t))
    else:
        gs[name].draw(TransformPen(pen, tf))


def bien_doi(font, sx, d_em, cap_scale):
    upem = font['head'].unitsPerEm
    d = d_em * upem                    # đơn vị font, dương = khép
    shift = -d / 2
    cap_h = font['OS/2'].sCapHeight or 0.7 * upem
    glyf, hmtx = font['glyf'], font['hmtx']
    gs = font.getGlyphSet()
    rev = {}
    for cp, gn in font.getBestCmap().items():
        rev.setdefault(gn, []).append(cp)

    co_hoa = {gn for gn, cps in rev.items() if la_chu_hoa(cps)}
    tf_chung = Transform(sx, 0, 0, 1, shift, 0)
    moi = {}
    for gn in font.getGlyphOrder():
        g = glyf[gn]
        adv, _ = hmtx[gn]
        pen = TTGlyphPen(None)
        if gn in co_hoa:
            if g.isComposite():
                # thành phần đầu là chữ gốc -> kéo cao; dấu phía trên -> đẩy lên; dấu phía dưới -> giữ
                for i, c in enumerate(g.components):
                    t_c = Transform(1, 0, 0, 1, c.x, c.y)
                    if hasattr(c, 'transform'):
                        (a, b), (cc, dd) = c.transform
                        t_c = Transform(a, b, cc, dd, c.x, c.y)
                    if i == 0:
                        t = tf_chung.scale(1, cap_scale).transform(t_c)
                    else:
                        bp = BoundsPen(gs); gs[c.glyphName].draw(bp)
                        ymin = (bp.bounds[1] + c.y) if bp.bounds else 0
                        dy = cap_h * (cap_scale - 1) if ymin > cap_h * 0.5 else 0
                        t = tf_chung.translate(0, dy).transform(t_c)
                    ve_glyph(font, gs, c.glyphName, pen, t)
            else:
                ve_glyph(font, gs, gn, pen, tf_chung.scale(1, cap_scale))
        else:
            ve_glyph(font, gs, gn, pen, tf_chung)
        moi[gn] = (pen.glyph(), adv)

    for gn, (ng, adv) in moi.items():
        glyf[gn] = ng
        new_adv = adv if adv == 0 else max(0, round(adv * sx - d))
        ng.recalcBounds(glyf)
        lsb = ng.xMin if ng.numberOfContours != 0 else 0
        hmtx[gn] = (new_adv, lsb)

    # bỏ hinting cũ (không còn khớp nét mới)
    for t in ['fpgm', 'prep', 'cvt ', 'hdmx', 'LTSH', 'VDMX', 'kern']:
        if t in font:
            del font[t]
    if 'maxp' in font:
        font['maxp'].maxSizeOfInstructions = 0

    # GPOS: dấu ghép, kerning theo cùng phép biến đổi
    if 'GPOS' in font:
        gpos = font['GPOS'].table
        def anchor(a, glyphname=None):
            if a is None: return
            a.XCoordinate = round(a.XCoordinate * sx + shift)
            if glyphname in co_hoa:
                a.YCoordinate = round(a.YCoordinate * cap_scale)
        def vr(v):
            if v is None: return
            for k in ('XAdvance', 'XPlacement'):
                if hasattr(v, k) and getattr(v, k):
                    setattr(v, k, round(getattr(v, k) * sx))
        for lk in gpos.LookupList.Lookup:
            for st in lk.SubTable:
                typ = lk.LookupType
                if typ == 9:
                    typ = st.ExtSubTable.LookupType; st = st.ExtSubTable
                if typ == 1:
                    if st.Format == 1: vr(st.Value)
                    else:
                        for v in st.Value: vr(v)
                elif typ == 2:
                    if st.Format == 1:
                        for ps in st.PairSet:
                            for pvr in ps.PairValueRecord: vr(pvr.Value1); vr(pvr.Value2)
                    else:
                        for c1 in st.Class1Record:
                            for c2 in c1.Class2Record: vr(c2.Value1); vr(c2.Value2)
                elif typ == 4:
                    for gn, mr in zip(st.MarkCoverage.glyphs, st.MarkArray.MarkRecord): anchor(mr.MarkAnchor, gn)
                    for gn, br in zip(st.BaseCoverage.glyphs, st.BaseArray.BaseRecord):
                        for a in br.BaseAnchor: anchor(a, gn)
                elif typ == 6:
                    for gn, mr in zip(st.Mark1Coverage.glyphs, st.Mark1Array.MarkRecord): anchor(mr.MarkAnchor, gn)
                    for gn, m2 in zip(st.Mark2Coverage.glyphs, st.Mark2Array.Mark2Record):
                        for a in m2.Mark2Anchor: anchor(a, gn)
                elif typ == 5:
                    for gn, mr in zip(st.MarkCoverage.glyphs, st.MarkArray.MarkRecord): anchor(mr.MarkAnchor, gn)
                    for gn, la in zip(st.LigatureCoverage.glyphs, st.LigatureArray.LigatureAttach):
                        for cr in la.ComponentRecord:
                            for a in cr.LigatureAnchor: anchor(a, gn)
    # chiều cao chữ hoa mới
    font['OS/2'].sCapHeight = round(cap_h * cap_scale)


def doi_ten(font, ho, kieu):
    name = font['name']
    full = ho if kieu == 'Regular' else f'{ho} {kieu}'
    vals = {1: ho, 2: {'Regular': 'Regular', 'Italic': 'Italic', 'Medium': 'Regular', 'Medium Italic': 'Italic'}[kieu],
            3: f'{ho}:{kieu}:2026', 4: full, 6: full.replace(' ', ''), 16: ho, 17: kieu}
    goc = 'Lora (Copyright 2011 The Lora Project Authors)' if 'Serif' in ho else 'Afacad (Copyright 2023 The Afacad Project Authors)'
    vals[0] = f'Dựng từ {goc}, giấy phép SIL OFL 1.1. Đã sửa đổi tỉ lệ và khoảng chữ cho web Jadora.'
    vals[13] = 'SIL Open Font License 1.1 — xem OFL kèm theo.'
    vals[14] = 'https://openfontlicense.org'
    # xoá tên cũ có chứa tên font gốc (Lora là Reserved Font Name)
    for rec in list(name.names):
        if rec.nameID in vals:
            name.setName(vals[rec.nameID], rec.nameID, rec.platformID, rec.platEncID, rec.langID)
    for nid in (16, 17, 0, 13, 14):
        if not name.getName(nid, 3, 1, 0x409):
            name.setName(vals[nid], nid, 3, 1, 0x409)
    for rec in list(name.names):
        s = rec.toUnicode()
        if rec.nameID not in vals and ('Lora' in s or 'Afacad' in s) and rec.nameID not in (0,):
            name.removeNames(nameID=rec.nameID)


for nguon, wght, sx, d_em, cap_scale, ho, kieu, nghieng, ra in BAN:
    p = os.path.join(SRC, nguon)
    if not os.path.exists(p):
        print('bỏ qua (không có nguồn):', nguon); continue
    f = TTFont(p)
    ghim = {a.axisTag: a.defaultValue for a in f['fvar'].axes}
    ghim['wght'] = wght
    font = instantiateVariableFont(f, ghim, inplace=False, updateFontNames=False)
    bien_doi(font, sx, d_em, cap_scale)
    doi_ten(font, ho, kieu)
    if nghieng:
        font['OS/2'].fsSelection |= 1
        font['head'].macStyle |= 2
    opt = Options(); opt.layout_features = ['*']; opt.name_IDs = ['*']; opt.name_legacy = True
    opt.name_languages = ['*']; opt.notdef_outline = True; opt.hinting = False
    sub = Subsetter(options=opt)
    cps = []
    for r in UNICODES.split(','):
        a, _, b = r.replace('U+', '').partition('-')
        cps += range(int(a, 16), int(b or a, 16) + 1)
    sub.populate(unicodes=cps); sub.subset(font)
    font.flavor = 'woff2'
    out = os.path.join(OUT, ra + '.woff2'); font.save(out)
    # bản ttf để xem thử bằng Pillow
    font.flavor = None; font.save(os.path.join(OUT, ra + '.ttf'))
    print(f'{ra}.woff2  {os.path.getsize(out)//1024} KB  (gốc wght {wght}, sx {sx}, khoảng {d_em:+.4f}em, chữ hoa x{cap_scale:.3f})')
