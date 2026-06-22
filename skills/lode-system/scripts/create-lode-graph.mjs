#!/usr/bin/env node
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);

if (hasFlag("--help") || hasFlag("-h")) {
  console.log(`Create an interactive LODE graph.

Usage:
  node create-lode-graph.mjs --root . --out lode/lode-graph.html

Options:
  --root <path>       Project root. Defaults to the current directory.
  --lode-dir <path>   LODE folder relative to root. Defaults to lode.
  --out <path>        Output HTML path relative to root. Defaults to lode/lode-graph.html.
  --title <text>      Project title. Defaults to lode/summary.md heading or root folder name.
  --include-tmp       Include lode/tmp markdown files.
`);
  process.exit(0);
}

const root = path.resolve(getValue("--root", "."));
const lodeDir = resolveFromRoot(getValue("--lode-dir", "lode"));
const outPath = resolveFromRoot(getValue("--out", "lode/lode-graph.html"));
const titleOverride = getValue("--title", "");
const includeTmp = hasFlag("--include-tmp");
const templatePath = path.resolve(scriptDir, "../assets/lode-graph-template.html");

const groupDefinitions = {
  core: { label: "Core", color: "#86f59c", anchor: { x: 0, y: 0 } },
  architecture: { label: "Architecture", color: "#f2f4f0", anchor: { x: -390, y: -150 } },
  data: { label: "Data", color: "#9ce6ff", anchor: { x: 390, y: -150 } },
  features: { label: "Features", color: "#efe47a", anchor: { x: -390, y: 255 } },
  operations: { label: "Operations", color: "#ffcf76", anchor: { x: 385, y: 255 } },
  plans: { label: "Plans", color: "#c9b6ff", anchor: { x: 0, y: 390 } },
  other: { label: "Other", color: "#ff907c", anchor: { x: 0, y: -360 } }
};

const markdownFiles = await collectMarkdownFiles(lodeDir, includeTmp);
if (markdownFiles.length === 0) {
  throw new Error(`No markdown files found under ${lodeDir}`);
}

const fileRecords = [];
for (const absolute of markdownFiles) {
  const rel = toPosix(path.relative(lodeDir, absolute));
  const text = await readFile(absolute, "utf8");
  fileRecords.push({
    absolute,
    rel,
    id: `file:${rel}`,
    text,
    title: firstHeading(text) || titleFromPath(rel),
    group: groupFor(rel),
    note: firstParagraph(text) || `LODE file: ${rel}`
  });
}

const projectName = titleOverride || inferProjectName(fileRecords) || path.basename(root);
const graph = buildGraph(projectName, fileRecords);
const template = await readFile(templatePath, "utf8");
const payload = JSON.stringify(graph, null, 2).replaceAll("<", "\\u003c");
const html = template.replace("__LODE_GRAPH_DATA__", payload);

await mkdir(path.dirname(outPath), { recursive: true });
await writeFile(outPath, html, "utf8");
console.log(`Created ${path.relative(root, outPath)}`);
console.log(`${graph.nodes.length} nodes, ${graph.links.length} links`);

function getValue(name, fallback) {
  const index = args.indexOf(name);
  if (index === -1 || index === args.length - 1) return fallback;
  return args[index + 1];
}

function hasFlag(name) {
  return args.includes(name);
}

function resolveFromRoot(value) {
  return path.isAbsolute(value) ? value : path.resolve(root, value);
}

async function collectMarkdownFiles(dir, shouldIncludeTmp) {
  const found = [];
  async function walk(current) {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const absolute = path.join(current, entry.name);
      const relative = toPosix(path.relative(dir, absolute));
      if (entry.isDirectory()) {
        if (!shouldIncludeTmp && (relative === "tmp" || relative.startsWith("tmp/"))) continue;
        await walk(absolute);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
        found.push(absolute);
      }
    }
  }
  await stat(dir);
  await walk(dir);
  return found.sort((a, b) => toPosix(a).localeCompare(toPosix(b)));
}

