#!/usr/bin/env node

// Wrapper to fix non-breaking space issue in wide terminals
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const hudScript = join(__dirname, 'dist', 'index.js');

const child = spawn('node', [hudScript], {
  stdio: ['inherit', 'pipe', 'inherit']
});

child.stdout.on('data', (data) => {
  // Replace non-breaking spaces with regular spaces
  const output = data.toString().replace(/\u00A0/g, ' ');
  process.stdout.write(output);
});

child.on('close', (code) => {
  process.exit(code);
});
