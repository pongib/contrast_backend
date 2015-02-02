var mysql  = require('mysql');
var express = require('express');

var log = require('./function');
var connection = require('./connection');
var router = express.Router();


router.post('/', function(req,res){
	console.log(log.getDateTime());
	var sqlReport = {
		report_personid: req.param('personid'), 
		report_type: req.param('report_type')
	};

	connection.query('INSERT INTO report_table SET ?', sqlReport, 
	function(err, result){
		if(err) throw err;
		res.send({"result": "insert report Complete"});
		console.log("insert report complete");
	});
});

module.exports = router;
