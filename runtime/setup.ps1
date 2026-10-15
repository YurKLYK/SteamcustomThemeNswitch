param([switch]$SkipDependencies, [switch]$NoStart, [switch]$NoStartup, [switch]$NoShortcuts, [string]$ThemeRoot)
$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
if (-not $SkipDependencies) {
    $steam = (Get-ItemProperty -LiteralPath 'HKCU:\Software\Valve\Steam' -ErrorAction SilentlyContinue).SteamExe
    if (-not $steam -or -not (Test-Path -LiteralPath $steam)) { throw 'Install Steam and sign in first: https://store.steampowered.com/about/' }
    $node = Get-Command node.exe -ErrorAction SilentlyContinue
    $nodeVersion = if ($node) { & $node.Source --version } else { '' }
    if ($nodeVersion -notmatch '^v(\d+)\.' -or [int]$Matches[1] -lt 24) {
        if (-not (Get-Command winget.exe -ErrorAction SilentlyContinue)) { throw 'Install Node.js 24 LTS from https://nodejs.org/ then run Setup.cmd again.' }
        Write-Host 'Installing official Node.js LTS through Windows Package Manager. Windows may ask for permission.'
        & winget.exe install --id OpenJS.NodeJS.LTS --exact --source winget --accept-source-agreements --accept-package-agreements --disable-interactivity
        if ($LASTEXITCODE -ne 0) { throw "Node.js installer failed ($LASTEXITCODE). Install Node.js 24 LTS manually and retry." }
        $env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')
    }
    $installed = @(Get-ItemProperty 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*','HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*','HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*' -ErrorAction SilentlyContinue | Where-Object { $_.DisplayName -match 'CSSLoader' })
    if ($installed.Count -eq 0) {
        Write-Host 'Downloading the official CSSLoader Desktop installer. Complete its installation window.'
        $release = Invoke-RestMethod 'https://api.github.com/repos/DeckThemes/CSSLoader-Desktop/releases/latest'
        $assets = @($release.assets | Where-Object { $_.name -match '\.msi$' })
        if ($assets.Count -ne 1) { throw 'Cannot identify the Windows installer. Install CSSLoader Desktop from its official Releases page and retry.' }
        $uri = [Uri]$assets[0].browser_download_url
        if ($uri.Scheme -ne 'https' -or $uri.Host -ne 'github.com' -or -not $uri.AbsolutePath.StartsWith('/DeckThemes/CSSLoader-Desktop/releases/download/')) { throw 'Unexpected CSSLoader download URL.' }
        $download = Join-Path ([IO.Path]::GetTempPath()) ('shfs-cssloader-' + [Guid]::NewGuid().ToString('N'))
        New-Item -ItemType Directory -Path $download | Out-Null
        $msi = Join-Path $download 'CSSLoader.Desktop.msi'
        Invoke-WebRequest -UseBasicParsing -Uri $uri.AbsoluteUri -OutFile $msi
        $result = Start-Process -FilePath msiexec.exe -ArgumentList ('/i "{0}" /norestart' -f $msi) -Wait -PassThru
        if ($result.ExitCode -notin @(0,3010)) { throw "CSSLoader installer failed or was cancelled ($($result.ExitCode))." }
    }
}
$installArgs = @{ NoStart=$NoStart; NoStartup=$NoStartup; NoShortcuts=$NoShortcuts }
if ($ThemeRoot) { $installArgs.ThemeRoot = $ThemeRoot }
& (Join-Path $PSScriptRoot 'install.ps1') @installArgs
Write-Host 'Theme CSS and helper installed. Open CSSLoader Desktop, install its Backend if prompted, refresh themes, and enable Switch Home for Steam (Dark).'
