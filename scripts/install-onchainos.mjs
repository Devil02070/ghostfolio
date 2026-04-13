import { execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";
import { homedir, platform } from "os";

const isWindows = platform() === "win32";
const binName = isWindows ? "onchainos.exe" : "onchainos";
const binDir = join(homedir(), ".local", "bin");
const binPath = join(binDir, binName);

if (existsSync(binPath)) {
  console.log(`onchainos already installed at ${binPath}`);
  process.exit(0);
}

console.log("Installing onchainos CLI...");

try {
  // Get latest tag
  const tagRes = execSync(
    'curl -sSL "https://api.github.com/repos/okx/onchainos-skills/releases/latest"',
    { encoding: "utf8", timeout: 15000 }
  );
  const tag = JSON.parse(tagRes).tag_name;
  console.log(`Latest version: ${tag}`);

  if (isWindows) {
    execSync(
      `powershell -Command "& { $ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/okx/onchainos-skills/${tag}/install.ps1' -OutFile \\"$env:TEMP\\onchainos-install.ps1\\" -UseBasicParsing; & \\"$env:TEMP\\onchainos-install.ps1\\" }"`,
      { stdio: "inherit", timeout: 60000 }
    );
  } else {
    execSync(
      `curl -sSL "https://raw.githubusercontent.com/okx/onchainos-skills/${tag}/install.sh" | sh`,
      { stdio: "inherit", timeout: 60000 }
    );
  }

  if (existsSync(binPath)) {
    console.log(`onchainos installed successfully at ${binPath}`);
  } else {
    console.warn("onchainos installation may have failed — binary not found. App will still run with testnet RPC fallback.");
  }
} catch (err) {
  console.warn("Could not install onchainos CLI:", err.message);
  console.warn("App will still run — auth and testnet features will use fallback mode.");
}
