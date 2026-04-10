#!/bin/sh
set -e

echo "Starting ci_post_clone.sh..."

# Navigate to the root of the cloned repository explicitly
cd $CI_WORKSPACE
echo "Workspace is: $(pwd)"

# Optimize Homebrew to install Node faster
export HOMEBREW_NO_INSTALL_CLEANUP=TRUE
export HOMEBREW_NO_INSTALLED_DEPENDENTS_CHECK=TRUE

echo "Installing Node.js..."
brew install node

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

echo "Installing project dependencies..."
npm install --no-audit --no-fund

echo "Syncing Capacitor plugins..."
npx cap sync ios

echo "Finished ci_post_clone.sh successfully!"
