#!/bin/bash

# Remove old usdt-guide folder
rm -rf usdt-guide

# Run install
npm install

# Run build
npm run build

# Rename dist to usdt-guide
mv dist usdt-guide

# Remove old zip file
rm -rf usdt-guide-*.zip

# Zip all files in usdt-guide folder excluding main.js, zip file name is usdt-guide-<date-time>.zip

zip -r usdt-guide-$(date +%Y%m%d%H%M).zip usdt-guide -x usdt-guide/main.js

# Git commit and push, commit message is build release <date-time>

if [ "$1" != "test" ]; then
    git add .
    git commit -m "build release $(date +%Y%m%d%H%M) [zip]"
    git push
fi

