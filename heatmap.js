function drawHeatmap(matrix,annots) {
    var margin = {top: 20.5, right: -.5, bottom: 9.5, left: 20.5},
        width = 720,
        height = 720;
    /*
    var n = 60,
        m=6000,
        zero = d3.range(n).map(function() { return 0; }),
        matrix = zero.map(function() { return zero.slice(); });
    
   
    // Fill matrix with random values
    for (var i = 0; i<matrix.length; i++) {
        for (var j = 0; j<matrix.length; j++) {
            matrix[i][j]=Math.random();
        }
    }
    */
    
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
    
    row.append("text")
        .attr("x", -6)
        .attr("y", xScale.rangeBand() / 2)
        .attr("dy", ".32em")
        .attr("text-anchor", "end")
        .text(function(d, i) { return i; });
        
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

    column.append("text")
        .attr("x", 6)
        .attr("y", xScale.rangeBand() / 2)
        .attr("dy", ".32em")
        .attr("text-anchor", "start")
        .text(function(d, i) { return i; });
    
    /* 
     * PLOT COLORBARS
     */
    // Make some fake color bar data
    var ordinalValues = ['a','b','c','d','e','f','g','h'];
    var annot1 = d3.range(n).map(function() { return 0; })
    for (var i=0;i<annot1.length;i++) {
        annot1[i]=Math.random();
    }
    var annot1 = [annot1];
    
    // Add y-scale depending on number of annotations
    var xScale = d3.scale.ordinal()
        .domain(d3.range(n))
        .rangeBands([0, width],5);
    
    var colorbarScale = d3.scale.linear()
        .domain([0, 0.5, 1])
        .range(["blue", "white", "red"])
        .clamp(true);
        
    var colorsvg = d3.select("#colorbar").append("svg")
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
      .data(function(d, i) { return annot1[i]; })
      .style("fill", colorbarScale);
    
}

