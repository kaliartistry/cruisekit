#!/usr/bin/env node
const tls = require("tls");
const net = require("net");
const { spawnSync } = require("child_process");

const required = [
  "GROWTHOPS_NOTIFY_EMAIL_TO",
  "GROWTHOPS_NOTIFY_EMAIL_FROM",
  "GROWTHOPS_SMTP_HOST",
  "GROWTHOPS_SMTP_PORT",
  "GROWTHOPS_SMTP_USER",
  "GROWTHOPS_SMTP_PASS",
];

const missing = required.filter((key) => !process.env[key]);
const subject = process.argv[2] || "CruiseKit GrowthOps notification";
const message = process.argv.slice(3).join(" ") || "CruiseKit GrowthOps needs attention.";

if (missing.length) {
  console.log(`Email not configured; missing ${missing.join(", ")}. Falling back to GitHub issue.`);
  const result = spawnSync(process.execPath, ["ops/scripts/create-approval-issue.js"], { stdio: "inherit" });
  process.exit(result.status || 0);
}

function encode(value) {
  return Buffer.from(value, "utf8").toString("base64");
}

function smtpSend() {
  const port = Number(process.env.GROWTHOPS_SMTP_PORT);
  const host = process.env.GROWTHOPS_SMTP_HOST;
  const secure = port === 465;
  const socket = secure ? tls.connect(port, host) : net.connect(port, host);
  let buffer = "";
  let step = 0;

  const commands = [
    `EHLO localhost\r\n`,
    `AUTH LOGIN\r\n`,
    `${encode(process.env.GROWTHOPS_SMTP_USER)}\r\n`,
    `${encode(process.env.GROWTHOPS_SMTP_PASS)}\r\n`,
    `MAIL FROM:<${process.env.GROWTHOPS_NOTIFY_EMAIL_FROM}>\r\n`,
    `RCPT TO:<${process.env.GROWTHOPS_NOTIFY_EMAIL_TO}>\r\n`,
    `DATA\r\n`,
    `From: ${process.env.GROWTHOPS_NOTIFY_EMAIL_FROM}\r\nTo: ${process.env.GROWTHOPS_NOTIFY_EMAIL_TO}\r\nSubject: ${subject}\r\n\r\n${message}\r\n.\r\n`,
    `QUIT\r\n`,
  ];

  socket.setEncoding("utf8");
  socket.on("data", (chunk) => {
    buffer += chunk;
    if (!/\r?\n$/.test(buffer)) return;
    const code = Number(buffer.slice(0, 3));
    if (code >= 400) {
      console.error(buffer.trim());
      socket.end();
      process.exitCode = 1;
      return;
    }
    buffer = "";
    if (step < commands.length) socket.write(commands[step++]);
  });
  socket.on("error", (error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

smtpSend();
