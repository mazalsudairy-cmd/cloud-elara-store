# Push this repo to GitHub as cloud-elara-store
# Prerequisites:
# 1. Create an EMPTY repo at https://github.com/<YOUR_USERNAME>/cloud-elara-store (no README)
# 2. Set your GitHub username:  $env:GITHUB_USERNAME = "yourname"
#    Or pass:  .\scripts\push-cloud-elara-store.ps1 -GitHubUsername "yourname"
#
# On first push Git may open a browser or ask for a Personal Access Token.

param(
    [Parameter(Mandatory = $false)]
    [string]$GitHubUsername = $env:GITHUB_USERNAME
)

$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")
$repo = "cloud-elara-store"

if (-not $GitHubUsername -or $GitHubUsername.Trim() -eq "") {
    Write-Host "Set your GitHub username, then run again:" -ForegroundColor Yellow
    Write-Host '  $env:GITHUB_USERNAME = "your-github-username"' -ForegroundColor Cyan
    Write-Host "  .\scripts\push-cloud-elara-store.ps1" -ForegroundColor Cyan
    exit 1
}

$originUrl = "https://github.com/$GitHubUsername/$repo.git"

git remote remove origin 2>$null
git remote add origin $originUrl

Write-Host "Remote: $originUrl" -ForegroundColor Green
git push -u origin main

Write-Host "Done. Repo: https://github.com/$GitHubUsername/$repo" -ForegroundColor Green
