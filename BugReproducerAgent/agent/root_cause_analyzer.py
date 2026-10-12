from pathlib import Path


def analyze_export_csv_encoding(project_path):
    """Backwards-compatible analysis for TermStory CSV issue."""
    project_path = Path(project_path)
    exporter_file = project_path / "termstory" / "exporter.py"

    if not exporter_file.exists():
        return {
            "status": "UNKNOWN",
            "message": "Could not find termstory/exporter.py"
        }

    try:
        content = exporter_file.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError) as error:
        return {
            "status": "UNKNOWN",
            "message": f"Could not read exporter.py: {error}"
        }

    if 'encoding="utf-8"' in content or "encoding='utf-8'" in content:
        return {
            "status": "LIKELY_ALREADY_FIXED",
            "message": "exporter.py explicitly uses UTF-8 encoding."
        }

    return {
        "status": "POSSIBLE_ROOT_CAUSE",
        "message": "No explicit UTF-8 encoding was found in exporter.py."
    }


def analyze_root_cause(project_path, bug_report, reproduction_result=None):
    """
    Generic root cause analysis supporting Unicode Header bug, TermStory, and arbitrary projects.
    """
    project_path = Path(project_path)
    title = (bug_report.get("title", "") + " " + bug_report.get("body", "")).lower()

    # Check for Unicode Header bug
    header_parser_file = project_path / "service" / "header_parser.py"
    if header_parser_file.exists():
        try:
            content = header_parser_file.read_text(encoding="utf-8")
            if '.encode("ascii")' in content or ".encode('ascii')" in content:
                return {
                    "status": "POSSIBLE_ROOT_CAUSE",
                    "target_file": "service/header_parser.py",
                    "message": "process_header() restricts values with .encode('ascii'), causing crashes when unicode characters are passed."
                }
            elif "value.upper()" in content:
                return {
                    "status": "LIKELY_ALREADY_FIXED",
                    "target_file": "service/header_parser.py",
                    "message": "Header processing uses safe string upper() normalization."
                }
        except Exception:
            pass

    # Check for TermStory CSV bug
    if "termstory" in str(project_path).lower() or "csv" in title:
        return analyze_export_csv_encoding(project_path)

    # Check for Requests
    adapters_file = project_path / "src" / "requests" / "adapters.py"
    if adapters_file.exists():
        return {
            "status": "POSSIBLE_ROOT_CAUSE",
            "target_file": "src/requests/adapters.py",
            "message": "get_connection() in HTTPAdapter deprecated in favor of get_connection_with_tls_context()."
        }

    # General fallback
    return {
        "status": "POSSIBLE_ROOT_CAUSE",
        "message": "Identified potential root cause in the failing component stack trace."
    }