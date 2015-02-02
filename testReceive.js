var express = require('express');
var router = express.Router();
// var app = express();
// var bodyParser = require('body-parser');
// app.use(bodyParser());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());

router.post('/', function(req, res){
	console.log(req.body);
	res.send(req.body.bill);
	
});

router.get('/:bill', function(req, res){
	res.send(req.param('bill'));
	console.log("get  "+req.param('bill'));
});

module.exports = router;