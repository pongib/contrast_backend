var mysql  = require('mysql');
var express = require('express');

var connection = require('./connection');
var query = require('./function');
var router = express.Router();


//middleware
router.use(function(req, res, next){
	if(req.param('udid') === undefined || req.param('personid') === undefined || req.param('condition_side') === undefined ){
		res.send({result: "Don't have udid or personid or side"});
		console.log("sending missing something");
	}else{
		console.log(query.getDateTime());
		next();
	}
});
//doing
router.post('/',function(req,res){
	connection.query('SELECT lineitem_status FROM udid_lineitem_table WHERE lineitem_udid = ? AND lineitem_personid = ?',[req.param('udid'), req.param('personid')], 
	function(err, rows){
		if(err) throw err;
		if (rows.length > 0) {
			res.send({result: "Error same udid and person id in this table"});
			console.log("Error same udid and person id in this table");
		}else{
			connection.query('INSERT INTO udid_lineitem_table SET lineitem_udid = ?,lineitem_personid = ?, lineitem_status = ?',[req.param('udid'), req.param('personid'), req.param('condition_side')],
			function(err , result){
				if (err) throw err;
				var sqlComment = {
								  comment_personid: req.param('personid'), 
								  comment_comment: req.param('comment'), 
								  comment_condition: req.param('condition_side'), // toogle button
								  comment_like: 0,
								  comment_dislike: 0,
								  // comment_condition_icon: req.param('status') //param('status') mean this comment from which side 
								 };
				connection.query('INSERT INTO comment_table SET ?', sqlComment, 
				function(err, result)
				{
						if(err) throw err;
						//res.send({"result": "insert Complete"});
						console.log("insert selected sidecomplete");
						
				});

				// add like or dislike on database
				// approve transaction to add like or dislike person
				connection.beginTransaction(function(err){
					if(err) throw err;
					connection.query('SELECT person_like, person_dislike, person_category FROM person_table WHERE person_id = ?', req.param('personid'), 
					function(err, rows){
						if(err){
							connection.rollback(function(){
								throw err;
							});
						}
						if(rows.length === 0){
							res.send({result: "person id not found"});
							console.log("person id not found");
						}else{
							var personid = req.param('personid');
							var side = req.param('condition_side');
							var category = rows[0].person_category;
							var like = rows[0].person_like;		
							var dislike = rows[0].person_dislike;
							if (side === "like") 
								like += 1;
							else if(side === "dislike")
								dislike += 1;
							connection.query('UPDATE person_table SET person_like = ?, person_dislike = ? WHERE person_id = ?',[like, dislike, req.param('personid')], 
							function(err, result){
								if(err){
									connection.rollback(function(){
										throw err;
									});
								}
								connection.commit(function(err){
									if(err){
										connection.rollback(function(){
											throw err;
										});
									}
									console.log("result: added "+side+" person complete..");
									console.log("changed "+result.changedRows);
									query.queryCommentAll(personid, side, like, dislike, res, category);
								});							
							});
						}					
					});
				});
// normal add like or dislike person
				// connection.query('SELECT person_like, person_dislike FROM person_table WHERE person_id = ?', req.param('personid'), 
				// function(err, rows){
				// 	if(err) throw err;
				// 	if(rows.length === 0){
				// 		res.send({result: "person id not found"});
				// 		console.log("person id not found");
				// 	}else{
				// 		var personid = req.param('personid');
				// 		var side = req.param('condition_side');
				// 		var like = rows[0].person_like;
				// 		var dislike = rows[0].person_dislike;
				// 		if (req.param('condition_side') === "like") 
				// 			like += 1;
				// 		else if(req.param('condition_side') === "dislike")
				// 			dislike += 1;
				// 			connection.query('UPDATE person_table SET person_like = ?, person_dislike = ? WHERE person_id = ?',[like, dislike, req.param('personid')], 
				// 			function(err, result){
				// 				if(err) throw err;
				// 					//res.send({"result": "added "+req.param('condition_side')+" complete"});
				// 					console.log("result: added "+req.param('condition_side')+" complete..");
				// 					console.log("changed "+result.changedRows);
				// 					query.queryCommentAll(personid, side, like, dislike, res);
				// 			});
				// 	}
					

				// });
					
			});
		}
	});
	
});

module.exports = router;
