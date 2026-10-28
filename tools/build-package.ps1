param([string]$OutputDirectory = (Join-Path (Split-Path -Parent $PSScriptRoot) 'dist'))
$ErrorActionPreference = 'Stop'
$sourceRoot = Split-Path -Parent $PSScriptRoot
$manifest = Get-Content -LiteralPath (Join-Path $sourceRoot 'theme.json') -Raw | ConvertFrom-Json
$tempRoot = Join-Path ([IO.Path]::GetTempPath()) ('shfs-package-' + [Guid]::NewGuid().ToString('N'))
$packageRoot = Join-Path $tempRoot 'Switch Home for Steam'
New-Item -ItemType Directory -Path $packageRoot -Force | Out-Null
try {
    foreach ($name in @('theme.json','shared.css','home.css','settings.css','menus.css','PRIORITY','README.md','CHANGELOG.md','Setup.cmd','Artwork-Resizer.html')) {
        Copy-Item -LiteralPath (Join-Path $sourceRoot $name) -Destination $packageRoot
    }
    Copy-Item -LiteralPath (Join-Path $sourceRoot 'options') -Destination $packageRoot -Recurse
    $runtimeRoot = Join-Path $packageRoot 'runtime'
    New-Item -ItemType Directory -Path $runtimeRoot | Out-Null
    foreach ($name in @('home.css','native-home.js','watch-home.mjs','install.ps1','setup.ps1','uninstall.ps1','startup.vbs','launch.ps1','launch.vbs')) {
        Copy-Item -LiteralPath (Join-Path $sourceRoot "runtime\$name") -Destination $runtimeRoot
    }
    $toolRoot = Join-Path $packageRoot 'tools'
    New-Item -ItemType Directory -Path $toolRoot | Out-Null
    foreach ($name in @('build-package.ps1','check-environment.ps1','validate-theme.ps1')) {
        Copy-Item -LiteralPath (Join-Path $PSScriptRoot $name) -Destination $toolRoot
    }
    New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null
    $archive = Join-Path $OutputDirectory ("Switch-Home-for-Steam-$($manifest.version).zip")
    Compress-Archive -LiteralPath $packageRoot -DestinationPath $archive -Force
    Write-Output $archive
} finally {
    $resolvedTemp = [IO.Path]::GetFullPath($tempRoot)
    $systemTemp = [IO.Path]::GetFullPath([IO.Path]::GetTempPath()).TrimEnd('\') + '\'
    if (-not $resolvedTemp.StartsWith($systemTemp, [StringComparison]::OrdinalIgnoreCase) -or (Split-Path -Leaf $resolvedTemp) -notmatch '^shfs-package-[a-f0-9]{32}$') { throw 'Refusing unexpected temporary cleanup path' }
    Remove-Item -LiteralPath $resolvedTemp -Recurse -Force
}
