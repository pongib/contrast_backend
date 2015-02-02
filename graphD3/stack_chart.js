var stackChart = module.exports = function() {
var d3 = require('d3');

 var chart = function(container){

			//Set up stack method
			var stack = d3.layout.stack();

			//Data, stacked
			stack(data);

			//Set up scales
			var xScale = d3.scale.linear()
					.range([0, width])
					.domain([0,				
							d3.max(data, function(d) {
								return d3.max(d, function(d) {
									return d.y0 + d.y;
									});
								})
							]);


  			var yScale = d3.scale.ordinal()
  					.rangeRoundBands([0, height], 0.0)
  					.domain(d3.range(data.length));

			//Easy colors accessible via a 10-step ordinal scale
			var colors = d3.scale.ordinal()
       			.range(["#7EE4D0","#FF6C61"]);
		
			//Create SVG element
			var svg = container
						.append("svg")
						.attr("width", width)
						.attr("height", height);
	
			// Add a group for each row of data
			var groups = svg.selectAll("g")
				.data(data)
				.enter()
				.append("g")
				.style("fill", function(d, i) {
					return colors(i);
				});
	
			// Add a rect for each data value
			var rects = groups.selectAll("rect")
				.data(function(d) { return d; })
				.enter()
				.append("rect")
				.attr("x", function(d) {
					return xScale(d.y0);
				})
				.attr("y", function(d,i) {
					return yScale(i);
				})
				.attr("width", function(d) {
					return xScale(d.y);
				})
				.attr("height", yScale.rangeBand());

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