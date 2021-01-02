
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

const width = 900;
const height = 500;
const margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50,
};

const svgBarChart =  d3.select("body").append("svg")
  // .attr("height", height - margin.top - margin.bottom)
  //  .attr("width", width - margin.left - margin.right)
  .attr("viewBox", [0, 0, width, height]);
  // .attr("height", height)
  // .attr("width", width)

// svgBarChart.append("rect").attr("x", 0)
// .attr("y", 0).attr("width", 200).attr("height", 200).attr("fill", "purple");

// This code works but doesn't pass the 14th test: 
const tooltip = d3.select("body")
      .append("div")
      .attr("id", "tooltip")
      .attr("style", "position: absolute; opacity: 0; background-color: rgb(225, 225, 225); color: rgb(30, 30, 30); padding: 5px; font-size: 14px")
.style("box-shadow", "2px 2px 2px 1px solid black");

d3.json(
  url, 
  function (error, {data}) {
    
    const barWidth = (width -margin.right - margin.left) / data.length;
    
    const xTimeScale = d3.scaleTime()
      .domain([d3.min(data, d => Date.parse(d[0])), d3.max(data, d => Date.parse(d[0]))])
      .range([margin.left, width - margin.right])
    
    const xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => Date.parse(d[0])),
        d3.max(data, d => Date.parse(d[0]))])
      .range([margin.left, width - margin.right])
    
    const xAxis = d3.axisBottom(xTimeScale);
    
    svgBarChart
      .append("g")
      .attr("id", "x-axis")
      .call(xAxis)
      .attr("transform", `translate(${0}, ${height - margin.bottom})`);
    
    const yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[1])])
      .range([height - margin.bottom, margin.top]);
    
    const yAxis = d3.axisLeft(yLinearScale);
    
    svgBarChart
      .append("g")
      .attr("id", "y-axis")
      .call(yAxis)
      .attr("transform", `translate(${margin.left}, ${0})`);
    
     svgBarChart
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("data-date", d => d[0])
      .attr("data-gdp", d => d[1])
      .attr("fill", "rgb(3, 60, 192)")
      .attr("height", d => yLinearScale(0) - yLinearScale(d[1]))
      .attr("width", barWidth)
      .attr("x", (d, i) => i * barWidth)
      .attr("y", d => yLinearScale(d[1]))
      .attr("transform", `translate(${margin.left}, ${0})`)

// This code works with the tooltip variable outside of this d3.json function but it doesn't pass the 14th test   
    
    .on("mouseover", function(d) {
       d3.select("#tooltip")
        .transition()
        .duration(200)
        .style("opacity", 1)
        .attr("data-date", d[0])
        // .text(d[0])
      // .text(`${d3.select(this).attr("data-date")}, ${d3.select(this).attr("data-gdp")}`)        
       // tooltip.html("<p>Date: " + d3.select(this).attr("data-date") + "</p>" + "<p>GDP: $" + d3.select(this).attr("data-gdp") + "} Billion</p>")
       tooltip.html(`${d3.select(this).attr("data-date")}<br/>$${d3.select(this).attr("data-gdp")} Billion`)
       
     })

    .on("mouseout", function(e) {
       d3.select("#tooltip")
        .style("opacity", 0)
     })
    
    .on("mousemove", function(e) {
       d3.select("#tooltip")
        .style("left", (d3.event.pageX - 50) + "px")
       
        // .style("top", (d3.event.pageY - 50) + "px")
       // .style("top", "476px")
       // .style("top", "495px")
       // .style("top", (d3.event.pageY + 10) + "px")
       .style("bottom", (d3.select("body").attr("height") - 20/*+ 5*/) + "px")
     });
    
    svgBarChart
      .on("mouseout", function() {
      d3.select("#tooltip")
        .style("opacity", 0)
    });
    
    
    
    // d3.selectAll("rect")
    //   .append("title")
     // .text(d3.select(this).attr("data-date"))
    
  }
);

