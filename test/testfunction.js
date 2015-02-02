var express = require('express');
var connection = require('./connection');


module.exports.search = function(search){


	console.log("Loop");
	connection.query('SELECT person_id, person_name, person_category, person_like, person_dislike FROM person_table WHERE person_name LIKE ? ORDER BY person_name ASC', '%'+search+'%',
	function(err, rows, result){
		if(err) throw err;
		if(rows.length <= 0){
			console.log("Search Not found");
		}
		else{
			console.log(rows);
			console.log("Search Complete");
			}
	});
}

module.exports.printX = function(name){ console.log("Hi"+name);}


