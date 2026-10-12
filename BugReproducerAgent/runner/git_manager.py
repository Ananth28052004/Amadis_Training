import shutil
import subprocess
from pathlib import Path

# Known shortcuts mapping bare project names to their GitHub owner/repository
KNOWN_REPOS = {
    "requests": "psf/requests",
    "flask": "pallets/flask",
    "httpx": "encode/httpx",
    "pydantic": "pydantic/pydantic",
    "marshmallow": "marshmallow-code/marshmallow",
    "termstory": "bitflicker64/Termstory",
    "django": "django/django",
    "fastapi": "fastapi/fastapi",
    "click": "pallets/click",
    "jinja2": "pallets/jinja",
    "werkzeug": "pallets/werkzeug",
}


def ensure_unicode_demo_service(workspace_path: Path) -> Path:
    """Initialize or restore the local benchmark Unicode Header Service project."""
    target_dir = workspace_path / "unicode_header_service"
    service_dir = target_dir / "service"
    service_dir.mkdir(parents=True, exist_ok=True)
    
    init_file = service_dir / "__init__.py"
    if not init_file.exists():
        init_file.write_text("# Unicode Header Service\n", encoding="utf-8")
        
    hp = service_dir / "header_parser.py"
    hp.write_text(
        'def process_header(name: str, value: str) -> dict:\n'
        '    """Process an HTTP header. Bug: crashes on unicode values."""\n'
        '    key = name.strip().lower()\n'
        '    encoded = value.encode("ascii")\n'
        '    return {key: encoded.decode("ascii").upper()}\n',
        encoding="utf-8"
    )
        
    req = target_dir / "requirements.txt"
    if not req.exists():
        req.write_text("pytest>=7.0.0\n", encoding="utf-8")
        
    return target_dir


def clone_repository(repository: str, workspace_path):
    workspace_path = Path(workspace_path)

    # Create workspace folder if it does not exist
    workspace_path.mkdir(parents=True, exist_ok=True)

    # 1. Handle local benchmark/offline demo repository
    clean_repo = repository.strip().rstrip("/")
    if "unicode" in clean_repo.lower() and ("header" in clean_repo.lower() or "service" in clean_repo.lower()):
        demo_path = ensure_unicode_demo_service(workspace_path)
        return {
            "success": True,
            "cloned": False,
            "path": demo_path,
            "message": "Local benchmark repository ready at unicode_header_service."
        }

    # 2. Resolve bare repo name using known repository mapping
    if "/" not in clean_repo and not clean_repo.startswith("http"):
        resolved_repo = KNOWN_REPOS.get(clean_repo.lower(), clean_repo)
    else:
        resolved_repo = clean_repo

    repository_name = resolved_repo.split("/")[-1]
    project_path = workspace_path / repository_name

    # 3. Check whether repository already exists and has a valid .git directory
    if project_path.exists():
        if (project_path / ".git").is_dir():
            try:
                subprocess.run(["git", "checkout", "."], cwd=project_path, capture_output=True, timeout=10)
            except Exception:
                pass
            for f in project_path.rglob("test_bug_*"):
                try:
                    f.unlink()
                except Exception:
                    pass
            return {
                "success": True,
                "cloned": False,
                "path": project_path,
                "message": "Repository already exists in workspace."
            }
        else:
            # Incomplete or non-git directory — remove and do fresh clone
            shutil.rmtree(project_path, ignore_errors=True)

    # 4. Check for case-insensitive alias with valid .git directory
    for existing_dir in workspace_path.iterdir():
        if existing_dir.is_dir() and (existing_dir / ".git").is_dir():
            dir_name_norm = existing_dir.name.lower().replace("-", "_")
            target_norm = repository_name.lower().replace("-", "_")
            if dir_name_norm == target_norm:
                return {
                    "success": True,
                    "cloned": False,
                    "path": existing_dir,
                    "message": f"Found existing local workspace at {existing_dir.name}."
                }

    # 5. Build proper GitHub clone URL
    if resolved_repo.startswith("http://") or resolved_repo.startswith("https://"):
        repository_url = resolved_repo
    elif "/" in resolved_repo:
        repository_url = f"https://github.com/{resolved_repo}.git"
    else:
        repository_url = f"https://github.com/{resolved_repo}.git"

    print()
    print("Cloning repository (shallow --depth 1):")
    print(repository_url)
    print()

    # 6. Execute git clone
    try:
        result = subprocess.run(
            [
                "git",
                "clone",
                "--depth",
                "1",
                repository_url,
                str(project_path)
            ],
            capture_output=True,
            text=True,
            timeout=180
        )

        if result.returncode != 0:
            if project_path.exists():
                shutil.rmtree(project_path, ignore_errors=True)
            err_details = result.stderr.strip() if result.stderr else "Repository not found or network connection error."
            return {
                "success": False,
                "cloned": False,
                "path": project_path,
                "message": f"Git clone failed for {repository_url}: {err_details}",
                "output": result.stdout,
                "error": result.stderr
            }

        return {
            "success": True,
            "cloned": True,
            "path": project_path,
            "message": "Repository cloned successfully.",
            "output": result.stdout,
            "error": result.stderr
        }

    except FileNotFoundError:
        return {
            "success": False,
            "cloned": False,
            "path": project_path,
            "message": (
                "Git was not found. "
                "Please install Git and make sure it is available in PATH."
            )
        }

    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "cloned": False,
            "path": project_path,
            "message": f"Git clone timed out after 180 seconds for {repository_url}."
        }