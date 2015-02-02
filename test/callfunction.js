var express = require('express');
var test = require('./testfunction');

var app = express();

console.log("OK");
test.printX("pong");
test.search("b");