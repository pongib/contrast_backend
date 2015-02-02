var mysql  = require('mysql');
var express = require('express');

var log = require('./function');
var connection = require('./connection');
var router = express.Router();

router.post('/', function(req, res){
	console.log(log.getDateTime());
	var post = {suggest_name: req.param('name'), suggest_category : req.param('category')};  
	console.log(post);
	var query = connection.query('INSERT INTO suggest_table SET ?', post,
	function(err, rows){
	if(err) throw err;
	res.send({ result: "complete" });
	});
});

module.exports = router;