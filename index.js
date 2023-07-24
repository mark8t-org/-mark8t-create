#!/usr/bin/env node
const { join } = require('path');
const fs = require('fs').promises;
const fse = require('fs-extra');
const path = require('path');
const {
  runCommand,
  executeCommand,
  copyFiles,
  navigateToDirectory
} = require('./functions');

// Constants
const TEMPLATE_REPO = 'https://github.com/ryanspice/-mark8t-web';
const LOCAL_MODULE_PATH = 'B:\\Dev\\-mark8t-web';

// Command line arguments
const [, , , ...args] = process.argv;
const [projectName, ...commandArgs] = args;

// Determine target directory
const targetDirectory = join(process.cwd(), projectName);

// Set configuration variables
const forceClean = commandArgs.includes('-f');
const useLocalModule = commandArgs.includes('-local');

// Create the prompts
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

  try {
    const answers = await inquirer.prompt(prompts);
    await updateProjectFiles(projectName, answers, targetDirectory, forceClean);
  } catch (error) {
    console.error('An error occurred:', error);
    process.exit(1);
  }
}

// Async function to update the mark8t.config.json and package.json files
async function updateProjectFiles(projectName, answers, targetDirectory, forceClean) {
  const { enableGoogleIntegration } = answers;
  const execa = (await import('execa')).execa;
  const chalk = (await import('chalk')).default;

  try {
    // Clean the target directory if the forceClean flag is set
    if (forceClean) {
      console.log(chalk.yellow(`Cleaning the target directory: ${targetDirectory}`));
      await runCommand(`npx rimraf ${targetDirectory}`);
      console.log(chalk.green(`Target directory cleaned successfully.`));
    }

    if (useLocalModule) {
      // Use local module
      console.log(chalk.yellow(`Creating a new @mark8t/web project in ${targetDirectory} using local module at ${LOCAL_MODULE_PATH}`));
      await copyFiles(LOCAL_MODULE_PATH, targetDirectory);
      console.log(chalk.green(`Local module copied successfully.`));
    } else {
      // Clone the template repository
      console.log(chalk.yellow(`Creating a new @mark8t/web project in ${targetDirectory}`));
      await executeCommand('git', ['clone', TEMPLATE_REPO, targetDirectory], { stdio: 'inherit' });
      console.log(chalk.green(`Template repository cloned successfully.`));
    }

    // Create the mark8t.config.json file
    const configFilePath = path.join(targetDirectory, 'mark8t.config.json');
    const configData = { projectName };
    await fs.writeFile(configFilePath, JSON.stringify(configData, null, 2));
    console.log(chalk.green(`Created mark8t.config.json in ${targetDirectory}`));

    // Update the package.json file
    const packageFilePath = path.join(targetDirectory, 'package.json');
    const packageJson = await fs.readFile(packageFilePath, 'utf8');
    const packageData = JSON.parse(packageJson);

    packageData.name = projectName;
    packageData.devDependencies = packageData.devDependencies || {};
    packageData.devDependencies.svelte = 'latest';
    packageData.devDependencies['smui-theme'] = 'latest';
    packageData.dependencies = packageData.dependencies || {};
    packageData.dependencies.vite = '^4.3.9';

    await fs.writeFile(packageFilePath, JSON.stringify(packageData, null, 2));
    console.log(chalk.green(`Updated package.json in ${targetDirectory} with the name: ${projectName}`));

    // Run npm install to update the devDependency
    console.log(chalk.yellow('Updating Svelte devDependency...'));
    await execa('npm install', { cwd: targetDirectory });
    console.log(chalk.green('Svelte devDependency updated successfully.'));

    // Install dependencies
    console.log(chalk.yellow('Installing dependencies...'));
    await executeCommand('npm', ['install'], { cwd: targetDirectory, stdio: 'inherit' });
    console.log(chalk.green('Dependencies installed successfully.'));

    // Print success message
    console.log(chalk.green(`Successfully created ${projectName}`));
    navigateToDirectory();
  } catch (error) {
    console.error(chalk.red('An error occurred while updating project files:'), error);
    displayErrorExplanation(error);
    process.exit(1);
  }
}


// Function to display an explanation of the error
function displayErrorExplanation(error) {
  const errorCode = error.exitCode;
  let errorMessage = error.message;

  // Add custom error explanations for specific error codes
  if (errorCode === 128) {
    errorMessage = `Command failed with exit code 128: ${errorMessage}`;
    // You can provide a brief explanation or look up online for more details
    // ...
  }

  console.error(errorMessage);
}
build();
