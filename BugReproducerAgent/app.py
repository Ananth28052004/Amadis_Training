import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Safe stdout handling for Windows cp1252 consoles
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

load_dotenv()

from agent.orchestrator import BugReproducerPipeline


def print_banner():
    print("=" * 60)
    print("           🤖 AUTONOMOUS BUG REPRODUCER AGENT")
    print("=" * 60)
    print("Public Open-Source Issue Reproducer & Local Patch Verifier")
    print("Zero upstream writes - 100% local safety sandbox.")
    print("=" * 60)
    print()


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Autonomous Bug Reproducer & Fixer Agent")
    parser.add_argument("url", nargs="?", default="", help="GitHub issue URL (e.g. https://github.com/owner/repo/issues/123 or preset: unicode-header)")
    parser.add_argument("--provider", "-p", choices=["ollama", "gemini", "groq", "mock"], default="", help="LLM provider: ollama, gemini, groq, mock")
    parser.add_argument("--model", "-m", default="", help="Model name (e.g. qwen2.5-coder:7b, gemini-flash-latest)")
    args = parser.parse_args()

    print_banner()

    issue_url = args.url
    if not issue_url:
        print("Available options:")
        print("  1. [Preset] Unicode Header Crash ('crashes when the header value contains unicode')")
        print("  2. [Preset] TermStory Unicode CSV Issue #425")
        print("  3. [Custom] Enter custom GitHub issue URL")
        print()

        choice = input("Select an option [1-3] (Default: 1): ").strip()
        if choice == "2":
            issue_url = "termstory-425"
        elif choice == "3":
            issue_url = input("Enter GitHub Issue URL (e.g. https://github.com/owner/repo/issues/123): ").strip()
            if not issue_url:
                print("No URL provided. Exiting.")
                return
        else:
            issue_url = "unicode-header"

    provider = args.provider
    api_key = ""
    model = args.model

    if not provider:
        print()
        print("LLM Providers:")
        print("  1. Local Ollama (Qwen2.5-Coder 7B) [100% Free, Private, No API Key]")
        print("  2. Google Gemini (FREE tier - gemini-flash-latest)")
        print("  3. Groq (FREE tier - ultra-fast)")
        print("  4. Intelligent Mock / Benchmark Demo Mode")
        print()

        p_choice = input("Select LLM Provider [1-4] (Default: 1): ").strip()
        if p_choice == "2":
            provider = "gemini"
            api_key = os.getenv("GEMINI_API_KEY", "") or input("Enter your Gemini API Key: ").strip()
        elif p_choice == "3":
            provider = "groq"
            api_key = os.getenv("GROQ_API_KEY", "") or input("Enter your Groq API Key: ").strip()
        elif p_choice == "4":
            provider = "mock"
        else:
            provider = "ollama"
            model = model or "qwen2.5-coder:7b"
    else:
        if provider == "gemini":
            api_key = os.getenv("GEMINI_API_KEY", "")
        elif provider == "groq":
            api_key = os.getenv("GROQ_API_KEY", "")

    print()
    print(f"🚀 Initializing Bug Reproducer Pipeline [Provider: {provider.upper()}]...")
    pipeline = BugReproducerPipeline(
        provider=provider,
        api_key=api_key,
        model=model,
    )

    try:
        result = pipeline.run_all(issue_url)
        print()
        if result["success"]:
            print("🎉 SUCCESS: Bug reproduced, fixed, verified, and report generated!")
        else:
            print("⚠️ FINISHED: Check report for detailed status.")
        print(f"📄 Report saved to: {result['report_path']}")
        print()
        print("💡 Tip: You can also launch the interactive Web UI anytime with:")
        print("   .\\run_ui.bat  or  .\\venv\\Scripts\\streamlit run ui.py")
    except Exception as error:
        print()
        print(f"❌ Execution error: {error}")


if __name__ == "__main__":
    main()