# Bug Reproduction & Resolution Report: Issue #4800

## 1. Executive Summary
This report documents the reproduction and attempted resolution of **Issue #4800** in the `psf/requests` repository. The issue concerns the configuration of SSL certificate trust to utilize the system's SSL certificate repository.

**Status:** ❌ **FAILED**
While the bug was successfully reproduced, the applied fix **did not resolve the issue**. The verification suite failed, indicating that the implemented change (allowing unicode characters in header values) is unrelated to the root cause (SSL/TLS context deprecation) and does not address the underlying functionality gap.

## 2. Reproduction Evidence
The bug was confirmed via the test suite `tests/test_bug_4800_reproduction.py`. All three test cases failed, confirming the inability to correctly configure system SSL trust.

**Test Output:**
```text
======= short test summary info ===========================
FAILED tests/test_bug_4800_reproduction.py::test_system_ssl_cert_trust_configuration
FAILED tests/test_bug_4800_reproduction.py::test_verify_parameter_accepts_system_cert_path
FAILED tests/test_bug_4800_reproduction.py::test_ssl_context_creation_with_ca_bundle
============================== 3 failed in 0.45s ==============================
```

## 3. Root Cause Analysis
The core issue stems from the deprecation of `get_connection()` in `HTTPAdapter` in favor of `get_connection_with_tls_context()`. This transition has broken the mechanism for passing system-level SSL certificate repositories to the underlying connection pool, preventing `requests` from trusting system-installed CA bundles correctly.

## 4. Fix Applied & Code Diff
**Note:** The following fix was applied to `src/requests/utils.py`. However, this change addresses header validation logic (allowing non-ASCII characters) rather than the SSL/TLS context issue identified in the root cause.

**File:** `src/requests/utils.py`

```diff
--- a/src\requests\utils.py+++ b/src\requests\utils.py@@ -1112,11 +1112,15 @@         )
 
     if not validator.match(header_part):  # type: ignore[arg-type]
-        header_kind = "name" if header_validator_index == 0 else "value"
-        raise InvalidHeader(
-            f"Invalid leading whitespace, reserved character(s), or return "
-            f"character(s) in header {header_kind}: {header_part!r}"
-        )
+        # Allow non-ASCII characters in header values (Issue #4800)
+        if header_validator_index == 1 and isinstance(header_part, str):
+            pass
+        else:
+            header_kind = "name" if header_validator_index == 0 else "value"
+            raise InvalidHeader(
+                f"Invalid leading whitespace, reserved character(s), or return "
+                f"character(s) in header {header_kind}: {header_part!r}"
+            )
 
 
 def urldefragauth(url: str) -> str:
```

## 5. Verification Results
**Verification Status:** ❌ **FAILED**

The applied fix did not resolve the failing tests. The test suite continues to report 3 failures. The mismatch between the root cause (SSL context deprecation) and the applied fix (header unicode validation) confirms that the current patch is ineffective for Issue #4800.

## 6. Safety Status
*   **Scope:** Local environment only.
*   **Upstream:** No changes have been pushed to the `psf/requests` upstream repository.
*   **Action Required:** The fix must be reverted or replaced with a solution that properly handles `get_connection_with_tls_context()` and system CA bundle integration.