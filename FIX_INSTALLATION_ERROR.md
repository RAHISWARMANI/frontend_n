# Fix Installation Error - Zustand Not Found

## Problem
```
[plugin:vite:import-analysis] Failed to resolve import "zustand" from "src/store.js".
Does the file exist?
```

This error means the `zustand` package (and other dependencies) are not installed in your `node_modules` folder.

---

## Solution 1: Using the Setup Batch File (EASIEST - Windows)

1. **Navigate to the project folder:**
   ```
   cd d:\ps26\project
   ```

2. **Double-click the `setup.bat` file** that was just created
   - It will automatically:
     - Clear npm cache
     - Remove old package lock files
     - Install all dependencies
     - Start the development server

3. **Wait for it to complete** (this may take 2-5 minutes)

4. **Your browser should open automatically** to http://localhost:5173

---

## Solution 2: Manual Command Line Installation (Windows Command Prompt)

If the batch file doesn't work, follow these steps manually:

1. **Open Command Prompt (cmd.exe)** - NOT PowerShell
   - Press `Win + R`
   - Type `cmd`
   - Press Enter

2. **Navigate to project:**
   ```
   cd /d d:\ps26\project
   ```

3. **Clear npm cache:**
   ```
   npm cache clean --force
   ```

4. **Remove lock file:**
   ```
   del package-lock.json
   ```

5. **Install all dependencies:**
   ```
   npm install
   ```
   - This will take 2-5 minutes
   - You'll see many lines of output as packages download

6. **Start development server:**
   ```
   npm run dev
   ```

7. **Open your browser to:**
   ```
   http://localhost:5173
   ```

---

## Solution 3: Git Bash Alternative (If Command Prompt Fails)

If you have Git installed on Windows:

1. **Right-click in the project folder**
2. **Select "Git Bash Here"**
3. **Run these commands:**
   ```bash
   npm cache clean --force
   rm -f package-lock.json
   npm install
   npm run dev
   ```

---

## Verification Checklist

After running the installation, check if these files exist:

✅ **node_modules folder** should exist and contain many folders  
✅ **node_modules/zustand** should exist  
✅ **node_modules/react** should exist  
✅ **node_modules/react-dom** should exist  

To verify from command prompt:
```bash
dir node_modules | findstr zustand
```

If you see `zustand`, the installation was successful!

---

## What These Commands Do

| Command | Purpose |
|---------|---------|
| `npm cache clean --force` | Clears any corrupted npm cache |
| `del package-lock.json` | Removes old lock file to force fresh install |
| `npm install` | Downloads and installs all packages from package.json |
| `npm run dev` | Starts the Vite development server |

---

## Troubleshooting

### If you get "npm is not recognized"
- Node.js is not installed
- Download from https://nodejs.org/ (use LTS version)
- Install it and restart your computer
- Then try again

### If installation is very slow
- Your internet connection might be slow
- Wait and let it complete (can take 5-10 minutes on slow connections)
- Do NOT stop the process

### If you get permission errors
- Run Command Prompt as Administrator:
  - Right-click cmd.exe
  - Select "Run as administrator"
  - Then run the commands again

### If port 5173 is already in use
- Another app is using the port
- Close other Vite dev servers
- Or run: `npm run dev -- --port 3000`

---

## Expected Output

When everything works correctly, you should see:

```
  VITE v8.0.0-beta.13  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Then your browser opens to show the Peer Review Platform login screen!

---

## Next Steps After Installation

1. ✅ You'll see the login screen
2. ✅ Click "John Teacher" to login as a teacher
3. ✅ Explore the dashboard
4. ✅ Try creating an assignment
5. ✅ Logout and login as "Alice Student"
6. ✅ Try uploading files and submitting reviews

---

## Quick Reference Commands

```bash
# Install dependencies (do this first!)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview

# Stop the dev server
Ctrl + C
```

---

**Choose Solution 1 (setup.bat) for the easiest experience!**

If you have any issues, try Solution 2 (Command Prompt) step by step.

