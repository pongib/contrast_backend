var connection = require('./connection');	


// for query comment in first time 
//include LIMIT 100 OFFSET 0 to sql
module.exports.queryCommentAll = function(personid, side, personLike, personDislike, res, category){
	connection.query('SELECT comment_comment AS comment FROM comment_table WHERE comment_personid = ?  && comment_condition = "like" ', personid, 
	function(err, rows, result){
		if(err) throw err;
		var commentLike = [];
		var commentDislike = [];			
		for(var prop in rows)
			commentLike.push(rows[prop].comment);
			//query dislike
			connection.query('SELECT comment_comment AS comment FROM comment_table WHERE comment_personid = ? && comment_condition = "dislike" ', personid, 
			function(err, rows, result){
				for(var prop in rows)
					commentDislike.push(rows[prop].comment);
				res.send(
				{
					"profile": "old", 
					"like": personLike, 
					"dislike": personDislike, 
					// "amountreply": amountReply, 
					"side": side,
					"category": category,
					"token" : "no",
					"comment_like": commentLike,
					"comment_dislike": commentDislike,
					"result": "complete"
				});
				console.log("sending profile old with side and comment complete..");
			});

		
	});
}

module.exports.queryCommentAllwithToken = function(personid, side, personLike, personDislike, res, tokenFavorite, category){
	connection.query('SELECT comment_comment AS comment FROM comment_table WHERE comment_personid = ?  && comment_condition = "like" ', personid, 
	function(err, rows, result){
		if(err) throw err;
		var commentLike = [];
		var commentDislike = [];			
		for(var prop in rows)
			commentLike.push(rows[prop].comment);
			//query dislike
			connection.query('SELECT comment_comment AS comment FROM comment_table WHERE comment_personid = ? && comment_condition = "dislike" ', personid, 
			function(err, rows, result){
				for(var prop in rows)
					commentDislike.push(rows[prop].comment);
				res.send(
				{
					"profile": "old", 
					"like": personLike, 
					"dislike": personDislike, 
					// "amountreply": amountReply, 
					"side": side,
					"category": category,
					"token" : tokenFavorite,
					"comment_like": commentLike,
					"comment_dislike": commentDislike,
					"result": "complete"
					
				});
				console.log("sending profile old with side and comment complete..");
			});

		
	});
}

module.exports.queryCommentSide = function(personid, side, res){
	connection.query('SELECT comment_comment AS comment FROM comment_table WHERE comment_personid = ?  && comment_condition = ? ', [personid, side], 
	function(err, rows, result){
		if(err) throw err;
		var comment = [];		
		for(var prop in rows)
			comment.push(rows[prop].comment);
		connection.query('SELECT person_like, person_dislike FROM person_table WHERE person_id = ?', personid, 
		function(err, rows, result){
			if(err) throw err;
			if(rows.length === 0){
				res.send({result: "Not found id"});
				console.log("select not found");
			}else{
				var personLike = rows[0].person_like;
				var personDislike = rows[0].person_dislike;	
				res.send(
				{
					"profile": "old", 
					"like": personLike, 
					"dislike": personDislike, 
					// "amountreply": amountReply, 
					"comment": comment,
					"result": "complete"
				});
				console.log("sending profile old with side "+side+" and comment complete..");
			}
		});
	});
}


module.exports.getDateTime = function(){

		var date = new Date();

 		var hour = date.getHours();
   		hour = (hour < 10 ? "0" : "") + hour;

   		var min  = date.getMinutes();
   		min = (min < 10 ? "0" : "") + min;

    	var sec  = date.getSeconds();
    	sec = (sec < 10 ? "0" : "") + sec;

   		var year = date.getFullYear();

   		var month = date.getMonth() + 1;
   		month = (month < 10 ? "0" : "") + month;

   		var day  = date.getDate();
   		day = (day < 10 ? "0" : "") + day;

   		return "Date:"+day + ":" + month + ":" + year + " Time:" + hour + ":" + min + ":" + sec;
}