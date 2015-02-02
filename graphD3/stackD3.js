var express = require('express');
var router = express.Router();
var connection = require('../connection');
var log = require('../function');

router.get('/', function(req, res){
	console.log("************************GRAPH************************")
	console.log(log.getDateTime());
	console.log("personid " + req.param('personid') + " width = "+ req.param('w') + " Height = "+req.param('h'));
	
	connection.query('SELECT person_like, person_dislike FROM person_table WHERE person_id = ?', req.param('personid'), 
	function(err, rows, result){
		if(err) throw err;
		if(rows.length === 0){
			console.log("select not found");
			res.send({result : "select not found"});
		}else{
			console.log(rows);
			var width = req.param('w');
			var height = req.param('h');

			if(rows[0].person_like === 0 && rows[0].person_dislike === 0)
			{
				rows[0].person_dislike = 1;
				rows[0].person_like = 1;
			}

			var data = [
				[
					{
						x: 0,
						y: rows[0].person_like
					},
				],
				[
					{
						x: 0,
						y: rows[0].person_dislike
					},
				]
			];
			//console.log('sata = ' + data);
			res.render('stack' ,{ data: data , width: width, height : height });
			//res.send(rows);

			console.log('Graph Success !!');
		}
	});
 
});

module.exports = router;