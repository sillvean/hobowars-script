$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$artifactsDirectory = Join-Path $repoRoot 'artifacts'
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$latestOutputPath = Join-Path $artifactsDirectory 'tampermonkey-script.js'
$outputFileName = "tampermonkey-script-$timestamp.js"
$outputPath = Join-Path $artifactsDirectory $outputFileName
$sourceFiles = @(
    'src/meta/header.js'
    'src/config/flags.js'
    'src/config/colors.js'
    'src/features/swimming.js'
    'src/config/icons.js'
    'src/config/navigation-data.js'
    'src/core/page-context.js'
    'src/core/section-header.js'
    'src/core/utilities.js'
    'src/theme/section-header.js'
    'src/theme/nav-links.js'
    'src/theme/dark-mode-buttons.js'
    'src/theme/dark-mode-living-area.js'
    'src/theme/dark-mode-shop.js'
    'src/theme/apply-dark-mode.js'
    'src/layout/section-header.js'
    'src/layout/topbar-layout.js'
    'src/layout/navigation.js'
    'src/layout/right-panel.js'
    'src/layout/topbar-settings.js'
    'src/layout/topbar-resize.js'
    'src/features/section-header.js'
    'src/features/maps.js'
    'src/features/hitlist.js'
    'src/features/rpsls.js'
    'src/features/uni-grid.js'
    'src/features/rankings.js'
    'src/features/shop.js'
    'src/bootstrap/section-header.js'
    'src/bootstrap/main.js'
)

$sections = foreach ($relativePath in $sourceFiles) {
    $fullPath = Join-Path $repoRoot $relativePath
    if (-not (Test-Path $fullPath)) {
        throw "Missing source file: $relativePath"
    }

    [System.IO.File]::ReadAllText($fullPath).TrimEnd([Environment]::NewLine.ToCharArray())
}

$combined = ($sections -join ([Environment]::NewLine + [Environment]::NewLine))

if (-not (Test-Path $artifactsDirectory)) {
    New-Item -ItemType Directory -Path $artifactsDirectory | Out-Null
}

function Get-StringSha256([string] $text) {
    $sha256 = [System.Security.Cryptography.SHA256]::Create()
    try {
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($text)
        $hashBytes = $sha256.ComputeHash($bytes)
        return ([System.BitConverter]::ToString($hashBytes)).Replace('-', '').ToLowerInvariant()
    } finally {
        $sha256.Dispose()
    }
}

$latestArtifact = Get-ChildItem -Path $artifactsDirectory -Filter 'tampermonkey-script-*.js' -File |
    Sort-Object Name -Descending |
    Select-Object -First 1

$newHash = Get-StringSha256 $combined
$latestHash = $null

if ($latestArtifact) {
    $latestHash = (Get-FileHash -Path $latestArtifact.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
}

if ($latestHash -eq $newHash) {
    Write-Output "No artifact created. Content hash matches latest artifact: $($latestArtifact.FullName)"
    exit 0
}

[System.IO.File]::WriteAllText($outputPath, $combined)
[System.IO.File]::WriteAllText($latestOutputPath, $combined)

Write-Output "Built $outputPath and updated $latestOutputPath from $($sourceFiles.Count) source files."
