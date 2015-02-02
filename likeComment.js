var express = require('express');
var connection = require('./connection');
var router = express.Router();
var log = require('./function');

//middleware
router.use(function(req, res, next){
	if(req.param('personid') === undefined || req.param('commentid') === undefined){
		res.send({result: "Don't have personid or commentid"});
		console.log("Don't have personid or commentid");
	}else{
		console.log(log.getDateTime());
		next();
	}
});

router.post('/', function(req, res){
	connection.beginTransaction(function(err){
		if(err) throw err;
		var x = connection.query('SELECT comment_like AS amountlike FROM comment_table WHERE comment_personid = ? && comment_commentid = ?', [req.param('personid'), req.param('commentid')],
		function(err, rows){
			if(err){
				connection.rollback(function() {
		          throw err;
			    });
			}
			if(rows.length === 0){
				res.send({result: "not found comment or personid for add like"});
				console.log("not found comment or personid for add like");
			}else {
				var like = rows[0].amountlike + 1;
				connection.query('UPDATE comment_table SET comment_like = ? WHERE comment_personid = ? && comment_commentid = ?', [like, req.param('personid'), req.param('commentid')], 
				function(err, result){
					if(err){
						connection.rollback(function(){
							throw err;
						});
					}
					connection.commit(function(err){
						if(err){ 
					        connection.rollback(function() {
				        		throw err;
				        	});
				    	}
				    	res.send({result: "added like complete"});
				    	console.log("added like complete and changed "+ result.changedRows+ " row");
					});
				});

			}
		});
	});
});

module.exports = router;