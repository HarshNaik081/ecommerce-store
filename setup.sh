#!/bin/bash

# ShopSphere E-commerce Platform - Setup Script
# This script automates the setup process for the entire application

echo "🚀 ShopSphere E-commerce Platform - Automated Setup"
echo "===================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if Node.js is installed
print_info "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js v18+ from https://nodejs.org/"
    exit 1
fi
print_success "Node.js $(node --version) found"

# Check if MongoDB is installed
print_info "Checking MongoDB installation..."
if ! command -v mongod &> /dev/null; then
    print_warning "MongoDB not found in PATH. Make sure MongoDB is installed and running."
fi

echo ""
print_info "Setting up Backend..."
echo "--------------------"

# Navigate to backend directory
cd backend || exit

# Install backend dependencies
print_info "Installing backend dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_success "Backend dependencies installed"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_info "Creating .env file..."
    cp .env.example .env
    print_success ".env file created"
    print_warning "Please edit backend/.env with your configuration"
else
    print_info ".env file already exists"
fi

echo ""
read -p "Do you want to seed the database with sample data? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Seeding database..."
    npm run seed
    if [ $? -eq 0 ]; then
        print_success "Database seeded successfully"
        echo ""
        print_info "Default login credentials:"
        echo "  Admin: admin@shopsphere.com / admin123"
        echo "  User:  john@example.com / password123"
    else
        print_error "Failed to seed database"
    fi
fi

# Go back to root
cd ..

echo ""
print_info "Setting up Frontend..."
echo "--------------------"

# Navigate to frontend directory
cd frontend || exit

# Install frontend dependencies (optional)
if [ -f package.json ]; then
    print_info "Installing frontend dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        print_success "Frontend dependencies installed"
    fi
fi

# Go back to root
cd ..

echo ""
echo "===================================================="
print_success "Setup Complete!"
echo "===================================================="
echo ""

print_info "Next steps:"
echo ""
echo "1. Start MongoDB (if not running):"
echo "   $ mongod"
echo ""
echo "2. Start the backend server:"
echo "   $ cd backend"
echo "   $ npm run dev"
echo "   Backend will run on: http://localhost:5000"
echo ""
echo "3. In a new terminal, start the frontend:"
echo "   $ cd frontend"
echo "   $ npx http-server -p 3000"
echo "   Frontend will run on: http://localhost:3000"
echo ""
echo "Alternative: Use Docker"
echo "   $ docker-compose up -d"
echo "   Access at: http://localhost"
echo ""
print_success "Happy coding! 🎉"
