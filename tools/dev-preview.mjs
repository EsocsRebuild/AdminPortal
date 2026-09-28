#!/usr/bin/env node
/**
 * Preview the portal without a backend: starts the mock API and `next dev`
 * pointed at it. Ctrl+C stops both.
 *
 *   npm run dev:preview   →  http://localhost:3001  (admin@esocs.test / Preview-Password-2026)
 */
import { spawn } from "node:child_process";

const MOCK_PORT = process.env.MOCK_API_PORT ?? "4010";
const children = [];
const run = (cmd, args, env) => {
  const child = spawn(cmd, args, {
    stdio: "inherit",
    env: { ...process.env, ...env },
    shell: process.platform === "win32",
  });
  child.on("exit", (code) => {
    children.forEach((c) => c !== child && c.kill("SIGTERM"));
    process.exit(code ?? 0);
  });
  children.push(child);
};

run(process.execPath, ["tools/mock-api/server.mjs"], { MOCK_API_PORT: MOCK_PORT, MOCK_API_LOG: "0" });
run("npx", ["next", "dev", "--port", "3001"], {
  BACKEND_API_URL: `http://localhost:${MOCK_PORT}/v1`,
  NEXT_PUBLIC_APP_URL: "http://localhost:3001",
});

for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => children.forEach((c) => c.kill(sig)));
