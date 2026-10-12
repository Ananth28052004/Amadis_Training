# Bug Reproduction & Resolution Report

## Executive Summary

**Bug Issue:** #425 - `export_csv` crashes with `UnicodeEncodeError` on non-ASCII command text

**Repository:** bitflicker64/Termstory

**Reproduction Status:** TEST_ERROR

**Fix Applied:** Specify encoding='utf-8' when opening file

**Verification Passed:** False

**Safety Status:** Local only, nothing pushed upstream

## Reproduction Evidence

The test failed with the following error message:

```plaintext
annot import name 'export_csv' from 'termstory.cli' (C:\Ananth\BugReproducerAgent\workspace\Termstory\termstory\cli.py)
```

The short test summary indicates an error during collection:

```plaintext
ERROR tests/test_bug_425_reproduction.py
!!!!!!!!!!!!!!!!!!! Interrupted: 1 error during collection !!!!!!!!!!!!!!!!!!!!
============================== 1 error in 0.47s ===============================
```

## Root Cause Analysis

The root cause of the issue is that the `export_csv` function in `exporter.py` explicitly uses UTF-8 encoding, but the file opening operation does not specify the encoding, leading to a `UnicodeEncodeError` when non-ASCII characters are encountered.

## Fix Applied & Code Diff

The fix applied was to specify `encoding='utf-8'` when opening the file. The relevant code change is as follows:

```diff
--- a/termstory\exporter.py+++ b/termstory\exporter.py@@ -445,7 +445,7 @@                 writer.writerow(row)
 
     if output_file and output_file != "-":
-        with open(output_file, "w", newline="") as f:
+        with open(output_file, "w", encoding="utf-8", newline="") as f:
             write_rows(f)
     else:
         write_rows(sys.stdout)
```

## Verification Results

Verification has not been completed as the fix has not been pushed upstream and the issue has not been resolved locally.

## Safety Status

The fix is local and has not been pushed upstream. The issue has not been resolved locally, so the safety status is local only.