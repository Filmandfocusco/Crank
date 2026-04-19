#!/bin/sh
set -e

echo "Starting ci_post_clone.sh..."

# The repository root is located at $CI_PRIMARY_REPOSITORY_PATH
cd "$CI_PRIMARY_REPOSITORY_PATH"
echo "Root workspace is: $(pwd)"

# Ensure Node and NPM are in the path (standard Xcode Cloud paths)
export PATH=$PATH:/usr/local/bin

echo "Checking environment..."
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

echo "Installing project dependencies..."
# Use --no-audit and --no-fund to speed up and avoid exit code noise
npm install --no-audit --no-fund

echo "Syncing Capacitor plugins..."
# Syncing ensures native dependencies are mapped correctly
npx cap sync ios

echo "Finished ci_post_clone.sh successfully!"

