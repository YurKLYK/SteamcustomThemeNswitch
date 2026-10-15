param(
    [string]$ThemeRoot = (Join-Path $env:USERPROFILE 'homebrew\themes\Switch Home for Steam'),
    [switch]$NoStart,
    [switch]$NoStartup,
    [switch]$NoShortcuts
)
$ErrorActionPreference = 'Stop'
$sourceRoot = Split-Path -Parent $PSScriptRoot
$themeRoot = [IO.Path]::GetFullPath($ThemeRoot)
$startupRoot = [Environment]::GetFolderPath('Startup')
$startupEntry = Join-Path $startupRoot 'Switch Home for Steam.vbs'
$watcher = Join-Path $themeRoot 'runtime\watch-home.mjs'
$node = (Get-Command node.exe -ErrorAction Stop).Source
$nodeVersion = & $node --version
if ($LASTEXITCODE -ne 0 -or $nodeVersion -notmatch '^v(\d+)\.' -or [int]$Matches[1] -lt 24) {
    throw 'Install Node.js 24 LTS or newer, reopen PowerShell, and try again.'
}

if ([IO.Path]::GetFullPath($sourceRoot) -ne [IO.Path]::GetFullPath($themeRoot)) {
    New-Item -ItemType Directory -Force -Path $themeRoot | Out-Null
    foreach ($name in @('theme.json','shared.css','home.css','menus.css','PRIORITY','README.md','CHANGELOG.md','Setup.cmd')) {
        Copy-Item -LiteralPath (Join-Path $sourceRoot $name) -Destination $themeRoot -Force
    }
    Copy-Item -LiteralPath (Join-Path $sourceRoot 'options') -Destination $themeRoot -Recurse -Force
    $installedRuntime = Join-Path $themeRoot 'runtime'
    New-Item -ItemType Directory -Force -Path $installedRuntime | Out-Null
    foreach ($name in @('install.ps1','uninstall.ps1','startup.vbs','launch.ps1','launch.vbs','watch-home.mjs','native-home.js','home.css')) {
        Copy-Item -LiteralPath (Join-Path $PSScriptRoot $name) -Destination $installedRuntime -Force
    }
}

Set-Content -LiteralPath (Join-Path $themeRoot 'runtime\node-path.txt') -Value $node -Encoding Unicode
if (-not $NoStartup) { Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'startup.vbs') -Destination $startupEntry -Force }
if (-not $NoShortcuts) {
    $shortcutPath = Join-Path ([Environment]::GetFolderPath('Desktop')) 'Switch Home for Steam.lnk'
    $launcher = Join-Path $themeRoot 'runtime\launch.vbs'
    $shell = New-Object -ComObject WScript.Shell
    $shortcut = $shell.CreateShortcut($shortcutPath)
    if ((Test-Path -LiteralPath $shortcutPath) -and $shortcut.Arguments -ne ('"{0}"' -f $launcher)) { throw 'A different desktop shortcut already has this name. Rename it or use -NoShortcuts.' }
    $shortcut.TargetPath = Join-Path $env:WINDIR 'System32\wscript.exe'
    $shortcut.Arguments = '"{0}"' -f $launcher
    $shortcut.WorkingDirectory = $themeRoot
    $shortcut.Description = 'Start the theme helper and Steam Big Picture together'
    $steamExe = (Get-ItemProperty -LiteralPath 'HKCU:\Software\Valve\Steam' -Name SteamExe -ErrorAction SilentlyContinue).SteamExe
    if ($steamExe -and (Test-Path -LiteralPath $steamExe)) { $shortcut.IconLocation = "$steamExe,0" }
    $shortcut.Save()
}
$watcherPattern = [Regex]::Escape($watcher)
$running = Get-CimInstance Win32_Process | Where-Object {
    $_.Name -ieq 'node.exe' -and $_.CommandLine -and $_.CommandLine -match $watcherPattern
}
if (-not $NoStart) {
    $running | ForEach-Object { Stop-Process -Id $_.ProcessId -ErrorAction Stop }
    Start-Process -FilePath $node -ArgumentList ('"{0}"' -f $watcher) -WindowStyle Hidden
}

Write-Output "Theme installed at: $themeRoot"
if (-not $NoStartup) { Write-Output "Startup watcher registered: $startupEntry" }
Write-Output 'In CSS Loader Desktop, refresh the injector and enable Switch Home for Steam with Color Scheme set to Dark.'
