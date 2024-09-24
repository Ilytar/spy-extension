import { execSync } from "child_process";
import { ALL_FILES_STRING, FILES_ALIASES } from "./files.js";

function getInputFiles() {
  const targetTypes = process.argv.slice(2);
  let inputFiles;
  if (targetTypes.length === 0) {
    inputFiles = ALL_FILES_STRING;
  } else {
    inputFiles = targetTypes
      .map((targetType) => FILES_ALIASES[targetType])
      .filter(Boolean)
      .join(" ");
  }
  return inputFiles;
}
export function generateBuildCommandWithFlags(flags = []) {
  const inputFiles = getInputFiles();
  if (inputFiles.length === 0) {
    throw new Error("Переданы неверные аргументы");
  }
  const flagsString = flags.length > 0 ? `${flags.join(" ")}` : "";
  return `printf '${inputFiles}' | xargs -d ' ' -P0 -I% npx vite build  ${flagsString} -- --input=%`;
}

export function executeCommand(command) {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error("Ошибка при выполнении команды");
    process.exit(1);
  }
}
