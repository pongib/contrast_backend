var express = require('express');
var app = express();
var mysql  = require('mysql');
var favicon = require('static-favicon');

app.use(favicon());

//connection database
var connection = mysql.createConnection({
	host	: 'localhost',
	user	: 'root',
	password	: '1234',
	port	: '3306',
	database: 'contrast'
});

app.engine('.html', require('ejs').__express);
app.set('views', __dirname);
app.set('view engine', 'html');

//var fixtureData = require('./fixture_data.json');
app.locals.barChartHelper = require('./bar_chart_helper');


app.use('/graph/:id', function(req, res) {
	console.log(req.param('id'));
	
	connection.query('SELECT person_like, person_dislike FROM person_table WHERE person_id = ?', req.param('id'), 
	function(err, rows, result){
		if(err) throw err;
		if(rows.length === 0){
			console.log("select not found");
		}else{
			console.log(rows);
			var data = [
			{
				'age' : 'one',
				'population' : rows[0].person_like
			},
			{
				'age' : 'two',
				'population' : rows[0].person_dislike
			}];
			console.log('data = ' + data);
			res.render('index' ,{ data: data });
			//res.send(rows);

			console.log('Success !!');
		}
	}
	 );
 
});


app.listen(9000);
console.log('listening on port 9000');
