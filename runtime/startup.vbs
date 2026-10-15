Set shell = CreateObject("WScript.Shell")
profile = shell.ExpandEnvironmentStrings("%USERPROFILE%")
script = profile & "\homebrew\themes\Switch Home for Steam\runtime\launch.ps1"
shell.Run "powershell.exe -NoProfile -ExecutionPolicy Bypass -File """ & script & """ -WatcherOnly", 0, False
