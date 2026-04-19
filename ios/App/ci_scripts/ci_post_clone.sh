#!/bin/sh
set -e

echo "Starting ci_post_clone.sh..."

# 1. Add Homebrew to PATH for both Intel and Apple Silicon
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"

# 2. Optimize Homebrew
export HOMEBREW_NO_AUTO_UPDATE=1
export HOMEBREW_NO_INSTALL_CLEANUP=1

# 3. Install Node if not present
if ! command -v node >/dev/null 2>&1; then
    echo "Node.js not found. Installing via Homebrew..."
    brew install node
else
    echo "Node.js is already installed: $(node -v)"
fi

# 4. Navigate to project root
cd "$CI_PRIMARY_REPOSITORY_PATH"
echo "Project root: $(pwd)"

# 5. Install dependencies and sync
echo "Installing dependencies..."
npm install --no-audit --no-fund

echo "Syncing Capacitor..."
npx cap sync ios

echo "Finished ci_post_clone.sh successfully!"


