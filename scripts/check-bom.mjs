// scripts/check-bom.mjs
import { readFile } from "node:fs/promises";
import { execSync } from "node:child_process";

const files = execSync("git ls-files", { encoding: "utf8" })
    .split(/\r?\n/)
    .filter(Boolean);

let bad = 0;
for (const file of files) {
    let buf;
    try {
        buf = await readFile(file);
    } catch {
        continue;
    }
    if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
        console.error("BOM:", file);
        bad++;
    }
}
if (bad) {
    console.error(`\n${bad} file(s) contain BOM. Run: node scripts/strip-bom.mjs`);
    process.exit(1);
}
console.log("No BOM found.");