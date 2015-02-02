
var express = require('express');
var connection = require('./connection');
var router = express.Router();

router.post('/',function(req, res){
	connection.query('SELECT comment_like AS amountlike FROM comment_table WHERE comment_personid = ? && comment_commentid = ?', [req.param('personid'), req.param('commentid')], 
				function(err, rows){
					if(err) throw err;
					if(rows.length === 0){
						res.send({result: "person id not found"});
						console.log("person id not found");
					}else{
						var like = rows[0].amountlike + 1;
							connection.query('UPDATE comment_table SET comment_like = ? WHERE comment_personid = ? && comment_commentid = ?', [like, req.param('personid'), req.param('commentid')], 
							function(err, result){
								if(err) throw err;
									res.send({result: "ok"});
									console.log("changed "+result.changedRows);
									
							});
					}
					

				});
});

module.exports = router;