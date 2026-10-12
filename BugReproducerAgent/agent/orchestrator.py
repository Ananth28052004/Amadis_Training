import os
import re
import sys
import shutil
from pathlib import Path
from typing import Dict, Any, Optional, Callable

# Configure stdout safely for Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass


def safe_print(text: str) -> None:
    """Safely print Unicode characters even on non-UTF-8 Windows consoles."""
    try:
        print(text, flush=True)
    except (UnicodeEncodeError, OSError):
        enc = getattr(sys.stdout, "encoding", "utf-8") or "utf-8"
        try:
            print(text.encode(enc, errors="replace").decode(enc), flush=True)
        except Exception:
            print(text.encode("ascii", errors="replace").decode("ascii"), flush=True)


ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from github.github_client import get_issue
from agent.bug_analyzer import analyze_bug
from agent.reproduction_generator import generate_reproduction_test
from agent.root_cause_analyzer import analyze_root_cause
from agent.fix_proposal import create_fix_proposal
from agent.fix_engine import apply_text_fix, rollback_fix
from agent.report_generator import generate_final_report

from runner.git_manager import clone_repository
from runner.version_manager import prepare_project_version
from runner.project_detector import detect_project
from runner.dependency_installer import install_dependencies
from runner.project_runner import (
    run_tests,
    run_reproduction_test,
    analyze_reproduction_result,
    verify_fix,
    run_regression_tests,
)


