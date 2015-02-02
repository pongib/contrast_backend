var express = require('express');
var router = express.Router();

router.get('/v1', function(req, res){
	res.send("A");
});

router.get('/v1/:id', function(req, res){
	res.render("<p>Hi rende</p>");
});

module.exports = router;