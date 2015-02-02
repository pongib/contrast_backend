var d3 = require('d3');
var barChart = require('./bar_chart');


var getBarChart = function (params) {
  //console.log("test :" + req.param('id') );

  var chart = barChart()
    .data(params.data)
    .width(params.width)
    .height(params.height);

  d3.select('body').append('div').attr('id', params.containerId).call(chart);

  var selector = '#' + params.containerId;
  var sg = d3.select(selector).node().outerHTML;
  // console.log(sg);
  d3.select(selector).remove();

  return sg;

};

module.exports = {
  getBarChart: getBarChart
};
