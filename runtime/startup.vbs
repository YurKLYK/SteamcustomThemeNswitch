Set shell = CreateObject("WScript.Shell")
Set files = CreateObject("Scripting.FileSystemObject")
profile = shell.ExpandEnvironmentStrings("%USERPROFILE%")
script = profile & "\homebrew\themes\Switch Home for Steam\runtime\watch-home.mjs"
node = "node.exe"
nodePathFile = profile & "\homebrew\themes\Switch Home for Steam\runtime\node-path.txt"
If files.FileExists(nodePathFile) Then
    Set savedPath = files.OpenTextFile(nodePathFile, 1, False, -1)
    If Not savedPath.AtEndOfStream Then node = Trim(savedPath.ReadLine)
    savedPath.Close
End If
shell.Run """" & node & """ """ & script & """", 0, False
