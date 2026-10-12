def can_apply_fix(investigation):
    status = investigation["status"]

    if status == "REPRODUCED":
        return {
            "allowed": True,
            "message": (
                "Bug was reproduced. "
                "Local fix can be attempted."
            )
        }

    return {
        "allowed": False,
        "message": (
            "Bug was not reproduced. "
            "Source code must not be modified."
        )
    }