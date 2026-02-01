# Deploying NoShowIQ to Vercel

NoShowIQ is a Full-Stack application using:
- **Frontend**: Next.js (React)
- **Backend**: Node.js (Next API Routes)
- **Database**: Mock JSON Storage (Ready for Prisma/Postgres)

## Steps to Deploy

### 1. Push to GitHub
If you haven't already:
```bash
git init
git add .
git commit -m "Initialize NoShowIQ Full Stack"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com).
2. Click **New Project**.
3. Import your GitHub repository.
4. Vercel will automatically detect the **Next.js** framework.
5. In the root directory, ensure it points to the `frontend` folder (or just the root if you moved the frontend there).

### 3. Environment Variables (Optional)
If you add a real database (like Neon or Supabase) later, add your `DATABASE_URL` to Vercel's environment variables.

### 4. Deploy!
Click **Deploy**. Your app will be live at `https://noshowiq.vercel.app`.

## Project Structure
- `src/app`: React UI (Next.js App Router).
- `src/app/api`: Node.js Backend routes.
- `src/lib/mockDb.ts`: Mock Database logic.