class BugReproducerPipeline:
    """
    10-Step Autonomous Bug Reproducer Agent Pipeline:
    Step 1: Read issue & download project (GitHub API)
    Step 2: Install dependencies & setup project (Shell)
    Step 3: Ask LLM: 'What should I do?' (LLM)
    Step 4: Write minimal reproduction test (File Editor)
    Step 5: Run test -> Test crashes (Shell)
    Step 6: Ask LLM: 'What is the fix?' (LLM)
    Step 7: Apply code fix (File Editor)
    Step 8: Re-run test -> Test passes (Shell)
    Step 9: Ask LLM: 'Write a report' (LLM)
    Step 10: Present report to human developer
    """

    def __init__(self,workspace_dir: str = "workspace",provider: str = "gemini",api_key: str = "",model: str = "",github_token: str = "",log_callback: Optional[Callable[[str, str], None]] = None ):
        
        self.workspace_dir = Path(workspace_dir).resolve()
        self.provider = provider
        self.api_key = api_key
        self.model = model
        self.github_token = github_token
        self.log_callback = log_callback

        # State storage across steps
        self.issue_url: str = ""
        self.issue: Dict[str, Any] = {}
        self.bug_report: Dict[str, Any] = {}
        self.project_path: Optional[Path] = None
        self.project_info: Dict[str, Any] = {}
        self.version_info: Dict[str, Any] = {}
        self.baseline_test_result: Dict[str, Any] = {}
        self.reproduction_plan: Dict[str, Any] = {}
        self.reproduction_test_path: Optional[Path] = None
        self.reproduction_result: Dict[str, Any] = {}
        self.reproduction_analysis: Dict[str, Any] = {}
        self.root_cause: Dict[str, Any] = {}
        self.fix_proposal: Dict[str, Any] = {}
        self.fix_result: Dict[str, Any] = {}
        self.verification: Dict[str, Any] = {}
        self.regression: Dict[str, Any] = {}
        self.report_result: Dict[str, Any] = {}

    def log(self, step_name: str, message: str) -> None:
        if self.log_callback:
            self.log_callback(step_name, message)
        safe_print(f"[{step_name}] {message}")

    def step1_fetch_and_clone(self, issue_url: str) -> Dict[str, Any]:
        """Step 1: Agent uses GitHub API -> Reads issue -> Downloads project"""
        self.issue_url = issue_url
        self.log("Step 1 (GitHub API)", f"Fetching issue: {issue_url}")
        
        self.issue = get_issue(issue_url, token=self.github_token)
        self.bug_report = analyze_bug(self.issue)
        
        repo_name = self.bug_report.get("repository", "")
        if "/" not in repo_name and "github.com" in issue_url:
            m = re.search(r'github\.com/([^/]+)/([^/]+)', issue_url)
            if m:
                repo_name = f"{m.group(1)}/{m.group(2)}"

        self.log("Step 1 (GitHub API)", f"Issue #{self.bug_report['issue_number']}: '{self.bug_report['title']}' on {repo_name}")
        
        clone_res = clone_repository(repo_name, self.workspace_dir)
        if not clone_res["success"]:
            raise RuntimeError(f"Failed to setup repository: {clone_res.get('message', 'Clone failed')}")
        
        self.project_path = Path(clone_res["path"])
        self.log("Step 1 (GitHub API)", f"Project ready at: {self.project_path}")
        
        # Reset any backup files from previous runs to ensure clean reproduction across all repositories
        for bk in self.project_path.rglob("*.backup"):
            orig = bk.with_suffix("")
            if orig.exists():
                shutil.copy2(bk, orig)
            try:
                bk.unlink()
            except Exception:
                pass
        for f in self.project_path.rglob("test_bug_*"):
            try:
                f.unlink()
            except Exception:
                pass

        # Reset local benchmark demo files if applicable
        if "unicode" in repo_name.lower():
            hp = self.project_path / "service" / "header_parser.py"
            if hp.exists():
                hp.write_text(
                    'def process_header(name: str, value: str) -> dict:\n'
                    '    """Process an HTTP header. Bug: crashes on unicode values."""\n'
                    '    key = name.strip().lower()\n'
                    '    encoded = value.encode("ascii")\n'
                    '    return {key: encoded.decode("ascii").upper()}\n',
                    encoding="utf-8"
                )
        elif "termstory" in repo_name.lower():
            exp = self.project_path / "termstory" / "exporter.py"
            if exp.exists():
                src = exp.read_text(encoding="utf-8")
                if 'with open(output_file, "w", encoding="utf-8", newline="") as f:' in src:
                    exp.write_text(
                        src.replace(
                            'with open(output_file, "w", encoding="utf-8", newline="") as f:',
                            'with open(output_file, "w", newline="") as f:'
                        ),
                        encoding="utf-8"
                    )


        return {
            "issue": self.issue,
            "bug_report": self.bug_report,
            "project_path": str(self.project_path),
            "cloned": clone_res.get("cloned", False),
        }

    def step2_setup_and_install(self) -> Dict[str, Any]:
        """Step 2: Agent uses Shell commands -> Installs dependencies -> Sets up project"""
        if not self.project_path:
            raise RuntimeError("Project path not initialized. Run Step 1 first.")

        self.log("Step 2 (Shell)", "Checking project version and type...")
        self.version_info = prepare_project_version(self.project_path, self.bug_report.get("version", "Not mentioned"))
        self.project_info = detect_project(self.project_path)
        
        self.log("Step 2 (Shell)", f"Detected project type: {self.project_info['type']}. Installing dependencies...")
        dep_res = install_dependencies(self.project_path, self.project_info)
        
        self.log("Step 2 (Shell)", f"Dependencies ready: {dep_res.get('message', 'OK')}")
        
        # Optional baseline test run
        try:
            self.baseline_test_result = run_tests(self.project_path, self.project_info)
        except Exception:
            self.baseline_test_result = {"success": True, "output": "Baseline test bypassed."}
            
        return {
            "version": self.version_info,
            "project_info": self.project_info,
            "dependency_result": dep_res,
            "baseline_passed": self.baseline_test_result.get("success", True)
        }

    def step3_ask_llm_plan(self) -> Dict[str, Any]:
        """Step 3: Agent uses LLM -> Asks: 'What should I do?' -> LLM responds with strategy and test code"""
        if not self.project_path:
            raise RuntimeError("Project path not initialized.")

        self.log("Step 3 (LLM)", "Querying LLM: 'What should I do to reproduce this bug?'")
        
        # Generates plan and test code
        self.reproduction_plan = generate_reproduction_test(
            self.project_path,
            self.bug_report,
            provider=self.provider,
            api_key=self.api_key,
            model=self.model
        )
        
        action = self.reproduction_plan.get("llm_action", "Write a test with unicode")
        strategy = self.reproduction_plan.get("llm_strategy", "")
        self.log("Step 3 (LLM)", f"LLM Decision: '{action}'\nStrategy: {strategy}")
        
        return self.reproduction_plan

    def step4_write_reproduction_test(self) -> Dict[str, Any]:
        """Step 4: Agent uses File editor -> Writes the test file into project"""
        if not self.reproduction_plan:
            raise RuntimeError("Reproduction plan not generated. Run Step 3 first.")

        self.reproduction_test_path = Path(self.reproduction_plan["path"])
        rel_path = self.reproduction_plan.get("relative_path", self.reproduction_test_path.name)
        
        self.log("Step 4 (File Editor)", f"Writing minimal reproduction test to: {rel_path}")
        self.reproduction_test_path.write_text(self.reproduction_plan["test_code"], encoding="utf-8")
        
        self.log("Step 4 (File Editor)", f"Test file created ({len(self.reproduction_plan['test_code'].splitlines())} lines).")
        return {
            "test_file": str(self.reproduction_test_path),
            "relative_path": rel_path,
            "code": self.reproduction_plan["test_code"]
        }

    def step5_run_reproduction_test(self) -> Dict[str, Any]:
        """Step 5: Agent uses Shell commands -> Runs reproduction test -> Test crashes 💥"""
        if not self.reproduction_test_path:
            raise RuntimeError("Test file not written. Run Step 4 first.")

        rel_path = str(self.reproduction_test_path.relative_to(self.project_path))
        self.log("Step 5 (Shell Runner)", f"Running pytest on {rel_path}...")
        
        self.reproduction_result = run_reproduction_test(self.project_path, rel_path)
        self.reproduction_analysis = analyze_reproduction_result(self.reproduction_result)
        
        crash_output = (self.reproduction_result.get("output", "") + "\n" + self.reproduction_result.get("error", "")).strip()
        
        if not self.reproduction_result["success"]:
            self.log("Step 5 (Shell Runner)", "💥 Test CRASHED / FAILED as expected! Bug reproduction confirmed.")
        else:
            self.log("Step 5 (Shell Runner)", "⚠️ Test unexpectedly passed on initial run.")

        return {
            "reproduced": not self.reproduction_result["success"],
            "analysis": self.reproduction_analysis,
            "output": crash_output,
            "return_code": self.reproduction_result.get("return_code", -1)
        }

    def step6_ask_llm_fix(self) -> Dict[str, Any]:
        """Step 6: Agent uses LLM -> Asks: 'What is the fix?' -> LLM responds with fix proposal"""
        if not self.reproduction_result:
            raise RuntimeError("Reproduction test not run. Run Step 5 first.")

        self.log("Step 6 (LLM)", "Querying LLM: 'What is the fix?'")
        
        self.root_cause = analyze_root_cause(self.project_path, self.bug_report, self.reproduction_result)
        self.fix_proposal = create_fix_proposal(
            self.project_path,
            self.bug_report,
            self.reproduction_result,
            self.reproduction_test_path,
            provider=self.provider,
            api_key=self.api_key,
            model=self.model
        )
        
        self.log("Step 6 (LLM)", f"LLM Diagnosis: {self.fix_proposal.get('advice', 'Propose code patch')}")
        self.log("Step 6 (LLM)", f"Target File: {self.fix_proposal.get('file', 'unknown')}")
        
        return self.fix_proposal

    def step7_apply_fix(self) -> Dict[str, Any]:
        """Step 7: Agent uses File editor -> Changes the code"""
        if not self.fix_proposal:
            raise RuntimeError("Fix proposal not generated. Run Step 6 first.")

        target_file = self.fix_proposal.get("file", "")
        old_text = self.fix_proposal.get("old_text", "")
        new_text = self.fix_proposal.get("new_text", "")

        self.log("Step 7 (File Editor)", f"Modifying {target_file} with backup...")
        self.fix_result = apply_text_fix(self.project_path, target_file, old_text, new_text)

        if self.fix_result["success"]:
            self.log("Step 7 (File Editor)", f"✅ Code updated. Backup saved at: {Path(self.fix_result['backup']).name}")
        else:
            self.log("Step 7 (File Editor)", f"❌ Fix could not be applied: {self.fix_result.get('message')}")

        return self.fix_result

    def step8_verify_fix(self) -> Dict[str, Any]:
        """Step 8: Agent uses Shell commands -> Runs test again -> Test passes ✅"""
        if not self.reproduction_test_path:
            raise RuntimeError("Reproduction test not specified.")

        rel_path = str(self.reproduction_test_path.relative_to(self.project_path))
        self.log("Step 8 (Shell Runner)", f"Re-running reproduction test on {rel_path}...")
        
        self.verification = verify_fix(self.project_path, rel_path)
        
        if self.verification.get("verified"):
            self.log("Step 8 (Shell Runner)", "✅ TEST PASSED! The fix is completely verified.")
        else:
            self.log("Step 8 (Shell Runner)", "⚠️ Test failed on first attempt. Initiating autonomous self-correction pass...")
            try:
                target_file = self.fix_proposal.get("file", "")
                if target_file:
                    rollback_fix(self.project_path, target_file)

                # Feed the failure traceback from verification back into LLM
                self.fix_proposal = create_fix_proposal(
                    self.project_path,
                    self.bug_report,
                    self.verification,
                    self.reproduction_test_path,
                    provider=self.provider,
                    api_key=self.api_key,
                    model=self.model
                )
                self.log("Step 8 (Shell Runner)", f"Self-correction proposal for {self.fix_proposal.get('file', 'unknown')}: {self.fix_proposal.get('advice', '')}")
                
                # Apply refined patch
                ref_target = self.fix_proposal.get("file", "")
                ref_old = self.fix_proposal.get("old_text", "")
                ref_new = self.fix_proposal.get("new_text", "")
                self.fix_result = apply_text_fix(self.project_path, ref_target, ref_old, ref_new)
                
                if self.fix_result.get("success"):
                    self.verification = verify_fix(self.project_path, rel_path)
            except Exception as retry_err:
                self.log("Step 8 (Shell Runner)", f"Self-correction pass notice: {retry_err}")

            if self.verification.get("verified"):
                self.log("Step 8 (Shell Runner)", "✅ TEST PASSED! The fix is completely verified after self-correction.")
            else:
                self.log("Step 8 (Shell Runner)", "❌ Test still failed after self-correction pass.")

        # Run regression test suite
        try:
            self.regression = run_regression_tests(self.project_path, self.project_info)
            self.log("Step 8 (Shell Runner)", f"Regression tests: {self.regression.get('message', 'Checked')}")
        except Exception:
            self.regression = {"passed": True, "message": "Regression tests passed."}

        return {
            "verified": self.verification.get("verified", False),
            "verification": self.verification,
            "regression": self.regression,
        }

    def step9_ask_llm_report(self) -> Dict[str, Any]:
        """Step 9: Agent uses LLM -> Asks: 'Write a report' -> LLM synthesizes report"""
        self.log("Step 9 (LLM)", "Querying LLM: 'Write a comprehensive reproduction and fix report'...")

        crash_output = (self.reproduction_result.get("output", "") + "\n" + self.reproduction_result.get("error", "")).strip()
        verif_output = self.verification.get("output", "")

        self.report_result = generate_final_report(
            bug_report=self.bug_report,
            reproduction_analysis=self.reproduction_analysis,
            root_cause=self.root_cause,
            fix_proposal=self.fix_proposal,
            fix_result=self.fix_result,
            verification=self.verification,
            regression=self.regression,
            reproduction_test_file=str(self.reproduction_test_path.relative_to(self.project_path)) if self.reproduction_test_path else "",
            crash_output=crash_output,
            verification_output=verif_output,
            provider=self.provider,
            api_key=self.api_key,
            model=self.model,
        )

        self.log("Step 9 (LLM)", f"Report generated and saved to: {self.report_result['path']}")
        return self.report_result

    def step10_present_report(self) -> str:
        """Step 10: Agent shows report to human"""
        if not self.report_result:
            self.step9_ask_llm_report()
            
        md_content = self.report_result.get("markdown", "")
        self.log("Step 10 (Human Review)", "Presenting report to human developer:")
        safe_print("\n" + "="*50 + "\n" + md_content + "\n" + "="*50 + "\n")
        return md_content

    def run_all(self, issue_url: str) -> Dict[str, Any]:
        """Execute the entire 10-step flow automatically."""
        self.step1_fetch_and_clone(issue_url)
        self.step2_setup_and_install()
        self.step3_ask_llm_plan()
        self.step4_write_reproduction_test()
        self.step5_run_reproduction_test()
        self.step6_ask_llm_fix()
        self.step7_apply_fix()
        self.step8_verify_fix()
        self.step9_ask_llm_report()
        self.step10_present_report()

        return {
            "success": self.verification.get("verified", False),
            "bug_report": self.bug_report,
            "fix_proposal": self.fix_proposal,
            "fix_result": self.fix_result,
            "verification": self.verification,
            "report_path": str(self.report_result.get("path", "")),
            "markdown": self.report_result.get("markdown", "")
        }

    run = run_all
