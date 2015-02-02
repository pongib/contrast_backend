var mysql  = require('mysql');
var jwt = require('jsonwebtoken');
var sha1 = require('sha1')
var express = require('express');
var connection = require('../connection');
var log = require('../function');
var router = express.Router();
var pwdHash = null;
var secret = 'this is the secret secret secret 12356';
//middleware
router.use(function(req, res, next){	
	pwdHash =  sha1(req.param('password'));
	next();
});

router.post('/', function(req, res){
	connection.query('SELECT username , password FROM login_table WHERE username = ?', req.param('username'), 
	function(err, rows){
		if(err) throw err;
		if(rows.length === 0){
			// connection.query('INSERT INTO login_table SET username = ? , password = ?', [req.param('username'), pwdHash],
			// function(err, result){
			// 	if(err) throw err;
			// 	console.log("add new user to databse complete..  Result = "+result.affectedRows+" row");
			// 	var token = jwt.sign(req.param('username'), secret, { expiresInMinutes: 1 });
			// 	res.send(401, {username: req.param('username'), token: token});
			// });
			res.send(401, "Wrong username or password");
		}else {
			if(pwdHash === rows[0].password){
				var token = jwt.sign(req.param('username'), '1234', { expiresInMinutes: 1 });
				res.send({result: "OK", username: req.param('username'), token: token});
			}else {
				res.send(401, "Wrong username or password");
			}
		}
	});
});

module.exports = router;