const { execSync } = require('child_process');
const fs = require('fs');

console.log("Checking chromium availability...");
execSync('chromium --version', { stdio: 'inherit' });

