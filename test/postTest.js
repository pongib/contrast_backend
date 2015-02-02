var express = require('express');
var router = express.Router();
var app = express();

router.post('/', function(req, res){
	console.log(req.param('bill'));
	res.send("OK");
});

app.listen(3000);