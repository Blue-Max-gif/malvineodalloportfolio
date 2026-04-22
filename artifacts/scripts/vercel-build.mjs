import { execSync } from "node:child_process";
import { cpSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// This script lives at artifacts/scripts/vercel-build.mjs
// Vercel runs it from the artifacts/ directory (Root Directory setting)
const artifactsDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const repoRoot = path.dirname(artifactsDir);

console.log("Node:", process.version);
console.log("CWD:", process.cwd());
console.log("Repo root:", repoRoot);

const run = (cmd, env = {}, cwd = repoRoot) => {
  console.log(`\n$ ${cmd}`);
  try {
    execSync(cmd, {
      stdio: "inherit",
      cwd,
      env: { ...process.env, ...env },
    });
  } catch {
    console.error(`\n✖ Failed: ${cmd}`);
    process.exit(1);
  }
};

// Install all workspace dependencies from repo root
// (Vercel's auto-install runs from artifacts/ so it misses the pnpm workspace)
console.log("\n=== Installing dependencies ===");
run("pnpm install");

// Output goes to artifacts/dist/ (Vercel's outputDirectory is relative to Root Directory)
const distDir = path.join(artifactsDir, "dist");

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });

// Build portfolio → serve at /
console.log("\n=== Building portfolio ===");
run("pnpm --filter @workspace/portfolio run build", { BASE_PATH: "/" });
cpSync(path.join(repoRoot, "artifacts/portfolio/dist/public"), distDir, { recursive: true });

// Build admin → serve at /admin/
console.log("\n=== Building admin ===");
run("pnpm --filter @workspace/admin run build", { BASE_PATH: "/admin/" });
mkdirSync(path.join(distDir, "admin"), { recursive: true });
cpSync(path.join(repoRoot, "artifacts/admin/dist/public"), path.join(distDir, "admin"), { recursive: true });

// Build api-server → produces dist/vercel-app.mjs for the serverless function
console.log("\n=== Building api-server ===");
run("pnpm --filter @workspace/api-server run build");

console.log("\n=== Done ===");
console.log("dist/        → portfolio");
console.log("dist/admin/  → admin dashboard");
