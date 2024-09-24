import { executeCommand, generateBuildCommandWithFlags } from "./command.js";

const command = generateBuildCommandWithFlags([]);
executeCommand(command);
