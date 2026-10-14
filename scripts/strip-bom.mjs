// scripts/strip-bom.mjs
import { readFile, writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";

const files = execSync("git ls-files", { encoding: "utf8" })
    .split(/\r?\n/)
    .filter(Boolean);

let fixed = 0;
for (const file of files) {
    let buf;
    try {
        buf = await readFile(file);
    } catch {
        continue; // file đã bị xoá nhưng còn trong index, bỏ qua
    }
    if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
        await writeFile(file, buf.subarray(3));
        console.log("strip BOM:", file);
        fixed++;
    }
}
console.log(`\nDone. ${fixed} file(s) fixed.`);