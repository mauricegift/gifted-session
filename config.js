require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 50900,
    SESSION_PREFIX: process.env.SESSION_PREFIX || "Gifted~",
    GC_JID: process.env.GC_JID,
    DATABASE_URL: process.env.DATABASE_URL,
    BOT_REPO: process.env.BOT_REPO || "https://github.com/mauricegift/atassa",
    WA_CHANNEL: process.env.WA_CHANNEL || "https://whatsapp.com/channel/0029VbCpYtZLtOj5LDuj7Q1p",
    MSG_FOOTER: process.env.MSG_FOOTER || "> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢɪғᴛᴇᴅ ᴛᴇᴄʜ*",
};
