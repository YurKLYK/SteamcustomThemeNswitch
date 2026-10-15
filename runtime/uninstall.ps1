$ErrorActionPreference = 'Stop'
$themeRoot = Join-Path $env:USERPROFILE 'homebrew\themes\Switch Home for Steam'
$startupEntry = Join-Path ([Environment]::GetFolderPath('Startup')) 'Switch Home for Steam.vbs'
$watcher = Join-Path $themeRoot 'runtime\watch-home.mjs'
$watcherPattern = [Regex]::Escape($watcher)

Get-CimInstance Win32_Process | Where-Object {
    $_.Name -ieq 'node.exe' -and $_.CommandLine -and $_.CommandLine -match $watcherPattern
} | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }

if (Test-Path -LiteralPath $startupEntry) { Remove-Item -LiteralPath $startupEntry }
Write-Output 'The HOME watcher and its Windows startup entry have been removed.'
Write-Output 'Disable the theme in CSS Loader Desktop, refresh the injector, then remove the theme folder if you no longer need it.'
