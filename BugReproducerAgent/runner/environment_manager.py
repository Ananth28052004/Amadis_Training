import sys
import subprocess
from pathlib import Path


def create_python_environment(project_path):
    project_path = Path(project_path).resolve()
    project_path.mkdir(parents=True, exist_ok=True)

    environment_path = (
        project_path / ".reproducer-venv"
    ).resolve()

    win_exe = environment_path / "Scripts" / "python.exe"
    unix_exe = environment_path / "bin" / "python"

    # -----------------------------------------
    # Environment already exists and is valid
    # -----------------------------------------
    if environment_path.exists() and (win_exe.exists() or unix_exe.exists()):
        return {
            "success": True,
            "created": False,
            "path": environment_path,
            "message": "Project virtual environment already exists."
        }

    # Clean up incomplete/broken virtualenv folder if present
    if environment_path.exists():
        import shutil
        shutil.rmtree(environment_path, ignore_errors=True)

    print()
    print("Creating isolated Python environment:")
    print(environment_path)
    print()

    try:
        result = subprocess.run(
            [
                sys.executable,
                "-m",
                "venv",
                "--system-site-packages",
                str(environment_path)
            ],
            cwd=str(project_path),
            capture_output=True,
            text=True,
            timeout=120
        )

        if result.returncode == 0 and (win_exe.exists() or unix_exe.exists()):
            return {
                "success": True,
                "created": True,
                "path": environment_path,
                "message": "Isolated Python environment created successfully.",
                "output": result.stdout,
                "error": result.stderr
            }

    except Exception as exc:
        print(f"[Notice] Isolated venv creation exception ({exc}). Using active Python environment fallback.")

    # Fallback to active runtime environment if venv creation fails or is unsupported
    active_env = Path(sys.executable).parent.parent
    return {
        "success": True,
        "created": False,
        "path": active_env,
        "message": "Using active Python environment with installed dependencies.",
        "output": "",
        "error": ""
    }


def get_python_executable(environment_path):
    environment_path = Path(environment_path).resolve()
    win_exe = environment_path / "Scripts" / "python.exe"
    if win_exe.exists():
        return win_exe
    unix_exe = environment_path / "bin" / "python"
    if unix_exe.exists():
        return unix_exe
    return Path(sys.executable)


def get_pip_executable(environment_path):
    environment_path = Path(environment_path).resolve()
    win_exe = environment_path / "Scripts" / "pip.exe"
    if win_exe.exists():
        return win_exe
    unix_exe = environment_path / "bin" / "pip"
    if unix_exe.exists():
        return unix_exe
    active_pip = Path(sys.executable).parent / ("pip.exe" if sys.platform == "win32" else "pip")
    if active_pip.exists():
        return active_pip
    return win_exe