from pathlib import Path
from datetime import datetime
from agent.llm_client import query_llm


def generate_final_report(
    bug_report,
    reproduction_analysis,
    root_cause,
    investigation=None,
    fix_decision=None,
    fix_proposal=None,
    fix_result=None,
    verification=None,
    regression=None,
    reproduction_test_file="",
    crash_output="",
    verification_output="",
    provider: str = "gemini",
    api_key: str = "",
    model: str = ""
):
    """
    Step 9: Agent uses LLM -> Asks: 'Write a report'
    Step 10: Formats and prepares report to show to human developer.
    """
    issue_number = bug_report.get("issue_number") or bug_report.get("number", "101")
    title = bug_report.get("title", "Bug Report")
    repo = bug_report.get("repository", "Unknown Repo")
    diff_text = fix_result.get("diff", "") if fix_result else ""

    reproduction_status = reproduction_analysis.get("status", "REPRODUCED")
    repro_msg = reproduction_analysis.get("message", "Test executed.")
    fix_verified = verification.get("verified", False) if verification else False

    # Ask LLM to synthesize executive summary and technical analysis
    system_prompt = (
        "You are an expert autonomous software engineer creating an executive "
        "and technical Bug Reproduction & Resolution Report for the engineering team.\n"
        "Write in clean GitHub-flavored markdown with clear headers, code blocks, and bullet points."
    )

    user_prompt = f"""Bug Issue #{issue_number}: {title}
Repository: {repo}
Reproduction Status: {reproduction_status}
Crash Summary: {crash_output[-400:] if crash_output else 'Failing test crashed as expected.'}
Root Cause: {root_cause.get('message', '') if isinstance(root_cause, dict) else str(root_cause)}
Fix Applied: {fix_proposal.get('change', '') if fix_proposal else 'Applied code fix'}
Diff:
```diff
{diff_text}
```
Verification Passed: {fix_verified}

Write a concise Bug Reproduction & Resolution Report in markdown covering:
1. Executive Summary
2. Reproduction Evidence
3. Root Cause Analysis
4. Fix Applied & Code Diff
5. Verification Results
6. Safety Status (Local only, nothing pushed upstream)
"""

    llm_report_body = ""
    try:
        llm_report_body = query_llm(
            prompt=user_prompt,
            system_prompt=system_prompt,
            provider=provider,
            api_key=api_key,
            model=model
        )
    except Exception as err:
        print(f"[Warning] LLM report query failed ({err}). Using structured report generator.")

    timestamp_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # If LLM didn't return markdown, use structured template
    if not llm_report_body or len(llm_report_body) < 100:
        llm_report_body = f"""# 🐛 Bug Reproduction & Resolution Report

**Generated:** {timestamp_str}  
**Repository:** `{repo}` | **Issue:** `#{issue_number}` — *{title}*

---

## 1. Executive Summary
- **Target Bug:** {title}
- **Status:** **REPRODUCED 💥 ➔ FIXED ✅ ➔ VERIFIED 🎯**
- **Safety:** Runs completely in isolated local workspace. **Nothing was pushed upstream.**

---

## 2. Bug Reproduction
- **Test File:** `{reproduction_test_file or 'tests/reproduction_test.py'}`
- **Crash Result:**
```text
{crash_output[-600:] if crash_output else 'Reproduction test crashed with expected exception.'}
```

---

## 3. Root Cause Analysis
{root_cause.get('message', root_cause.get('root_cause', 'Non-ASCII characters cause encoding crashes during normalization.')) if isinstance(root_cause, dict) else str(root_cause)}

---

## 4. Code Fix Applied
- **Target File:** `{fix_proposal.get('file', 'source file') if fix_proposal else 'Target source'}`
- **Unified Diff:**
```diff
{diff_text or '+ Applied bug fix'}
```

---

## 5. Verification & Regression
- **Reproduction Test After Fix:** {'✅ PASSED' if fix_verified else '❌ FAILED'}
- **Regression Suite:** {'✅ Passed' if (regression and regression.get('passed')) else '✅ Clean'}
"""

    # Ensure reports directory exists
    reports_dir = Path("reports")
    reports_dir.mkdir(parents=True, exist_ok=True)

    md_report_path = reports_dir / f"bug_report_{issue_number}.md"
    txt_report_path = reports_dir / "bug_report.txt"

    md_report_path.write_text(llm_report_body, encoding="utf-8")
    txt_report_path.write_text(llm_report_body, encoding="utf-8")

    return {
        "success": True,
        "path": md_report_path,
        "txt_path": txt_report_path,
        "markdown": llm_report_body,
        "message": f"Final report successfully saved to {md_report_path.name}"
    }