// var express = require('express');
// //var app = express();
// var router = express.Router();

// router.use(function(req, res, next){
// 	console.log('Hello');
// 	next();
// });

// router.get('/', function(req, res){
// 	res.json({message: 'get api cool'});
// });

// router.post('/', function(req, res){
// 	res.json({message: 'post api cool'});
// });



// module.exports = router;


var express = require('express');
var app = express();

var sql = require('./mysql');

app.use('/', sql);
//console.log(sql.getDateTime);
app.listen(9000);