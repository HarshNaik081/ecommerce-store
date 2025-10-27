# MongoDB Installation & Setup Guide for Windows

## ⚠️ MongoDB Not Installed

Your system doesn't have MongoDB installed. Follow these steps to install it:

## Option 1: Install MongoDB Community Edition (Recommended)

### Step 1: Download MongoDB
1. Visit: https://www.mongodb.com/try/download/community
2. Select:
   - Version: Latest (7.0 or higher)
   - Platform: Windows
   - Package: MSI
3. Click "Download"

### Step 2: Install MongoDB
1. Run the downloaded `.msi` file
2. Choose "Complete" installation
3. **Important**: Check "Install MongoDB as a Service"
4. **Important**: Check "Install MongoDB Compass" (GUI tool)
5. Complete the installation

### Step 3: Verify Installation
Open PowerShell and run:
```powershell
mongod --version
```

### Step 4: Create Data Directory
```powershell
New-Item -ItemType Directory -Path C:\data\db -Force
```

### Step 5: Start MongoDB Service
```powershell
net start MongoDB
```

## Option 2: Use Docker (Alternative)

If you have Docker installed:

```powershell
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Option 3: Use MongoDB Atlas (Cloud - Free Tier)

1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create a free cluster
4. Get connection string
5. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shopsphere
   ```

## After Installing MongoDB

### 1. Verify MongoDB is Running
```powershell
# Check service status
Get-Service MongoDB

# Or connect with mongo shell
mongosh
```

### 2. Seed the Database
```powershell
cd backend
npm run seed
```

This will create:
- ✅ Admin user (admin@shopsphere.com / admin123)
- ✅ Demo users (user1@example.com / password123)
- ✅ 6 product categories
- ✅ 10 sample products with reviews

### 3. Test the API
Visit: http://localhost:5000/api/health

## Quick Start Commands (After MongoDB Installation)

### Terminal 1: MongoDB (if not running as service)
```powershell
mongod --dbpath=C:\data\db
```

### Terminal 2: Backend
```powershell
cd backend
npm run dev
```

### Terminal 3: Frontend
```powershell
cd frontend
npx http-server -p 8080
```

## Troubleshooting

### MongoDB won't start
```powershell
# Check if port 27017 is in use
netstat -ano | findstr :27017

# Kill process if needed
taskkill /PID <process_id> /F
```

### Can't connect to MongoDB
1. Check MongoDB is running: `Get-Service MongoDB`
2. Check firewall isn't blocking port 27017
3. Verify connection string in `.env` file

### Backend won't start
1. Make sure dependencies are installed: `npm install`
2. Check `.env` file exists
3. Verify Node.js is installed: `node --version`

## Current Status

✅ **Backend**: Running on http://localhost:5000  
✅ **Frontend**: Running on http://localhost:8080  
❌ **MongoDB**: Not installed - Install using steps above  

## Need Help?

Check the main README.md for more detailed documentation.
