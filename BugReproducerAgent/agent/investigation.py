def build_investigation_result(
    reproduction_result,
    root_cause_result
):
    if reproduction_result["return_code"] == 0:
        return {
            "status": "NOT_REPRODUCED",
            "confidence": "HIGH",
            "summary": (
                "The reproduction test passed. "
                "The reported bug was not reproduced "
                "in the current project version."
            ),
            "next_action": (
                "Do not modify the source code yet. "
                "Record the result and investigate the "
                "historical project state."
            )
        }

    if root_cause_result["status"] == "POSSIBLE_ROOT_CAUSE":
        return {
            "status": "REPRODUCED",
            "confidence": "HIGH",
            "summary": (
                "The reproduction test failed and "
                "the source contains a possible cause."
            ),
            "next_action": (
                "Inspect the relevant source code and "
                "prepare a local fix."
            )
        }

    return {
        "status": "UNKNOWN",
        "confidence": "LOW",
        "summary": (
            "The available evidence is not enough "
            "to determine the bug status."
        ),
        "next_action": (
            "Collect more evidence from the project "
            "history and reproduction environment."
        )
    }