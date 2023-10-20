#!/bin/bash

# Run install
npm install

# Run build
npm run build

# Remove old zip file
rm -rf usdt-guide-*.zip

# Zip all files in dist folder excluding main.js, zip file name is usdt-guide-<date-time>.zip

zip -r usdt-guide-$(date +%Y%m%d%H%M).zip dist -x dist/main.js

# Git commit and push, commit message is build release <date-time>

git add .
git commit -m "build release $(date +%Y%m%d%H%M)"
git push

