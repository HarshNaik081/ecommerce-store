# ShopSphere E-commerce Platform - Windows Setup Script

Write-Host "🚀 ShopSphere E-commerce Platform - Automated Setup" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "ℹ Checking Node.js installation..." -ForegroundColor Blue
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed. Please install Node.js v18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if MongoDB is running
Write-Host "ℹ Checking MongoDB..." -ForegroundColor Blue
$mongoRunning = Get-Process mongod -ErrorAction SilentlyContinue
if ($mongoRunning) {
    Write-Host "✓ MongoDB is running" -ForegroundColor Green
} else {
    Write-Host "⚠ MongoDB is not running. Please start MongoDB service." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "ℹ Setting up Backend..." -ForegroundColor Blue
Write-Host "--------------------"

# Navigate to backend directory
Set-Location -Path "backend"

# Install backend dependencies
Write-Host "ℹ Installing backend dependencies..." -ForegroundColor Blue
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "ℹ Creating .env file..." -ForegroundColor Blue
    Copy-Item ".env.example" -Destination ".env"
    Write-Host "✓ .env file created" -ForegroundColor Green
    Write-Host "⚠ Please edit backend\.env with your configuration" -ForegroundColor Yellow
} else {
    Write-Host "ℹ .env file already exists" -ForegroundColor Blue
}

Write-Host ""
$seedDb = Read-Host "Do you want to seed the database with sample data? (y/n)"
if ($seedDb -eq 'y' -or $seedDb -eq 'Y') {
    Write-Host "ℹ Seeding database..." -ForegroundColor Blue
    npm run seed
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Database seeded successfully" -ForegroundColor Green
        Write-Host ""
        Write-Host "ℹ Default login credentials:" -ForegroundColor Blue
        Write-Host "  Admin: admin@shopsphere.com / admin123"
        Write-Host "  User:  john@example.com / password123"
    } else {
        Write-Host "✗ Failed to seed database" -ForegroundColor Red
    }
}

# Go back to root
Set-Location -Path ".."

Write-Host ""
Write-Host "ℹ Setting up Frontend..." -ForegroundColor Blue
Write-Host "--------------------"

# Navigate to frontend directory
Set-Location -Path "frontend"

# Install frontend dependencies (optional)
if (Test-Path "package.json") {
    Write-Host "ℹ Installing frontend dependencies..." -ForegroundColor Blue
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
    }
}

# Go back to root
Set-Location -Path ".."

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "✓ Setup Complete!" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "ℹ Next steps:" -ForegroundColor Blue
Write-Host ""
Write-Host "1. Start MongoDB (if not running):"
Write-Host '   > net start MongoDB'
Write-Host ""
Write-Host "2. Start the backend server:"
Write-Host "   > cd backend"
Write-Host "   > npm run dev"
Write-Host "   Backend will run on: http://localhost:5000"
Write-Host ""
Write-Host "3. In a new terminal, start the frontend:"
Write-Host "   > cd frontend"
Write-Host "   > npx http-server -p 3000"
Write-Host "   Frontend will run on: http://localhost:3000"
Write-Host ""
Write-Host "Alternative: Use Docker"
Write-Host "   > docker-compose up -d"
Write-Host "   Access at: http://localhost"
Write-Host ""
Write-Host "✓ Happy coding! 🎉" -ForegroundColor Green
