# Post-Mortem: Uncommitted Local Fix Caused Production Build Failure

**Date:** 2026-02-08
**Author:** Claude
**Severity:** Medium (production deployment blocked)

## Incident

Production deployment to Vercel failed repeatedly due to TypeScript error: `Property 'assignedTo' does not exist on type 'OrderTask'`. The fix existed locally but was never committed, causing a mismatch between local builds (passing) and CI builds (failing).

## Timeline

1. During earlier work, `components/features/task-list.tsx` was edited to remove a reference to `task.assignedTo`
2. `npm run build` ran locally and passed (using the fixed local file)
3. Other files were committed but `task-list.tsx` was missed
4. Deployed to Vercel - build failed because git had the broken version
5. Vercel errors were not investigated; assumed the "Ready" deployment was current
6. User reported branding not working; old deployment was still live because new code couldn't build

## Root Cause

**Modified files were not verified as committed before deploying.**

The local build passed, which gave false confidence. Vercel builds from git, not from local files.

## What Went Wrong

1. Made an edit and didn't immediately commit it
2. Didn't run `git status` before deploying to check for uncommitted changes
3. Saw Vercel "Error" status in the deployment list but didn't investigate
4. Assumed the successful deployment was current code

## Prevention

1. **Always run `git status` before deploying** - verify no uncommitted changes
2. **Run `git diff --stat` to see what's modified** - catch forgotten edits
3. **Investigate build errors immediately** - don't assume they're transient
4. **After committing, run `git status` again** - confirm working tree is clean
5. **Trust CI over local builds** - if CI fails, the problem is real

## Checklist Before Deploy

```bash
git status                  # Check for uncommitted files
git diff --stat             # See what's different
npm run build               # Verify build passes
git add <files>             # Stage changes
git status                  # Confirm staged correctly
git commit                  # Commit
git status                  # Confirm clean
git push && vercel --prod   # Deploy
```

## Resolution

Committed the missing fix to `task-list.tsx` and redeployed. Build succeeded.
