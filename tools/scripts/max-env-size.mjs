#!/usr/bin/env node

/**
 * Finds the maximum size of an environment variable that can be passed
 * via child_process.execSync using binary search.
 */

import { execSync } from "node:child_process";

const ENV_NAME = "TEST_ENV_VAR";

// Minimal env: only PATH + our test var, so the total envp size is
// deterministic across runs (no fluctuation from shell variables).
const BASE_ENV = { PATH: process.env.PATH };

function trySize(size) {
  const value = "A".repeat(size);
  try {
    const result = execSync(`printenv ${ENV_NAME}`, {
      env: { ...BASE_ENV, [ENV_NAME]: value },
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
      maxBuffer: size + 1024,
    });
    const output = result.trim();
    if (output !== value) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// Binary search between low and high
let low = 1;
let high = 8 * 1024 * 1024; // 8 MB upper bound

// First, verify the upper bound actually fails (sanity check)
if (trySize(high)) {
  console.log(`Even ${high} bytes works — upper bound too low or no limit found.`);
  process.exit(0);
}

// Verify the lower bound works
if (!trySize(low)) {
  console.log("Even 1 byte fails — something is wrong.");
  process.exit(1);
}

console.log(`Binary searching between ${low} and ${high} bytes...\n`);

while (low + 1 < high) {
  const mid = Math.floor((low + high) / 2);
  process.stdout.write(`  Testing ${mid} bytes... `);
  if (trySize(mid)) {
    console.log("✓ pass");
    low = mid;
  } else {
    console.log("✗ fail");
    high = mid;
  }
}

const maxBytes = low;
console.log(`\nMax env var size: ${maxBytes} bytes (${(maxBytes / 1024).toFixed(1)} KB / ${(maxBytes / (1024 * 1024)).toFixed(2)} MB)`);
