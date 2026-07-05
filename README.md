<<<<<<< HEAD
# PlaywrightAutomation

Playwright-based UI/API automation framework.

Quick push instructions

Prerequisites:
- Git installed: https://git-scm.com/downloads
- GitHub CLI (`gh`) recommended: https://cli.github.com/

Using the included PowerShell helper (recommended):

1. Authenticate `gh`:

```powershell
gh auth login
```

2. Run the helper (replace username and repo name as needed):

```powershell
.\push-to-github.ps1 -Username <your-github-username> -RepoName PlaywrightAutomation
```

Manual steps (if not using `gh`):

```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
# create repository at github.com/<your-username>/<repo-name> via web UI
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Notes:
- The helper script will attempt to create the remote repo using `gh` and push the `main` branch.
- You must authenticate locally (via `gh auth login` or provide credentials for HTTPS pushes).

=======
# PLAYWRIGHTAUTOMATION
playwright automation for api and web
>>>>>>> b4968980a58062c4cde50bc261f72e41040887a7
