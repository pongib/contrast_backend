var mysql  = require('mysql');
var express = require('express');
var log = require('./function');
var connection = require('./connection');
var router = express.Router();

//middleware
router.use(function(req, res, next){
	if(req.param('udid') === undefined || req.param('personid') === undefined){
		res.send({result: "Don't have udid or personid"});
		console.log("sending missing something");
	}else{
		connection.query('SELECT udid FROM udid_table WHERE udid = ?', req.param('udid'), 
		function(err, rows){
			if(err) throw err;
			if(rows.length === 0){
				res.send({result: "Don't found udid"});
				console.log("Don't found udid");
			}else {
				console.log(log.getDateTime());
				next();
			}
		});
	}
});


router.post('/', function(req,res){

	connection.query('SELECT * FROM favorite_table WHERE favorite_udid = ? && favorite_personid = ?',[req.param('udid'), req.param('personid')], 
	function(err, rows){
		if(err) throw err;
		if(rows.length > 0){
			res.send({ result: "Can't add same favorite" });
			console.log("Can't add same favorite");
		}else if(rows.length === 0){
			var post = {favorite_udid: req.param('udid'), favorite_personid: req.param('personid')};  
			connection.query('INSERT INTO favorite_table SET ?', post,
			function(err, rows){
			if(err) throw err;
			res.send({ result: "Add favorite complete" });
			console.log("Add favorite complete");
			});
		}
	});
	
});

module.exports = router;