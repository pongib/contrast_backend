var barChart = module.exports = function() {
var d3 = require('d3');
// var width = 150,
//     height = 150  ,
//     
    
var chart = function(container){
  radius = Math.min(width, height) / 2;
  // console.log('container = '+container);
  // console.log('data = ' + data);
      var color = d3.scale.ordinal()
       .range([ "#FF6C61",  "#6BFFD4",  "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    

      var arc = d3.svg.arc()
       .outerRadius(radius)
       .innerRadius(radius/1.5);

      var pie = d3.layout.pie()
       .sort(null)
       .value(function(d) { return d.population; });

      var svg = container.append("svg")
       .data(data)
       .attr("width", width)
       .attr("height", height)
         .append("g")
         .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


      // svg.append("text")
      //     .attr("dy", ".035em")
      //     .style("text-anchor", "middle")
      //     .style("font-size", "50px")
      //     .attr("class", "inside")
      //     .text(function(d) { return 'เต้ย'; });

      // svg.append("text")
      //     .attr("dy", "1em")
      //     .style("text-anchor", "middle")
      //     .style("font-size", "30px")
      //     .attr("class", "inside")
      //     .text(function(d) { return 'หน้าม่อ'; });
    
          

        var g = svg.selectAll(".arc")
          .data(pie(data))         
          .enter().append("g")
          .attr("class", "arc");


           

        g.append("path")
          .attr("d", arc)
         .style("fill", function(d) { return color(d.data.age); });

  };

   chart.data = function(value) {
    if (!arguments.length) return data;
    data = value;
    return chart;
  };


  chart.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return chart;
  };

  chart.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    return chart;
  };

  return chart;
};
