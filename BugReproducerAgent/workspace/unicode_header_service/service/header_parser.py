def process_header(name: str, value: str) -> dict:
    """Process an HTTP header. Bug: crashes on unicode values."""
    key = name.strip().lower()
    return {key: value.upper()}
