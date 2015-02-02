var express = require('express');
var path = require('path');
var fs = require('fs');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken'); 
var expressJwt = require('express-jwt');
//add live reload
var livereload = require('livereload');
// var secret = 'this is the secret secret secret 12356';
//var routes = require('./routes/index');

var favorite = require('./favorite');
var suggest = require('./suggest');
var main = require('./main');
var favoriteAdd = require('./favoriteAdd');
var profileSelect = require('./profileSelect');
var profileSelect_edit = require('./profileSelect_edit');
var profileNew = require('./profileNew');
var profileQueryComment = require('./profileQueryComment');
var profileNewInsert = require('./profileNewInsert');
var profileOldInsertComment  = require('./profileOldInsertComment');
var profileQueryLikeComment = require('./queryCommentLikeSide');
var profileQueryDislikeComment = require('./queryCommentDislikeSide');
var likeComment = require('./likeComment');
var dislikeComment = require('./dislikeComment');
var genUDID = require('./genUDID');
var report = require('./report');
var search = require('./search');
var donutD3 = require('./graphD3/donutD3');
var stackD3 = require('./graphD3/stackD3');
var testLookid = require('./testLookid');
// log file
var logFile = fs.createWriteStream('./logFile.log', {flags: 'a' , 'mode': 0666 });
// web angular
var ngSuggest = require('./webAdmin/AngularSuggest');
var ngReport = require('./webAdmin/AngularReport');
var ngCreatePerson = require('./webAdmin/AngularCreatePerson');
var ngDeletePerson = require('./webAdmin/AngularDeletePerson');
var ngLogin = require('./webAdmin/AngularLogin');
//live reload
var autoF5 = livereload.createServer();
//for test bug
var testBug = require('./testBug');
//var testGet = require('./testGet');


var app = express();

//middleware



app.use(logger('dev'));
app.use(logger({stream : logFile}));
app.use(favicon());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'public')));
// autoF5.watch(__dirname + "/webAdmin");
console.log(__dirname);
//set view graph for d3
app.engine('.html', require('ejs').__express);
// app.set('views', __dirname + '/graphD3');
app.set('views', path.join(__dirname, 'graphD3'));
app.set('view engine', 'html');
app.locals.barChartHelper = require('./graphD3/bar_chart_helper');
app.locals.stackChartHelper = require('./graphD3/stack_chart_helper');

console.log("server start..");
//select path here!
app.use('/profile/old/insert/comment', profileOldInsertComment);
app.use('/profile/new/insert', profileNewInsert);
app.use('/profile/old/query/comment', profileQueryComment);
app.use('/profile/new', profileNew);
app.use('/profile/query/comment/like', profileQueryLikeComment);
app.use('/profile/query/comment/dislike', profileQueryDislikeComment);
app.use('/comment/like', likeComment);
app.use('/comment/dislike', dislikeComment);
// app.use('/profile-select', profileSelect); 
app.use('/profile-select', profileSelect_edit);
app.use('/main', main);
app.use('/report', report);
app.use('/search', search);
app.use('/favorite', favorite);
app.use('/favorite-add', favoriteAdd);
app.use('/suggest', suggest);
app.use('/graph/donut', donutD3);
app.use('/graph/stack', stackD3);
app.use('/new/gen.udid', genUDID);
//web admin path
app.use('/', express.static(path.join(__dirname, 'webAdmin')));
app.use('/testweb', express.static(path.join(__dirname, 'testWeb')));
// app.use('/admin', expressJwt({secret: '1234'}).unless({path: ['/admin/login']}));
app.use('/admin/suggest', ngSuggest);
app.use('/admin/create/person', ngCreatePerson);
app.use('/admin/report', ngReport);
app.use('/admin/delete/person', ngDeletePerson);
app.use('/admin/login', ngLogin);
//path for test bug
// app.use('/test', testBug);

app.use('/test', testLookid);





/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
 