var drawChart  = function() {
	const svg = d3.select(DOM.svg(width, height));
  
  svg.append("g")
      //ttr("fill", "orange")
    .selectAll("rect")
    .data(data1)
    .join("rect")
      .attr("x", d => x(d.name))
      .attr("y", d => y(d.value))
      .attr("height", d => y(0) - y(d.value))
      .attr("width", x.bandwidth())
  .attr("fill", function(d){ return colorPicker(d.name); });    

  
  function colorPicker(v){
    if(v=== "Sunday") { 
      return "#1170AA"
    }
    else if (v=== "Monday"){ 
      return "#FC7D0B";                
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
  //label for x-axis
  svg.append("text")             
      .attr("transform",
            `translate(500,${height - (margin.bottom -25)})`)
      .style("text-anchor", "middle")
      .text("Incident Day of the Week");
  
  //label for y-axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x",-200)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Number of Records"); 
  
  svg.append("text")
        .attr("x", (width/2))             
        .attr("y",13)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Comparing Amount of Incidents per Day in USF");
  
  
  //number labels
  svg.selectAll(".text")        
  .data(data1)
  .enter()
  .append("text")
  .attr("class","label")
  .attr("x", (function(d) { return x(d.name)+50}  ))
  .attr("y", function(d) { return y(d.value) - 20; })
  .attr("dy", ".75em")
  .text(function(d) { return d.value; });    

  
  
  
  svg.append("g")
      .call(xAxis);
  
  svg.append("g")
      .call(yAxis);


var data1 = {
  let out = [];
  let day1 = {};
  day1.value = 20;
  day1.name = "Sunday"
  out[0] = day1
  
  let day2 = {};
  day2.value = 35;
  day2.name = "Monday"
  out[1] = day2
  
  let day3 = {};
  day3.value = 19;
  day3.name = "Tuesday"
  out[2] = day3
  
  let day4 = {};
  day4.value = 13;
  day4.name = "Wednesday"
  out[3] = day4
  
  let day5 = {};
  day5.value = 19;
  day5.name = "Thursday"
  out[4] = day5
  
  let day6 = {};
  day6.value = 22;
  day6.name = "Friday"
  out[5] = day6
  
  let day7 = {};
  day7.value = 27;
  day7.name = "Saturday"
  out[6] = day7
  return out;
}
var x = d3.scaleBand()
    .domain(data1.map(d => d.name))
    .range([margin.left, width - margin.right])
    .padding(0.1);

var y = d3.scaleLinear()
    .domain([0, d3.max(data1, d => d.value)]).nice()
    .range([height - margin.bottom, margin.top]);
var xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSize(0));

var yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(data1.y));
var line = d3.line()
    .defined(d => !isNaN(d.value))
    .x(d => x(d.name))
    .y(d => y(d.value));
  
  return svg.node();
}