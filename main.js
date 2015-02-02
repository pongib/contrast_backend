var mysql  = require('mysql');
var express = require('express');
var log = require('./function');
var connection = require('./connection');
var router = express.Router();

//middleware
router.use(function(req, res, next){	
	
	if(req.param('udid') === undefined){
		res.send({result: "Don't have udid"});
		console.log("Don't have udid "+ req.param('udid'));
	}else{
		console.log(log.getDateTime());
		next();
	}
});

router.post('/',function(req,res){
	connection.query('SELECT pay_for_reply AS amountReply FROM udid_table WHERE udid = ?',req.param('udid'), 
	function(err, rows){
		if(err) throw err;
		if(rows.length === 0){
			connection.query('INSERT INTO udid_table SET udid = ?, pay_for_reply = 0, pay_for_see = 0', req.param('udid'), 
			function(err, result){
				if(err) throw err;
				console.log("Insert new udid complete");
				connection.query('SELECT person_id, person_name, person_category, person_like, person_dislike FROM person_table ORDER BY  person_like + person_dislike DESC LIMIT 15', 
				function(err, rows){
					if(err) throw err;
					res.send({"popular":rows});
					console.log("return popular in main complete...");
				});
			}); 
		}else {
			var amountReply = rows[0].amountReply;
			connection.query('SELECT person_id, person_name, person_category, person_like, person_dislike FROM person_table ORDER BY  person_like + person_dislike DESC LIMIT 15', 
			function(err, rows){
				if(err) throw err;
				res.send({"popular":rows});
				console.log("return popular in main complete...");
			});
		}
	});
	

});


module.exports = router;
