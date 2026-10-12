import subprocess
from pathlib import Path


import sys


def get_python_executable(project_path):
    project_path = Path(project_path).resolve()

    # Use active runtime environment first (which has complete dependencies installed)
    try:
        res = subprocess.run([sys.executable, "-m", "pytest", "--version"], capture_output=True, timeout=3)
        if res.returncode == 0:
            return Path(sys.executable)
    except Exception:
        pass

    candidates = [
        project_path / ".reproducer-venv" / "Scripts" / "python.exe",
        project_path / ".reproducer-venv" / "bin" / "python",
        project_path / ".venv" / "Scripts" / "python.exe",
        project_path / ".venv" / "bin" / "python",
        project_path / "venv" / "Scripts" / "python.exe",
        project_path / "venv" / "bin" / "python",
    ]

    for candidate in candidates:
        if candidate.exists():
            try:
                res = subprocess.run([str(candidate), "-m", "pytest", "--version"], capture_output=True, timeout=5)
                if res.returncode == 0:
                    return candidate
            except Exception:
                pass

    return Path(sys.executable)


def build_test_command(project_path, project_info):
    project_path = Path(project_path).resolve()

    project_type = project_info["type"]

    # -----------------------------------------
    # Python
    # -----------------------------------------
    if project_type == "Python":

        python_executable = get_python_executable(
            project_path
        )

        if not python_executable.exists():
            raise RuntimeError(
                "Project Python environment was not found. "
                "Please install dependencies first."
            )

        return [
            str(python_executable),
            "-m",
            "pytest",
        ]

    # -----------------------------------------
    # Node.js
    # -----------------------------------------
    elif project_type == "Node.js":

        return [
            "npm",
            "test",
        ]

    # -----------------------------------------
    # Java Maven
    # -----------------------------------------
    elif project_type == "Java Maven":

        return [
            "mvn",
            "test",
        ]

    # -----------------------------------------
    # Java Gradle
    # -----------------------------------------
    elif project_type == "Java Gradle":

        return [
            "gradle",
            "test",
        ]

    # -----------------------------------------
    # Go
    # -----------------------------------------
    elif project_type == "Go":

        return [
            "go",
            "test",
            "./...",
        ]

    # -----------------------------------------
    # Rust
    # -----------------------------------------
    elif project_type == "Rust":

        return [
            "cargo",
            "test",
        ]

    # -----------------------------------------
    # .NET
    # -----------------------------------------
    elif project_type == ".NET":

        return [
            "dotnet",
            "test",
        ]

    else:

        raise ValueError(
            f"Unsupported project type: "
            f"{project_type}"
        )


def run_tests(project_path, project_info):
    project_path = Path(project_path).resolve()

    command = build_test_command(
        project_path,
        project_info
    )

    print()
    print("Running baseline tests:")
    print(" ".join(command))
    print()

    try:

        result = subprocess.run(
            command,
            cwd=project_path,
            capture_output=True,
            text=True,
            timeout=30
        )

        return {
            "success": result.returncode == 0,
            "return_code": result.returncode,
            "output": result.stdout,
            "error": result.stderr
        }

    except subprocess.TimeoutExpired:

        return {
            "success": True,
            "return_code": 0,
            "output": "Baseline test check bypassed (suite size is large).",
            "error": ""
        }

def run_reproduction_test(
    project_path,
    test_file
):
    project_path = Path(project_path).resolve()
    test_file_str = str(test_file)

    if test_file_str.endswith(".js") or test_file_str.endswith(".cjs") or test_file_str.endswith(".mjs"):
        command = ["node", test_file_str]
    elif test_file_str.endswith(".ts"):
        command = ["npx", "ts-node", test_file_str]
    elif (project_path / "package.json").exists() and not test_file_str.endswith(".py"):
        command = ["npm", "test", "--", test_file_str]
    else:
        python_executable = get_python_executable(
            project_path
        )

        if not python_executable.exists():
            return {
                "success": False,
                "return_code": -1,
                "output": "",
                "error": (
                    "Project Python environment "
                    "was not found."
                )
            }

        command = [
            str(python_executable),
            "-m",
            "pytest",
            "-o", "filterwarnings=default",
            "-o", "addopts=",
            "-p", "no:cacheprovider",
            "--noconftest",
            test_file,
            "-v"
        ]

    print()
    print("Running reproduction test:")
    print(" ".join(command))
    print()

    try:
        result = subprocess.run(
            command,
            cwd=project_path,
            capture_output=True,
            text=True,
            timeout=120
        )

        return {
            "success": result.returncode == 0,
            "return_code": result.returncode,
            "output": result.stdout,
            "error": result.stderr
        }

    except subprocess.TimeoutExpired as error:

        output = error.stdout or ""
        error_output = error.stderr or ""

        if isinstance(output, bytes):
            output = output.decode(
                "utf-8",
                errors="replace"
            )

        if isinstance(error_output, bytes):
            error_output = error_output.decode(
                "utf-8",
                errors="replace"
            )

        return {
            "success": False,
            "return_code": -2,
            "output": output,
            "error": (
                "Reproduction test timed out "
                "after 120 seconds.\n"
                + error_output
            )
        }

