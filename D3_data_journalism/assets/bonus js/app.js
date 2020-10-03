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

// Initial Params
var chosenXAxis ='poverty'
var chosenYAxis ='healthcare'


// function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
      d3.max(healthData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating y-scale var upon click on axis label
function yScale(healthData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8,
      d3.max(healthData, d => d[chosenYAxis]) * 1.2
    ])
    .range([0, height]);

  return yLinearScale;

}

// function used for updating yAxis var upon click on axis label
function renderAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

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
        .domain([8, d3.max(healthData, d => d[chosenXAxis])])
        .range([0, width]);

 		
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d[chosenYAxis])])
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
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 15)
    .classed("stateCircle", true);
  
 var circlesText = circlesGroup.append("text")
    .text(d => d.abbr)
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .classed("stateText", true);

      

  

      
 
    var circletextGroup = chartGroup.selectAll()
            .data(healthData)
            .enter()
            .append("text")
            .text(d => (d.abbr))
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d[chosenYAxis]))
            .classed('stateText',true);
     // Create x-axes labels


  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var poverty = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 10)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var age = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 25)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age(Median)");

   var income= xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");



// Create y-axes labels
 	var ylabelgroups=chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      
      var y1=ylabelgroups.attr("y", 10 - margin.left )
      .attr("x", 0 - (height / 2))
      .attr("dy", "0em")
      .attr("value", "healthcare") // value to grab for event listener
      .classed("active", true)
      .text("Lacks Healthcare(%)");

      var y2=ylabelgroups.attr("y", 20 - margin.left )
      .attr("x", 0 - (height / 2))
      .attr("dy", '1em')
      .attr("value", "smokes") // value to grab for event listener
      .classed("inactive", true)
      .text("Smokers(%)");

      var y3=ylabelgroups.attr("y", 30 - margin.left )
      .attr("x", 0 - (height / 2))
      .attr("dy", '2em')
      .attr("value", "obese") // value to grab for event listener
      .classed("inactive", true)
      .text("Obese(%)");

    // x axis labels event listener
 xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var xvalue = d3.select(this).attr("value");
      if (xvalue !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = xvalue;
    }
});

  // y axis labels event listener
  ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var yvalue = d3.select(this).attr("value");
      if (yvalue !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = yvalue;
      }
  });
// changes classes to change bold text
        if (chosenXAxis === "poverty") {
          poverty
            .classed("active", true)
            .classed("inactive", false);
          age
            .classed("active", false)
            .classed("inactive", true);
          income
          .classed("active", false)
          .classed("inactive", true);
        }
        else if (chosenXAxis === "age"){
          age
            .classed("active", true)
            .classed("inactive", false);
          poverty
            .classed("active", false)
            .classed("inactive", true);
          income
          .classed("active", false)
          .classed("inactive", true);
        }
 else 
{
           income
            .classed("active", true)
            .classed("inactive", false);
          age
            .classed("active", false)
            .classed("inactive", true);
          poverty
          .classed("active", false)
          .classed("inactive", true);;
        }


});


