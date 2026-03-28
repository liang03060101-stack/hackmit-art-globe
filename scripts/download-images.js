#!/usr/bin/env node
/**
 * download-images.js
 * Downloads all painting images into public/images/ so they load from localhost.
 *
 * Run ONCE with your VPN/proxy active:
 *   node scripts/download-images.js
 *
 * Or point it at your local proxy explicitly:
 *   HTTPS_PROXY=http://127.0.0.1:7890 node scripts/download-images.js
 *
 * Supports Clash / v2ray / shadowsocks local proxies (typically port 7890 or 1080).
 */

import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../public/images');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ── Images to download ───────────────────────────────────────────────────────
const IMAGES = [
  {
    file: 'mona-lisa.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/600px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg',
  },
  {
    file: 'starry-night.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/800px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
  },
  {
    file: 'great-wave.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/The_Great_Wave_off_Kanagawa.jpg/800px-The_Great_Wave_off_Kanagawa.jpg',
  },
  {
    file: 'girl-pearl-earring.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/600px-1665_Girl_with_a_Pearl_Earring.jpg',
  },
  {
    file: 'guernica.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/en/7/74/PicassoGuernica.jpg',
  },
  {
    file: 'ninth-wave.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Hovhannes_Aivazovsky_-_The_Ninth_Wave_-_Google_Art_Project.jpg/800px-Hovhannes_Aivazovsky_-_The_Ninth_Wave_-_Google_Art_Project.jpg',
  },
  {
    file: 'shrimp.jpg',
    url: 'https://uploads5.wikiart.org/images/qi-baishi/shrimp.jpg!Large.jpg',
  },
];

// ── Proxy detection ───────────────────────────────────────────────────────────
const PROXY_URL =
  process.env.HTTPS_PROXY ||
  process.env.HTTP_PROXY ||
  process.env.https_proxy ||
  process.env.http_proxy;

if (PROXY_URL) {
  console.log(`🔀 Using proxy: ${PROXY_URL}`);
} else {
  console.log('ℹ️  No proxy set. If downloads fail, try:');
  console.log('   HTTPS_PROXY=http://127.0.0.1:7890 node scripts/download-images.js\n');
}

// ── Download with optional proxy tunnel ───────────────────────────────────────
function download(url, destFile) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(destFile)) {
      const size = fs.statSync(destFile).size;
      if (size > 5000) {
        console.log(`  ✓ already exists (${Math.round(size / 1024)} KB) — skipping`);
        return resolve();
      }
    }

    const doRequest = (finalUrl) => {
      const parsed = new URL(finalUrl);
      const isHttps = parsed.protocol === 'https:';
      const lib = isHttps ? https : http;

      const options = {
        hostname: parsed.hostname,
        port: parsed.port || (isHttps ? 443 : 80),
        path: parsed.pathname + parsed.search,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          'Referer': 'https://en.wikipedia.org/',
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        },
        timeout: 30000,
      };

      if (PROXY_URL) {
        const proxy = new URL(PROXY_URL);
        // CONNECT tunnel for HTTPS through proxy
        const connectReq = http.request({
          host: proxy.hostname,
          port: parseInt(proxy.port) || 8080,
          method: 'CONNECT',
          path: `${parsed.hostname}:${parsed.port || 443}`,
          headers: { Host: `${parsed.hostname}:${parsed.port || 443}` },
        });

        connectReq.on('connect', (_res, socket) => {
          const tlsOptions = {
            socket,
            servername: parsed.hostname,
            rejectUnauthorized: false,
          };
          const tlsSocket = require('tls').connect(tlsOptions, () => {
            const req = https.request({ ...options, socket: tlsSocket, agent: false }, handleResponse);
            req.on('error', reject);
            req.end();
          });
          tlsSocket.on('error', reject);
        });

        connectReq.on('error', reject);
        connectReq.end();
        return;
      }

      const req = lib.request(options, handleResponse);
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
      req.end();
    };

    const handleResponse = (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return doRequest(res.headers.location);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const file = fs.createWriteStream(destFile);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        const size = fs.statSync(destFile).size;
        console.log(`  ✓ saved (${Math.round(size / 1024)} KB)`);
        resolve();
      });
      file.on('error', reject);
    };

    doRequest(url);
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n📂 Saving images to: ${OUT_DIR}\n`);
  let ok = 0, fail = 0;

  for (const { file, url } of IMAGES) {
    const dest = path.join(OUT_DIR, file);
    process.stdout.write(`  Downloading ${file}… `);
    try {
      await download(url, dest);
      ok++;
    } catch (err) {
      console.log(`  ✗ FAILED: ${err.message}`);
      fail++;
    }
  }

  console.log(`\n${ok} downloaded, ${fail} failed.`);
  if (fail > 0) {
    console.log('\n💡 To fix failures, enable your VPN then run:');
    console.log('   HTTPS_PROXY=http://127.0.0.1:7890 node scripts/download-images.js');
  } else {
    console.log('\n✅ All done! Images are now served from localhost — no internet needed.');
  }
}

main();
