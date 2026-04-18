#!/bin/bash

# ============================================================================
# Binder OS - Demo Request System Complete Setup Script
# ============================================================================
# This script automates the entire setup process for the demo request form
# with email integration using Google Apps Script
# 
# Usage: bash scripts/setup-demo-system.sh
# ============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Utility functions
print_header() {
    echo -e "\n${CYAN}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}\n"
}

print_step() {
    echo -e "${BLUE}➜${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# ============================================================================
# Step 1: Check prerequisites
# ============================================================================
print_header "Step 1: Checking Prerequisites"

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi
print_success "Node.js is installed ($(node --version))"

if ! command -v npm &> /dev/null && ! command -v bun &> /dev/null; then
    print_error "Neither npm nor bun is installed."
    exit 1
fi

if command -v bun &> /dev/null; then
    PKG_MANAGER="bun"
    print_success "Using bun as package manager ($(bun --version))"
else
    PKG_MANAGER="npm"
    print_success "Using npm as package manager ($(npm --version))"
fi

# ============================================================================
# Step 2: Install dependencies
# ============================================================================
print_header "Step 2: Installing Dependencies"

print_step "Installing packages with $PKG_MANAGER..."
cd "$PROJECT_ROOT"

if [ "$PKG_MANAGER" = "bun" ]; then
    bun install
else
    npm install
fi

print_success "Dependencies installed successfully"

# ============================================================================
# Step 3: Create .env file
# ============================================================================
print_header "Step 3: Setting Up Environment Variables"

ENV_FILE="$PROJECT_ROOT/.env"
ENV_EXAMPLE="$PROJECT_ROOT/.env.example"

if [ -f "$ENV_FILE" ]; then
    print_warning ".env file already exists"
    read -p "Do you want to overwrite it? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_step "Keeping existing .env file"
    else
        rm "$ENV_FILE"
        touch "$ENV_FILE"
    fi
else
    print_step "Creating .env file..."
    touch "$ENV_FILE"
fi

# Create or update .env file with placeholders
cat > "$ENV_FILE" << 'EOF'
# Google Apps Script Configuration
# Get this URL from: https://script.google.com/
# 1. Deploy your script as Web App
# 2. Copy the deployment URL here
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/d/{DEPLOYMENT_ID}/userweb

# Email Configuration
VITE_ADMIN_EMAIL=info@binder33labs.com
VITE_APP_SCRIPT_EMAIL=info@binder-os.com
EOF

print_success ".env file created with placeholder values"

# ============================================================================
# Step 4: Check if apps-script directory exists
# ============================================================================
print_header "Step 4: Checking Google Apps Script Files"

APPS_SCRIPT_DIR="$PROJECT_ROOT/apps-script"

if [ ! -d "$APPS_SCRIPT_DIR" ]; then
    print_step "Creating apps-script directory..."
    mkdir -p "$APPS_SCRIPT_DIR"
    print_success "apps-script directory created"
else
    print_success "apps-script directory already exists"
fi

if [ ! -f "$APPS_SCRIPT_DIR/EmailHandler.gs" ]; then
    print_warning "EmailHandler.gs not found in apps-script directory"
    echo -e "${YELLOW}Please manually create EmailHandler.gs or copy it from the template${NC}"
else
    print_success "EmailHandler.gs found in apps-script directory"
fi

# ============================================================================
# Step 5: Display component files info
# ============================================================================
print_header "Step 5: Component Files Status"

COMPONENT_FILES=(
    "src/components/DemoRequestForm.tsx"
    "src/components/Navbar.tsx"
    "src/components/ui/dialog.tsx"
    "src/App.css"
)

for file in "${COMPONENT_FILES[@]}"; do
    if [ -f "$PROJECT_ROOT/$file" ]; then
        print_success "$file exists"
    else
        print_warning "$file not found (may need to be created)"
    fi
done

# ============================================================================
# Step 6: Display Google Apps Script Setup Instructions
# ============================================================================
print_header "Step 6: Google Apps Script Deployment Instructions"

cat << 'EOF'
To complete the setup, you need to deploy the Google Apps Script:

1. Go to https://script.google.com/
2. Create a NEW PROJECT
3. Copy the entire content of apps-script/EmailHandler.gs
4. Paste it into the Google Apps Script editor
5. SAVE the project

6. Deploy as Web App:
   - Click "Deploy" button (top right)
   - Select "New Deployment"
   - Choose type: "Web app"
   - Execute as: Your Gmail account
   - Who has access: "Anyone"
   - Click "Deploy"

7. A dialog will appear with the deployment URL
   Copy the URL: https://script.google.com/macros/d/[DEPLOYMENT_ID]/userweb

8. Update your .env file:
   VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/d/[YOUR_DEPLOYMENT_ID]/userweb

9. Configure email addresses in apps-script/EmailHandler.gs:
   const ADMIN_EMAIL = "your-admin@email.com"
   const APP_SCRIPT_EMAIL = "sender@email.com"

10. IMPORTANT: Redeploy after making any changes to EmailHandler.gs
    - Click "Deploy" → "Manage Deployments" 
    - Select your deployment
    - Click the update/refresh button
    - Select "Deploy" for the new version

EOF

# ============================================================================
# Step 7: Build and development info
# ============================================================================
print_header "Step 7: Development & Build Commands"

cat << 'EOF'
Available commands:

Development:
  npm run dev       - Start development server (http://localhost:5173)
  bun run dev       - Using bun

Testing:
  npm run test      - Run unit tests
  bun run test      - Using bun

Build & Deploy:
  npm run build     - Create production build
  bun run build     - Using bun
  npm run preview   - Preview production build locally

Linting:
  npm run lint      - Check code quality

Testing the Form:
  1. Ensure .env has correct VITE_GOOGLE_APPS_SCRIPT_URL
  2. Run: npm run dev (or bun run dev)
  3. Navigate to http://localhost:5173
  4. Click "Request Demo" button
  5. Fill out the form
  6. Click "Request Demo"
  7. Check your email for confirmation

EOF

# ============================================================================
# Step 8: Create useful helper scripts
# ============================================================================
print_header "Step 8: Creating Helper Scripts"

# Create a script to easily update environment variables
HELPERS_DIR="$PROJECT_ROOT/scripts"
mkdir -p "$HELPERS_DIR"

cat > "$HELPERS_DIR/update-env.sh" << 'EOF'
#!/bin/bash
# Quick script to update environment variables

echo "=== Update Environment Variables ==="
echo ""
read -p "Enter Google Apps Script URL: " SCRIPT_URL
read -p "Enter Admin Email (default: info@binder33labs.com): " ADMIN_EMAIL
read -p "Enter App Script Email (default: info@binder-os.com): " APP_SCRIPT_EMAIL

ADMIN_EMAIL=${ADMIN_EMAIL:-"info@binder33labs.com"}
APP_SCRIPT_EMAIL=${APP_SCRIPT_EMAIL:-"info@binder-os.com"}

ENV_FILE=".env"

# Update .env file
sed -i.bak "s|VITE_GOOGLE_APPS_SCRIPT_URL=.*|VITE_GOOGLE_APPS_SCRIPT_URL=$SCRIPT_URL|" "$ENV_FILE"
sed -i.bak "s|VITE_ADMIN_EMAIL=.*|VITE_ADMIN_EMAIL=$ADMIN_EMAIL|" "$ENV_FILE"
sed -i.bak "s|VITE_APP_SCRIPT_EMAIL=.*|VITE_APP_SCRIPT_EMAIL=$APP_SCRIPT_EMAIL|" "$ENV_FILE"

rm "${ENV_FILE}.bak"

echo "✓ Environment variables updated successfully!"
echo ""
echo "Updated .env:"
cat "$ENV_FILE"
EOF

chmod +x "$HELPERS_DIR/update-env.sh"
print_success "Created update-env.sh helper script"

# ============================================================================
# Step 9: Create configuration reference
# ============================================================================
print_header "Step 9: Configuration Reference"

cat > "$PROJECT_ROOT/.env.reference.js" << 'EOF'
/**
 * Environment Variables Reference Guide
 * 
 * Copy these to your .env file and fill in your values
 */

// Google Apps Script Web App URL
// Format: https://script.google.com/macros/d/{DEPLOYMENT_ID}/userweb
// Where {DEPLOYMENT_ID} is obtained from your deployed Google Apps Script
// Instructions:
//   1. Go to https://script.google.com/
//   2. Create new project
//   3. Paste EmailHandler.gs code
//   4. Deploy as Web App
//   5. Copy the deployment URL
VITE_GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/d/{DEPLOYMENT_ID}/userweb";

// Admin email address where demo requests will be sent
// This should be your company's email where leads are managed
VITE_ADMIN_EMAIL = "info@binder33labs.com";

// Email address that sends the emails from Google Apps Script
// This should be a Gmail account you have access to
VITE_APP_SCRIPT_EMAIL = "info@binder-os.com";
EOF

print_success "Created .env.reference.js configuration guide"

# ============================================================================
# Step 10: Summary
# ============================================================================
print_header "Setup Complete! ✓"

cat << EOF
${GREEN}All steps completed successfully!${NC}

${CYAN}Next Actions:${NC}

1. ${YELLOW}Deploy Google Apps Script:${NC}
   - Go to https://script.google.com/
   - Create new project
   - Copy apps-script/EmailHandler.gs content
   - Deploy as Web App
   - Copy deployment URL

2. ${YELLOW}Update .env file:${NC}
   - Run: bash scripts/update-env.sh
   - Or manually edit .env with your deployment URL

3. ${YELLOW}Start development:${NC}
   - Run: npm run dev (or bun run dev)
   - Visit: http://localhost:5173
   - Test the demo request form

4. ${YELLOW}Production deployment:${NC}
   - Run: npm run build
   - Deploy to your hosting service

${BLUE}Documentation Files:${NC}
- .env.example          - Environment variables template
- .env.reference.js     - Configuration reference
- scripts/update-env.sh - Helper script to update config

${BLUE}For Questions or Issues:${NC}
- Check .env.reference.js for configuration help
- Review apps-script/EmailHandler.gs for email settings
- Ensure Google Apps Script deployment URL is correct

Happy demoing! 🚀
EOF

print_success "Setup script finished"
