#!/bin/bash

# Apartment Booking App - Apply Backend Fixes Script
# This script will replace all the broken files with fixed versions

echo "🔧 Starting Backend Fixes Application..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from your project root directory"
    exit 1
fi

echo "📁 Backing up original files..."
mkdir -p .backup/models
mkdir -p .backup/api/users
mkdir -p .backup/api/appartements

# Backup originals
cp src/models/Reservation.js .backup/models/ 2>/dev/null
cp src/models/Louer.js .backup/models/ 2>/dev/null
cp src/app/api/users/route.js .backup/api/users/ 2>/dev/null
cp src/app/api/users/authentification/route.js .backup/api/users/ 2>/dev/null
cp src/app/api/appartements/route.js .backup/api/appartements/ 2>/dev/null
cp src/app/api/appartements/[id]/route.js .backup/api/appartements/ 2>/dev/null

echo "✅ Backups created in .backup/ directory"
echo ""

echo "🔄 Applying fixes..."

# Replace Models
if [ -f "src/models/Reservation_fixed.js" ]; then
    cp src/models/Reservation_fixed.js src/models/Reservation.js
    echo "  ✓ Fixed Reservation model"
fi

if [ -f "src/models/Louer_fixed.js" ]; then
    cp src/models/Louer_fixed.js src/models/Louer.js
    echo "  ✓ Fixed Louer model"
fi

# Replace API Routes
if [ -f "src/app/api/users/route_fixed.js" ]; then
    cp src/app/api/users/route_fixed.js src/app/api/users/route.js
    echo "  ✓ Fixed Users API route"
fi

if [ -f "src/app/api/users/authentification/route_fixed.js" ]; then
    cp src/app/api/users/authentification/route_fixed.js src/app/api/users/authentification/route.js
    echo "  ✓ Fixed Authentication API route"
fi

if [ -f "src/app/api/appartements/route_fixed.js" ]; then
    cp src/app/api/appartements/route_fixed.js src/app/api/appartements/route.js
    echo "  ✓ Fixed Appartements API route"
fi

if [ -f "src/app/api/appartements/[id]/route_fixed.js" ]; then
    cp "src/app/api/appartements/[id]/route_fixed.js" "src/app/api/appartements/[id]/route.js"
    echo "  ✓ Fixed Appartements [id] API route"
fi

echo ""
echo "🧹 Cleaning up temporary files..."
rm -f src/models/*_fixed.js
rm -f src/app/api/users/*_fixed.js
rm -f src/app/api/users/authentification/*_fixed.js
rm -f src/app/api/appartements/*_fixed.js
rm -f "src/app/api/appartements/[id]/*_fixed.js"

echo ""
echo "✅ All backend fixes applied successfully!"
echo ""
echo "📦 Next steps:"
echo "  1. Remove unused dependencies:"
echo "     npm uninstall @prisma/client prisma mysql2"
echo ""
echo "  2. Make sure your .env.local has these variables:"
echo "     - MONGODB_URI"
echo "     - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
echo "     - CLERK_SECRET_KEY"
echo "     - API_SECRET_KEY"
echo ""
echo "  3. Start your dev server and test:"
echo "     npm run dev"
echo ""
echo "  4. Test an API endpoint:"
echo "     http://localhost:3000/api/appartements"
echo ""
echo "📚 See BACKEND_FIXES_DOCUMENTATION.md for full details"
echo ""
echo "🎉 Done! Your backend is now ready."