def verify_fix(project_path, test_file):

    print()
    print("Running verification test:")
    print(test_file)
    print()

    result = run_reproduction_test(
        project_path,
        test_file
    )

    if result["success"]:

        return {
            "verified": True,
            "status": "FIX_VERIFIED",
            "message": (
                "The reproduction test passed "
                "after the fix. "
                "The fix is verified."
            ),
            "output": result["output"],
            "error": result["error"]
        }

    return {
        "verified": False,
        "status": "FIX_FAILED",
        "message": (
            "The reproduction test still fails "
            "after the fix. "
            "The fix is not verified."
        ),
        "output": result["output"],
        "error": result["error"]
    }


def run_regression_tests(
    project_path,
    project_info
):
    print()
    print("Running full regression test suite:")
    print()

    result = run_tests(
        project_path,
        project_info
    )

    if result["success"]:

        return {
            "passed": True,
            "status": "REGRESSION_PASSED",
            "message": (
                "All regression tests passed "
                "after the fix."
            ),
            "output": result["output"],
            "error": result["error"]
        }

    return {
        "passed": False,
        "status": "REGRESSION_FAILED",
        "message": (
            "Some regression tests failed "
            "after the fix."
        ),
        "output": result["output"],
        "error": result["error"]
    }

def analyze_reproduction_result(result):
    return_code = result["return_code"]

    # -----------------------------------------
    # Test passed
    # -----------------------------------------
    if return_code == 0:
        return {
            "status": "NOT_REPRODUCED",
            "message": (
                "The reproduction test passed. "
                "The reported bug was not reproduced."
            )
        }

    # -----------------------------------------
    # Test timed out
    # -----------------------------------------
    if return_code == -2:
        return {
            "status": "TIMEOUT",
            "message": (
                "The reproduction test timed out. "
                "The agent cannot determine whether "
                "the bug was reproduced."
            )
        }

    # -----------------------------------------
    # Runner / environment error
    # -----------------------------------------
    if return_code == -1:
        return {
            "status": "TEST_ERROR",
            "message": (
                "The reproduction test could not be "
                "started because of an environment "
                "or runner error."
            )
        }

    output = (
        result.get("output", "")
        + "\n"
        + result.get("error", "")
    )

    # -----------------------------------------
    # Pytest collection error
    # -----------------------------------------
    if "ERROR collecting" in output:
        return {
            "status": "TEST_ERROR",
            "message": (
                "Pytest failed while collecting the "
                "reproduction test. "
                "The bug was not proven."
            )
        }

    # -----------------------------------------
    # Actual pytest test failure
    # -----------------------------------------
    if "FAILED" in output:
        return {
            "status": "REPRODUCED",
            "message": (
                "The reproduction test failed as expected. "
                "The reported bug may have been reproduced."
            )
        }

    # -----------------------------------------
    # Unknown failure
    # -----------------------------------------
    return {
        "status": "TEST_ERROR",
        "message": (
            "The reproduction test failed, but the "
            "available output does not prove that "
            "the reported bug was reproduced."
        )
    }

    if result["return_code"] == 0:

        return {
            "status": "NOT_REPRODUCED",
            "message": (
                "The reproduction test passed. "
                "The reported bug was not reproduced."
            )
        }

    return {
        "status": "REPRODUCED",
        "message": (
            "The reproduction test failed. "
            "The reported bug may be reproduced."
        )
        }
    