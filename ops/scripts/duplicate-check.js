#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const appRoot = path.join(root, "apps", "web", "app");

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name === "page.tsx") files.push(full);
  }
  return files;
}

function routeFromPage(file) {
  const rel = path.relative(appRoot, file).replace(/\\/g, "/");
  const route = rel.replace(/\/page\.tsx$/, "").replace(/^page\.tsx$/, "");
  return `/${route.split("/").filter(Boolean).map((part) => part.replace(/\[(.+?)\]/g, ":$1")).join("/")}`;
}

const pages = walk(appRoot);
const seen = new Map();
const duplicates = [];
for (const page of pages) {
  const route = routeFromPage(page);
  const rel = path.relative(root, page).replace(/\\/g, "/");
  if (seen.has(route)) duplicates.push({ route, files: [seen.get(route), rel] });
  seen.set(route, rel);
}

console.log(JSON.stringify({ generatedAt: new Date().toISOString(), duplicates }, null, 2));
if (duplicates.length) process.exitCode = 1;
