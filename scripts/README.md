# ⚠️ SECURITY WARNING

**This directory contains example scripts that have hardcoded credentials for demonstration purposes.**

## Important Notes:

1. **DO NOT use these scripts in production** without updating them to use environment variables
2. **Update the scripts** to read from `.env` files before using
3. **Never commit actual credentials** to version control

## Scripts Overview:

- `setup.sql` - Database schema setup (contains example URLs)
- `uploadVideos.js` - Video upload script (needs env var updates)
- `setupBucket.js` - Bucket creation script (needs env var updates)
- `checkBucket.js` - Bucket verification script (needs env var updates)

## Usage:

Before using any script:
1. Copy `.env.example` to `.env`
2. Update scripts to use `process.env.VITE_SUPABASE_URL` and `process.env.VITE_SUPABASE_ANON_KEY`
3. Test with your actual credentials

## Security Best Practices:

- ✅ Use environment variables for all sensitive data
- ✅ Keep actual credentials in `.env` (which is gitignored)
- ✅ Use `.env.example` for documentation
- ❌ Never hardcode credentials in scripts
- ❌ Never commit `.env` files to git
