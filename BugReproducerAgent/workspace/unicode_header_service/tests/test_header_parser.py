import sys
from pathlib import Path
try:
    import importlib.metadata as _im
    _orig_v = _im.version
    def _safe_ver(pkg, *a, **kw):
        try:
            return _orig_v(pkg, *a, **kw)
        except Exception:
            return '0.1.0'
    _im.version = _safe_ver
except Exception:
    pass
this_file = Path(__file__).resolve()
project_root = this_file.parent
for parent in [this_file.parent, this_file.parent.parent, this_file.parent.parent.parent]:
    if (parent / '.git').exists() or (parent / 'pyproject.toml').exists() or (parent / 'setup.py').exists():
        project_root = parent
        break
for p in [project_root / 'src', project_root / 'lib', project_root]:
    if p.exists() and str(p) not in sys.path:
        sys.path.insert(0, str(p))

import pytest
from service.header_parser import process_header

@pytest.mark.parametrize('name, value, expected', [
    ('x-user-badge', 'Bearer 🚀_token_üñíçödé', {'name': 'X-USER-BADGE', 'value': 'BEARER 🚀_TOKEN_ÜÑÍÇÖDÉ'}),
])
def test_process_header_with_unicode(name, value, expected):
    result = process_header(name, value)
    assert result == expected