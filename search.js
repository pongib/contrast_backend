var mysql  = require('mysql');
var express = require('express');
var log = require('./function');
var connection = require('./connection');
var router = express.Router();

router.post('/',function(req,res){
	console.log(log.getDateTime());
	connection.query('SELECT person_id, person_name, person_category, person_like, person_dislike FROM person_table WHERE person_name LIKE ? ORDER BY person_name ASC', '%'+req.param('name')+'%',
	function(err, rows, result){
		if(err) throw err;
		if(rows.length <= 0){
			res.send({result: ["Not found"]});
			console.log("Search Not found");
		}
		else{
			// var result = [];
			// // for(var prop in rows)
			// // 	result.push(rows[prop].person_name);
			res.send({"search":rows});
			console.log("Search Complete");
			}
	});
});

module.exports = router;


