const fs = require("fs");

const mustFiles = [
  "AURORA-STATUS.md",
  "MVP_SCOPE.md",
  "DECISIONS.md",
  "ARCHITECTURE.md",
  "KPI.md",
];

for (const f of mustFiles) {
  if (!fs.existsSync(f)) {
    console.error(`GATE FAIL: missing ${f}`);
    process.exit(1);
  }
}

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const prismaVer =
  (pkg.dependencies && pkg.dependencies.prisma) ||
  (pkg.devDependencies && pkg.devDependencies.prisma) ||
  "";

if (!prismaVer.includes("6")) {
  console.error(`GATE FAIL: prisma version must be 6.x (found: ${prismaVer})`);
  process.exit(1);
}

console.log("GATE PASS");
