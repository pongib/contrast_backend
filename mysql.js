var mysql  = require('mysql');
var express = require('express');
var logger = require('morgan');
var responseTime = require('response-time');
var router = express.Router();
//var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
var connection = mysql.createConnection({
	host	: 'localhost',
	user	: 'root',
	password	: '1234',
	port	: '3306',
	database: 'contrast'
});

connection.connect(function(err){
	if(err){
		console.error('error connection: ' + err.stack);
		return;
	}

	console.log('connected as id '+ connection.threadID);
});

function getDateTime() {

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

// connection.query('SELECT idName, Name, age FROM database123.name', function(err, rows){
// 	if(err) throw err;
// 	for(var i = 0;i < rows.length;i++){
// 	console.log(rows[i].idName+"  "+rows[i].Name+" "+rows[i].age);
// 	}

// });



app.get('/', function(req, res){
	console.log("foo = "+req.param('foo'));
	console.log(req.get('Content-Type'));
	if(req.is('application/json')){
	console.log("body = "+req.body);
	console.log("foo0 = "+req.param('foo0'));
	console.log("query = "+req.query.foo0);
	}
	if(req.is('json')){
	console.log("body = "+req.body);
	console.log("foo0 = "+req.param('foo0'));
	console.log("query = "+req.query.foo0);
	}
	console.log(req.ip);
	
	connection.query('SELECT idName, name, age FROM database123.name', 
		function(err, rows){
			if(err) throw err;
			var text = rows[0].idName;                  
			res.send(rows);
			console.log(rows[1].idName);
		});
});

app.post('/', function(req, res){
	// if(req.is('json')){
	// console.log(req.body.null);
	// console.log(req.body.array[0]);
	// console.log(req.body.object.a);
	// console.log(req.param('array'));
	// console.log(req.param('boolean'));
	// console.log(req.param('null'));
	// console.log(req.param('number'));
	// console.log(req.param('object'));
	// console.log(req.param('string'));
	// var nullNew = req.param('null');
	// var me = req.param('object');
	// var arrayNew = req.param('array');
	// console.log(me.a + me['c']);
	// console.log(arrayNew[0]);
	// console.log(nullNew);
	// //console.log("foo = "+req.param('string'));
	// }

	if(req.is('json')){
	var timeNow = getDateTime();
	var timeStart = new Date().getTime();
	console.log("\n");
	console.log("-----------------------------------RECEIVE------------------------------------------");
	console.log("\n");
	console.log(timeNow+" ip: "+req.ip+" type: [[json]] [[POST]] method: "+req.param('method'));
	//console.log("body = "+req.body.string);
		if(req.param('method') === "insert"){
		//var sqlName = req.param('name');
		// console.log(sqlSearchBeforeInsertName);
		//var sqlSearchBeforeInsertCategory = req.param('category');
		// console.log(sqlSearchBeforeInsertCategory);
			if (req.param('page') === "create"){
			
			console.log("SQL Command "+ searchBeforeInsert.sql);
			}else if(req.param('page') === "profile"){
				if(req.param('type') === "new"){
				
				}else if(req.param('type') === "old"){
					
				}
			}
		}else if(req.param('method') === "search"){
		//var nameQuery = {"%req.param('name')%"};
	
		console.log("SQL command "+query.sql);
		}else if(req.param('page') === "profile"){
			
					// choose page 
					// cannot found status which mean this user never select side before.   
					if (rows.length === 0) {
					
						
					// found status which mean user already selected side
					}else if(statusSide === "like" || statusSide === "dislike" ){
						// include query like and dislike comment here 
						

					}
				});
			});
			
		}else if(req.param('page') === "main"){
			// poppular
			
		}else if(req.param('page') === "favorite"){
			
		}
	
	//res.send(req.body);
	}else if(req.is('application/x-www-form-urlencoded')){
	console.log(req.ip+" json Mode POST METHOD Type "+req.param('method'));
	//console.log("body = "+req.body.string);
		if(req.param('method') === "insert"){
		var sqlSearchBeforeInsert = { name: req.param('name') };
		var searchBeforeInsert = connection.query('SELECT name FROM database123.name WHERE ?', sqlSearchBeforeInsert, 
			function(err, rows){
				if(err) throw err;
				if(rows.length >= 1)
					res.send({message: "Can not add this name"});
				else {
					var post = {name: req.param('name')};  
					console.log(post);
					var query = connection.query('INSERT INTO database123.name SET ?',post,
					function(err, result){
						if(err) throw err;
						res.send('User added to database with ID:' +result.insertId);
					});
				}
			});
		console.log("SQL Command "+ searchBeforeInsert.sql);
		}else if(req.param('method') === "search"){
		var nameQuery = {name: req.param('name')};
		var query = connection.query('SELECT name FROM database123.name WHERE ?', nameQuery,
			function(err, rows, result){
				
				if(err) throw err;
				res.send(rows);
				console.log(rows);

			});
		console.log("SQL command "+query.sql);
		}
	
	}
});


// app.listen(9000);
module.exports = app;
//module.exports = getDateTime;

