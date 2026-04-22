import { execSync } from "node:child_process";
import { cpSync, mkdirSync, rmSync } from "node:fs";

const run = (cmd, env = {}) => {
  console.log(`\n$ ${cmd}`);
  try {
    execSync(cmd, {
      stdio: "inherit",
      env: { ...process.env, ...env },
    });
  } catch (err) {
    console.error(`\n✖ Command failed: ${cmd}`);
    console.error(err.message);
    process.exit(1);
  }
};

console.log("Node:", process.version);
console.log("Platform:", process.platform);
console.log("CWD:", process.cwd());

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
console.log("dist/        → portfolio");
console.log("dist/admin/  → admin dashboard");
