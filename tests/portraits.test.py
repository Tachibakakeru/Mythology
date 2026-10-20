"""Validate the actual portrait assets registered in index.html (Pillow)."""
import hashlib
from pathlib import Path
import re
from PIL import Image

root = Path(__file__).resolve().parents[1]
source = (root / 'index.html').read_text(encoding='utf-8')
registry = re.search(r'const NODE_PORTRAITS = \{([\s\S]*?)\n\};', source).group(1)
entries = re.findall(r"'([^']+)':'([^']+)'", registry)
assert len({key for key, _ in entries}) == len(entries), 'Duplicate portrait keys'
japanese_defs = re.search(r'const JP_NODE_DEFS = \[([\s\S]*?)\n\];', source).group(1)
japanese_ids = set(re.findall(r'\["([^"]+)"', japanese_defs))
hashes = {}
for key, relative in entries:
    if key.startswith('japan:'):
        assert key[6:] in japanese_ids, (key, 'Unknown Japanese node')
    path = root / relative
    assert path.is_file(), (key, 'Missing file', relative)
    with Image.open(path) as image:
        assert image.size == (256, 256), (key, image.size)
        assert image.mode == 'RGBA', (key, image.mode)
        alpha = image.getchannel('A')
        assert all(alpha.getpixel(p) == 0 for p in [(0, 0), (255, 0), (0, 255), (255, 255)]), (key, 'Opaque corners')
        assert alpha.getextrema() == (0, 255), (key, 'Missing alpha range')
        assert sum(alpha.histogram()[128:]) > 256 * 256 // 4, (key, 'Empty image')
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    assert digest not in hashes, (key, 'Shared portrait with', hashes.get(digest))
    hashes[digest] = key
    assert path.stat().st_size < 300_000, (key, 'Oversized node asset')
registered = {relative for _, relative in entries if relative.startswith('assets/portraits/japan/')}
actual = {p.relative_to(root).as_posix() for p in (root / 'assets/portraits/japan').glob('*.png')}
assert registered == actual, ('Unregistered or missing Japanese portraits', registered ^ actual)
print(f'Portraits OK: {len(entries)} total, {len(registered)} Japanese; unique RGBA assets, 256px, transparent corners')
