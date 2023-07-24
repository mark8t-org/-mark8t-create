

// Async function to run a command and return its output
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

// Async function to execute commands using execa
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
			return !relPath.includes('node_modules') && !relPath.includes('git');
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

module.exports = {
	runCommand,
	executeCommand,
	copyFiles,
	navigateToDirectory
}