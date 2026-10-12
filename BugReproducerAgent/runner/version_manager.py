import subprocess
from pathlib import Path


def run_git_command(project_path, arguments):
    project_path = Path(project_path)

    result = subprocess.run(
        ["git", *arguments],
        cwd=project_path,
        capture_output=True,
        text=True,
        timeout=120
    )

    if result.returncode != 0:
        raise RuntimeError(
            result.stderr.strip()
            or "Git command failed."
        )

    return result.stdout.strip()


def get_current_branch(project_path):
    return run_git_command(
        project_path,
        ["branch", "--show-current"]
    )


def get_current_commit(project_path):
    return run_git_command(
        project_path,
        ["rev-parse", "HEAD"]
    )


def checkout_version(project_path, version):
    project_path = Path(project_path)

    # First fetch tags and remote information.
    run_git_command(
        project_path,
        ["fetch", "--all", "--tags"]
    )

    # Try the requested version.
    try:
        run_git_command(
            project_path,
            ["checkout", version]
        )

    except RuntimeError as error:
        raise RuntimeError(
            f"Could not checkout version '{version}'. "
            f"Make sure the version exists as a "
            f"branch, tag, or commit.\n{error}"
        ) from error

    return {
        "version": version,
        "branch": get_current_branch(project_path),
        "commit": get_current_commit(project_path)
    }


def prepare_project_version(
    project_path,
    reported_version
):
    # Check if project is a git repository
    if not (project_path / ".git").exists():
        return {
            "selected_by": "local_directory",
            "reported_version": reported_version,
            "version": "Local checkout",
            "branch": "main",
            "commit": "local"
        }

    # -----------------------------------------
    # If issue contains a specific version
    # -----------------------------------------
    if reported_version != "Not mentioned":
        try:
            result = checkout_version(
                project_path,
                reported_version
            )

            return {
                "selected_by": "issue_version",
                "reported_version": reported_version,
                **result
            }
        except Exception:
            pass

    # -----------------------------------------
    # No version mentioned in the issue
    # -----------------------------------------
    try:
        branch = get_current_branch(project_path)
        commit = get_current_commit(project_path)
    except Exception:
        branch = "main"
        commit = "head"

    return {
        "selected_by": "default_checkout",
        "reported_version": "Not mentioned",
        "version": "Current checkout",
        "branch": branch,
        "commit": commit
    }