function buildGraph(projectName, records) {
  const nodes = [{
    id: "project",
    label: projectName,
    group: "core",
    size: 24,
    note: "Project-specific LODE graph generated from the repository's durable knowledge files."
  }];
  const links = [];
  const fileByRel = new Map(records.map((record) => [record.rel, record]));
  const groupsInUse = new Set(["core"]);

  for (const group of unique(records.map((record) => record.group))) {
    groupsInUse.add(group);
    const groupLabel = groupDefinitions[group]?.label || titleCase(group);
    nodes.push({
      id: `group:${group}`,
      label: groupLabel,
      group,
      size: group === "core" ? 15 : 17,
      note: `${groupLabel} LODE files and their extracted headings.`
    });
    links.push(link("project", `group:${group}`, 0.72));
  }

  for (const record of records) {
    nodes.push({
      id: record.id,
      label: record.title,
      group: record.group,
      size: sizeForFile(record.rel),
      note: record.note
    });
    links.push(link(`group:${record.group}`, record.id, 0.78));
    if (record.rel === "lode-map.md" || record.rel === "summary.md") {
      links.push(link("project", record.id, 0.92));
    }

    const headings = extractHeadings(record.text).slice(0, 4);
    headings.forEach((heading, index) => {
      const id = `heading:${record.rel}:${index}`;
      nodes.push({
        id,
        label: heading,
        group: record.group,
        size: 6.4,
        note: `Section from ${record.rel}`
      });
      links.push(link(record.id, id, 0.32));
    });

    for (const targetRel of extractMarkdownLinks(record.rel, record.text, fileByRel)) {
      links.push(link(record.id, fileByRel.get(targetRel).id, 0.62));
    }
  }

  return {
    projectName,
    generatedAt: new Date().toISOString(),
    groups: Object.entries(groupDefinitions)
      .filter(([id]) => groupsInUse.has(id))
      .map(([id, value]) => ({ id, ...value })),
    nodes,
    links: uniqueLinks(links)
  };
}

function groupFor(rel) {
  const first = rel.split("/")[0];
  if (!rel.includes("/")) return "core";
  if (groupDefinitions[first]) return first;
  return "other";
}

function link(source, target, strength) {
  return { source, target, strength };
}

function sizeForFile(rel) {
  if (rel === "lode-map.md") return 17;
  if (rel === "summary.md") return 16;
  if (rel === "terminology.md" || rel === "practices.md") return 14;
  return 11;
}

function firstHeading(text) {
  return text.match(/^#\s+(.+)$/m)?.[1]?.trim();
}

function inferProjectName(records) {
  const summary = records.find((record) => record.rel === "summary.md");
  return summary ? firstHeading(summary.text) : "";
}

function firstParagraph(text) {
  const cleaned = text
    .replace(/```[\s\S]*?```/g, "")
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .find((part) => part && !part.startsWith("#") && !part.startsWith("- ") && !part.startsWith("|"));
  return cleanMarkdown(cleaned || "").slice(0, 220);
}

function extractHeadings(text) {
  const headings = [];
  for (const match of text.matchAll(/^#{2,3}\s+(.+)$/gm)) {
    const heading = cleanMarkdown(match[1]).trim();
    if (heading && !/^table of contents$/i.test(heading)) headings.push(heading);
  }
  return headings;
}

function extractMarkdownLinks(sourceRel, text, fileByRel) {
  const targets = new Set();
  const patterns = [
    /\[[^\]]+\]\(([^)]+\.md(?:#[^)]+)?)\)/g,
    /`([^`]+\.md)`/g
  ];

  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const href = match[1].split("#")[0].trim();
      if (!href || href.startsWith("http://") || href.startsWith("https://")) continue;
      const resolved = normalizeMarkdownTarget(sourceRel, href);
      if (fileByRel.has(resolved) && resolved !== sourceRel) targets.add(resolved);
    }
  }
  return targets;
}

function normalizeMarkdownTarget(sourceRel, href) {
  const sourceDir = path.posix.dirname(sourceRel);
  const joined = href.startsWith("/")
    ? href.slice(1)
    : path.posix.join(sourceDir === "." ? "" : sourceDir, href);
  return path.posix.normalize(joined);
}

function cleanMarkdown(value) {
  return value
    .replace(/\[[^\]]+\]\(([^)]+)\)/g, "$1")
    .replace(/[`*_>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function titleFromPath(rel) {
  const base = path.posix.basename(rel, ".md");
  if (/^readme$/i.test(base)) return "README";
  return titleCase(base.replace(/[-_]+/g, " "));
}

function titleCase(value) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function unique(values) {
  return [...new Set(values)];
}

function uniqueLinks(values) {
  const seen = new Set();
  return values.filter((item) => {
    if (item.source === item.target) return false;
    const key = `${item.source}->${item.target}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
