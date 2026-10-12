from pathlib import Path


def detect_project(project_path):
    """
    Detect the project type from the presence of well-known build/config files.
    Supports: Python, Node.js, Java Maven, Java Gradle, Go, Rust, .NET
    """
    project = Path(project_path)

    if (project / "package.json").exists():
        return {
            "type": "Node.js",
            "install_command": "npm install",
            "test_command": "npm test"
        }

    if (project / "requirements.txt").exists():
        return {
            "type": "Python",
            "install_command": "pip install -r requirements.txt",
            "test_command": "pytest"
        }

    if (project / "pyproject.toml").exists():
        return {
            "type": "Python",
            "install_command": "pip install -e .",
            "test_command": "pytest"
        }

    if (project / "pom.xml").exists():
        return {
            "type": "Java Maven",
            "install_command": "mvn install -DskipTests",
            "test_command": "mvn test"
        }

    if (project / "build.gradle").exists() or (project / "build.gradle.kts").exists():
        return {
            "type": "Java Gradle",
            "install_command": "gradle build -x test",
            "test_command": "gradle test"
        }

    if (project / "go.mod").exists():
        return {
            "type": "Go",
            "install_command": "go mod download",
            "test_command": "go test ./..."
        }

    if (project / "Cargo.toml").exists():
        return {
            "type": "Rust",
            "install_command": "cargo build",
            "test_command": "cargo test"
        }

    if (project / "setup.py").exists() or (project / "setup.cfg").exists():
        return {
            "type": "Python",
            "install_command": "pip install -e .",
            "test_command": "pytest"
        }

    if (project / "Pipfile").exists() or (project / "tox.ini").exists():
        return {
            "type": "Python",
            "install_command": "pip install -e .",
            "test_command": "pytest"
        }

    # .NET — look for any .csproj or .sln file
    csproj_files = list(project.glob("*.csproj")) + list(project.glob("**/*.csproj"))
    sln_files = list(project.glob("*.sln"))
    if csproj_files or sln_files:
        return {
            "type": ".NET",
            "install_command": "dotnet restore",
            "test_command": "dotnet test"
        }

    # Intelligent fallback: detect by source files present
    py_files = [p for p in project.rglob("*.py") if ".git" not in p.parts and ".venv" not in p.parts]
    if py_files:
        return {
            "type": "Python",
            "install_command": "pip install -e .",
            "test_command": "pytest"
        }

    js_files = [p for p in project.rglob("*.js") if "node_modules" not in p.parts and ".git" not in p.parts]
    if js_files:
        return {
            "type": "Node.js",
            "install_command": "npm install",
            "test_command": "npm test"
        }

    raise ValueError(
        f"Could not detect the project type in '{project_path}'. "
        "No recognized configuration files or source code found."
    )