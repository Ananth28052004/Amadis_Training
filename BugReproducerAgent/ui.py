import os
import sys
import re
import subprocess
from pathlib import Path
import streamlit as st
from dotenv import load_dotenv

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

load_dotenv()

from agent.orchestrator import BugReproducerPipeline
from agent.llm_client import get_stored_api_key, set_stored_api_key
from github.github_client import DEMO_ISSUES

st.set_page_config(
    page_title="Bug Reproducer Agent",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

STEP_DEFS = [
    ("📡", "Fetch Issue", "GitHub API"),
    ("⚙️", "Setup & Deps", "Install packages"),
    ("🧠", "LLM Plan", "What to do?"),
    ("📝", "Write Test", "Minimal repro test"),
    ("💥", "Run & Crash", "Confirm bug"),
    ("🔍", "LLM Fix", "Root cause"),
    ("✏️", "Patch Code", "Apply fix"),
    ("✅", "Verify Fix", "Test passes"),
    ("📊", "LLM Report", "Write report"),
    ("👁️", "Review", "Human review"),
]

STEP_MSGS = [
    "Fetching bug report & cloning repository…",
    "Detecting language & installing dependencies…",
    "Asking LLM: What should I do to reproduce this?…",
    "Writing minimal reproduction test file…",
    "Running test — confirming crash…",
    "Asking LLM: What is the fix?…",
    "Applying code patch with backup…",
    "Re-running test to verify fix works…",
    "Asking LLM to write the full report…",
    "Formatting final report for human review…",
]

_defaults = dict(
    pipeline=None,
    logs=[],
    step_states=["wait"] * 10,
    step_progress=0,
    results={},
    running=False,
    error_msg="",
    issue_url_input="",
    lang_detected=""
)
for k, v in _defaults.items():
    if k not in st.session_state:
        st.session_state[k] = v

def log_cb(sn, msg):
    st.session_state.logs.append(f"[{sn}] {msg}")

def open_vscode(path):
    try:
        subprocess.Popen(["code", str(path)], shell=True)
        return True
    except Exception:
        return False

def cleanup_ws(pp):
    removed = []
    for pat in ["test_bug_*", "*.backup"]:
        for f in Path(pp).rglob(pat):
            try:
                f.unlink()
                removed.append(f.name)
            except Exception:
                pass
    return removed

def reset_all():
    for k, v in _defaults.items():
        st.session_state[k] = v
    hp = Path("workspace/unicode_header_service/service/header_parser.py")
    if hp.exists():
        hp.write_text(
            'def process_header(name:str,value:str)->dict:\n'
            '    key=name.strip().lower()\n'
            '    encoded=value.encode("ascii")\n'
            '    return {key:encoded.decode("ascii").upper()}\n',
            encoding="utf-8"
        )
    for ws in ["workspace/unicode_header_service", "workspace/Termstory", "workspace/requests", "workspace/pydantic"]:
        p = Path(ws)
        if p.exists():
            for f in p.rglob("test_bug_*"):
                try:
                    f.unlink()
                except Exception:
                    pass
            for f in p.rglob("*.backup"):
                try:
                    f.unlink()
                except Exception:
                    pass

# ── SIDEBAR (PURE PYTHON STREAMLIT) ──
with st.sidebar:
    st.title("🤖 Bug Reproducer")
    st.caption("Autonomous Agent · 10 Steps")
    st.divider()

    st.subheader("🧠 LLM Engine")
    prov_opts = {
        "💻 Qwen2.5-Coder 7B (Local Ollama)": ("ollama", "qwen2.5-coder:7b"),
        "⚡ Groq Ultra-Fast (free)": ("groq", "qwen/qwen3.8-27b"),
        "🔮 Google Gemini Flash (free)": ("gemini", "gemini-flash-latest"),
    }
    prov_label = st.selectbox("Engine:", list(prov_opts.keys()), index=0, label_visibility="collapsed")
    provider, default_model = prov_opts[prov_label]
    if provider == "ollama":
        api_key = ""
        st.success("🟢 **Ollama Ready** (`qwen2.5-coder:7b`)\n\n• 100% Local & Private\n• Unlimited runs · No rate limits\n• Specialized code intelligence")
    else:
        stored = get_stored_api_key(provider)
        api_key = st.text_input("API Key:", value=stored, type="password", placeholder="Paste your free API key…")
        if api_key:
            set_stored_api_key(api_key, provider)
        with st.expander("🔑 Get a FREE API Key"):
            links = {
                "gemini": "[Google AI Studio](https://aistudio.google.com/app/apikey) — 1,500 req/day free",
                "groq": "[Groq Console](https://console.groq.com/keys) — Free API Keys",
            }
            st.markdown(links.get(provider, ""))

    st.divider()
    st.subheader("🐙 GitHub Token (optional)")
    gh_token = st.text_input("Token:", value=os.getenv("GITHUB_TOKEN", ""), type="password", placeholder="ghp_...", label_visibility="collapsed")
    st.caption("Without token: 60 req/hr · With token: 5,000 req/hr")

    st.divider()
    st.subheader("⚙️ Supported Languages")
    st.write("🐍 Python · 🟨 Node.js · ☕ Java · 🐹 Go · 🦀 Rust · 💠 .NET")

    st.divider()
    st.markdown("**🛡️ Safe Sandbox**\n- ✅ Clones into `workspace/` only\n- ✅ Auto-backup before any patch\n- ✅ No upstream git push ever\n- ✅ Cleanup removes temp files")

# ── MAIN TITLE & HEADER (PURE PYTHON) ──
st.title("🤖 Bug Reproducer Agent")
st.caption(
    "Autonomous Pair-Programming Agent: Reads the GitHub issue → clones the repo → "
    "installs dependencies → writes a failing test → isolates root cause → applies fix → "
    "verifies with tests → presents Old vs. New code report."
)
st.divider()

# ── URL INPUT ──
st.subheader("🔗 GitHub Issue URL")
url_col, btn_col1, btn_col2 = st.columns([5, 1.2, 1])
with url_col:
    raw_url = st.text_input(
        "GitHub Issue URL:",
        value=st.session_state.issue_url_input,
        placeholder="https://github.com/owner/repo/issues/123",
        label_visibility="collapsed",
        key="url_input_field"
    )
    st.session_state.issue_url_input = raw_url
with btn_col1:
    run_btn = st.button("🚀 Run Agent", type="primary", use_container_width=True, disabled=st.session_state.running)
with btn_col2:
    reset_btn = st.button("🔄 Reset", use_container_width=True)
if reset_btn:
    reset_all()
    st.rerun()

active_url = st.session_state.issue_url_input.strip()

# ── 10-STEP AUTONOMOUS PIPELINE (ONE-LINE PURE PYTHON UI) ──
st.divider()
st.subheader("📋 10-Step Autonomous Execution Pipeline")

def render_pipeline_ui(running=False, current_msg=""):
    pct = min(100, max(0, st.session_state.step_progress * 10))
    st.progress(pct / 100, text=f"Progress: Step {st.session_state.step_progress}/10 ({pct}%)")

    # 10 Steps in 1 Single Horizontal Row using native Streamlit columns
    step_cols = st.columns(10)
    for i in range(10):
        icon, label, _ = STEP_DEFS[i]
        st_val = st.session_state.step_states[i] if i < len(st.session_state.step_states) else "wait"
        with step_cols[i]:
            if st_val == "done":
                st.success(f"**0{i+1}** {icon}\n\n**{label}**")
            elif st_val == "active":
                st.info(f"**0{i+1}** {icon}\n\n**{label}**")
            elif st_val == "error":
                st.error(f"**0{i+1}** {icon}\n\n**{label}**")
            else:
                st.caption(f"**0{i+1}** {icon}\n\n{label}")

    if running:
        st.info(f"🔄 **Executing Step {st.session_state.step_progress + 1}/10:** {current_msg}")
    elif st.session_state.error_msg:
        st.error(f"❌ **Execution Halted:** {st.session_state.error_msg}")
    elif st.session_state.step_progress == 10:
        st.success("🎉 **Pipeline Complete:** 10/10 steps verified. Bug reproduced and fixed!")

pipeline_placeholder = st.empty()
with pipeline_placeholder.container():
    render_pipeline_ui(
        running=st.session_state.running,
        current_msg=STEP_MSGS[min(st.session_state.step_progress, 9)] if st.session_state.running else ""
    )

def make_pipeline():
    return BugReproducerPipeline(
        provider=provider,
        api_key=api_key,
        model=default_model,
        github_token=gh_token or os.getenv("GITHUB_TOKEN", ""),
        log_callback=log_cb
    )

def exec_step(pipeline, i):
    fns = [
        lambda: pipeline.step1_fetch_and_clone(active_url),
        lambda: pipeline.step2_setup_and_install(),
        lambda: pipeline.step3_ask_llm_plan(),
        lambda: pipeline.step4_write_reproduction_test(),
        lambda: pipeline.step5_run_reproduction_test(),
        lambda: pipeline.step6_ask_llm_fix(),
        lambda: pipeline.step7_apply_fix(),
        lambda: pipeline.step8_verify_fix(),
        lambda: pipeline.step9_ask_llm_report(),
        lambda: pipeline.step10_present_report(),
    ]
    fns[i]()

PLACEHOLDER_URLS = {
    "https://github.com/owner/repo/issues/123",
    "https://github.com/owner/repo/issues/",
    "owner/repo",
}

def clean_and_extract_url(raw: str) -> str:
    s = raw.strip().strip("'\"`")
    if s in DEMO_ISSUES:
        return s
    m = re.search(r'https?://(?:www\.)?github\.com/[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+/(?:issues|pull)/\d+', s)
    if m:
        return m.group(0)
    m_issues = re.search(r'https?://(?:www\.)?github\.com/[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+(?:/issues)?/?', s)
    if m_issues:
        return m_issues.group(0).rstrip("/")
    m_short = re.search(r'([A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+)(?:#|/issues/)(\d+)', s)
    if m_short:
        return f"https://github.com/{m_short.group(1)}/issues/{m_short.group(2)}"
    return s

def validate_url(url: str):
    cleaned = clean_and_extract_url(url)
    if not cleaned:
        return False, "empty", cleaned
    if cleaned in DEMO_ISSUES:
        return True, "", cleaned
    if "owner/repo" in cleaned.lower() or "example" in cleaned.lower() or cleaned in PLACEHOLDER_URLS:
        return False, "placeholder", cleaned
    if re.search(r'https?://(?:www\.)?github\.com/[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+', cleaned):
        return True, "", cleaned
    return False, "format", cleaned

# ── PIPELINE EXECUTION TRIGGER ──
if run_btn:
    is_valid, url_err, cleaned_url = validate_url(active_url)
    if not active_url or url_err == "empty":
        st.error("⚠️ Please enter a GitHub issue URL above.")
    elif url_err == "placeholder":
        st.warning(
            "⚠️ That looks like an example placeholder URL. "
            "Please paste a real GitHub issue link like: `https://github.com/psf/requests/issues/4800` "
            "or `https://github.com/encode/httpx/issues/2855`."
        )
    elif url_err == "format":
        st.warning(
            "⚠️ URL format not recognized. Please enter a full GitHub issue URL:\n\n"
            "`https://github.com/owner/repo/issues/123`"
        )
    else:
        st.session_state.issue_url_input = cleaned_url
        active_url = cleaned_url
        pipeline = make_pipeline()
        st.session_state.update(
            pipeline=pipeline,
            logs=[],
            step_states=["wait"] * 10,
            step_progress=0,
            results={},
            error_msg="",
            running=True
        )
        try:
            for i in range(10):
                st.session_state.step_states[i] = "active"
                with pipeline_placeholder.container():
                    render_pipeline_ui(running=True, current_msg=STEP_MSGS[i])
                
                exec_step(pipeline, i)
                
                st.session_state.step_states[i] = "done"
                st.session_state.step_progress = i + 1
                with pipeline_placeholder.container():
                    render_pipeline_ui(running=True, current_msg=f"Step {i+1} completed: {STEP_DEFS[i][1]}")

                if i == 1 and pipeline.project_info:
                    st.session_state.lang_detected = pipeline.project_info.get("type", "")

            st.session_state.results = {
                k: getattr(pipeline, k, None)
                for k in [
                    "bug_report", "issue", "version_info", "project_info", "project_path",
                    "reproduction_plan", "reproduction_result", "reproduction_analysis",
                    "root_cause", "fix_proposal", "fix_result", "verification", "regression",
                    "report_result"
                ]
            }
            st.session_state.running = False
            with pipeline_placeholder.container():
                render_pipeline_ui(running=False)
            st.rerun()

        except Exception as exc:
            idx = st.session_state.step_progress
            if idx < 10:
                st.session_state.step_states[idx] = "error"
            st.session_state.error_msg = str(exc)
            st.session_state.running = False
            with pipeline_placeholder.container():
                render_pipeline_ui(running=False)
            st.error(f"❌ Step {idx+1} failed — {exc}")

# ── RESULTS & BUG RESOLUTION REPORT (PURE PYTHON STREAMLIT) ──
r = st.session_state.results
pipeline = st.session_state.pipeline

if st.session_state.step_progress > 0 and pipeline:
    st.divider()
    st.subheader("🎯 Bug Resolution Report")

    repro_res = r.get("reproduction_result") or {}
    verif_res = r.get("verification") or {}
    fix_res = r.get("fix_result") or {}
    fix_prop = r.get("fix_proposal") or {}
    proj_info = r.get("project_info") or {}
    proj_path = r.get("project_path")
    report_res = r.get("report_result") or {}
    bug_repr = not repro_res.get("success", True) if repro_res else None
    fix_ok = fix_res.get("success", False)
    verif_ok = verif_res.get("verified", False)
    lang = st.session_state.lang_detected or proj_info.get("type", "—")

    # Native Streamlit Metrics Row
    m1, m2, m3, m4 = st.columns(4)
    m1.metric("Status", "✅ Fixed & Verified" if verif_ok else ("💥 Bug Reproduced" if bug_repr else "In Progress"))
    target_file = fix_prop.get("file") or "source file"
    m2.metric("Target File", Path(target_file).name, target_file)
    m3.metric("Language", lang)
    m4.metric("Verification", "100% Passed" if verif_ok else ("Failed" if verif_ok is False else "Pending"))

    # Concise Diagnosis Callout
    old_raw = (fix_prop.get("old_text") or fix_res.get("old_text") or "").strip()
    new_raw = (fix_prop.get("new_text") or fix_res.get("new_text") or "").strip()
    root_cause_msg = (
        fix_prop.get("root_cause")
        or (r.get("root_cause") or {}).get("message")
        or (r.get("bug_report") or {}).get("title")
        or "Identified failure in target component."
    )
    advice_msg = fix_prop.get("advice") or fix_prop.get("explanation") or "Applied targeted source fix to resolve the crash."
    issue_num = (r.get("bug_report") or {}).get("issue_number") or "report"

    st.info(f"🔍 **Problem Diagnosis:** {root_cause_msg}\n\n💡 **Applied Fix:** {advice_msg}")

    # Action Buttons (Pure Python)
    if proj_path:
        btn_col1, btn_col2, btn_col3 = st.columns([1, 1, 1.5])
        with btn_col1:
            if st.button("🖥️ Open in VS Code", use_container_width=True, key="res_open_vscode"):
                if open_vscode(proj_path):
                    st.success(f"Opened `{Path(proj_path).name}` in VS Code!")
                else:
                    st.warning("Could not open VS Code — ensure `code` is in PATH.")
        with btn_col2:
            if st.button("🗑️ Delete Temp Files", use_container_width=True, key="res_clean_temp"):
                rm = cleanup_ws(proj_path)
                if rm:
                    st.success(f"Removed: {', '.join(rm)}")
                else:
                    st.info("Nothing to clean up.")
        with btn_col3:
            md_content = (report_res or {}).get("markdown", "")
            if md_content:
                st.download_button(
                    "📥 Download Fix Summary",
                    data=md_content,
                    file_name=f"fix_summary_{issue_num}.md",
                    mime="text/markdown",
                    use_container_width=True
                )

    st.divider()
    st.subheader("⚡ Code Comparison — Exact Lines Changed")
    if target_file and target_file != "source file":
        st.caption(f"📁 **Modified Target File:** `{target_file}`")

    # Native Side-by-Side Code Boxes
    if old_raw or new_raw:
        col_old, col_new = st.columns(2)
        with col_old:
            st.error("🔴 **OLD (BUGGY) CODE (BEFORE)**")
            st.code(old_raw, language="python")

        with col_new:
            st.success("🟢 **NEW (FIXED) CODE (AFTER)**")
            st.code(new_raw, language="python")
    else:
        st.warning(
            "⚠️ **No Code Changes Proposed:** The reproduction test did not crash or trigger the bug condition. "
            "A test must fail first to prove and isolate the bug before applying a fix."
        )

    # Prominent Unified Git Diff Box
    diff_text = fix_res.get("diff", "")
    if diff_text:
        with st.expander("📄 **Unified Git Diff (+ / -)**", expanded=True):
            st.code(diff_text, language="diff")

    # Deleted / Unused Code Callout (Pure Python)
    old_lines = [l.strip() for l in old_raw.splitlines() if l.strip()]
    new_lines = [l.strip() for l in new_raw.splitlines() if l.strip()]
    removed = [l for l in old_lines if l not in new_lines]
    if removed:
        with st.expander("🗑️ **Deleted / Replaced Source Lines**", expanded=False):
            st.code("\n".join(f"# Removed: {l}" for l in removed), language="python")
    elif old_raw and new_raw:
        st.success("✨ **Code cleanly replaced** — no dead or unused lines left behind.")

    if verif_ok:
        st.success("🎉 **Verification Confirmed:** All reproduction tests passed cleanly after applying the patch. Zero errors.")

    # Collapsible Advanced Technical Diagnostics
    with st.expander("🛠️ Advanced Technical Diagnostics & Full Terminal Logs", expanded=False):
        dtabs = st.tabs([
            "📄 Unified Git Diff",
            "💥 Test Crash Output",
            "✅ Verification Output",
            "📜 Agent Log Stream",
            "📋 Markdown Report"
        ])
        with dtabs[0]:
            diff_text = fix_res.get("diff", "")
            if diff_text:
                st.code(diff_text, language="diff")
            else:
                st.caption("No git diff recorded.")
        with dtabs[1]:
            crash = (repro_res.get("output", "") + "\n" + repro_res.get("error", "")).strip()
            if crash:
                st.code(crash, language="text")
            else:
                st.caption("No crash output recorded.")
        with dtabs[2]:
            vout = verif_res.get("output", "").strip()
            if vout:
                st.code(vout, language="text")
            else:
                st.caption("No verification output recorded.")
        with dtabs[3]:
            if st.session_state.logs:
                st.code("\n".join(st.session_state.logs), language="text")
            else:
                st.caption("No logs recorded.")
        with dtabs[4]:
            md = (report_res or {}).get("markdown", "")
            if md:
                st.markdown(md)
            else:
                st.caption("No report generated yet.")

elif st.session_state.step_progress == 0:
    st.info("🤖 **Ready to reproduce bugs:** Paste a GitHub issue URL above and click **🚀 Run Agent** to begin.")
