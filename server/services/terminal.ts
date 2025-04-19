import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

const execPromise = util.promisify(exec);
const writeFilePromise = util.promisify(fs.writeFile);
const mkdirPromise = util.promisify(fs.mkdir);

// Security: Set a max length for command output
const MAX_OUTPUT_LENGTH = 50000; // Characters

// Security: List of allowed commands to reduce potential harm
const ALLOWED_COMMANDS = [
  'ls', 'cat', 'pwd', 'echo', 'mkdir', 'touch', 'rm', 'cp', 'mv',
  'grep', 'find', 'ps', 'cd', 'python', 'python3', 'node', 'npm',
  'chmod', 'wc', 'head', 'tail', 'sort', 'uniq', 'date', 'whoami',
  'ping', 'curl', 'wget', 'nslookup', 'dig', 'ssh-keygen'
];

// Blocked commands that could be dangerous
const BLOCKED_COMMANDS = [
  'sudo', 'su', 'chmod -R', 'rm -rf', 'dd', '/dev/null',
  '>', '>>', '2>', '&>', '|', 'eval', 'exec',
  'reboot', 'shutdown', 'init', 'mkfs', 'mount', 'umount',
  'chown', 'passwd', 'apt', 'apt-get', 'yum', 'dnf', 'pacman'
];

/**
 * Safely determine if a command is allowed to run
 */
function isCommandAllowed(command: string): boolean {
  const normalizedCmd = command.trim().toLowerCase();
  
  // Check if command includes any blocked terms
  if (BLOCKED_COMMANDS.some(blocked => normalizedCmd.includes(blocked))) {
    return false;
  }
  
  // Get the first word (the actual command)
  const mainCommand = normalizedCmd.split(' ')[0];
  
  // Check if it's in our allowed list
  return ALLOWED_COMMANDS.includes(mainCommand);
}

/**
 * Execute a terminal command
 */
export async function executeCommand(command: string, directory: string): Promise<{output: string, newDirectory?: string}> {
  try {
    // Validate directory exists and is within the project
    if (!fs.existsSync(directory)) {
      directory = process.cwd();
    }
    
    // Sanitize command
    const trimmedCommand = command.trim();
    const mainCommand = trimmedCommand.split(' ')[0].toLowerCase();
    
    // Handle cd command specially since exec can't change the current directory of the Node process
    if (mainCommand === 'cd') {
      const target = trimmedCommand.split(' ')[1] || '';
      let newDir = '';
      
      if (!target || target === '~') {
        newDir = process.env.HOME || '/home/user';
      } else if (path.isAbsolute(target)) {
        newDir = target;
      } else {
        newDir = path.resolve(directory, target);
      }
      
      // Verify the directory exists
      if (fs.existsSync(newDir) && fs.statSync(newDir).isDirectory()) {
        return {
          output: '',
          newDirectory: newDir
        };
      } else {
        return {
          output: `cd: ${target}: No such directory`
        };
      }
    }
    
    // Check if command is allowed
    if (!isCommandAllowed(mainCommand)) {
      return {
        output: `Error: Command '${mainCommand}' is not allowed for security reasons.`
      };
    }
    
    // Execute the command
    const { stdout, stderr } = await execPromise(trimmedCommand, {
      cwd: directory,
      maxBuffer: 1024 * 1024 // 1MB buffer
    });
    
    // Limit output size
    let output = stdout;
    if (stderr) {
      output += stderr;
    }
    
    if (output.length > MAX_OUTPUT_LENGTH) {
      output = output.substring(0, MAX_OUTPUT_LENGTH) + 
        `\n\n[Output truncated, exceeded ${MAX_OUTPUT_LENGTH} characters]`;
    }
    
    return { output };
  } catch (error) {
    // Return error as command output
    return {
      output: error instanceof Error ? 
        `Error: ${error.message}` : 
        'Unknown error occurred while executing command'
    };
  }
}

/**
 * Create a script file
 */
export async function createScript(name: string, content: string, directory: string): Promise<{message: string}> {
  try {
    // Validate name
    if (!name.match(/^[a-zA-Z0-9_\-\.]+$/)) {
      return { message: "Error: Script name can only contain letters, numbers, dots, underscores, and hyphens" };
    }
    
    // Add extension if needed
    if (!name.includes('.')) {
      if (content.includes('#!/usr/bin/env python')) {
        name += '.py';
      } else if (content.includes('#!/usr/bin/env node')) {
        name += '.js';
      } else if (content.includes('#!/bin/bash')) {
        name += '.sh';
      }
    }
    
    // Create the full path
    const scriptPath = path.join(directory, name);
    
    // Ensure the directory exists
    const dirPath = path.dirname(scriptPath);
    if (!fs.existsSync(dirPath)) {
      await mkdirPromise(dirPath, { recursive: true });
    }
    
    // Write the file
    await writeFilePromise(scriptPath, content, { mode: 0o755 }); // Make executable
    
    return { message: `Created script: ${scriptPath}` };
  } catch (error) {
    return {
      message: error instanceof Error ? 
        `Error creating script: ${error.message}` : 
        'Unknown error occurred while creating script'
    };
  }
}