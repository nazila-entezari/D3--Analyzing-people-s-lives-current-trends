// Section 1: Pre-Data Setup
// ===========================
// Before we code any data visualizations,
// we need to at least set up the width, height and margins of the graph.
var width = parseInt(d3.select("#scatter").style("width"));

// Designate the height of the graph
var height = width - width / 4;

//I'm settings margins all around at 20 pixels:
// Margin spacing for graph
var margin = 20;

// space for placing words
var labelArea = 120;

// padding for the text at the bottom and left axes
var tPadBot = 40;
var tPadLeft = 40;

// Create the actual canvas for the graph
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");


// Set the radius for each dot that will appear in the graph.
// If the browser changes below 530 pixels, so we reduce the radius of the circle from 10 to 5 pixels
var circRadius;
function crGet() {
  if (width <= 530) {
    circRadius = 5;
  }
  else {
    circRadius = 10;
  }
}
crGet();

// Next, we're coding the Labels for our Axes
// A) Bottom Axis
// ==============
// We create a group element to nest our bottom axes labels.
svg.append("g").attr("class", "xText");
// xText will allows us to select the group without excess code.
var xText = d3.select(".xText");

// We give xText a transform property that places it at the bottom of the chart.
// By nesting this attribute in a function, we can easily change the location of the label group
// whenever the width of the window changes.
  xText.attr(
    "transform",
    "translate(" +
      ((width - labelArea) / 2 + labelArea) +
      ", " +
      (height - margin - tPadBot) +
      ")"
  );

// Now we use xText to append the text SVG files, with y coordinates specified to space out the values.
// age
//If we look at the d3Style.css, we have aText and active as two separate class elements which would give
//us different look and feel. 
xText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("Poverty (%)");

// B) Then we're going to code our Left Axis
// ============
// Specifying the variables like this allows us to make our transform attributes more readable.
var leftTextX = margin + tPadLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;

// We add a second label group, this time for the axis left of the chart.
svg.append("g").attr("class", "yText");

// yText will allows us to select the group without excess code.
var yText = d3.select(".yText");

// Like before, we nest the group's transform attr in a function
// to make changing it on window change an easy operation.

  yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
  );

// income
yText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "healthcare")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Lacking HealthCare");

// 2. Import our .csv file.
// ========================

// Import our CSV data with d3's .csv import method.
d3.csv("assets/data/data.csv").then(function(data) {
  // Visualize the data
  visualize(data);
});

// 3. Create our visualization function
// ====================================
// We called a "visualize" function on the data obtained with d3's .csv method.
// This function handles the visual manipulation of all elements dependent on the data.
function visualize(theData) {
  // PART 1: Essential Local Variables and Functions
  // =================================
  // curX and curY will determine what data gets represented in each axis.
  // We designate our defaults here, which carry the same names
  // as the headings in their matching .csv data file.
  var curX = "poverty";
  var curY = "healthcare";



  // We also save empty variables for our the min and max values of x and y.
  // this will allow us to alter the values in functions and remove repetitious code.
  var xMin;
  var xMax;
  var yMin;
  var yMax;

  // This function allows us to set up tooltip rules (see d3-tip.js).
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([40, -60])
    .html(function(d) {
      // Grab the first_name.
      var theName = "<div>" + d.state+ "</div>";
      // Get the x value's key and value.
      var theX = "<div>" + curX + ": " + parseFloat(d[curX])+ "</div>";
      // Get the y value's key and value.
      var theY = "<div>" + curY + ": " + parseFloat(d[curY])+ "</div>";      
      // Display what we capture.
      return theName + theX + theY;
    });

  // Call the toolTip function.
  svg.call(toolTip);

  // a. change the min and max for x
  function xMinMax() {
    // min will grab the smallest datum from the selected column.
    xMin = d3.min(theData, function(d) {
      return parseFloat(d[curX]) * 0.90;
    });

    // .max will grab the largest datum from the selected column.
    xMax = d3.max(theData, function(d) {
      return parseFloat(d[curX]) * 1.10;
    });
  }

  // b. change the min and max for y
  function yMinMax() {
    // min will grab the smallest datum from the selected column.
    yMin = d3.min(theData, function(d) {
      return parseFloat(d[curY]) * 0.90;
    });

    // .max will grab the largest datum from the selected column.
    yMax = d3.max(theData, function(d) {
      return parseFloat(d[curY]) * 1.10;
    });
  }


  // Part 3: Instantiate the Scatter Plot
  // ====================================
  // This will add the first placement of our data and axes to the scatter plot.
  // First grab the min and max values of x and y.
  xMinMax();
  yMinMax();

  // With the min and max values now defined, we can create our scales.
  // Notice in the range method how we include the margin and word area.
  // This tells d3 to place our circles in an area starting after the margin and word area.
  var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, width - margin]);
  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    // Height is inverses due to how d3 calc's y-axis placement
    .range([height - margin - labelArea, margin]);

  // We pass the scales into the axis methods to create the axes.
  // Note: D3 4.0 made this a lot less cumbersome then before. Kudos to mbostock.
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  // We append the axes in group elements. By calling them, we include
  // all of the numbers, borders and ticks.
  // The transform attribute specifies where to place the axes.
  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

  // Now let's make a grouping for our dots and their labels.
  var theCircles = svg.selectAll("g theCircles").data(theData).enter();

// We append the circles for each row of data (or each person, in this case).
  theCircles
    .append("circle")
    // These attr's specify location, size and class.
    .attr("cx", function(d) {
      return xScale(d[curX]);
    })
    .attr("cy", function(d) {
      return yScale(d[curY]);
    })
    .attr("r", circRadius)
    .attr("class", function(d) {
      return "stateCircle " + d.abbr;
    })
    // Hover rules (based on event listeners)
    .on("mouseover", function(d) {
      // Show the tooltip
      toolTip.show(d, this);
      // Highlight the state circle's border
      d3.select(this).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // Remove the tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select(this).style("stroke", "#e3e3e3");
    });

  // With the circles on our graph, we need matching labels.
  // Let's grab the state abbreviations from our data
  // and place them in the center of our dots.
  theCircles
    .append("text")
    // We return the abbreviation to .text, which makes the text the abbreviation.
    .text(function(d) {
      return d.abbr;
    })
    // Now place the text using our scale.
    .attr("dx", function(d) {
      return xScale(d[curX]);
    })
    .attr("dy", function(d) {
      // When the size of the text is the radius,
      // adding a third of the radius to the height
      // pushes it into the middle of the circle.
      return yScale(d[curY]) + circRadius / 2.5;
    })
    .attr("font-size", circRadius)
    .attr("class", "stateText")
    // Hover Rules
    .on("mouseover", function(d) {
      // Show the tooltip
      toolTip.show(d);
      // Highlight the state circle's border
      d3.select("." + d.abbr).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // Remove tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select("." + d.abbr).style("stroke", "#e3e3e3");
    });

  }