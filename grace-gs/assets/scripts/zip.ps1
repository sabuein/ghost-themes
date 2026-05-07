$ErrorActionPreference = 'Stop'
$dest = 'C:/Users/sala/Desktop/grace-gs.zip'

if (Test-Path $dest) { Remove-Item $dest -Force }

$items = Get-ChildItem -Path . -Recurse -File | Where-Object {
    $rel = $_.FullName.Substring((Get-Location).Path.Length + 1)
    -not (
        $_.Extension -eq '.zip' -or
        $_.Name -eq '.gitignore' -or
        $rel -like 'assets\audio\*' -or
        $rel -like 'assets\files\*' -or
        $rel -like 'assets\labs\*' -or
        $rel -like 'assets\videos\*' -or
        $rel -like 'assets\scripts\*'
    )
}

Compress-Archive -Path $items.FullName -DestinationPath $dest -Force
Write-Host "Created $dest"