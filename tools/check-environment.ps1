$ErrorActionPreference = 'Stop'
$nodeCommand = Get-Command node.exe -ErrorAction SilentlyContinue
if ($nodeCommand) { Write-Output "Node.js: $(& $nodeCommand.Source --version)" } else { Write-Output 'Node.js: NOT FOUND (install Node.js 24 LTS)' }
$themeRoot = Join-Path $env:USERPROFILE 'homebrew\themes\Switch Home for Steam'
Write-Output "Theme installed: $(Test-Path -LiteralPath (Join-Path $themeRoot 'theme.json'))"
Write-Output "Saved Node.js path: $(Test-Path -LiteralPath (Join-Path $themeRoot 'runtime\node-path.txt'))"
$startupEntry = Join-Path ([Environment]::GetFolderPath('Startup')) 'Switch Home for Steam.vbs'
Write-Output "Startup entry: $(Test-Path -LiteralPath $startupEntry)"
$watcherPattern = [regex]::Escape((Join-Path $themeRoot 'runtime\watch-home.mjs'))
$watchers = @(Get-CimInstance Win32_Process | Where-Object { $_.Name -ieq 'node.exe' -and $_.CommandLine -and $_.CommandLine -match $watcherPattern })
Write-Output "Theme watcher processes: $($watchers.Count)"
try {
    $targets = @(Invoke-RestMethod -Uri 'http://127.0.0.1:8080/json' -TimeoutSec 3)
    $bigPicture = @($targets | Where-Object { $_.type -eq 'page' -and $_.title -like '*Big Picture*' })
    Write-Output "Steam debug endpoint: reachable; Big Picture targets: $($bigPicture.Count)"
} catch { Write-Output 'Steam debug endpoint: unavailable (open Steam Big Picture and check CEF debugging)' }
Write-Output 'This check does not change Steam, CSSLoader, startup settings or files.'
