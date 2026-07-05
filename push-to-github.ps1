param(
    [Parameter(Mandatory=$true)] [string] $Username,
    [Parameter(Mandatory=$false)] [string] $RepoName = "PlaywrightAutomation",
    [switch] $Private
)

function ErrExit($msg){ Write-Error $msg; exit 1 }

if (-not (Get-Command git -ErrorAction SilentlyContinue)) { ErrExit "git is not installed. Install Git and retry." }
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) { Write-Host "Warning: GitHub CLI 'gh' not found. You can create the repo manually and then run the push steps." }

if (-not (Test-Path ".git")) {
    git init
}

git add .
try { git commit -m "Initial commit" } catch { Write-Host "No changes to commit or git commit failed." }

git branch -M main

$privacy = if ($Private.IsPresent) { "--private" } else { "--public" }
$repoArg = "$Username/$RepoName"

if (Get-Command gh -ErrorAction SilentlyContinue) {
    try {
        gh repo create $repoArg $privacy --source=. --remote=origin --push --confirm
        Write-Host "Repository created and pushed: https://github.com/$repoArg"
    } catch {
        Write-Error "gh failed to create or push. You can create the repo via the web UI and then run: git remote add origin https://github.com/$repoArg.git; git push -u origin main"
    }
} else {
    Write-Host "Please create the repo on GitHub (https://github.com/new) and then run the following commands:"
    Write-Host "git remote add origin https://github.com/$repoArg.git"
    Write-Host "git push -u origin main"
}
