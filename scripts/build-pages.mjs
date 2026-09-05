import { copyFileSync, existsSync, renameSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const apiDir = "app/api";
const backup = ".api.bak";

if (existsSync(apiDir)) {
  renameSync(apiDir, backup);
}

const result = spawnSync("npx", ["next", "build"], {
  stdio: "inherit",
  env: { ...process.env, GITHUB_PAGES: "true" },
});

if (existsSync(backup)) {
  renameSync(backup, apiDir);
}

if (result.status === 0 && existsSync("out/index.html")) {
  writeFileSync("out/.nojekyll", "");
  copyFileSync("out/index.html", "out/404.html");
}

process.exit(result.status ?? 1);
