/*
//////////////// Voroi for better hover interactions ////////////////
How to use a voronoi digram to split the space in such a way that each point 
in a cell of the digram is the closest to that cell. This makes it possible to 
interact with hover without having to hover exactly on the element, but you
can hover in the vicinity of it and it will still work. 

Code based on Tyler Wolf: https://observablehq.com/@thetylerwolf/day-22-delaunay-voronoi#data
*/


const width = 900;
const height = 500;

/// Create the svg ///
const svg = d3.select("#wrapper").append("svg")
  .attr("width", width)
  .attr("height", height)
  .style('background-color', '#1a1a1a')


/// Colour scale ///
const color = d3.scaleLinear()
  .domain([ -1, 1 ])
  .range([ '#309', '#ff630f' ])


/// Generate the data using Peril Noise ///
// m number of points with (x, y) and value 
const m = 200; 
const n = (new Noise(Math.random()));
const noiseFactor = 0.4;
const data = d3.range(m).map(() => { 
  const x = Math.floor(Math.random() * width),
        y = Math.floor(Math.random() * height),
        value = n.perlin2( x/(width * noiseFactor ) , y/(height * noiseFactor ))
        return { x, y, value }
    })
console.log(data)


//////////////////////////////////////////////////////////
///////// Circle Maps with Delaunay interactions /////////
//////////////////////////////////////////////////////////
// enable hover over a point to mean hover over its corresponding voronoi cell 

// 1. Generate the delaunay to start 
const delaunay = d3.Delaunay.from(data, d => d.x, d => d.y);

// 2. Place the circles on the screen 
const points = svg.selectAll('circle')
  .data(data)
  .join('circle')
    .attr('cx', d => d.x)
    .attr("cy", d => d.y)
    .attr("r", d => Math.max(Math.abs(20 * d.value), 3))
    .style("stroke-width", 0)
    .style("stroke-opacity", 0.7)
    .style("stroke", (d, i) => color(d.value))
    .style("fill", d => color(d.value))
    .style("fill-opacity", 0.85)

// 3. Create mouse event on the svg and not on the circles 
svg.on("mousemove", function(e) {
  // get the mouse positions in the svg element 
  const { layerX, layerY } = e;
  // find the index of the nearest point to the mouse position 
  const pointIndex = delaunay.find(layerX, layerY);
  // iterate through all the points and set the stroke-width 
  // based on whether or not it is our selected point 
  points.transition()
    .style('stroke-width', (d, i) => i == pointIndex ? 20 : 0);
});

// 4. When the mouse leaves the svg, set all the stroke-widths to zero
svg.on("mouseleave", function() {
  points.transition()
    .style("stroke-width", 0)
});
