var mysql  = require('mysql');
var express = require('express');

var connection = require('./connection');

var query = require('./function');
var router = express.Router();

//middleware
router.use(function(req, res, next){
	if( req.param('personid') === undefined || req.param('comment') === undefined || req.param('condition_side') === undefined || !(req.param('condition_side') === "like" ||  req.param('condition_side') === "dislike")){
		res.send({result: "Don't have personid or comment or condition_side"});
		console.log("Don't have personid "+req.param('personid')+" or comment "+req.param('comment')+" or condition_side "+ req.param('condition_side'));
	}else{
		console.log(query.getDateTime());
		next();
	}
});

router.post('/',function(req,res){
	
	var sqlComment = 	{
		comment_personid: req.param('personid'), 
		comment_comment: req.param('comment'), 
		comment_condition: req.param('condition_side'), // toogle button
		comment_like: 0,
		comment_dislike: 0
		// comment_condition_icon: req.param('status') //param('status') mean this comment from which side 
	};

	connection.query('INSERT INTO comment_table SET ?', sqlComment, 
	function(err, result){
		if(err) throw err;
		// res.send({"result": "insert comment Complete"});
		console.log("insert comment complete");
		query.queryCommentSide(req.param('personid'), req.param('condition_side'), res);
	});
});

module.exports = router;
