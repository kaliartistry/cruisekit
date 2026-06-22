#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const files = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(tsx|ts|md)$/.test(entry.name)) files.push(full);
  }
}

walk(path.join(root, "apps", "web", "app"));
walk(path.join(root, "apps", "web", "components"));
walk(path.join(root, "ops"));

const localLinks = [];
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  for (const match of text.matchAll(/href=["'`]([^"'`#][^"'`]*)["'`]/g)) {
    if (match[1].startsWith("/")) {
      localLinks.push({ file: path.relative(root, file).replace(/\\/g, "/"), href: match[1] });
    }
  }
}

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  status: "static href scan only",
  localLinks,
}, null, 2));
