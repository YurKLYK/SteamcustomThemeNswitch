param([switch]$WatcherOnly, [switch]$CheckOnly)
$ErrorActionPreference = 'Stop'
$watcher = Join-Path $PSScriptRoot 'watch-home.mjs'
$savedNode = Join-Path $PSScriptRoot 'node-path.txt'
$node = if (Test-Path -LiteralPath $savedNode) { (Get-Content -LiteralPath $savedNode -Encoding Unicode -First 1).Trim() } else { (Get-Command node.exe -ErrorAction Stop).Source }
if (-not (Test-Path -LiteralPath $node -PathType Leaf)) { throw 'Node.js was moved. Run Setup.cmd again.' }
if (-not (Test-Path -LiteralPath $watcher -PathType Leaf)) { throw 'Theme watcher is missing. Run Setup.cmd again.' }
$steamExe = (Get-ItemProperty -LiteralPath 'HKCU:\Software\Valve\Steam' -Name SteamExe -ErrorAction SilentlyContinue).SteamExe
if (-not $WatcherOnly -and (-not $steamExe -or -not (Test-Path -LiteralPath $steamExe -PathType Leaf))) { throw 'Steam installation was not found. Install and open Steam first.' }
if ($CheckOnly) { Write-Output 'Launcher paths are valid; no processes were started.'; return }
$launchMutex = [Threading.Mutex]::new($false, 'Local\SwitchHomeForSteam.Launch')
$locked = $false
try {
    try { $locked = $launchMutex.WaitOne(10000) } catch [Threading.AbandonedMutexException] { $locked = $true }
    if (-not $locked) { throw 'Another theme launch is still in progress.' }
    $pattern = [Regex]::Escape([IO.Path]::GetFullPath($watcher))
    $running = @(Get-CimInstance Win32_Process | Where-Object { $_.Name -ieq 'node.exe' -and $_.CommandLine -and $_.CommandLine -match $pattern })
    if ($running.Count -eq 0) { Start-Process -FilePath $node -ArgumentList ('"{0}"' -f $watcher) -WindowStyle Hidden }
} finally { if ($locked) { $launchMutex.ReleaseMutex() }; $launchMutex.Dispose() }
if (-not $WatcherOnly) {
    if (Get-Process -Name steam -ErrorAction SilentlyContinue) {
        Start-Process -FilePath 'steam://open/bigpicture'
    } else {
        Start-Process -FilePath $steamExe -ArgumentList '-cef-enable-debugging', '-gamepadui'
    }
}
