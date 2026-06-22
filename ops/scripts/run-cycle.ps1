param(
  [switch]$AllowOneTask
)

$ErrorActionPreference = "Stop"
$repo = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $repo

if ($repo -match "OneDrive|Documents|Desktop") {
  throw "Refusing to run GrowthOps from unsafe path: $repo"
}

git fetch origin
$branch = git branch --show-current
if ($branch -eq "main") {
  git pull --ff-only origin main
}

node ops/scripts/preflight-audit.js --write-inventory
node ops/scripts/daily-report.js

if (-not $AllowOneTask) {
  Write-Host "Preflight, inventory, and daily report complete. Pass -AllowOneTask only after Kali-approved automation prompt selects one safe foundation task."
  exit 0
}

Write-Host "Use the Codex automation prompt to select exactly one safe foundation task, branch, change, postflight, commit, push, and PR."
