import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import path from 'path';

async function run() {
  console.log('Starting preview server...');
  const server = spawn('npm', ['run', 'preview'], {
    cwd: process.cwd(),
    shell: true
  });

  server.stdout.on('data', (d) => console.log('server: ' + d.toString()));
  server.stderr.on('data', (d) => console.error('server error: ' + d.toString()));

  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
  page.on('requestfailed', request => console.log('BROWSER NET ERROR:', request.url(), request.failure().errorText));

  console.log('Navigating to http://localhost:4173...'); // Vite preview default port
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0', timeout: 10000 }).catch(e => console.log('Goto error:', e));

  const content = await page.evaluate(() => document.body.innerHTML);
  console.log('BODY CONTENT LENGTH:', content.length);
  if (content.length < 500) {
    console.log('BODY CONTENT:', content);
  }

  await browser.close();
  server.kill();
  console.log('Done');
}

run();
