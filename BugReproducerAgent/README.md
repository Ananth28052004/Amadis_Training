# 🤖 Bug Reproducer Agent

An autonomous agent that reads public GitHub bug reports, sets up the project at the reported version, writes minimal failing reproduction tests, asks an LLM for root cause and fix diagnosis, applies the fix locally, proves it works, and generates a verification report.

> **Zero Upstream Access Needed**: Everything runs on public open-source repos. The agent operates strictly inside the local `workspace/` sandbox and never pushes commits or branches upstream.

---

## 🎯 10-Step Autonomous Workflow

```text
Step 1: Agent uses GitHub API
        ➔ Reads the issue
        ➔ Downloads/clones the project

Step 2: Agent uses Shell commands
        ➔ Installs dependencies
        ➔ Sets up the project environment

Step 3: Agent uses LLM
        ➔ Asks: "What should I do?"
        ➔ LLM: "Write a test with unicode"

Step 4: Agent uses File editor
        ➔ Writes the minimal reproduction test file

Step 5: Agent uses Shell commands
        ➔ Runs the test
        ➔ Test crashes 💥 (Bug reproduction confirmed!)

Step 6: Agent uses LLM
        ➔ Asks: "What is the fix?"
        ➔ LLM: "Change value.upper()" (Safe Unicode handling)

Step 7: Agent uses File editor
        ➔ Changes the code (with automatic safety backup)

Step 8: Agent uses Shell commands
        ➔ Runs the test again
        ➔ Test passes ✅ (Fix verified!)

Step 9: Agent uses LLM
        ➔ Asks: "Write a report"
        ➔ LLM writes comprehensive markdown report

Step 10: Agent shows report to human
        ➔ Interactive visual presentation in Python UI
```

---

## 🔑 Free API Key Setup

You can use **100% Free** LLM API keys:

### Option 1: Google Gemini API (Recommended - Free Tier)
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with any Google account
3. Click **"Create API key"**
4. Copy your key and add it to `.env`:
   ```env
   GEMINI_API_KEY=your_key_here
   ```
   *(Or paste it directly into the Python UI)*
   *Free tier quota: 15 Requests/Min, 1 Million Tokens/Min, 1,500 Requests/Day.*

### Option 2: Groq Cloud API (Free Tier)
1. Visit [Groq Console](https://console.groq.com/keys)
2. Sign in and create an API key
3. Provides ultra-fast free inference on Llama 3.3 70B:
   ```env
   GROQ_API_KEY=your_key_here
   ```

### Option 3: Intelligent Offline / Demo Mode (No Key Required!)
- You can test immediately without any API key by selecting **"Mock / Offline Demo"** in the UI or CLI.

---

## 🖥️ Running the Python UI

Launch the modern interactive web interface:

```bash
# Using the python launcher:
python run_ui.py

# Or directly with Streamlit:
streamlit run ui.py

# Or double-click on Windows:
run_ui.bat
```

Open your browser at **http://localhost:8501**.

### UI Features:
- **Scenario Selector**: 1-click presets for the Unicode Header crash, TermStory CSV issue, or any custom GitHub URL.
- **Provider Switcher**: Switch between Gemini (Free), Groq (Free), OpenRouter, and Offline Demo Mode.
- **Full Automation**: Click **"Run Full 10-Step Pipeline"** for end-to-end execution.
- **Step-by-Step Mode**: Step through each phase interactively to watch the agent plan, write tests, observe the crash, apply the fix, and verify.
- **Diff & Terminal**: Syntax-highlighted code diffs, crash stack traces, and verification logs.
- **Markdown Report Viewer**: Live rendering with download button.

---

## 💻 Running via CLI

You can also run headlessly in the command line:

```bash
python app.py
```

---

## 📂 Project Structure

```text
BugReproducerAgent/
├── agent/
│   ├── orchestrator.py          # Unified 10-step autonomous pipeline controller
│   ├── llm_client.py            # Multi-provider client (Gemini Free, Groq Free, Mock)
│   ├── reproduction_generator.py# Step 3 & 4: LLM plan & reproduction test writer
│   ├── fix_proposal.py          # Step 6: LLM root cause & fix proposal
│   ├── fix_engine.py            # Step 7: File editor surgical patcher & backup
│   ├── report_generator.py      # Step 9 & 10: LLM report synthesizer
│   ├── bug_analyzer.py          # Bug issue parser & extractor
│   └── root_cause_analyzer.py   # Code & stack trace root cause inspector
├── github/
│   └── github_client.py         # GitHub API client + preset demo issues
├── runner/
│   ├── git_manager.py           # Git repo clone & workspace manager
│   ├── project_runner.py        # Pytest & shell test execution runner
│   ├── project_detector.py      # Auto-detects Python, pytest, node, etc.
│   ├── dependency_installer.py  # Isolated environment & dependency setup
│   └── version_manager.py       # Git version & checkout manager
├── workspace/
│   ├── unicode_header_service/  # Sample project with header unicode bug
│   └── Termstory/               # Sample project with CSV unicode bug
├── reports/                     # Saved markdown and text reports
├── ui.py                        # Streamlit Python UI
├── run_ui.py                    # One-command UI launcher
├── run_ui.bat                   # Windows batch launcher
├── app.py                       # CLI application
├── .env.example                 # Example environment variables
└── README.md                    # Project documentation
```
