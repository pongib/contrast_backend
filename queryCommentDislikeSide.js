var express = require('express');

var connection = require('./connection');
var query = require('./function');
var router = express.Router();

router.use(function(req, res, next){
	if(req.param('personid') === undefined){
		res.send({result: "Don't have personid"});
		console.log("Don't have personid");
	}else{
		console.log(query.getDateTime());
		next();
	}
});

router.post('/', function(req, res){
	query.queryCommentSide(req.param('personid'), "dislike", res);
});

module.exports = router;