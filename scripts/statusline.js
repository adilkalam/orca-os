#!/usr/bin/env node
"use strict";

const fs = require("fs");
const { execSync } = require("child_process");

// --- input ---
const input = readJSON(0); // stdin
const transcript = input.transcript_path;

const model = input.model || {};
const name = `\x1b[95m${String(model.display_name ?? "")}\x1b[0m`.trim();
const CONTEXT_WINDOW = 200_000;
const AUTO_COMPACT_THRESHOLD = 160_000; // Claude Code auto-compacts at ~80%

// === SYSTEM METRICS ===

function getCPUUsage() {
  try {
    if (process.platform === "darwin") {
      const topOutput = execSync("top -l 1 -n 0", { encoding: "utf8" });
      const cpuLine = topOutput.match(/CPU usage: ([\d.]+)% user, ([\d.]+)% sys, ([\d.]+)% idle/);
      if (cpuLine) {
        const user = parseFloat(cpuLine[1]);
        const sys = parseFloat(cpuLine[2]);
        const total = user + sys;
        const rounded = Math.round(total);

        let color = "\x1b[32m"; // green
        if (rounded >= 80) color = "\x1b[31m"; // red
        else if (rounded >= 60) color = "\x1b[33m"; // yellow

        return `${color}󰻠 ${rounded}%\x1b[0m`;
      }
    }
    return "\x1b[90m󰻠 --%\x1b[0m";
  } catch {
    return "\x1b[90m󰻠 --%\x1b[0m";
  }
}

// GPU monitoring removed - requires sudo access

function getMemoryUsage() {
  try {
    if (process.platform === "darwin") {
      // Get total memory from sysctl
      const totalMemBytes = parseInt(
        execSync("sysctl -n hw.memsize", { encoding: "utf8" }).trim()
      );

      // Get memory stats from vm_stat
      const vmStat = execSync("vm_stat", { encoding: "utf8" });
      const pageSize = parseInt(
        vmStat.match(/page size of (\d+) bytes/)?.[1] || "4096"
      );

      // Parse pages
      const freePages = parseInt(vmStat.match(/Pages free:\s+(\d+)/)?.[1] || "0");
      const activePages = parseInt(vmStat.match(/Pages active:\s+(\d+)/)?.[1] || "0");
      const inactivePages = parseInt(vmStat.match(/Pages inactive:\s+(\d+)/)?.[1] || "0");
      const wiredPages = parseInt(vmStat.match(/Pages wired down:\s+(\d+)/)?.[1] || "0");
      const compressedPages = parseInt(vmStat.match(/Pages occupied by compressor:\s+(\d+)/)?.[1] || "0");

      // Calculate used memory (active + wired + compressed)
      const usedBytes = (activePages + wiredPages + compressedPages) * pageSize;
      const usagePercent = Math.round((usedBytes / totalMemBytes) * 100);

      let color = "\x1b[32m"; // green
      if (usagePercent >= 90) color = "\x1b[31m"; // red
      else if (usagePercent >= 75) color = "\x1b[33m"; // yellow

      return `${color}󰍛 ${usagePercent}%\x1b[0m`;
    }
    return "\x1b[90m󰍛 --%\x1b[0m";
  } catch {
    return "\x1b[90m󰍛 --%\x1b[0m";
  }
}

// === GIT FUNCTIONS ===

function getCurrentFolder() {
  try {
    const cwd = process.cwd();
    return cwd.split("/").pop() || cwd;
  } catch {
    return "";
  }
}

