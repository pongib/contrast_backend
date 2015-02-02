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
	
	connection.query('SELECT pay_for_reply FROM udid_table WHERE udid = ?', req.param('udid'),
	function(err, rows){
		if(err) throw err;
		if(rows.length === 0){
			res.send({result: "Not found udid"});
			console.log("not found udid");
		}
		else{
			res.send({"amountreply": rows[0].pay_for_reply});
			console.log("sending profile new with amount reply complete..");
		}
	}); 
});

module.exports = router;
