import { execSync } from "child_process";
import fs from "fs";
import path from "path";

try {
  const githooksDir = path.resolve(".githooks");
  const preCommitFile = path.join(githooksDir, "pre-commit");

  if (fs.existsSync(preCommitFile)) {
    fs.chmodSync(preCommitFile, "755");
  }

  execSync("git config core.hooksPath .githooks", { stdio: "inherit" });
  console.log("✅ Git hooks configured to .githooks/");
} catch (err) {
  console.warn("⚠️ Note: Git hooks setup skipped (not a git repository or git unavailable).");
}

