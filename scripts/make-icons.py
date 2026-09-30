"""Draws the app icon (Lulu the bunny on a sky gradient) at every size the PWA needs.

    python scripts/make-icons.py
"""
import os
from PIL import Image, ImageDraw

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "icons")
S = 1024  # draw big, then downscale for smooth edges


def draw(scale: float) -> Image.Image:
    """scale < 1 shrinks the bunny to keep it inside a maskable icon's safe zone."""
    img = Image.new("RGB", (S, S))
    d = ImageDraw.Draw(img)
    top, bottom = (143, 216, 255), (255, 214, 236)
    for y in range(S):
        t = y / S
        d.line([(0, y), (S, y)], fill=tuple(int(a + (b - a) * t) for a, b in zip(top, bottom)))

    c = S / 2

    def p(x, y):  # bunny is designed on a 120-unit grid centered at (60, 61)
        return c + (x - 60) * 7.2 * scale, c + (y - 61) * 7.2 * scale

    def ellipse(cx, cy, rx, ry, fill, outline=None, width=0):
        x0, y0 = p(cx - rx, cy - ry)
        x1, y1 = p(cx + rx, cy + ry)
        d.ellipse([x0, y0, x1, y1], fill=fill, outline=outline, width=int(width * scale))

    line = (243, 215, 230)
    for ex in (40, 80):  # ears
        ellipse(ex, 34, 13, 32, "white", line, 14)
        ellipse(ex, 36, 6.5, 23, (255, 179, 207))
    ellipse(60, 84, 38, 36, "white", line, 14)  # head
    ink = (59, 42, 90)
    for ex in (46, 74):  # eyes
        ellipse(ex, 80, 6, 7.5, ink)
        ellipse(ex + 2, 77, 2.2, 2.2, "white")
    for ex in (35, 85):  # cheeks
        ellipse(ex, 93, 7, 4.5, (255, 179, 207))
    nose = [p(56, 89), p(64, 89), p(60, 93)]
    d.polygon(nose, fill=(255, 122, 168))
    x0, y0 = p(52, 91)
    x1, y1 = p(68, 105)
    d.arc([x0, y0, x1, y1], 20, 160, fill=ink, width=int(18 * scale))
    # bow
    bx, by = p(86, 52)
    r = 36 * scale
    d.polygon([(bx, by), (bx - 2 * r, by - r), (bx - 2 * r, by + r)], fill=(255, 111, 181))
    d.polygon([(bx, by), (bx + 2 * r, by - r), (bx + 2 * r, by + r)], fill=(255, 111, 181))
    d.ellipse([bx - r * 0.6, by - r * 0.6, bx + r * 0.6, by + r * 0.6], fill=(255, 159, 207))
    return img


def save(img: Image.Image, name: str, size: int) -> None:
    img.resize((size, size), Image.LANCZOS).save(os.path.join(OUT, name), optimize=True)


os.makedirs(OUT, exist_ok=True)
regular, maskable = draw(0.9), draw(0.72)
save(regular, "icon-192.png", 192)
save(regular, "icon-512.png", 512)
save(maskable, "maskable-512.png", 512)
save(regular, "apple-touch-icon.png", 180)
save(regular, "favicon-64.png", 64)
print("icons written to public/icons")
