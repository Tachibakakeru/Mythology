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
yokai_defs = re.search(r'const YOKAI_DEFS = \[([\s\S]*?)\n\];', source).group(1)
yokai_ids = set(re.findall(r'\["([^"]+)"', yokai_defs))
greek_defs = re.search(r'const GR_NODE_DEFS = \[([\s\S]*?)\n\];', source).group(1)
greek_ids = set(re.findall(r'\["([^"]+)"', greek_defs))
assert japanese_ids == {key[6:] for key, _ in entries if key.startswith('japan:')}, 'Japanese nodes missing portraits'
assert yokai_ids == {key[6:] for key, _ in entries if key.startswith('yokai:')}, 'Yokai nodes missing portraits'
hashes = {}
for key, relative in entries:
    if key.startswith('japan:'):
        assert key[6:] in japanese_ids, (key, 'Unknown Japanese node')
    if key.startswith('yokai:'):
        assert key[6:] in yokai_ids, (key, 'Unknown yokai node')
    if key.startswith('greek:'):
        assert key[6:] in greek_ids, (key, 'Unknown Greek node')
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
counts = {}
for namespace in ['japan', 'yokai', 'greek']:
    registered = {relative for _, relative in entries if relative.startswith(f'assets/portraits/{namespace}/')}
    actual = {p.relative_to(root).as_posix() for p in (root / f'assets/portraits/{namespace}').glob('*.png')}
    assert registered == actual, (f'Unregistered or missing {namespace} portraits', registered ^ actual)
    counts[namespace] = len(registered)
print(f"Portraits OK: {len(entries)} total, {counts['japan']} Japanese, {counts['yokai']} yokai, {counts['greek']} Greek; unique RGBA assets, 256px, transparent corners")
