var mysql  = require('mysql');
var express = require('express');
var connection = require('./connection');

var router = express.Router();
var log = require('./function');


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
	connection.query('SELECT person_id, person_name, person_category, person_like, person_dislike FROM favorite_table JOIN person_table ON favorite_personid = person_id WHERE favorite_udid = ?',req.param('udid'),
	function(err, rows){
		if(err) throw err;
		if(rows.length === 0){
			res.send({result: "Don't have favorite"});
			console.log("Don't have favorite");
		}else{
			res.send({"favorite": rows});
			console.log("return favorite complete...");
		}	
	});

});

module.exports = router;
