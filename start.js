const { exec } = require('child_process');
const path = require('path');

const projectPath = path.join(__dirname);

exec('npm install', { cwd: projectPath }, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error during 'npm install': ${error}`);
    return;
  }

  console.log(`'npm install' output: ${stdout}`);

  const commandsToRun = [
    'node index.js',
    'node server.js'
  ];

  for (const command of commandsToRun) {
    exec(command, { cwd: projectPath }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error during '${command}': ${error}`);
        return;
      }
      console.log(`'${command}' output: ${stdout}`);
    });
  }
});
