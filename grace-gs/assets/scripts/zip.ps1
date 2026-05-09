<#
  Copyright (c) 2026 AbuEin Technologies — Salaheddin AbuEin <salaheddin@abuein.dev>
  https://abuein.dev/
  SPDX-License-Identifier: MIT
#>

$ErrorActionPreference = "Stop"
$ThemeRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$Output    = "$env:USERPROFILE\Desktop\grace-gs.zip"
$Stage     = Join-Path $env:TEMP "grace-gs-stage"

if (Test-Path $Output) { Remove-Item $Output -Force }
if (Test-Path $Stage)  { Remove-Item $Stage  -Recurse -Force }

# Mirror the theme into a clean staging folder, dropping junk on the way
robocopy $ThemeRoot $Stage /MIR `
    /XD ".git" ".git\*" "node_modules" "ghost-config" "assets\audio" "assets\files" "assets\labs" "assets\videos" `
    /XF "*.zip" ".gitignore" | Out-Null

Compress-Archive -Path (Join-Path $Stage '*') -DestinationPath $Output -Force
Remove-Item $Stage -Recurse -Force
Write-Host "Zipped to $Output"