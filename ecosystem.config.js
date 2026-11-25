module.exports = {
  apps: [{
    name: "atassasess",
    script: "index.js",
    cwd: "/root/web/gifted-session", // Change this to your desired app code location
    env: {
      PORT: 6898,
      DATAASE_URL: ""
    }
  }]
};
