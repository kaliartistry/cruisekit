# CruiseKit Publisher

Publishing means opening a GitHub PR, not pushing directly to `main`. Before a PR, run preflight, confirm the branch is not `main`, run checks, run postflight, review staged files for secrets, and document any failed or skipped checks. Create a `needs-kali` issue for approval-gated work.
