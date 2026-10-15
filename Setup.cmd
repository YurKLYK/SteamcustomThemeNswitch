@echo off
setlocal
set "SHFS_SETUP_FILE=%~f0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; try { $text=[IO.File]::ReadAllText($env:SHFS_SETUP_FILE); $code=($text -split ':POWERSHELL_START\r?\n',2)[1]; if(-not $code){throw 'Setup payload is missing'}; & ([ScriptBlock]::Create($code)); exit 0 } catch { Write-Host ('Setup failed: '+$_.Exception.Message) -ForegroundColor Red; exit 1 }"
if errorlevel 1 goto failed
echo Setup complete. Enable the theme in CSSLoader Desktop, then use the desktop shortcut.
pause
exit /b 0
:failed
echo Setup did not complete. Read the error above and run this file again.
pause
exit /b 1
:POWERSHELL_START
$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$version = 'v0.5.23'
$work = Join-Path ([IO.Path]::GetTempPath()) ('shfs-download-' + [Guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $work | Out-Null
$archive = Join-Path $work 'theme.zip'
Write-Host "Downloading Switch Home for Steam $version from GitHub..."
Invoke-WebRequest -UseBasicParsing -Uri "https://github.com/YurKLYK/SteamcustomThemeNswitch/archive/refs/tags/$version.zip" -OutFile $archive
Expand-Archive -LiteralPath $archive -DestinationPath $work
$roots = @(Get-ChildItem -LiteralPath $work -Directory | Where-Object { Test-Path -LiteralPath (Join-Path $_.FullName 'theme.json') })
if ($roots.Count -ne 1) { throw 'Downloaded package has an unexpected structure.' }
$root = $roots[0].FullName
$manifest = Get-Content -LiteralPath (Join-Path $root 'theme.json') -Raw | ConvertFrom-Json
if ($manifest.name -ne 'Switch Home for Steam' -or $manifest.version -ne $version) { throw 'Downloaded package version does not match this installer.' }
& (Join-Path $root 'runtime\setup.ps1')
Write-Host "Downloaded files retained at: $work"
