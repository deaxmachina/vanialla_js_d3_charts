
/* 
/////////////// Hexagonal Bin with varying colour /////////////
This example shows how to use the d3-hexbin plugin for hexagonal binning. 
2,000 random points with a normal distribution are binned into hexagons; 
color encodes the number of points that fall into each bin.

Code from Mike Bostock: https://bl.ocks.org/mbostock/4248145
*/

const width = 800;
const height = 600;

const svg = d3.select("#wrapper-hex-colour").append("svg")
  .attr("width", width)
  .attr("height", height)

const g = svg.append("g");


/// create some random points for the hexbins ///
const randomX = d3.randomNormal(width / 2, 80)
const randomY = d3.randomNormal(height / 2, 80)
const points = d3.range(2000).map(function() { 
  return [randomX(), randomY()]; 
});

const color = d3.scaleSequential(d3.interpolateLab("white", "steelblue"))
  .domain([0, 20]);

const hexbin = d3.hexbin()
  .radius(20)
  .extent([[0, 0], [width, height]]);

const clip = g.append("clipPath")
  .attr("id", "clip")
.append("rect")
  .attr("width", width)
  .attr("height", height);

const hex = g.append("g")
  .attr("class", "hexagon")
  //.attr("clip-path", "url(#clip)")
.selectAll("path")
.data(hexbin(points))
.join("path")
  .attr("d", hexbin.hexagon())
  .attr("transform", d => `translate(${d.x}, ${d.y})`)
  .attr("fill", d => color(d.length))
  .attr("stroke", 'white')
  .attr("stroke-width", 2)