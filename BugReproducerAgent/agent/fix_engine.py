import re
import difflib
import shutil
from pathlib import Path


def apply_text_fix(
    project_path,
    file_path,
    old_text,
    new_text,
):
    project_path = Path(project_path).resolve()

    clean_rel = str(file_path or "").strip()
    if not clean_rel:
        return {
            "success": False,
            "message": "Target file was not specified by LLM diagnosis.",
            "diff": "",
            "file": "",
            "old_text": old_text,
            "new_text": new_text,
        }

    target_file = (project_path / clean_rel).resolve()
    if target_file.is_dir():
        return {
            "success": False,
            "message": f"Target path '{clean_rel}' is a directory, not a source code file.",
            "diff": "",
            "file": str(target_file),
            "old_text": old_text,
            "new_text": new_text,
        }

    # If the exact path does not exist, search project_path for matching filename
    if not target_file.exists():
        fname = Path(clean_rel).name
        matches = [
            p for p in project_path.rglob(fname)
            if ".venv" not in p.parts and ".git" not in p.parts and "tests" not in p.parts
        ]
        if matches:
            target_file = matches[0].resolve()
        else:
            return {
                "success": False,
                "message": f"Target file '{file_path}' was not found in project '{project_path.name}'.",
                "diff": "",
                "file": str(target_file),
                "old_text": old_text,
                "new_text": new_text,
            }

    # Security check: Make sure the target file stays inside the project.
    if project_path not in target_file.parents and target_file != project_path:
        return {
            "success": False,
            "message": "Refusing to modify a file outside the project boundary.",
            "diff": "",
            "file": str(target_file),
            "old_text": old_text,
            "new_text": new_text,
        }

    try:
        content = target_file.read_text(encoding="utf-8")
    except Exception as e:
        return {
            "success": False,
            "message": f"Could not read target file: {e}",
            "diff": "",
            "file": str(target_file),
            "old_text": old_text,
            "new_text": new_text,
        }

    # Normalize newlines for reliable matching
    normalized_content = content.replace("\r\n", "\n")
    normalized_old_raw = old_text.replace("\r\n", "\n")
    normalized_old = normalized_old_raw.strip()
    normalized_new = new_text.replace("\r\n", "\n")

    if normalized_old_raw in normalized_content:
        updated_content = normalized_content.replace(normalized_old_raw, normalized_new, 1)
    elif normalized_old in normalized_content:
        updated_content = normalized_content.replace(normalized_old, normalized_new.strip(), 1)
    else:
        # Try line-by-line whitespace-tolerant match
        lines = normalized_content.splitlines()
        old_lines = [l.strip() for l in normalized_old.splitlines() if l.strip()]
        matched = False
        for i in range(len(lines) - len(old_lines) + 1):
            slice_lines = [l.strip() for l in lines[i:i + len(old_lines)]]
            if slice_lines == old_lines:
                # Detect base indentation of the matched block in the file vs the proposed replacement
                orig_first_line = lines[i]
                target_indent_match = re.match(r"^(\s*)", orig_first_line)
                target_indent = target_indent_match.group(1) if target_indent_match else ""

                new_lines_raw = normalized_new.splitlines()
                if new_lines_raw:
                    first_non_empty = next((l for l in new_lines_raw if l.strip()), "")
                    prop_indent_match = re.match(r"^(\s*)", first_non_empty)
                    prop_indent = prop_indent_match.group(1) if prop_indent_match else ""

                    if prop_indent != target_indent:
                        adjusted_lines = []
                        for l in new_lines_raw:
                            if not l.strip():
                                adjusted_lines.append("")
                            elif l.startswith(prop_indent):
                                adjusted_lines.append(target_indent + l[len(prop_indent):])
                            else:
                                adjusted_lines.append(target_indent + l.lstrip())
                        adjusted_new = "\n".join(adjusted_lines)
                    else:
                        adjusted_new = normalized_new
                else:
                    adjusted_new = normalized_new

                parts = []
                if i > 0:
                    parts.append("\n".join(lines[:i]))
                parts.append(adjusted_new)
                if i + len(old_lines) < len(lines):
                    parts.append("\n".join(lines[i + len(old_lines):]))
                updated_content = "\n".join(parts) + "\n"
                matched = True
                break
        if not matched and len(old_lines) >= 1:
            best_ratio = 0.0
            best_i = -1
            best_len = len(old_lines)
            old_block_str = "\n".join(old_lines)
            windows = [1] if len(old_lines) == 1 else [len(old_lines), len(old_lines) - 1, len(old_lines) + 1]
            for window in windows:
                if window <= 0:
                    continue
                for i in range(len(lines) - window + 1):
                    cand_block_str = "\n".join(l.strip() for l in lines[i:i + window])
                    ratio = difflib.SequenceMatcher(None, old_block_str, cand_block_str).ratio()
                    if ratio > best_ratio:
                        best_ratio = ratio
                        best_i = i
                        best_len = window

            if best_ratio >= 0.78 and best_i >= 0:
                orig_first_line = lines[best_i]
                target_indent_match = re.match(r"^(\s*)", orig_first_line)
                target_indent = target_indent_match.group(1) if target_indent_match else ""

                new_lines_raw = normalized_new.splitlines()
                if new_lines_raw:
                    first_non_empty = next((l for l in new_lines_raw if l.strip()), "")
                    prop_indent_match = re.match(r"^(\s*)", first_non_empty)
                    prop_indent = prop_indent_match.group(1) if prop_indent_match else ""

                    if prop_indent != target_indent:
                        adjusted_lines = []
                        for l in new_lines_raw:
                            if not l.strip():
                                adjusted_lines.append("")
                            elif l.startswith(prop_indent):
                                adjusted_lines.append(target_indent + l[len(prop_indent):])
                            else:
                                adjusted_lines.append(target_indent + l.lstrip())
                        adjusted_new = "\n".join(adjusted_lines)
                    else:
                        adjusted_new = normalized_new
                else:
                    adjusted_new = normalized_new

                parts = []
                if best_i > 0:
                    parts.append("\n".join(lines[:best_i]))
                parts.append(adjusted_new)
                if best_i + best_len < len(lines):
                    parts.append("\n".join(lines[best_i + best_len:]))
                updated_content = "\n".join(parts) + "\n"
                matched = True

        if not matched:
            return {
                "success": False,
                "message": "The expected old code was not found in target file. No changes made.",
                "diff": "",
                "file": str(target_file),
                "old_text": old_text,
                "new_text": new_text,
            }

    # Create backup before writing changes
    backup_file = target_file.with_suffix(target_file.suffix + ".backup")
    if not backup_file.exists():
        shutil.copy2(target_file, backup_file)

    target_file.write_text(updated_content, encoding="utf-8")

    # Generate unified diff
    rel_path = str(target_file.relative_to(project_path))
    diff_lines = list(difflib.unified_diff(
        content.splitlines(keepends=True),
        updated_content.splitlines(keepends=True),
        fromfile=f"a/{rel_path}",
        tofile=f"b/{rel_path}",
        lineterm=""
    ))
    diff_text = "".join(diff_lines)

    return {
        "success": True,
        "message": "Local fix applied successfully.",
        "file": str(target_file),
        "backup": str(backup_file),
        "diff": diff_text,
        "old_text": old_text,
        "new_text": new_text,
    }


def rollback_fix(project_path, file_path):
    """Restore file from .backup if available."""
    project_path = Path(project_path).resolve()
    target_file = (project_path / file_path).resolve()
    backup_file = target_file.with_suffix(target_file.suffix + ".backup")
    if backup_file.exists():
        shutil.copy2(backup_file, target_file)
        return True
    return False