function getGitBranch() {
  try {
    return execSync("git branch --show-current", { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

function getGitStatus() {
  try {
    const status = execSync("git status --porcelain", { encoding: "utf8" });
    const lines = status.trim().split("\n").filter(Boolean);

    let modified = 0;
    let untracked = 0;
    let staged = 0;

    lines.forEach((line) => {
      const statusCode = line.substring(0, 2);
      if (statusCode === "??") untracked++;
      else if (statusCode[0] !== " " && statusCode[0] !== "?") staged++;
      else if (statusCode[1] !== " ") modified++;
    });

    const parts = [];
    // Add space between icon and number as requested
    if (staged > 0) parts.push(`\x1b[32m${staged} 󰄬\x1b[0m`);
    if (modified > 0) parts.push(`\x1b[33m${modified} 󰛿\x1b[0m`);
    if (untracked > 0) parts.push(`\x1b[31m${untracked} 󰋗\x1b[0m`);

    return parts.length > 0 ? `[${parts.join(" • ")}]` : "";
  } catch {
    return "";
  }
}

function getGitAheadBehind() {
  try {
    const result = execSync(
      "git rev-list --left-right --count HEAD...@{upstream}",
      { encoding: "utf8", stderr: "ignore" }
    ).trim();

    const [ahead, behind] = result.split("\t").map(Number);
    const parts = [];

    // Add space between number and icon
    if (ahead > 0) parts.push(`\x1b[32m${ahead} 󰜷\x1b[0m`);
    if (behind > 0) parts.push(`\x1b[31m${behind} 󰜮\x1b[0m`);

    return parts.length > 0 ? parts.join(" ") : "";
  } catch {
    return "";
  }
}

// === TOKEN USAGE FUNCTIONS ===

function readJSON(fd) {
  try {
    return JSON.parse(fs.readFileSync(fd, "utf8"));
  } catch {
    return {};
  }
}

function usedTotal(u) {
  return (
    (u?.input_tokens ?? 0) +
    (u?.output_tokens ?? 0) +
    (u?.cache_read_input_tokens ?? 0) +
    (u?.cache_creation_input_tokens ?? 0)
  );
}

function syntheticModel(j) {
  const m = String(j?.message?.model ?? "").toLowerCase();
  return m === "<synthetic>" || m.includes("synthetic");
}

function assistantMessage(j) {
  return j?.message?.role === "assistant";
}

function subContext(j) {
  return j?.isSidechain === true;
}

function contentNoResponse(j) {
  const c = j?.message?.content;
  return (
    Array.isArray(c) &&
    c.some(
      (x) =>
        x &&
        x.type === "text" &&
        /no\s+response\s+requested/i.test(String(x.text))
    )
  );
}

function parseTs(j) {
  const t = j?.timestamp;
  const n = Date.parse(t);
  return Number.isFinite(n) ? n : -Infinity;
}

function newestMainUsageByTimestamp() {
  if (!transcript) return null;
  let latestTs = -Infinity;
  let latestUsage = null;

  let lines;
  try {
    lines = fs.readFileSync(transcript, "utf8").split(/\r?\n/);
  } catch {
    return null;
  }

  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (!line) continue;

    let j;
    try {
      j = JSON.parse(line);
    } catch {
      continue;
    }

    const u = j.message?.usage;
    if (
      subContext(j) ||
      syntheticModel(j) ||
      j.isApiErrorMessage === true ||
      usedTotal(u) === 0 ||
      contentNoResponse(j) ||
      !assistantMessage(j)
    )
      continue;

    const ts = parseTs(j);
    if (ts > latestTs) {
      latestTs = ts;
      latestUsage = u;
    } else if (ts == latestTs && usedTotal(u) > usedTotal(latestUsage)) {
      latestUsage = u;
    }
  }

  return latestUsage;
}

const comma = (n) =>
  new Intl.NumberFormat("en-US").format(
    Math.max(0, Math.floor(Number(n) || 0))
  );

const abbreviate = (n) => {
  const num = Math.max(0, Math.floor(Number(n) || 0));
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + "k";
  }
  return num.toString();
};

// === BUILD STATUS LINES ===

// System metrics
const cpu = getCPUUsage();
const memory = getMemoryUsage();

// Git info
const folder = getCurrentFolder();
const branch = getGitBranch();
const gitStatus = getGitStatus();
const gitAheadBehind = getGitAheadBehind();

// Token usage
const usage = newestMainUsageByTimestamp();

if (!usage) {
  // No usage yet - show waiting message
  console.log(
    `${name} \x1b[90m|\x1b[0m \x1b[36mwaiting for first message...\x1b[0m`
  );

  // Line 2: CPU • Memory | folder • branch | git status
  const systemMetrics = [cpu, memory].filter(Boolean).join(" \x1b[90m•\x1b[0m ");
  const folderInfo = folder ? `\x1b[36m📁 ${folder}\x1b[0m` : "";
  const branchInfo = branch ? `\x1b[32m ${branch}\x1b[0m` : "";
  const gitInfo = [gitStatus, gitAheadBehind].filter(Boolean).join(" \x1b[90m•\x1b[0m ");

  const line2Parts = [folderInfo, branchInfo].filter(Boolean);
  const line2Location = line2Parts.length > 0 ? line2Parts.join(" \x1b[90m•\x1b[0m ") : "";

  const line2Segments = [systemMetrics, line2Location, gitInfo].filter(Boolean);
  const line2Full = line2Segments.join(" \x1b[90m|\x1b[0m ");

  if (line2Full) console.log(line2Full);

  process.exit(0);
}

// Calculate token metrics
const used = usedTotal(usage);
const pct = CONTEXT_WINDOW > 0 ? Math.round((used * 1000) / CONTEXT_WINDOW) / 10 : 0;

// Calculate tokens until auto-compact
const tokensRemaining = AUTO_COMPACT_THRESHOLD - used;

// Color for token usage
let tokenColor = "\x1b[32m"; // green
if (pct >= 90) tokenColor = "\x1b[31m"; // red
else if (pct >= 70) tokenColor = "\x1b[33m"; // yellow

// Build token usage string: [icon] (50.2%) 100,427/200,000
const tokenUsage = `${tokenColor}📊 (${pct.toFixed(1)}%) ${comma(used)}/${comma(CONTEXT_WINDOW)}\x1b[0m`;

// Auto-compact indicator - abbreviated tokens remaining, grey text
const autoCompactInfo = `\x1b[90m${abbreviate(tokensRemaining)} until auto-compact\x1b[0m`;

// LINE 1: Model | token usage | auto-compact text
const line1 = `${name} \x1b[90m|\x1b[0m ${tokenUsage} \x1b[90m|\x1b[0m ${autoCompactInfo}`;

// LINE 2: CPU • Memory | folder • branch | git status • ahead/behind
const systemMetrics = [cpu, memory].filter(Boolean).join(" \x1b[90m•\x1b[0m ");
const folderInfo = folder ? `\x1b[36m📁 ${folder}\x1b[0m` : "";
const branchInfo = branch ? `\x1b[32m ${branch}\x1b[0m` : "";
const gitInfo = [gitStatus, gitAheadBehind].filter(Boolean).join(" \x1b[90m•\x1b[0m ");

const line2LocationParts = [folderInfo, branchInfo].filter(Boolean);
const line2Location = line2LocationParts.length > 0 ? line2LocationParts.join(" \x1b[90m•\x1b[0m ") : "";

const line2Segments = [systemMetrics, line2Location, gitInfo].filter(Boolean);
const line2Full = line2Segments.join(" \x1b[90m|\x1b[0m ");

console.log(line1);
if (line2Full) console.log(line2Full);
