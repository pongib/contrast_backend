var sha1 = require('sha1');
var crypto = require('crypto');
var express = require('express');
var connection = require('./connection');

var router = express.Router();
var log = require('./function');

router.post('/', function(req, res){
	console.log("********************GEN UDID********************");
	console.log(log.getDateTime());
	crypto.randomBytes(256, function(ex, buf){
		if(ex) throw ex;
		// console.log("Have %d bytes of random data: %s", buf.length, buf);
		//var timeStamp = new Date().getTime();
		var data = buf+" "+(new Date().getTime());
		// console.log("timeStamp = "+timeStamp+"\n");
		// console.log('data: '+data+"\n");
		var udid = sha1(data);
		res.send({"udid" : udid});
		console.log("udid: "+udid);
	});
	
});

module.exports = router;