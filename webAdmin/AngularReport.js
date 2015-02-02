var mysql  = require('mysql');
var express = require('express');
var expressJwt = require('express-jwt');
var connection = require('../connection');
var log = require('../function');
var router = express.Router();

router.use('/', expressJwt({secret: '1234'}));

router.use(function(err, req, res, next){
  if (err.constructor.name === 'UnauthorizedError') {
    res.send(401, 'Unauthorized');//can write any description did you want
    console.log("Unauthorized can not access");
  }else next();
});
// router.get('/', expressJwt({secret: '1234'}), function(req, res){
router.get('/', function(req, res){
	console.log(log.getDateTime());

	connection.query('SELECT itemno AS id , R.report_personid AS personid, P.person_name AS Name,IF(isnull(Type_1), 0, Type_1) as Type1,  IF(isnull(Type_2), 0, Type_2) as Type2, IF(isnull(Type_3), 0, Type_3) as Type3 , COUNT(IF(isnull(Type_1), 0 , Type_1) + IF(isnull(Type_2), 0 , Type_2) + IF(isnull(Type_3), 0 , Type_3)) AS OverAll FROM (((report_table R LEFT JOIN REPORT1 X ON R.report_personid =  X.PersonID) LEFT JOIN REPORT2 Y ON  R.report_personid =  Y.PersonID) LEFT JOIN REPORT3 Z ON R.report_personid =  Z.PersonID) JOIN person_table P ON P.person_id = R.report_personid GROUP BY R.report_personid ORDER BY OverAll DESC',  
	function(err, rows){
		if(err) throw err;
		res.json(rows);
		console.log("send report people to angular complete...");
	});
});
module.exports = router;