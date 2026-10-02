import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = path.join(root, "site");
if (!fs.existsSync(path.join(site, "index.html"))) throw new Error("Run npm run build before validating the site.");

const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const target = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(target) : [target];
});

const files = walk(site);
const htmlFiles = files.filter(file => file.endsWith(".html"));
const failures = [];

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const relative = path.relative(site, file);
  for (const required of ["<title>", "<main", "<nav", "assets/styles.css", "assets/app.js"]) {
    if (!html.includes(required)) failures.push(`${relative}: missing ${required}`);
  }
  if (/(?:>|=")(?:undefined|null)(?:<|")/i.test(html.replace(/Insufficient Evidence \/ 尚未记录。/g, ""))) {
    failures.push(`${relative}: rendered undefined/null value`);
  }
  const h1Count = (html.match(/<h1(?:\s|>)/g) || []).length;
  if (h1Count !== 1) failures.push(`${relative}: expected exactly one h1; found ${h1Count}`);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) failures.push(`${relative}: duplicate ids ${[...new Set(duplicates)].join(", ")}`);
  if (/<canvas(?:\s|>)/.test(html)) failures.push(`${relative}: canvas visualization remains after static-visual redesign`);
  const references = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(match => match[1]);
  for (const reference of references) {
    if (/^(?:https?:|mailto:|data:)/.test(reference)) continue;
    const [withQuery, fragment] = reference.split("#", 2);
    const clean = withQuery.split("?", 1)[0];
    let target = path.resolve(path.dirname(file), clean || ".");
    if (clean.endsWith("/") || fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, "index.html");
    if (!fs.existsSync(target)) {
      failures.push(`${relative}: broken local reference ${reference}`);
      continue;
    }
    if (fragment && target.endsWith(".html")) {
      const targetHtml = fs.readFileSync(target, "utf8");
      if (!targetHtml.includes(`id="${fragment}"`)) failures.push(`${relative}: missing fragment target ${reference}`);
    }
  }
}

const catalog = JSON.parse(fs.readFileSync(path.join(site, "data", "catalog.json"), "utf8"));
for (const route of catalog.routes || []) {
  const target = path.join(site, route, "index.html");
  if (!fs.existsSync(target)) failures.push(`Public route is missing: ${route || "/"}`);
}

const publicIndexes = ["index.html", "program/index.html", "papers/index.html", "gaps/index.html", "questions/index.html"]
  .map(relative => fs.readFileSync(path.join(site, relative), "utf8"))
  .join("\n");
for (const forbidden of ["研究风格参照", "Zhicong Lu（最偏好）", "当前42篇活动文献", "28篇暂缓材料"]) {
  if (publicIndexes.includes(forbidden)) failures.push(`Public pages expose removed content: ${forbidden}`);
}

const catalogText = JSON.stringify(catalog);
for (const forbidden of ["second_author", "human_confirmed", "Meta Aria", "Quest 3", "budget", "developer_instructions"]) {
  if (catalogText.includes(forbidden)) failures.push(`Public catalog exposes internal field: ${forbidden}`);
}
if (!/value="featured" selected/.test(fs.readFileSync(path.join(site, "papers", "index.html"), "utf8"))) {
  failures.push("Paper library does not default to the featured evidence set.");
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Site validation passed: ${catalog.routes.length} public routes, ${catalog.counts.featured_papers}/${catalog.counts.papers} papers shown by default.`);
