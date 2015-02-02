var mysql  = require('mysql');
var express = require('express');

var connection = require('./connection');
var query = require('./function');
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
	connection.query('SELECT * FROM favorite_table WHERE favorite_udid = ? AND favorite_personid = ?', [req.param('udid'), req.param('personid')], 
	function(err, rows){
		var tokenFavorite;
		if(err) throw err;
		if(rows.length === 0)
			tokenFavorite = "no";
		else tokenFavorite = "yes";
		connection.query('SELECT person_like, person_dislike, person_category FROM person_table WHERE person_id = ?', req.param('personid'), 
		function(err, rows, result){
			if(err) throw err;
			if(rows.length === 0){
				res.send({result: "Not found id"});
				console.log("select not found");
			}else{
				var personid = req.param('personid');
				var personLike = rows[0].person_like;
				var personDislike = rows[0].person_dislike;
				var personCategory = rows[0].person_category;
				connection.query('SELECT lineitem_status AS side, pay_for_reply AS amountReply FROM udid_lineitem_table JOIN udid_table ON lineitem_udid = udid WHERE lineitem_udid = ? && lineitem_personid = ? ',[req.param('udid'), req.param('personid')],
				function(err, rows, result)
				{
					
					if(rows.length === 0){
						connection.query('SELECT pay_for_reply FROM udid_table WHERE udid = ?', req.param('udid'),
						function(err, rows){
							if(err) throw err;
							if(rows.length === 0){
								res.send({result: "Not found udid"});
								console.log("not found udid");
							}
							else{
								res.send({"profile": "new", "like": personLike, "dislike": personDislike, "category": personCategory, "result": "complete"});
								console.log("profile : new");
							}
						});
						
					}
					else if(rows.length > 0)
					{
						var side = rows[0].side;
						// call query comment in function
						query.queryCommentAllwithToken(personid, side, personLike, personDislike, res, tokenFavorite, personCategory);
						// var amountReply = rows[0].amountReply; not use now
						// connection.query('SELECT comment_comment AS comment FROM comment_table WHERE comment_personid = ?  && comment_condition = "like" LIMIT 10 OFFSET 0', [req.param('personid')], 
						// function(err, rows, result){
						// 	if(err) throw err;
						// 	var commentLike = [];
						// 	var commentDislike = [];			
						// 	for(var prop in rows)
						// 		commentLike.push(rows[prop].comment);
						// 		//query dislike
						// 		connection.query('SELECT comment_comment AS comment FROM comment_table WHERE comment_personid = ? && comment_condition = "dislike" LIMIT 10 OFFSET 0', [req.param('personid')], 
						// 		function(err, rows, result){
						// 			for(var prop in rows)
						// 				commentDislike.push(rows[prop].comment);
						// 			res.send(
						// 			{
						// 				"profile": "old", 
						// 				"like": personLike, 
						// 				"dislike": personDislike, 
						// 				// "amountreply": amountReply, 
						// 				"side": side,
						// 				"comment_like": commentLike,
						// 				"comment_dislike": commentDislike
						// 			});
						// 			console.log("sending profile old with side and comment complete..");
						// 		});

							
						// });
						
					}
				});
			}		
		});	
	});
			
});


module.exports = router;

	

