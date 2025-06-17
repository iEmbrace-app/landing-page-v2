# 🔐 SECURITY SETUP REQUIRED

## Before Running the Project

1. **Create a `.env` file** in the root directory:
   ```bash
   cp .env.example .env
   ```

2. **Add your Supabase credentials** to the `.env` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

3. **Get your credentials** from [Supabase Dashboard](https://app.supabase.com/):
   - Go to Settings > API
   - Copy the URL and anon key

## Environment Variables

The project requires these environment variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Security Notes

- ✅ `.env` files are in `.gitignore` - credentials won't be committed
- ✅ Use `.env.example` as a template
- ⚠️ Never commit actual credentials to git
- ⚠️ Use environment variables for all sensitive data

## Development

```bash
# Install dependencies
npm install

# Set up environment variables (see above)
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run dev

# Build for production
npm run build
```
