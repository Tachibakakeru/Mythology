"""Downscale one generated portrait without changing its composition or alpha."""
import argparse
from pathlib import Path
from PIL import Image

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source', type=Path)
parser.add_argument('target', type=Path)
args = parser.parse_args()
if args.target.exists():
    parser.error('Refusing to overwrite an existing asset; use a versioned filename')
with Image.open(args.source) as original:
    if original.mode != 'RGBA' or original.width != original.height:
        parser.error('Expected a square generated RGBA portrait')
    image = original.resize((256, 256), Image.Resampling.LANCZOS)
    if any(image.getpixel(p)[3] != 0 for p in [(0, 0), (255, 0), (0, 255), (255, 255)]):
        parser.error('Transparent corners failed; repair with image_gen before registering')
    image.save(args.target, optimize=True)
print(f'{args.target.name}: 256px RGBA, {args.target.stat().st_size} bytes')
