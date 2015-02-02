var mysql  = require('mysql');
var express = require('express');

var log = require('./function');
var connection = require('./connection');
var router = express.Router();

//middleware
router.use(function(req, res, next){
	if(req.param('udid') === undefined || req.param('personid') === undefined){
		res.send({result: "Don't have udid or personid"});
		console.log("sending missing some varible gone");
	}else{
		console.log(query.getDateTime());
		next();
	}
});

router.post('/',function(req,res){

	connection.query('SELECT person_like, person_dislike FROM person_table WHERE person_id = ?', req.param('personid'), 
	function(err, rows, result){
		if(err) throw err;
		if(rows.length === 0){
			res.send({result: "Not found id"});
			console.log("select not found");
		}else{
			// var personID = rows[0].person_id;
			var personLike = rows[0].person_like;
			var personDislike = rows[0].person_dislike;
			connection.query('SELECT lineitem_status AS side, pay_for_reply AS amountReply FROM udid_lineitem_table JOIN udid_table ON lineitem_udid = udid WHERE lineitem_udid = ? && lineitem_personid = ? ',[req.param('udid'), req.param('personid')],
			function(err, rows, result)
			{
				
				console.log("row = "+rows.length);
				if(rows.length === 0){
					connection.query('SELECT pay_for_reply FROM udid_table WHERE udid = ?', req.param('udid'),
					function(err, rows){
						if(err) throw err;
						if(rows.length === 0){
							res.send({result: "Not found udid"});
							console.log("not found udid");
						}
						else{
							res.send({"profile": "new", "like": personLike, "dislike": personDislike});
							console.log("profile : new");
						}
					});
					
				}
				else if(rows.length > 0)
				{
					var side = rows[0].side;
					var amountReply = rows[0].amountReply;
					console.log("in loop");
					connection.query('SELECT comment_comment AS comment FROM comment_table WHERE comment_personid = ? && comment_condition = ? LIMIT 10 OFFSET 0', [req.param('personid'), side], 
					function(err, rows, result){
						if(err) throw err;
						var comment = [];
						for(var prop in rows)
							comment.push(rows[prop].comment);
						res.send(
						{
							"profile": "old", 
							"like": personLike, 
							"dislike": personDislike, 
							// "amountreply": amountReply, 
							"side": side,
							"comment": comment
						});
						console.log("sending profile old with side and comment complete..");
					});
				}
			});
		}		
	});		
});

module.exports = router;

	

