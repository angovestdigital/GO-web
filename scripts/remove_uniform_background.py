from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter


SOURCE = Path("public/assets/exeed.webp")
TARGET = Path("public/assets/exeed-cutout.png")

image = Image.open(SOURCE).convert("RGBA")
pixels = image.load()
width, height = image.size

# The manufacturer photograph uses a neutral studio gradient plus dark
# letterbox strips. Estimate its background row by row from both side edges,
# then remove only matching neutral pixels connected to the canvas edge. This
# keeps the silver bodywork and its contact shadow intact.
row_background: list[tuple[int, int, int]] = []
edge_width = max(12, min(120, width // 12))
for y in range(height):
    samples = [pixels[x, y][:3] for x in range(edge_width)]
    samples.extend(pixels[x, y][:3] for x in range(width - edge_width, width))
    channels = list(zip(*samples))
    row_background.append(tuple(sorted(channel)[len(channel) // 2] for channel in channels))
visited = bytearray(width * height)
background = Image.new("L", image.size, 0)
mask = background.load()
queue: deque[tuple[int, int]] = deque()

for x in range(width):
    queue.append((x, 0))
    queue.append((x, height - 1))
for y in range(height):
    queue.append((0, y))
    queue.append((width - 1, y))

def is_background(x: int, y: int) -> bool:
    r, g, b, _ = pixels[x, y]
    br, bg, bb = row_background[y]
    neutral = max(r, g, b) - min(r, g, b) <= 16
    distance = max(abs(r - br), abs(g - bg), abs(b - bb))
    return neutral and distance <= 32

while queue:
    x, y = queue.popleft()
    idx = y * width + x
    if visited[idx]:
        continue
    visited[idx] = 1
    if not is_background(x, y):
        continue
    mask[x, y] = 255
    if x:
        queue.append((x - 1, y))
    if x + 1 < width:
        queue.append((x + 1, y))
    if y:
        queue.append((x, y - 1))
    if y + 1 < height:
        queue.append((x, y + 1))

background = background.filter(ImageFilter.GaussianBlur(1.2))
alpha = background.point(lambda value: 255 - value)
image.putalpha(alpha)
bounds = alpha.getbbox()
if bounds:
    pad = 30
    left = max(0, bounds[0] - pad)
    top_y = max(0, bounds[1] - pad)
    right = min(width, bounds[2] + pad)
    bottom_y = min(height, bounds[3] + pad)
    image = image.crop((left, top_y, right, bottom_y))
image.save(TARGET, optimize=True)
