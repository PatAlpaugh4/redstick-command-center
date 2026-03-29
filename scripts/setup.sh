#!/bin/bash

set -e

echo "🚀 Setting up Redstick Ventures Command Center..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "${RED}❌ Node.js version 18+ required. Found: $(node -v)${NC}"
    exit 1
fi

echo "${GREEN}✓ Node.js $(node -v)${NC}"

if ! command -v npm &> /dev/null; then
    echo "${RED}❌ npm is not installed.${NC}"
    exit 1
fi

echo "${GREEN}✓ npm $(npm -v)${NC}"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo ""
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo "${YELLOW}⚠️  Please update .env.local with your configuration${NC}"
else
    echo "${GREEN}✓ .env.local already exists${NC}"
fi

# Check for PostgreSQL
echo ""
echo "🗄️  Checking PostgreSQL..."
if command -v psql &> /dev/null; then
    echo "${GREEN}✓ PostgreSQL client found${NC}"
elif command -v docker &> /dev/null; then
    echo "${YELLOW}⚠️  PostgreSQL not found, but Docker is available${NC}"
    echo "   You can start PostgreSQL with: docker-compose up -d db"
else
    echo "${YELLOW}⚠️  PostgreSQL not found. Please install PostgreSQL or use Docker.${NC}"
fi

# Setup database (if connection string is configured)
echo ""
echo "🗄️  Setting up database..."
if grep -q "postgresql://" .env.local; then
    echo "Running database migrations..."
    npx prisma migrate dev --name init || echo "${YELLOW}⚠️  Migration failed. Please check your DATABASE_URL${NC}"
    
    echo "Seeding database..."
    npx prisma db seed || echo "${YELLOW}⚠️  Seeding failed${NC}"
else
    echo "${YELLOW}⚠️  DATABASE_URL not configured. Skipping database setup.${NC}"
    echo "   Please update .env.local with your database connection string."
fi

# Success message
echo ""
echo "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Update .env.local with your configuration"
echo "  2. Start the development server: npm run dev"
echo "  3. Open http://localhost:3000"
echo ""
echo "Documentation:"
echo "  - README.md - Project overview"
echo "  - DEVELOPMENT.md - Development guide"
echo "  - ARCHITECTURE.md - System architecture"
echo ""
