import os
import json
import requests
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from project root if present
load_dotenv()

DEFAULT_GEMINI_MODEL = "gemini-flash-latest"
DEFAULT_GROQ_MODEL = "qwen/qwen3.8-27b"
DEFAULT_OLLAMA_MODEL = "qwen2.5-coder:7b"
DEFAULT_OLLAMA_URL = "http://localhost:11434"


def get_stored_api_key(provider: str = "gemini") -> str:
    """Retrieve API key from environment variables or .env file."""
    provider = provider.lower()
    if provider == "gemini":
        return os.getenv("GEMINI_API_KEY", "")
    elif provider == "groq":
        return os.getenv("GROQ_API_KEY", "")
    elif provider in ("ollama", "qwen", "local"):
        return os.getenv("OLLAMA_BASE_URL", DEFAULT_OLLAMA_URL)
    return ""


def set_stored_api_key(key: str, provider: str = "gemini") -> None:
    """Save API key in environment for current session."""
    provider = provider.lower()
    if provider == "gemini":
        os.environ["GEMINI_API_KEY"] = key
    elif provider == "groq":
        os.environ["GROQ_API_KEY"] = key


def call_gemini(prompt: str, system_prompt: str = "", api_key: str = "", model: str = DEFAULT_GEMINI_MODEL) -> str:
    """
    Call Google Gemini API using direct REST endpoint.
    Free tier API key available from Google AI Studio: https://aistudio.google.com/
    """
    key = api_key or get_stored_api_key("gemini")
    if not key:
        raise ValueError(
            "Gemini API Key is missing. Please provide a FREE API key from Google AI Studio (https://aistudio.google.com/) "
            "or switch to Mock/Demo mode."
        )

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"

    full_prompt = prompt
    if system_prompt:
        full_prompt = f"System Instructions:\n{system_prompt}\n\nTask:\n{prompt}"

    payload = {
        "contents": [
            {
                "parts": [{"text": full_prompt}]
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 4096,
        }
    }

    headers = {"Content-Type": "application/json"}
    
    response = requests.post(url, headers=headers, json=payload, timeout=60)
    
    if response.status_code != 200:
        error_msg = response.text
        try:
            error_data = response.json()
            if "error" in error_data:
                error_msg = error_data["error"].get("message", error_msg)
        except Exception:
            pass
        raise RuntimeError(f"Gemini API returned error ({response.status_code}): {error_msg}")

    result_json = response.json()
    try:
        candidate = result_json["candidates"][0]
        text = candidate["content"]["parts"][0]["text"]
        return text.strip()
    except (KeyError, IndexError) as err:
        raise RuntimeError(f"Unexpected response format from Gemini API: {result_json}") from err


def call_groq(prompt: str, system_prompt: str = "", api_key: str = "", model: str = DEFAULT_GROQ_MODEL) -> str:
    """
    Call Groq API (Free Tier). Free key from https://console.groq.com/
    """
    key = api_key or get_stored_api_key("groq")
    if not key:
        raise ValueError(
            "Groq API Key is missing. Get a FREE key from Groq Console (https://console.groq.com/) or switch to Demo mode."
        )

    url = "https://api.groq.com/openai/v1/chat/completions"
    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})

    payload = {
        "model": model,
        "messages": messages,
        "temperature": 0.2,
        "max_tokens": 4096,
    }

    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }

    response = requests.post(url, headers=headers, json=payload, timeout=60)
    if response.status_code != 200:
        raise RuntimeError(f"Groq API error ({response.status_code}): {response.text}")

    data = response.json()
    return data["choices"][0]["message"]["content"].strip()


def is_ollama_available(base_url: str = DEFAULT_OLLAMA_URL) -> bool:
    """Check if local Ollama server is responding."""
    try:
        res = requests.get(f"{base_url.rstrip('/')}/api/tags", timeout=2)
        return res.status_code == 200
    except Exception:
        return False


def call_ollama(
    prompt: str,
    system_prompt: str = "",
    model: str = DEFAULT_OLLAMA_MODEL,
    base_url: str = DEFAULT_OLLAMA_URL
) -> str:
    """
    Call local Ollama model (e.g. Qwen2.5-Coder 7B).
    Runs 100% locally with zero rate limits, no API key needed, and specialized coding capabilities.
    """
    url = f"{base_url.rstrip('/')}/api/generate"
    payload = {
        "model": model,
        "prompt": prompt,
        "system": system_prompt,
        "stream": False,
        "options": {
            "temperature": 0.2,
            "num_predict": 1024,
        }
    }
    headers = {"Content-Type": "application/json"}
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=180)
        if response.status_code != 200:
            raise RuntimeError(f"Ollama returned HTTP {response.status_code}: {response.text}")
        data = response.json()
        return data.get("response", "").strip()
    except requests.exceptions.ConnectionError:
        raise RuntimeError(
            f"Could not connect to Ollama at {base_url}. "
            "Please make sure Ollama is running (`ollama serve`)."
        )


def query_llm(
    prompt: str,
    system_prompt: str = "",
    provider: str = "ollama",
    api_key: str = "",
    model: str = ""
) -> str:
    """
    Unified entrypoint to query an LLM.
    Supported providers: 'ollama' (Qwen2.5-Coder 7B), 'groq', 'gemini'.
    Automatically fails over to Groq or local Ollama if Gemini hits 429 free tier quota limits.
    """
    provider = provider.lower()

    if provider in ("ollama", "qwen", "local"):
        chosen_model = model or DEFAULT_OLLAMA_MODEL
        ollama_url = api_key if (api_key and "http" in api_key) else os.getenv("OLLAMA_BASE_URL", DEFAULT_OLLAMA_URL)
        return call_ollama(prompt, system_prompt, model=chosen_model, base_url=ollama_url)

    elif provider == "gemini":
        chosen_model = model or DEFAULT_GEMINI_MODEL
        try:
            return call_gemini(prompt, system_prompt, api_key=api_key, model=chosen_model)
        except Exception as gem_err:
            groq_key = get_stored_api_key("groq")
            err_str = str(gem_err).lower()
            if groq_key and any(kw in err_str for kw in ["429", "quota", "503", "resource_exhausted", "high demand"]):
                print(f"[LLM Auto-Failover] Gemini quota reached ({gem_err}). Automatically switching to Groq ({DEFAULT_GROQ_MODEL})...")
                return call_groq(prompt, system_prompt, api_key=groq_key, model=DEFAULT_GROQ_MODEL)
            # Failover to local Ollama if available
            if is_ollama_available():
                print(f"[LLM Auto-Failover] Gemini quota reached. Automatically switching to local Ollama ({DEFAULT_OLLAMA_MODEL})...")
                return call_ollama(prompt, system_prompt, model=DEFAULT_OLLAMA_MODEL)
            raise gem_err

    elif provider == "groq":
        chosen_model = model or DEFAULT_GROQ_MODEL
        return call_groq(prompt, system_prompt, api_key=api_key, model=chosen_model)

    else:
        raise ValueError(f"Unsupported LLM provider '{provider}'. Please choose 'ollama', 'groq', or 'gemini'.")

