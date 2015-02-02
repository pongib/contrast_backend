var d3 = require('d3');
var stackChart = require('./stack_chart');


var getStackChart = function (params) {

  
  //console.log(thick);
    var chart = stackChart()
    .data(params.data)
    .width(params.width)
    .height(params.height);

  d3.select('body').append('div').attr('id', params.containerId).call(chart);

  var selector = '#' + params.containerId;
  var sg = d3.select(selector).node().outerHTML;
  
  d3.select(selector).remove();

  return sg;

};


module.exports = {
  getStackChart: getStackChart
};
