#!/usr/bin/env node
/**
 * PTDT — Non-TS log extraction helper
 * Scans recent git log bodies for fenced code blocks and writes them under docs/archived/.
 * Does not modify src/data.ts; pair with the lexical CI gate.
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ARCHIVE_DIR = path.join(__dirname, "..", "docs", "archived");

if (!fs.existsSync(ARCHIVE_DIR)) {
  fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
}

function safeName(name) {
  return String(name)
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 120) || "unnamed_block";
}

function extractLogsToArchive() {
  console.log("=== Starting extraction of non-TS fenced blocks from git log ===");
  let count = 0;

  try {
    const gitLogDump = execSync('git log -n 40 --pretty=format:"%B"', {
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
    });

    // ```lang\n...```
    const fenceRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)\n```/g;
    let match;
    let idx = 0;

    while ((match = fenceRegex.exec(gitLogDump)) !== null) {
      const lang = match[1] || "txt";
      const body = match[2].trim();
      if (body.length < 40) continue; // skip tiny fragments

      idx += 1;
      const filename = safeName(`log_extract_${idx}.${lang || "txt"}`);
      const destinationPath = path.join(ARCHIVE_DIR, `${filename}.txt`);
      fs.writeFileSync(destinationPath, body + "\n", "utf8");
      console.log(`Isolated -> docs/archived/${filename}.txt`);
      count += 1;
    }

    console.log("==========================================================");
    console.log(`Pass: ${count} non-TS structure(s) archived under docs/archived/.`);
  } catch (error) {
    console.error(`[EXTRACTION_FAILURE] ${error.message}`);
    process.exit(1);
  }
}

extractLogsToArchive();
