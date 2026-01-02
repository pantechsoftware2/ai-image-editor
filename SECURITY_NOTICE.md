# 🔐 URGENT: Secret Removal Instructions

## GitHub Secret Scanner Alert

Your private key was exposed in commit history. Follow these steps immediately:

### Step 1: Revoke the Exposed Private Key
1. Go to Google Cloud Console
2. Navigate to "Service Accounts"
3. Delete the service account: `vizly-service@ai-image-editor-482905.iam.gserviceaccount.com`
4. Create a NEW service account and download a new private key
5. Update your `.env.local` with the new key (kept locally, never committed)

### Step 2: Remove Secret from Git History

**Option A: Use GitHub's Secret Scanning (Recommended)**
1. Go to: https://github.com/pantechsoftware2/Vizly/security/secret-scanning
2. Click "Allow secret" on the notification for the exposed key
3. This tells GitHub it's a false positive (or you've already revoked it)

**Option B: Rewrite Git History (Advanced)**
```bash
# Install BFG Repo-Cleaner (recommended for this)
# Or use git filter-branch to remove the file with secrets

# Remove the .env.local from all history
git filter-branch --tree-filter 'rm -f .env.local' -- --all

# Force push (be careful!)
git push origin --force --all
```

### Step 3: Verify .env Files

Your current `.env.local`:
- ✅ All secrets replaced with placeholders
- ✅ Not tracked by git (in .gitignore)
- ✅ Safe to use locally

Your `.env.example`:
- ✅ Template file for team reference
- ✅ Safe to commit (no real secrets)
- ✅ Contains only placeholder values

### Step 4: Regenerate All Credentials
1. **Google Cloud API Key**: 
   - Create new service account
   - Download new private key as JSON
   - Update GOOGLE_CLOUD_PRIVATE_KEY in .env.local

2. **Supabase Keys**:
   - Regenerate anon key (if exposed)
   - Regenerate service key (if exposed)
   - Update in .env.local

### Step 5: Enable Secret Scanning
In GitHub Settings:
- Enable "Secret scanning" in your repository
- Enable "Push protection" to prevent future commits with secrets

---

## What's Been Done ✅

1. ✅ Removed all secrets from `.env.local` (replaced with placeholders)
2. ✅ `.env.local` is in `.gitignore` (won't be committed again)
3. ✅ Removed all unnecessary `.md` files except README.md
4. ✅ Committed cleanup changes

## What You Need to Do NOW 🔴

1. **IMMEDIATELY**: Revoke the exposed private key in Google Cloud Console
2. Create a new service account and get new credentials
3. Update your local `.env.local` with new credentials
4. (Optional but recommended) Rewrite git history to remove the secret commit

---

## Future Prevention

Never commit environment files with real secrets:
- ✅ Always use `.env.local` (ignored by git)
- ✅ Keep template in `.env.example`
- ✅ Use GitHub Secrets for CI/CD
- ✅ Review `.gitignore` before commits
- ✅ Use pre-commit hooks to prevent secret commits

```bash
# Install git hooks to prevent this
npm install husky --save-dev
npx husky install
npx husky add .husky/pre-commit "npm run lint-secrets"
```
