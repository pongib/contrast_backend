var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded());

app.post('/', function(req, res){

	console.log(req.param('name'));
	res.send(200);
});

app.listen(9000);