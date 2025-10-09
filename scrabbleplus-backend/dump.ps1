# dump-spring.ps1
param(
  [string]$OutFile = "spring-dump.txt",
  [int]$HeadLines = 0,
  [int]$TailLines = 0
)

$ErrorActionPreference = 'Stop'
$root = (Get-Location).Path

function Get-Lang($path) {
  $ext = [IO.Path]::GetExtension($path).TrimStart('.').ToLowerInvariant()
  switch ($ext) {
    'java' { 'java' }
    'xml'  { 'xml' }
    'yml'  { 'yaml' }
    'yaml' { 'yaml' }
    default { '' }
  }
}

# Safe relative-path helper for PowerShell 5
function Get-RelPath($base, $target) {
  try {
    $uri1 = New-Object System.Uri($base + [IO.Path]::DirectorySeparatorChar)
    $uri2 = New-Object System.Uri($target)
    return $uri1.MakeRelativeUri($uri2).ToString() -replace '/', '\'
  } catch { return $target }
}

$excludeRe = '(\\|/)(?:\.git|target|build|out|node_modules|bin|obj|\.idea|\.vscode)(?:\\|/|$)'

# Git info (optional)
$gitInfo = $null
try {
  $branch = (git rev-parse --abbrev-ref HEAD 2>$null)
  if ($branch) {
    $commit = (git rev-parse --short HEAD 2>$null)
    git diff --quiet --ignore-submodules HEAD 2>$null
    $dirty = if ($LASTEXITCODE -ne 0) { '*dirty*' } else { 'clean' }
    $gitInfo = @{ Branch=$branch.Trim(); Commit=$commit.Trim(); Status=$dirty }
  }
} catch {}

# Header
"### Spring Project Source Dump" | Out-File $OutFile -Encoding UTF8
"Root: $root" | Out-File $OutFile -Append -Encoding UTF8
"Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz')" | Out-File $OutFile -Append -Encoding UTF8
if ($gitInfo) { "Git: branch=$($gitInfo.Branch), commit=$($gitInfo.Commit), status=$($gitInfo.Status)" | Out-File $OutFile -Append -Encoding UTF8 }
"`n---`n" | Out-File $OutFile -Append -Encoding UTF8

# Collect source files
$files = Get-ChildItem -Recurse -File | Where-Object {
  $_.FullName -notmatch $excludeRe -and
  $_.Extension -match '^\.(java|xml|yml|yaml)$'
} | Sort-Object FullName

foreach ($f in $files) {
  $rel = Get-RelPath $root $f.FullName
  $lang = Get-Lang $f.FullName

  "==== BEGIN FILE: $rel" | Out-File $OutFile -Append -Encoding UTF8
  "Size: $($f.Length) bytes" | Out-File $OutFile -Append -Encoding UTF8
  if ($gitInfo) { "GitRef: $($gitInfo.Branch)@$($gitInfo.Commit)" | Out-File $OutFile -Append -Encoding UTF8 }
  "" | Out-File $OutFile -Append -Encoding UTF8

  try {
    $text = Get-Content -Raw -Encoding UTF8 -LiteralPath $f.FullName

    # Optional truncation
    if ($HeadLines -gt 0 -and $TailLines -ge 0) {
      $lines = $text -split "`r?`n"
      if ($lines.Count -gt ($HeadLines + $TailLines) -and $TailLines -gt 0) {
        $head = $lines[0..([Math]::Min($HeadLines, $lines.Count-1))]
        $tail = $lines[($lines.Count - $TailLines)..($lines.Count - 1)]
        $text = ($head -join "`n") + "`n... [truncated] ...`n" + ($tail -join "`n")
      } elseif ($lines.Count -gt $HeadLines -and $TailLines -eq 0) {
        $head = $lines[0..([Math]::Min($HeadLines, $lines.Count-1))]
        $text = ($head -join "`n") + "`n... [truncated] ..."
      }
    }

    ('```{0}' -f $lang) | Out-File $OutFile -Append -Encoding UTF8
    $text | Out-File $OutFile -Append -Encoding UTF8
    '```' | Out-File $OutFile -Append -Encoding UTF8
  } catch {
    '```' | Out-File $OutFile -Append -Encoding UTF8
    "!! Failed to read file: $($_.Exception.Message)" | Out-File $OutFile -Append -Encoding UTF8
    '```' | Out-File $OutFile -Append -Encoding UTF8
  }

  "`n==== END FILE`n`n" | Out-File $OutFile -Append -Encoding UTF8
}

"---`n### End of Dump" | Out-File $OutFile -Append -Encoding UTF8
Write-Host "Wrote $($files.Count) files to $OutFile"
