//TODO: Add one color bars per annotation
//TODO: Toggle portions of the color bars
//TODO: Add tool tips to show what samples are being connected
//TODO: Refactor to create an init object for each plot and a draw function for each plot
//TODO: Add ability to zoom on parts of the heatmap
//TODO: Add ability to upload matrix file
//TODO: Add color legends
//TODO: Add ability to download svg to png file
//TODO: Beautify the user interface
//TODO: Dynamic text sizing
//TODO: Make custom color palette for categorial variables with more than 20 levels

function drawHeatmap(matrix,annots) {
	var n = matrix.length;
    var margin = {top: 75, right: -.5, bottom: 9.5, left: 75},
        width = 720,
        height = 720;
    
    /* 
     * PLOT HEATMAP
     */
    var xScale = d3.scale.ordinal()
        .domain(d3.range(n))
        .rangeBands([0, width]);
    
    var colorScale = d3.scale.linear()
        .domain([0, 0.5, 1])
        .range(["brown", "#ddd", "darkgreen"])
        .clamp(true);

    var svg = d3.select("#heatmap").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("margin-left", margin.left + "px")
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height);
    
    var row = svg.selectAll(".row")
        .data(matrix)
        .enter()
        .append("g")
          .attr("class", "row")
          .attr("transform", function(d, i) { return "translate(0," + xScale(i) + ")"; });
    
    row.selectAll(".cell")
       .data(function(d) { return d; })
       .enter()
       .append("rect")
        .attr("class", "cell")
        .attr("x", function(d, i) { return xScale(i); })
        .attr("width", xScale.rangeBand())
        .attr("height", xScale.rangeBand());

    row.append("line")
        .attr("x2", width);
            
    row.selectAll(".cell")
      .data(function(d, i) { return matrix[i]; })
      .style("fill", colorScale);

    var column = svg.selectAll(".column")
        .data(matrix)
      .enter().append("g")
        .attr("class", "column")
        .attr("transform", function(d, i) { return "translate(" + xScale(i) + ")rotate(-90)"; });

    column.append("line")
        .attr("x1", -width);
	
	if (annots != null) {
	    row.append("text")
	        .attr("x", -6)
	        .attr("y", xScale.rangeBand() / 2)
	        .attr("dy", ".32em")
	        .attr("text-anchor", "end")
	        .text(function(d, i) { return annots[i].id; });
		column.append("text")
			.attr("x", 6)
			.attr("y", xScale.rangeBand() / 2)
		    .attr("dy", ".32em")
		    .attr("text-anchor", "start")
		    .text(function(d, i) { return annots[i].id; });	            	
    }
        
}

function drawColorPlot() {
	var margin = {top: 75, right: -.5, bottom: 9.5, left: 75},
        width = 720,
        height = 720;
	var xScale = d3.scale.ordinal()
		.domain(d3.range(n))
        .rangeBands([0, width],5);
    
    // Start off by making a color bar for each of the annotations
	var annotScales = Object();
    for (k in annots[1]) {
    	var vals = annots.map(function(e) {
    			return e[k];
    		});
    	//DEBUG
    	console.log(k);
    	console.log(typeof annots[1][k]);
    	
    	switch(typeof annots[1][k]) {
    		case "string":
    			var lvls = d3.unique(vals);
    			var nLvl = lvls.length;
    			var plt;
    			if (nLvl <= 10) {
    				plt = d3.scale.category10().range();
    			} else if (nLvl <= 20) {
    				plt = d3.scale.category20().range();
    			} else {
    				//TODO: Add custom color palette when more than 20 variables
    			}
    			var scale = d3.scale.ordinal()
    				.domain(lvls)
    				.range(plt.slice(0,nLvl));
    			annotScales[k] = scale;
    			break;
    		case "number":
    			[q1,q3] = d3.extent(vals);
    			q2 = d3.median(vals);
    			var colorbarScale = d3.scale.linear()
    				.domain([q1, q2, q3])
    				.range(["blue", "white", "red"])
    				.clamp(true);
    			annotScales[k] = scale;
    			break;
			case "boolean":
				var scale = d3.scale.ordinal()
					.domain([true,false])
					.range([colorbrewer.Paired[3][0],
						colorbrewer.Paired[3][2]]);
				annotScales[k] = scale;
				break;
			default:
				alert('Unrecognized JSON annotation type.');
            };    	
    }
	var colorsvg = d3.select("#colorbar")
		.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", 25 + margin.top + margin.bottom)
			.style("margin-left", margin.left + "px")
  		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    colorsvg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", 25);
    
    var colorrow = colorsvg.selectAll(".colorrow")
        .data(annot1)
        .enter()
        .append("g")
          .attr("class", "colorrow")
          .attr("transform", function(d, i) { return "translate(0," + xScale(i) + ")"; });
    
    colorrow.selectAll(".cell")
       .data(function(d) { return d; })
       .enter()
       .append("rect")
        .attr("class", "cell")
        .attr("x", function(d, i) { return xScale(i); })
        .attr("width", xScale.rangeBand())
        .attr("height", 25);
        
    colorrow.selectAll(".cell")
      .data(function(d, i) { return annot[i]['lastname']; })
      .style("fill", colorbarScale);
	
}

d3.unique = function(array) {
  return d3.scale.ordinal().domain(array).domain();
};

