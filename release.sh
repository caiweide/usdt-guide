#!/bin/bash

# Get the current directory name
PROJECT_NAME=$(basename "$(pwd)")

# Remove old project folder
rm -rf "$PROJECT_NAME"

# Run install
npm install

# Run build
npm run build

# Rename dist to project name
mv dist "$PROJECT_NAME"

# Remove old zip file
rm -rf ${PROJECT_NAME}-*.zip

# Zip all files in project folder excluding main.js, zip file name is <project>-<date-time>.zip
zip -r "${PROJECT_NAME}-$(date +%Y%m%d%H%M).zip" "$PROJECT_NAME" -x "${PROJECT_NAME}/main.js"

# Git commit and push, commit message is build release <date-time>
if [ "$1" != "test" ]; then
	git add .
	git commit -m "🚀 Build release $(date +%Y%m%d%H%M) [zip]"
	git push
fi