#!/bin/sh

# Fail the build if any command fails
set -e

# Navigate to the root of the project (from ios/App/ci_scripts)
cd ../../..

# Install Node and npm using Homebrew
brew install node

# Install npm dependencies
npm install

# Build the web assets (if applicable) and sync capacitor
npx cap copy ios
