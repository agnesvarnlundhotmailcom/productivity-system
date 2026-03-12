import { readdirSync, statSync, writeFileSync, readFileSync } from "fs";
import { join } from "path";

const ROOT = "src";
const DOCS = "docs/overview.md";

const IGNORE = ["node_modules", ".git", ".DS_Store", "dist", ".vite"];

function buildTree(dir, prefix = "") {
  let entries;
  try {
    entries = readdirSync(dir)
      .filter((e) => !IGNORE.includes(e))
      .sort((a, b) => {
        // Mappar före filer
        const aIsDir = statSync(join(dir, a)).isDirectory();
        const bIsDir = statSync(join(dir, b)).isDirectory();
        if (aIsDir && !bIsDir) return -1;
        if (!aIsDir && bIsDir) return 1;
        return a.localeCompare(b);
      });
  } catch {
    return "";
  }

  let result = "";
  entries.forEach((entry, index) => {
    const fullPath = join(dir, entry);
    const isLast = index === entries.length - 1;
    const connector = isLast ? "└── " : "├── ";
    const childPrefix = isLast ? "    " : "│   ";

    result += `${prefix}${connector}${entry}\n`;

    if (statSync(fullPath).isDirectory()) {
      result += buildTree(fullPath, prefix + childPrefix);
    }
  });

  return result;
}

const existing = readFileSync(DOCS, "utf-8");
const date = new Date().toISOString().split("T")[0];
const tree = buildTree(ROOT);

const newSection =
  `## Mappstruktur\n\n` +
  `Senast uppdaterad: ${date}\n\n` +
  "```\n" +
  `src/\n${tree}` +
  "```";

const updated = existing.replace(
  /## Mappstruktur[\s\S]*?```[\s\S]*?```/,
  newSection
);

writeFileSync(DOCS, updated, "utf-8");
console.log(`✅ Mappstruktur uppdaterad i ${DOCS} (${date})`);
