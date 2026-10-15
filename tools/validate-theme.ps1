$ErrorActionPreference = 'Stop'

$themeRoot = Split-Path -Parent $PSScriptRoot
$manifestPath = Join-Path $themeRoot 'theme.json'
$manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json -AsHashtable
$errors = [System.Collections.Generic.List[string]]::new()

if ($manifest.name -ne 'Switch Home for Steam') {
    $errors.Add('theme.json name must be Switch Home for Steam.')
}

if ([int]$manifest.manifest_version -ne 9) {
    $errors.Add('manifest_version must be 9.')
}

$cssReferences = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)

function Add-CssReferences {
    param([hashtable]$Definition)
    foreach ($key in $Definition.Keys) {
        if ($key -like '--*') { continue }
        [void]$cssReferences.Add([string]$key)
    }
}

Add-CssReferences -Definition $manifest.inject
foreach ($patch in $manifest.patches.Values) {
    foreach ($value in $patch.values.Values) {
        if ($value -is [hashtable]) { Add-CssReferences -Definition $value }
    }
}

foreach ($reference in $cssReferences) {
    $path = Join-Path $themeRoot $reference
    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
        $errors.Add("Missing referenced CSS file: $reference")
    }
}

$cssFiles = Get-ChildItem -LiteralPath $themeRoot -Recurse -Filter '*.css' -File
foreach ($file in $cssFiles) {
    $content = Get-Content -LiteralPath $file.FullName -Raw
    $openCount = ([regex]::Matches($content, '\{')).Count
    $closeCount = ([regex]::Matches($content, '\}')).Count
    if ($openCount -ne $closeCount) {
        $errors.Add("Unbalanced braces: $($file.FullName)")
    }
    if ($content -match '@import|javascript:|url\s*\(\s*["'']?https?://') {
        $errors.Add("External or executable CSS reference found: $($file.FullName)")
    }
}

if ($errors.Count -gt 0) {
    $errors | ForEach-Object { Write-Error $_ }
    exit 1
}

Write-Output "OK: $($cssFiles.Count) CSS files and $($cssReferences.Count) manifest references validated."
