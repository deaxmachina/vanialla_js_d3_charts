
/* 
/////////////// Hexagonal Bin with varying radius /////////////
Use when you have actual points, and when the data can otherwise be represented 
as a scatterplot. The example below uses 2000 random points from a normal distribution. 
The hexbin d3 method is used to bin these points into automatically computed bins 
Then the size of each hex is proportional to the number of points that go inside. 
The more points fall into this bin, the bigger its hexbin. 
This is what is normally meant by hexbin plot. 

Code from Mike Bostock: https://bl.ocks.org/mbostock/4248146

*/
const width = 800;
const height = 600;

const svg = d3.select("#wrapper-hex-size").append("svg")
  .attr("width", width)
  .attr("height", height)

const g = svg.append("g");


/// create some random points for the hexbins ///
const randomX = d3.randomNormal(width / 2, 80)
const randomY = d3.randomNormal(height / 2, 80)
const points = d3.range(2000).map(function() { 
  return [randomX(), randomY()]; 
});

console.log(points);

const radiusScale = d3.scaleSqrt()
    .domain([0, 50])
    .range([0, 20]);

const hexbin = d3.hexbin()
    .radius(20)
    .extent([[0, 0], [width, height]]);

console.log(hexbin(points))

// clip path if we want to contain the whole hex graph inside the square 
g.append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

/// draw the hexes ///
const hexagons = g.append("g")
  .attr("class", "hexagon")
  .attr("clip-path", "url(#clip)")
  .attr('fill', '#4d908e')
  .attr("stroke", 'white')
  .attr("stroke-width", 1)
.selectAll("path")
  .data(hexbin(points))
  .join("path")
    .attr("d", d => hexbin.hexagon(radiusScale(d.length)))
    .attr("transform", d => `translate(${d.x}, ${d.y})`)

// this is what all the original datapoints look like
g.selectAll("circle")
  .data(points)
  .join("circle")
  .attr("cx", d => d[0])
  .attr("cy", d => d[1])
  .attr("fill", '#90be6d')
  .attr("r", 1)