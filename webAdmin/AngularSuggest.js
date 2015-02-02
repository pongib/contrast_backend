var mysql  = require('mysql');
var express = require('express');
var expressJwt = require('express-jwt');
var log = require('../function');
var connection = require('../connection');
var router = express.Router();

router.use('/',  expressJwt({secret: '1234'}));

router.use(function(err, req, res, next){
  if (err.constructor.name === 'UnauthorizedError') {
    res.send(401, 'Unauthorized');//can write any description did you want
    console.log("Unauthorized can not access");
  }else next();
});
	// if(expressJwt({secret: '1234'})){
	// 	res.send(401);
	// }else{
	// 	next();
	// }



router.get('/', function(req, res){
	console.log(log.getDateTime());
	connection.query('SELECT suggest_id as id, suggest_name AS name, suggest_category AS category , COUNT(suggest_name) AS amount FROM suggest_table GROUP BY suggest_category ORDER BY amount DESC LIMIT 100 ', 
	function(err, rows){
		if(err) throw err;
		res.json(rows);
		console.log("send suggest people to angular complete...");
	});
});

module.exports = router;

