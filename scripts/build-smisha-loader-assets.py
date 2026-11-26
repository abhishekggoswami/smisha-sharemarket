from PIL import Image
from pathlib import Path

root = Path(__file__).resolve().parents[1]
source = root / "public/assets/smisha-logo-dark.png"
target = root / "public/assets/smisha-loader"
target.mkdir(parents=True, exist_ok=True)
im = Image.open(source).convert("RGBA")
w, h = im.size
pixels = im.load()
layers = ("bar-1", "bar-2", "bar-3", "bar-4", "bull", "wordmark", "subtitle", "tagline")
outputs = {n: Image.new("RGBA", (w, h), (0, 0, 0, 0)) for n in layers}
outpix = {n: item.load() for n, item in outputs.items()}
full = Image.new("RGBA", (w, h), (0, 0, 0, 0))
fpx = full.load()

# Regions are specified relative to the unchanged native logo canvas.
# No typography, icon, geometry or artwork is drawn from scratch.
bar_boxes = [(0.313, .471, .385, .56), (.394, .423, .47, .56), (.478, .37, .555, .56), (.56, .305, .64, .56)]
for y in range(h):
    for x in range(w):
        r, g, b, _ = pixels[x, y]
        intensity = max(r, g, b)
        if intensity < 35:
            continue
        # Remove the near-black/navy raster backdrop, preserving genuine logo pixels.
        alpha = min(255, int((intensity - 30) * 255 / 48))
        if alpha <= 0:
            continue
        color = (r, g, b, alpha)
        fpx[x, y] = color
        u, v = x/w, y/h
        gold = r > 125 and g > 78 and r > b*1.8
        bar_index = next((j for j,(x0,y0,x1,y1) in enumerate(bar_boxes) if x0 <= u <= x1 and y0 <= v <= y1), None)
        if bar_index is not None and gold:
            outpix[f"bar-{bar_index+1}"][x,y] = color
        elif v < .575 and gold:
            outpix["bull"][x,y] = color
        elif .565 <= v < .774:
            outpix["wordmark"][x,y] = color
        elif .773 <= v < .84:
            outpix["subtitle"][x,y] = color
        elif .84 <= v <= .93:
            outpix["tagline"][x,y] = color
full.save(target / "original-logo.png", optimize=True)
for name, layer in outputs.items():
    layer.save(target / f"{name}.png", optimize=True)
print(f"Prepared {len(outputs)+1} exact-position assets from {source.name}, canvas {w}x{h}")
