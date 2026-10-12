import re


def extract_version(text):
    patterns = [
        r"v\d+\.\d+\.\d+",
        r"\b\d+\.\d+\.\d+\b",
    ]

    for pattern in patterns:
        match = re.search(
            pattern,
            text,
            re.IGNORECASE
        )

        if match:
            return match.group(0)

    return "Not mentioned"


def extract_header(text):
    for line in text.splitlines():

        line = line.strip()

        if ":" in line and line.lower().startswith(
            (
                "x-",
                "authorization",
                "user-agent",
            )
        ):
            return line

    return "Not mentioned"


def extract_reproduction_steps(text):
    steps = []

    in_steps_section = False

    for line in text.splitlines():

        stripped = line.strip()

        # -----------------------------------------
        # Start of reproduction section
        # -----------------------------------------
        if re.search(
            r"(steps to reproduce|how to reproduce|reproduction)",
            stripped,
            re.IGNORECASE
        ):
            in_steps_section = True
            continue

        # -----------------------------------------
        # Stop when a new section starts
        # -----------------------------------------
        if (
            in_steps_section
            and stripped.startswith("##")
        ):
            break

        # -----------------------------------------
        # Numbered step
        # -----------------------------------------
        match = re.match(
            r"^\s*(\d+)[\.\)]\s+(.*)",
            stripped
        )

        if match:

            step_text = match.group(2).strip()

            if step_text:
                steps.append(step_text)

    return steps


def extract_expected_behavior(text):
    match = re.search(
        r"expected behavior\s*(.*?)(?=\n##|\n\*\*|\Z)",
        text,
        re.IGNORECASE | re.DOTALL
    )

    if match:
        value = match.group(1).strip()

        if value:
            return value

    return "Not mentioned"


def extract_environment(text):
    environment = {}

    in_environment = False

    for line in text.splitlines():

        stripped = line.strip()

        if re.search(
            r"environment",
            stripped,
            re.IGNORECASE
        ):
            in_environment = True
            continue

        if (
            in_environment
            and stripped.startswith("##")
        ):
            break

        match = re.match(
            r"^-\s*([^:]+):\s*(.+)$",
            stripped
        )

        if match:

            key = match.group(1).strip()
            value = match.group(2).strip()

            environment[key] = value

    return environment


def analyze_bug(issue):

    title = issue["title"]
    body = issue["body"]

    full_text = (
        f"{title}\n{body}"
    )

    bug_report = {
        "title": title,
        "repository": issue["repository"],
        "issue_number": issue["number"],
        "url": issue["url"],
        "body": body,

        "version": extract_version(
            full_text
        ),

        "header_input": extract_header(
            full_text
        ),

        "description": body,

        "reproduction_steps": (
            extract_reproduction_steps(
                body
            )
        ),

        "expected_behavior": (
            extract_expected_behavior(
                body
            )
        ),

        "environment": (
            extract_environment(
                body
            )
        ),
    }

    return bug_report