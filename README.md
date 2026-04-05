# Gifted-Session-Generator

> WhatsApp session generator for **ATASSA-MD / Gifted-MD** and any Baileys-based bot.  
> Supports **pair code** and **QR code** login, with optional **short session IDs** stored in MongoDB or PostgreSQL.

<a href='https://github.com/mauricegift/gifted-session/fork' target="_blank">
  <img alt='FORK REPO' src='https://img.shields.io/badge/-FORK REPO-black?style=for-the-badge&logo=github&logoColor=white'/>
</a>

---

## Features

- 🔗 **Pair Code login** — no phone needed, enter code in WhatsApp → Linked Devices
- 📷 **QR Code login** — traditional QR scan
- 🗜️ **Long session** — full zlib/base64 inline string (works anywhere, no DB needed)
- 🗃️ **Short session** — compact ID stored in MongoDB or PostgreSQL (auto-falls back to long if no DB)
- ⚡ Auto-detects database type from `DATABASE_URL` (`mongodb://` or `postgres://`)

---

## Environment Variables

Set these in a `.env` file or your hosting dashboard:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Optional | MongoDB (`mongodb+srv://...`) or PostgreSQL (`postgres://...`) connection string. If not set, all sessions use long format. |
| `SESSION_PREFIX` | Optional | Prefix prepended to session strings. Default: `Gifted~` |
| `PORT` | Optional | Port to listen on. Default: `50900` |
| `BOT_REPO` | Optional | GitHub URL shown in WhatsApp message button. Default: atassa repo |
| `WA_CHANNEL` | Optional | WhatsApp channel URL shown in message button. |
| `MSG_FOOTER` | Optional | Footer text in WhatsApp session message. |

---

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /` | Home landing page |
| `GET /pair` | Pair code login page |
| `GET /qr` | QR code landing page |
| `GET /qr/session?type=short\|long` | Generates and displays QR code |
| `GET /code?number=2547xxx&type=short\|long` | Returns pair code JSON `{ code, fallback }` |
| `GET /health` | Server health + storage backend status |

> `fallback: true` in the `/code` response means short was requested but no DB is configured — it automatically sent a long session.

---

## Usage in Your Bot

### Handling Both Short and Long Sessions

```js
// lib/session.js
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const axios = require('axios');

const sessionDir = path.join(__dirname, '..', 'session');
const credsPath = path.join(sessionDir, 'creds.json');

if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

async function loadSession(SESSION_ID) {
    if (!SESSION_ID || typeof SESSION_ID !== 'string') {
        throw new Error('SESSION_ID is missing or invalid');
    }

    // Remove existing creds
    if (fs.existsSync(credsPath)) fs.unlinkSync(credsPath);

    const PREFIX = 'Gifted~';

    if (!SESSION_ID.startsWith(PREFIX)) {
        throw new Error(`Invalid session format. Expected to start with "${PREFIX}"`);
    }

    const payload = SESSION_ID.slice(PREFIX.length);

    // Detect short vs long session
    // Short: compact alphanumeric ID (~12 chars, no base64 padding)
    // Long: full zlib/base64 string (very long)
    if (payload.length < 50) {
        // SHORT SESSION — fetch full session from server
        const serverUrl = `https://session.giftedtech.co.ke/session/${payload}`;
        const response = await axios.get(serverUrl, { timeout: 10000 });
        const fullSession = response.data;

        // fullSession is itself a long session string — recurse
        return loadSession(fullSession.trim());
    } else {
        // LONG SESSION — decode zlib/base64 inline
        const compressedData = Buffer.from(payload, 'base64');
        const decompressedData = zlib.gunzipSync(compressedData);
        fs.writeFileSync(credsPath, decompressedData, 'utf8');
        console.log('✅ Session loaded successfully');
    }
}

module.exports = { loadSession };
```

### In Your Bot Start File

```js
// index.js
const { loadSession } = require('./lib/session');
const { useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');

async function connectToWhatsApp() {
    await loadSession(process.env.SESSION_ID);

    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: !process.env.SESSION_ID,
        // ... your other options
    });

    sock.ev.on('creds.update', saveCreds);
    // ... rest of your bot logic
}

connectToWhatsApp();
```

### Example `.env` for Your Bot

```env
SESSION_ID=Gifted~abc123xyz   # short session
# or
SESSION_ID=Gifted~H4sIAAAAA...  # long session (full zlib string)
```

---

## Deployment

<a href='https://dashboard.heroku.com/new?template=https://github.com/mauricegift/gifted-session' target="_blank">
  <img alt='HEROKU DEPLOY' src='https://img.shields.io/badge/-HEROKU DEPLOY-black?style=for-the-badge&logo=heroku&logoColor=white'/>
</a>
<br>
<a href='https://dashboard.render.com' target="_blank">
  <img alt='DEPLOY TO RENDER' src='https://img.shields.io/badge/-DEPLOY TO RENDER-black?style=for-the-badge&logo=render&logoColor=white'/>
</a>
<br>
<a href='https://app.koyeb.com' target="_blank">
  <img alt='DEPLOY TO KOYEB' src='https://img.shields.io/badge/-DEPLOY TO KOYEB-black?style=for-the-badge&logo=koyeb&logoColor=white'/>
</a>

---

## Live Demo

[`https://session.giftedtech.co.ke`](https://session.giftedtech.co.ke)

---

## Owner

<a href="https://github.com/mauricegift">
  <img src="https://github.com/mauricegift.png" width="150" height="150" alt="Gifted Tech" style="border-radius:50%"/>
</a>

[`ℹ️ Contact Owner`](https://api.giftedtech.co.ke/contact)


## Repo Star History

[![Gifted-Session](https://api.star-history.com/svg?repos=mauricegift/gifted-session&type=Timeline)](#)

<a><img src='https://i.imgur.com/LyHic3i.gif'/></a>