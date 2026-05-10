<#
  Copyright (c) 2026 AbuEin Technologies — Salaheddin AbuEin <salaheddin@abuein.dev>
  https://abuein.dev/
  SPDX-License-Identifier: MIT
#>

$ErrorActionPreference = "Stop"
$ThemeRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$Output = Join-Path ([Environment]::GetFolderPath('Desktop')) "grace-gs.zip"
$Stage     = Join-Path $env:TEMP "grace-gs-stage"

if (Test-Path $Output) { Remove-Item $Output -Force }
if (Test-Path $Stage)  { Remove-Item $Stage  -Recurse -Force }

# Mirror the theme into a clean staging folder, dropping junk on the way
$exDirs = @(
    (Join-Path $ThemeRoot ".git"),
    "node_modules",
    (Join-Path $ThemeRoot "ghost-config"),
    (Join-Path $ThemeRoot "assets\audio"),
    (Join-Path $ThemeRoot "assets\files"),
    (Join-Path $ThemeRoot "assets\labs"),
    (Join-Path $ThemeRoot "assets\videos")
)
robocopy $ThemeRoot $Stage /MIR /XD @exDirs /XF "*.zip" ".gitignore" | Out-Null
if ($LASTEXITCODE -ge 8) { throw "robocopy failed with exit code $LASTEXITCODE" }
$global:LASTEXITCODE = 0
if (-not (Test-Path $Stage)) { throw "Staging folder was not created -- check exclusions." }

Get-ChildItem -Path $Stage -Force | Compress-Archive -DestinationPath $Output -Force
Remove-Item $Stage -Recurse -Force
Write-Host "Zipped to $Output"