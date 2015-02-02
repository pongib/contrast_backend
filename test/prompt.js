var prompt = require('prompt');
prompt.start();
var username = "pong";
var password = 1234;
prompt.get(['username', 'password'], function(err, result){

	console.log('Command-line input received:');
    console.log('  username: ' + result.username);
    console.log('  email: ' + result.email);
});