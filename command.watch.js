import { executeCommand, generateBuildCommandWithFlags } from "./command.js";

const command = generateBuildCommandWithFlags(["--watch"]);
executeCommand(command);
