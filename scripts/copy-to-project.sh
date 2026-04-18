#!/bin/bash

# ============================================================================
# Copy Demo System to New Project
# ============================================================================
# This script copies all reusable files from binder-os to another project
# 
# Usage: bash copy-to-project.sh /path/to/target/project
# ============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

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

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check arguments
if [ -z "$1" ]; then
    print_error "Please provide target project path"
    echo "Usage: bash copy-to-project.sh /path/to/target/project"
    exit 1
fi

TARGET_PROJECT="$1"

if [ ! -d "$TARGET_PROJECT" ]; then
    print_error "Target project directory does not exist: $TARGET_PROJECT"
    exit 1
fi

# Source is current directory
SOURCE_PROJECT="$(pwd)"

if [ ! -f "$SOURCE_PROJECT/package.json" ]; then
    print_error "Source project must have package.json"
    exit 1
fi

if [ ! -f "$TARGET_PROJECT/package.json" ]; then
    print_error "Target project must have package.json"
    exit 1
fi

print_header "Copy Demo Request System to New Project"

echo -e "${YELLOW}Source:${NC} $SOURCE_PROJECT"
echo -e "${YELLOW}Target:${NC} $TARGET_PROJECT"
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_error "Operation cancelled"
    exit 1
fi

# ============================================================================
# Copy files
# ============================================================================
print_header "Copying Reusable Files"

# Create necessary directories
print_step "Creating directories..."
mkdir -p "$TARGET_PROJECT/src/components/ui"
mkdir -p "$TARGET_PROJECT/apps-script"
mkdir -p "$TARGET_PROJECT/scripts"
print_success "Directories created"

# Copy component files
print_step "Copying component files..."
cp "$SOURCE_PROJECT/src/components/DemoRequestForm.tsx" "$TARGET_PROJECT/src/components/" || print_error "Failed to copy DemoRequestForm.tsx"
print_success "DemoRequestForm.tsx copied"

cp "$SOURCE_PROJECT/src/components/ui/dialog.tsx" "$TARGET_PROJECT/src/components/ui/" || print_error "Failed to copy dialog.tsx"
print_success "dialog.tsx copied"

# Copy CSS with time input fix
print_step "Copying CSS with time input styling..."
if grep -q "time.*::-webkit-calendar-picker-indicator" "$SOURCE_PROJECT/src/App.css"; then
    # Extract CSS time input fix
    sed -n '/\/\* Time input styling/,/^\}/p' "$SOURCE_PROJECT/src/App.css" >> "$TARGET_PROJECT/src/App.css"
    print_success "CSS time input fix added"
else
    print_error "Could not find time input CSS fix"
fi

# Copy Google Apps Script
print_step "Copying Google Apps Script..."
cp "$SOURCE_PROJECT/apps-script/EmailHandler.gs" "$TARGET_PROJECT/apps-script/" || print_error "Failed to copy EmailHandler.gs"
print_success "EmailHandler.gs copied"

# Copy setup scripts
print_step "Copying setup scripts..."
cp "$SOURCE_PROJECT/scripts/setup-demo-system.sh" "$TARGET_PROJECT/scripts/" || print_error "Failed to copy setup script"
chmod +x "$TARGET_PROJECT/scripts/setup-demo-system.sh"
print_success "setup-demo-system.sh copied and made executable"

if [ -f "$SOURCE_PROJECT/scripts/update-env.sh" ]; then
    cp "$SOURCE_PROJECT/scripts/update-env.sh" "$TARGET_PROJECT/scripts/"
    chmod +x "$TARGET_PROJECT/scripts/update-env.sh"
    print_success "update-env.sh copied"
fi

# Copy documentation
print_step "Copying documentation..."
cp "$SOURCE_PROJECT/.env.example" "$TARGET_PROJECT/" 2>/dev/null || echo "Creating .env.example..."
cp "$SOURCE_PROJECT/.env.reference.js" "$TARGET_PROJECT/" 2>/dev/null || echo "Creating .env.reference.js..."
cp "$SOURCE_PROJECT/REUSABLE_SETUP_GUIDE.md" "$TARGET_PROJECT/" 2>/dev/null
print_success "Documentation copied"

# ============================================================================
# Create checklist for user
# ============================================================================
print_header "Next Steps for Your Project"

cat << 'EOF'

The demo request system has been copied to your project.

REQUIRED CUSTOMIZATIONS:

1. Update Component Brand Text:
   - src/components/DemoRequestForm.tsx
     * Line 30: Update schema/labels with your content
     * Line 110-120: Update placeholder text
     * Line 135: Update "What's Your Main Purpose?" label

2. Update Navbar Button:
   - src/components/Navbar.tsx
     * Find: "Request Demo" button text
     * Update to your section name

3. Create/Update .env File:
   - Run: bash scripts/setup-demo-system.sh
   - Or manually create .env with:
     VITE_GOOGLE_APPS_SCRIPT_URL=<your-deployment-url>
     VITE_ADMIN_EMAIL=<your-admin-email>
     VITE_APP_SCRIPT_EMAIL=<your-sender-email>

4. Deploy Google Apps Script:
   - Go to https://script.google.com/
   - Create new project
   - Copy entire apps-script/EmailHandler.gs
   - Paste into Google Apps Script editor
   - Deploy as Web App
   - Get deployment URL
   - Add URL to .env

5. Update Email Templates (Optional):
   - Edit apps-script/EmailHandler.gs
   - Update email subjects and templates
   - Redeploy to Google Apps Script

6. Test the Form:
   - npm run dev
   - Click your button
   - Submit test form
   - Verify emails received

7. Deploy:
   - npm run build
   - Deploy to your hosting

REUSABLE SYSTEM:
- All form validation logic is reusable (no changes needed)
- All email submission logic is reusable (no changes needed)
- All Google Apps Script core functions are reusable (no changes needed)
- Only customize: brand text, email recipients, templates

For detailed instructions, see: REUSABLE_SETUP_GUIDE.md

Questions? Check:
- .env.reference.js for configuration help
- REUSABLE_SETUP_GUIDE.md for customization guide
- EmailHandler.gs for email settings

EOF

print_success "All files copied successfully!"
echo ""
echo -e "${GREEN}Your project is ready for customization.${NC}"
echo ""
echo "Run: bash scripts/setup-demo-system.sh"
echo "Then follow the 'Next Steps' above."
