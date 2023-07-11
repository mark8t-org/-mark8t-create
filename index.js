#!/usr/bin/env node
const { join } = require('path');
const fs = require('fs').promises;
const fse = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');

// Constants
const TEMPLATE_REPO = 'https://github.com/ryanspice/-mark8t-web';
const LOCAL_MODULE_PATH = 'B:\\Dev\\-mark8t-web';

// Command line arguments
const [, , , ...args] = process.argv;
const [projectName] = args;

// Determine target directory
const targetDirectory = join(process.cwd(), projectName);

//
const useLocalModule = true;
const forceClean = true;

//
const prompts = [
  {
    type: 'input',
    name: 'projectName',
    message: 'Enter a name for your project:',
    default: projectName,
  }
]

// Create the project
const build = async function () {
  const inquirer = (await import('inquirer')).default;
  console.log('Building...');
  // Run prompts
  await inquirer
    .prompt(prompts)
    .then(async (answers) => {
      // ...
      await updateProjectFiles(projectName, answers, targetDirectory, forceClean);
    })
    .catch(error => {
      console.error('An error occurred:', error);
      process.exit(1);
    });
}

/**
 * Runs a command and returns its output.
 * @param {string} command - The command to run.
 * @returns {Promise<string>} - The output of the command.
 */
async function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else if (stderr) {
        reject(new Error(stderr));
      } else {
        resolve(stdout);
      }
    });
  });
}
// Async function to execute commands
async function executeCommand(command, args, options) {
  try {
    const execa = (await import('execa')).execa;
    const { stdout, stderr } = await execa(command, args, options);
    console.log(stdout);
    console.error(stderr);
  } catch (error) {
    console.error(`An error occurred while executing command: ${error.message}`);
    process.exit(1);
  }
}

// Async function to copy files and directories excluding node_modules
async function copyFiles(source, destination) {
  const options = {
    filter: (src) => {
      const relPath = src.replace(source, '');
      return !relPath.includes('node_modules');
    }
  };

  try {
    await fse.copy(source, destination, options);

    console.log(`Copied ${source} to ${destination}`);
  } catch (error) {
    console.error(`An error occurred while copying ${source} to ${destination}:`, error);
    process.exit(1);
  }
}

// Function to navigate to the target directory
function navigateToDirectory() {
  try {
    process.chdir(targetDirectory);
    console.log(`Navigated to ${targetDirectory}`);
  } catch (error) {
    console.error('An error occurred while navigating to the target directory:', error);
    process.exit(1);
  }
}

// Function to update the mark8t.config.json and package.json files
async function updateProjectFiles(projectName, answers, targetDirectory, forceClean) {

  const { enableGoogleIntegration } = answers;
  const execa = (await import('execa')).execa;
  try {

    // Clean the target directory if the forceClean flag is set
    if (forceClean) {
      console.log(`Cleaning the target directory: ${targetDirectory}`);
      await runCommand(`npx rimraf ${targetDirectory}`);
    }

    if (useLocalModule) {
      // Use local module
      console.log(`Creating a new @mark8t/web project in ${targetDirectory} using local module at ${LOCAL_MODULE_PATH}`);
      await copyFiles(LOCAL_MODULE_PATH, targetDirectory);
    } else {
      // Clone the template repository
      console.log(`Creating a new @mark8t/web project in ${targetDirectory}`);
      await executeCommand('git', ['clone', TEMPLATE_REPO, targetDirectory], { stdio: 'inherit' });
    }

    // Create the mark8t.config.json file
    const configFilePath = path.join(targetDirectory, 'mark8t.config.json');
    const configData = { projectName };
    await fs.writeFile(configFilePath, JSON.stringify(configData, null, 2));

    console.log(`Created mark8t.config.json in ${targetDirectory}`);

    // Update the package.json file
    const packageFilePath = path.join(targetDirectory, 'package.json');
    const packageJson = await fs.readFile(packageFilePath, 'utf8');
    const packageData = JSON.parse(packageJson);
    packageData.name = projectName;

    // Update the devDependency for Svelte to the latest version
    if (!packageData.devDependencies)
      packageData.devDependencies = {};
    packageData.devDependencies.svelte = 'latest';
    packageData.devDependencies['smui-theme'] = 'latest';

    if (!packageData.dependencies)
      packageData.dependencies = {};
    packageData.dependencies.vite = '^4.3.9';

    await fs.writeFile(packageFilePath, JSON.stringify(packageData, null, 2));

    console.log(`Updated package.json in ${targetDirectory} with the name: ${projectName}`);


    // Run npm install to update the devDependency
    console.log('Updating Svelte devDependency...');
    await execa('npm install', { cwd: targetDirectory });

    console.log('Svelte devDependency updated successfully.');


    // Install dependencies
    console.log('Installing dependencies...');
    await executeCommand('npm', ['install'], { cwd: targetDirectory, stdio: 'inherit' });

    // Print success message
    console.log(`Successfully created ${projectName}`);
    navigateToDirectory();
  } catch (error) {
    console.error('An error occurred while updating project files:', error);
    process.exit(1);
  }
}


build();