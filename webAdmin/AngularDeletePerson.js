var mysql  = require('mysql');
var express = require('express');
var expressJwt = require('express-jwt');
var connection = require('../connection');
var log = require('../function');
var router = express.Router();


//middleware

router.use('/', expressJwt({secret: '1234'}));

router.use(function(err,req, res, next){
	if(err.constructor.name === 'UnauthorizedError'){		
		res.send(401, 'Unauthorized');//can write any description did you want
		console.log("Unauthorized can not access");
	}else next();
});

router.use('/', function(req, res, next){

	if(req.param('personid') === undefined){
		res.send({result: "Don't have personid"});
		console.log("Don't have personid");
	}else{
		console.log("*-----------------------Delete--------------------------------*");
		console.log("personid "+req.param('personid'));
		console.log(log.getDateTime());
		res.send("OK");
		// next();
	}
});

router.post('/',function(req,res){

	connection.query('SELECT person_name FROM person_table WHERE person_id = ?', req.param('personid'), 
	function(err, rows){
		if(err) throw err;
		if(rows.length === 0){
			res.send({
			result: "incomplete",
			reason: "already deleted"
			});
			console.log("person already deleted");
		}
		else{
			connection.query('DELETE FROM person_table WHERE person_id = ?', req.param('personid'),
			function(err, result){
				if(err) throw err;
				console.log("Delete person from database complete.."+"affected = "+result.affectedRows+" row");
				connection.query('DELETE FROM report_table WHERE report_personid = ?', req.param('personid'), 
				function(err, result){
					if(err) throw err;
					console.log("And delete = "+result.affectedRows+" row from report table");
					res.send({result: "OK"});
				});
			});
		}

	});
});

module.exports = router;
