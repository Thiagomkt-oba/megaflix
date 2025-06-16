const { execSync } = require('child_process');
const fs = require('fs');

console.log('Building frontend...');
execSync('npx vite build', { stdio: 'inherit' });

console.log('Creating dist directory...');
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}

console.log('Copying files to dist...');
execSync('cp -r client/dist/* dist/', { stdio: 'inherit' });

console.log('Build completed - dist directory ready');
const files = fs.readdirSync('dist');
console.log('Files in dist:', files.join(', '));