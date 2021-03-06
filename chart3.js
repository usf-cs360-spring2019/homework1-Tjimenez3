/*
 * this function will grab the latest text from our text area and update
 * the letter counts
 */
function colorPicker3(v){
    if(v=== "Sunday") { 
      return "#1170AA"
    }
    else if (v=== "Monday"){ 
      return "#0af755";                
    }
    else if (v=== "Tuesday"){ 
      return "#A3ACB9";                
    }
    else if (v=== "Wednesday"){ 
      return "#57606C";                
    }
    else if (v=== "Thursday"){ 
      return "#5FA2CE";                
    }    
    else if (v=== "Friday"){ 
      return "#C85200";                
    }    
    else if (v=== "Saturday"){ 
      return "#7B848F";                
    }
  }
var letters4 = ["Assault", "Larceny Theft","Malicious Mischief", "Non-Criminal", "Other Misc"];
var updateData3 = function() {
  // get the textarea "value" (i.e. the entered text)
  let text = d3.select("body").select("textarea").node().value;
  let map1 = new Map([["Monday", 1], ["Sunday", 2] ,["Friday", ]]); 
  let map2 = d3.map();
  map2.set("Assault",727);
  map2.set("Larceny Theft", 4032);
  map2.set("Malicious Mischief", 675);
  map2.set("Non-Criminal", 701);
  map2.set("Other Misc", 948);



  // some browsers support console.table()
  // javascript supports try/catch blocks
  try {
    // console.table(map2.entries());
  }
  catch (e) {
    // console.log(map2);
  }

  return map2;
};

/*
 * our massive function to draw a bar chart. note some stuff in here
 * is bonus material (for transitions and updating the text)
 */
var drawBarChart2 = function() {
  // get the data to visualize
  let count = updateData2()

  // get the svg to draw on
  let svg = d3.select("body").select("#svg2");

  /*
   * we will need to map our data domain to our svg range, which
   * means we need to calculate the min and max of our data
   */

  let countMin = 0; // always include 0 in a bar chart!
  let countMax = d3.max(count.values());

  // this catches the case where all the bars are removed, so there
  // is no maximum value to compute
  if (isNaN(countMax)) {
    countMax = 0;
  }
  

  // console.log("count bounds:", [countMin, countMax]);

  /*
   * before we draw, we should decide what kind of margins we
   * want. this will be the space around the core plot area,
   * where the tick marks and axis labels will be placed
   * http://bl.ocks.org/mbostock/3019563
   */
  let margin = {
    top:    35,
    right:  35, // leave space for y-axis
    bottom: 60, // leave space for x-axis
    left:   60
  };

  // now we can calculate how much space we have to plot
  let bounds = svg.node().getBoundingClientRect();
  let plotWidth = bounds.width - margin.right - margin.left;
  let plotHeight = bounds.height - margin.top - margin.bottom;

  /*
   * okay now somehow we have to figure out how to map a count value
   * to a bar height, decide bar widths, and figure out how to space
   * 
   for each letter along the x-axis
   *
   * this is where the scales in d3 come in very handy
   * https://github.com/d3/d3-scale#api-reference
   */

  /*
   * the counts are easiest because they are numbers and we can use
   * a simple linear scale, but the complicating matter is the
   * coordinate system in svgs:
   * https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Positions
   *
   * so we want to map our min count (0) to the max height of the plot area
   */
  let countScale = d3.scaleLinear()
    .domain([countMin, countMax])
    .range([plotHeight, 0])
    .nice(); // rounds the domain a bit for nicer output

  /*
   * the letters need an ordinal scale instead, which is used for
   * categorical data. we want a bar space for all letters, not just
   * the ones we found, and spaces between bars.
   * https://github.com/d3/d3-scale#band-scales
   */
  let letterScale = d3.scaleBand()
    .domain(letters3) // all letters (not using the count here)
    .rangeRound([0, plotWidth])
    .paddingInner(0.1); // space between bars

  // try using these scales in the console
  // console.log("count scale [0, 36]:", [countScale(0), countScale(36)]);
  // console.log("letter scale [a, z]:", [letterScale('a'), letterScale('z')]);

  // we are actually going to draw on the "plot area"
  let plot = svg.select("g#plot");

  if (plot.size() < 1) {
    // this is the first time we called this function
    // we need to steup the plot area
    plot = svg.append("g").attr("id", "plot");

    // notice in the "elements" view we now have a g element!

    // shift the plot area over by our margins to leave room
    // for the x- and y-axis
    plot.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }

  // now lets draw our x- and y-axis
  // these require our x (letter) and y (count) scales
  let xAxis = d3.axisBottom(letterScale).tickSize(0);
  let yAxis = d3.axisLeft(countScale).tickSize(0);

  // check if we have already drawn our axes
  if (plot.select("g#y-axis").size() < 1) {
    let xGroup = plot.append("g").attr("id", "x-axis");

    // the drawing is triggered by call()
    xGroup.call(xAxis);

    // notice it is at the top of our svg
    // we need to translate/shift it down to the bottom
    xGroup.attr("transform", "translate(0," + plotHeight + ")");

    // do the same for our y axisa
    let yGroup = plot.append("g").attr("id", "y-axis");
    yGroup.call(yAxis);
    yGroup.attr("transform", "translate(0)");
  }
  else {
    // we need to do this so our chart updates
    // as we type new letters in our box
    plot.select("g#y-axis").call(yAxis);
  }

  // now how about some bars!
  /*
   * time to bind each data element to a rectangle in our visualization
   * hence the name data-driven documents (d3)
   */
  svg.append("path")
      .datum(data1)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line);

  // setting the "key" is important... this is how d3 will tell
  // what is existing data, new data, or old data

  /*
   * okay, this is where things get weird. d3 uses an enter, update,
   * exit pattern for dealing with data. think of it as new data,
   * existing data, and old data. for the first time, everything is new!
   * http://bost.ocks.org/mike/join/
   */
  // we use the enter() selection to add new bars for new data

  
  
    

  
};
