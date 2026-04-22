import { execSync } from "node:child_process";
import { cpSync, mkdirSync, rmSync } from "node:fs";

const run = (cmd, env = {}) =>
  execSync(cmd, { stdio: "inherit", env: { ...process.env, ...env } });

// Clean output
rmSync("dist", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });

// Build portfolio (served at /)
console.log("\n=== Building portfolio ===");
run("pnpm --filter @workspace/portfolio run build", { BASE_PATH: "/" });
cpSync("artifacts/portfolio/dist/public", "dist", { recursive: true });

// Build admin (served at /admin/)
console.log("\n=== Building admin ===");
run("pnpm --filter @workspace/admin run build", { BASE_PATH: "/admin/" });
mkdirSync("dist/admin", { recursive: true });
cpSync("artifacts/admin/dist/public", "dist/admin", { recursive: true });

console.log("\n=== Build complete ===");
console.log("dist/ — portfolio root");
console.log("dist/admin/ — admin dashboard");
