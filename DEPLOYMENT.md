# Deployment Guide

This guide covers deploying the Peer Review Platform to various cloud platforms.

## Table of Contents
1. [Local Development](#local-development)
2. [Vercel Deployment](#vercel-deployment)
3. [Netlify Deployment](#netlify-deployment)
4. [Docker Deployment](#docker-deployment)
5. [AWS Deployment](#aws-deployment)
6. [Environment Variables](#environment-variables)

## Local Development

### Prerequisites
- Node.js 16+ or higher
- npm or yarn package manager

### Setup

```bash
cd project
npm install
npm run dev
```

The application will run on `http://localhost:5173`

## Vercel Deployment

### Step 1: Prepare Repository

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Push to GitHub

```bash
# Create GitHub repo and push
git remote add origin https://github.com/yourusername/peer-review-platform.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Configure:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Set environment variables in Vercel dashboard:
   ```
   VITE_API_URL=https://your-api-url.com/api
   ```
6. Click "Deploy"

### Step 4: Configure Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

## Netlify Deployment

### Step 1: Create Netlify Site

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

### Step 2: Configure via Dashboard

1. Go to [netlify.com](https://netlify.com)
2. Click "New Site from Git"
3. Select your GitHub repository
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Set environment variables in Site Settings → Build & Deploy → Environment

### netlify.toml Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[env]
  [env.production]
    VITE_API_URL = "https://api.example.com"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Docker Deployment

### Step 1: Create Dockerfile

Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Step 2: Create .dockerignore

```
node_modules
.git
.gitignore
.env
.env.local
dist
.DS_Store
README.md
```

### Step 3: Build and Run

```bash
# Build image
docker build -t peer-review-platform .

# Run container
docker run -p 3000:3000 peer-review-platform

# With environment variables
docker run -p 3000:3000 \
  -e VITE_API_URL=https://api.example.com \
  peer-review-platform
```

### Step 4: Docker Compose (Optional)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=https://api.example.com
    restart: unless-stopped

  # Optional: Add backend service
  api:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - ./backend:/app
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/peer_review
    depends_on:
      - db

  # Optional: Add database
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=peer_review
    volumes:
      - db_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  db_data:
```

Run with:
```bash
docker-compose up
```

## AWS Deployment

### Option 1: AWS Amplify

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Configure
amplify configure

# Initialize project
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

### Option 2: AWS S3 + CloudFront

```bash
# Build the app
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name/

# Invalidate CloudFront cache (optional)
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### Option 3: AWS Elastic Beanstalk

Create `.ebextensions/node.config`:

```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "serve -s dist -l 3000"
  aws:autoscaling:launchconfiguration:
    IamInstanceProfile: aws-elasticbeanstalk-ec2-role

commands:
  01_build:
    command: "npm run build"
```

Deploy:
```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p node.js-18 peer-review-platform

# Create environment
eb create peer-review-prod

# Deploy
eb deploy
```

## Environment Variables

### Development (.env.local)

```
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Peer Review Platform
VITE_LOG_LEVEL=debug
```

### Production (.env.production)

```
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Peer Review Platform
VITE_LOG_LEVEL=error
```

## CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x]

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Performance Optimization

### 1. Code Splitting

The app already supports automatic code splitting with Vite.

### 2. Image Optimization

Store images in `public/` directory and reference them:

```jsx
<img src="/images/logo.png" alt="Logo" />
```

### 3. Caching Strategy

In `vite.config.js`:

```javascript
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'zustand-vendor': ['zustand'],
        },
      },
    },
  },
}
```

### 4. Enable GZIP Compression

Most hosting providers enable this by default. Verify with:

```bash
curl -H "Accept-Encoding: gzip" -I https://yourdomain.com
```

## Security Checklist

- [ ] Use HTTPS only
- [ ] Set secure headers (CSP, X-Frame-Options, etc.)
- [ ] Implement rate limiting on API
- [ ] Use environment variables for secrets
- [ ] Enable CORS properly
- [ ] Regular security audits: `npm audit`
- [ ] Keep dependencies updated: `npm update`
- [ ] Use httpOnly cookies for tokens
- [ ] Implement CSRF protection

## Monitoring and Logging

### Sentry Integration (Error Tracking)

```bash
npm install @sentry/react @sentry/tracing
```

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://key@sentry.io/project-id",
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

export default Sentry.withProfiler(App);
```

### Analytics

Consider adding:
- Google Analytics
- Mixpanel
- LogRocket
- Datadog

## Troubleshooting

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Environment Variables Not Working

```bash
# Verify they're prefixed with VITE_
echo $VITE_API_URL

# Restart dev server after changing
npm run dev
```

### CORS Issues

Ensure your backend is configured with proper CORS:

```javascript
// Express example
const cors = require('cors');
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

### Assets Not Loading

Check that paths are relative:
- ✅ `/images/logo.png` - correct
- ✅ `./images/logo.png` - correct
- ❌ `images/logo.png` - may not work in subdirectories

## Support

- GitHub Issues: Create a new issue for bugs
- Discussions: Open for feature requests
- Email: support@yourdomain.com

