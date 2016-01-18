// console.log(process)
var commands = require('./commands.js');
commands.showPrompt();

process.stdin.on('data', function(data) {
  var cmd = data.toString().trim(); // remove the newline
  // if (cmd === 'pwd') commands.pwd();
  // if (cmd === 'date') commands.date();
  // process.stdout.write('\nprompt > ');
  commands.checkInput(cmd);
});