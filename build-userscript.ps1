$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$outputPath = Join-Path $repoRoot 'tampermonkey-script.js'
$sourceFiles = @(
    'src/meta/header.js'
    'src/core/shared.js'
    'src/core/utilities.js'
    'src/theme/dark-mode.js'
    'src/layout/layout.js'
    'src/features/gameplay.js'
    'src/bootstrap/main.js'
)

$sections = foreach ($relativePath in $sourceFiles) {
    $fullPath = Join-Path $repoRoot $relativePath
    if (-not (Test-Path $fullPath)) {
        throw "Missing source file: $relativePath"
    }

    [System.IO.File]::ReadAllText($fullPath)
}

$combined = ($sections -join '')
[System.IO.File]::WriteAllText($outputPath, $combined)

Write-Output "Built $outputPath from $($sourceFiles.Count) source files."
