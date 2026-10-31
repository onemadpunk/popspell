// Build: run `npm run build` before every push.
// Stamps every local script and stylesheet a page loads with a short fingerprint of that file's
// contents (style.css?v=3f9a1c2b), so a browser fetches a file again exactly when it has changed,
// and nobody has to bump version numbers by hand. `npm run check` fails if a stamp is out of date.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = new URL("..", import.meta.url);
const read = f => readFileSync(new URL(f, root), "utf8");
// The same fingerprint on Windows and on GitHub's Linux machines, whatever the line endings
export const fingerprint = file => createHash("sha256").update(read(file).replace(/\r\n/g, "\n")).digest("hex").slice(0, 8);

// The site's own pages (tracked by git), except Google's Search Console file
export function pages() {
  const tracked = execFileSync("git", ["ls-files", "*.html"], { cwd: fileURLToPath(root), encoding: "utf8" }).split("\n").filter(Boolean);
  return tracked.filter(p => !/^google[0-9a-f]+\.html$/.test(p));
}

const REF = /(<(?:script|link)\b[^>]*?\b(?:src|href)=")([A-Za-z0-9_\-/]+\.(?:js|css))(?:\?v=[^"]*)?(")/g;
// Each page with every local .js/.css reference stamped. The pupil app's page also carries a build
// number made from all its stamps, which open tablets compare with popspell.com's to notice an update.
export function stamped(page) {
  let html = read(page).replace(REF, (all, before, file, after) => (existsSync(new URL(file, root)) ? `${before}${file}?v=${fingerprint(file)}${after}` : all));
  if (page === "index.html") {
    const build = createHash("sha256").update([...html.matchAll(/\?v=([0-9a-f]{8})"/g)].map(m => m[1]).join(",")).digest("hex").slice(0, 8);
    const meta = `<meta name="popspell-build" content="${build}">`;
    html = /<meta name="popspell-build"[^>]*>/.test(html) ? html.replace(/<meta name="popspell-build"[^>]*>/, meta) : html.replace(/(<meta charset="utf-8">)/, `$1\n  ${meta}`);
  }
  return html;
}
// Pages whose stamps don't match their files
export const staleStamps = () => pages().filter(p => stamped(p) !== read(p));

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const changed = staleStamps();
  for (const p of changed) writeFileSync(new URL(p, root), stamped(p));
  console.log(changed.length ? `Stamped ${changed.join(", ")}.` : "All stamps are up to date.");
}
