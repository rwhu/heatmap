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
/**
 * @param: plotConfig: an object that contains the sizes needed to make the plot
 *                     any size
 */
function initHeatmap() {
    return;
}

function drawHeatmap(matrix,annots,plotObj) {
	var n = matrix.length;
    var margin = {top: 150, right: -.5, bottom: 9.5, left: 150},
        width = 800,
        height = 800;
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

function initColorPlot() {
    return;
}

function drawColorPlot(annots,whichAnnots,plotObj) {
    n = annots.length;
    annot_data = new Array();
    keys = Object.keys(annots[0]);
    for (var i = 0; i < keys.length; i++) {
        console.log(i);
        annot_data.push(annots.map(function(d) {return d[keys[i]];}));
    }
    
    var nAnnots = Object.keys(annot_data).length;
    
    var whichAnnots = Object.keys(annots)
    var margin = {top: 150, right: -.5, bottom: 9.5, left: 150},
        width = 800,
        height = 300;
    

	var xScale = d3.scale.ordinal()
		.domain(d3.range(n))
        .rangeBands([0, width]);
    var yScale = d3.scale.ordinal()
        .domain(d3.range(nAnnots))
        .rangeBands([0,height]);
    
    // Start off by making a color bar for each of the annotations
	annotScales = Object();
    for (var i = 0; i < keys.length; i++) {
        var k = Object.keys(annots[1])[i];
        console.log(k);
    	vals = annots.map(function(e) {
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
    		    console.log("Found number");
    			[q1,q3] = d3.extent(vals);
    			q2 = d3.median(vals);
    			var scale = d3.scale.linear()
    				.domain([q1, q2, q3])
    				.range(["black", "white", "red"])
    				.clamp(true);
    			annotScales[k] = scale;
    			break;
			case "boolean":
			    console.log('Found Boolean');
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
			.attr("height", height + margin.top + margin.bottom)
			.style("margin-left", margin.left + "px")
  		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    colorsvg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height);
    
    colorrow = colorsvg.selectAll(".colorrow")
        .data(annot_data)
        .enter()
        .append("g")
          .attr("class", "colorrow")
          .attr("transform", function(d, i) { return "translate(0," + yScale(i) + ")"; });
    
    colorrow.selectAll(".cell")
       .data(function(d) { return d; })
       .enter()
       .append("rect")
        .attr("class", "cell")
        .attr("x", function(d, i) { return xScale(i); })
        .attr("width", xScale.rangeBand())
        .attr("height", yScale.rangeBand());
    var idx = -1;    
    colorrow.selectAll(".cell")
      .data(function(d, i) { return d; })
      .style("fill", 
             function(d,i) {
                 //console.log(d)
                 var color = "black";
                 if (i==0) {
                     idx = idx + 1;
                 }
                 var color = annotScales[Object.keys(annotScales)[idx]](d);
                 return color});
	
}

function redrawColorPlot() {
    return;
}

d3.unique = function(array) {
  return d3.scale.ordinal().domain(array).domain();
};

