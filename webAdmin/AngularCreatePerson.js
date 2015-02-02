var mysql  = require('mysql');
var express = require('express');
var expressJwt = require('express-jwt');
var connection = require('../connection');
var log = require('../function');
var router = express.Router();


//middleware
router.use('/', expressJwt({secret: '1234'}));

// router.use(function(err,req, res, next){
// 	if(err.constructor.name === 'UnauthorizedError'){		
// 		res.send(401, 'Unauthorized');//can write any description did you want
// 		console.log("Unauthorized can not access");
// 	}else next();
// });

router.use('/', function(err, req, res, next){
	if(err.constructor.name === 'UnauthorizedError'){		
		res.send(401, 'Unauthorized');//can write any description did you want
		console.log("Unauthorized can not access");
	}else if(req.param('name') === undefined || req.param('category') === undefined || req.param('id') === undefined){
		res.send({result: "Don't have name or category or id"});
		console.log("Don't have name or category or id");
	}else{
		console.log("*-----------------------create--------------------------------*");
		console.log("id "+req.param('id')+" name: "+req.param('name')+" category: "+req.param('category'));
		console.log(log.getDateTime());
		res.send(200);
		// next();
	}
});

// router.post('/', expressJwt({secret: '1234'}),function(req,res){
router.post('/', function(req,res){
	var category = req.param('category');
		category = category.replace(/\s/g, '');
		console.log("category: "+category);
		
	connection.query('SELECT person_name FROM person_table WHERE person_name = ? && person_category = ?', [req.param('name'), category], 
	function(err, rows){
		if(err) throw err;
		if(rows.length >= 1){
			res.send({
			result: "incomplete",
			reason: "already created"
			});
			console.log("person already created");
		}
		else{
			var post = {person_name: req.param('name'), person_category : category, person_like: 0, person_dislike: 0};  
			console.log(post);
			var query = connection.query('INSERT INTO person_table SET ?', post,
			function(err, rows){
				if(err) throw err;
				console.log("added person to database complete..");
				connection.query('DELETE FROM suggest_table WHERE suggest_id = ?', req.param('id'), 
				function(err, result){
					if(err) throw err;
					console.log("And delete = "+result.affectedRows+" row from suggest table");
					res.send({result: "OK"});
				});
			});
		}

	});
});

module.exports = router;
