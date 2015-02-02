var mysql  = require('mysql');
var express = require('express');

var log = require('./function');
var connection = require('./connection');
var router = express.Router();

//middleware
router.use(function(req, res, next){
	if(req.param('personid') === undefined || req.param('side') === undefined || req.param('offset') === undefined ){
		res.send({result: "send something missing"});
		console.log("send something missing");
	}else{
		console.log(log.getDateTime());
		next();
	}
});

router.post('/',function(req,res){
	//console.log(req.param('personid') + req.param('side') + req.param('offset'));
	connection.query('SELECT comment_comment AS comment FROM comment_table WHERE comment_personid = ? && comment_condition = ? LIMIT 10 OFFSET ?', [req.param('personid'), req.param('side'), 10 * req.param('offset')], 
	function(err, rows, result){
		if(err) throw err;
		var comment = [];
		for(var prop in rows)
			comment.push(rows[prop].comment);
		res.send({"comment": comment});
		console.log("sending "+ req.param('side') +" comment with offset "+ req.param('offset')*10 +" complete..");
	});
});

module.exports = router;
