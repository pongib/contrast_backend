var express = require('express');
var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res) {
//   res.render('index', { title: 'Express' });
// });


// router.param('name',function(req, res, next, name){

// 	console.log("Name validation on "+ name);
// 	req.name = name;
// 	next();
// });

router.get('/', function(req, res){
	
	var str = req.param('age');
	//str++;
	console.log(str);
	// res.send('str');
	res.send(200, str);
	// res.send(200);
	

});

router.post('/',function(req,res){

	
	console.log(req.param('name'));
	//console.log(req.param('age'));
	res.send(200);

});



module.exports = router;
