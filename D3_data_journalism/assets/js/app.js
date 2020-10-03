// Step 1: Set up our chart
//= ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Step 3:
// Import data from the data.csv file
// =================================
d3.csv("./assets/data/data.csv").then(function(healthData) {
  // Step 4: Parse the data
  // Format the data and convert to numerical
  // =================================
 
  // Format the data
  healthData.forEach(function(data) {
   
    data.poverty    = +data.poverty;
    data.healthcare = +data.healthcare;
    data.age        = +data.age;
    data.smokes     = +data.smokes;
    data.obesity    = +data.obesity;
    data.income     = +data.income;
  });

  // Step 5: Create the scales for the chart
  // =================================
    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(healthData, d => d.poverty)])
        .range([0, width]);

    
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d.healthcare)])
        .range([height, 0]);

  // Step 6: Create axis functions
  // ==============================
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

  // Step 7: Append Axes to the chart
  // ==============================
  chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

      chartGroup.append("g")
        .call(yAxis);

  // Step 8: Create Circles
  // ==============================
  /*Create and place the "blocks" containing the circle and the text */ 

var circlesGroup = chartGroup.selectAll("g circle")
    .data(healthData)
    .enter()
    // .append("g");
  
 var circlesXY = circlesGroup.append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 15)
    .classed("stateCircle", true);
  
 var circlesText = circlesGroup.append("text")
    .text(d => d.abbr)
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .classed("stateText", true);
      

  // Create axes labels
     chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left )
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "aText")
      .text("Lacks Healthcare(%)");

    chartGroup.append("text")
    .attr("x", width/2)
    .attr("y", height+50)
    .attr("value", "poverty") // value to grab for event listener
    // .classed("active", true)
    .text("In Poverty (%)");

    // 
    var circletextGroup = chartGroup.selectAll()
            .data(healthData)
            .enter()
            .append("text")
            .text(d => (d.abbr))
            .attr("x", d => xLinearScale(d.poverty))
            .attr("y", d => yLinearScale(d.healthcare))
            .classed('stateText',true);
     

});