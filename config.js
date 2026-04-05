require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 50900,
    SESSION_PREFIX: process.env.SESSION_PREFIX || "Gifted~",
    GC_JID: process.env.GC_JID || "LZE4CoZNhLB28z5jtqwNLA",
    DATABASE_URL: process.env.DATABASE_URL,
    BOT_REPO: process.env.BOT_REPO || "https://github.com/mauricegift/atassa",
    WA_CHANNEL: process.env.WA_CHANNEL || "https://whatsapp.com/channel/0029VbCpYtZLtOj5LDuj7Q1p",
    MSG_FOOTER: process.env.MSG_FOOTER || "> *\u1d18\u1d0f\u1d21\u1d07\u0280\u1d07\u1d05 \u0299\u028f \u0262\u026a\u0493\u1d1b\u1d07\u1d05 \u1d1b\u1d07\u1d04\u029c*",
};
