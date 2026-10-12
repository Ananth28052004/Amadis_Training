from pathlib import Path


def find_text_in_source(project_path, search_text):
    project_path = Path(project_path)

    matches = []

    for file_path in project_path.rglob("*.py"):
        try:
            content = file_path.read_text(
                encoding="utf-8"
            )
        except (UnicodeDecodeError, OSError):
            continue

        for line_number, line in enumerate(
            content.splitlines(),
            start=1
        ):
            if search_text.lower() in line.lower():
                matches.append({
                    "file": str(file_path),
                    "line": line_number,
                    "content": line.strip()
                })

    return matches