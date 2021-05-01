// Code by Nadieh Bremer: https://observablehq.com/@nbremer/hexagon-grid-heatmap#SQRT3 

const initialWidth = 850;
const initialHeight = 500;
const mapColumns = 30;
const mapRows = 20; 
const SQRT3 = Math.sqrt(3);
// calculate the max radius that the hexagons can have to fit an initial width/height set as above 
// hint: use the formula for area of hexagons. We want to fit 600 elements of that area 
// (since there are 30x20 columns) inside a space of area initialWidth x initialHeight
// if you conmpute for a^2, where a is the side of a hexagon, you will end up with 
// a^2 = (initialWidth/(mapColumns * SQRT3)) * (initialHeight/(mapRows * 1.5))
const hexRadius = Math.floor(
  d3.min([
    initialWidth/(mapColumns * SQRT3),
    initialHeight/(mapRows * 1.5)
  ])
)
// then set the new height and width of the SVG based on the max
// number of hexagons that fit 
const width = Math.ceil(mapColumns * hexRadius * SQRT3 + hexRadius);
const height = Math.ceil(mapRows * 1.5 * hexRadius + 0.5 * hexRadius);

const svg = d3.select("#wrapper-hex-grid-heatmap").append("svg")
  .attr("width", width)
  .attr("height", height)

const hexbin = d3.hexbin()
  .radius(hexRadius)
  .x(d => d.x)
  .y(d => d.y)

const color = chroma.scale(['#fafa6e','#2A4858'])
  .mode('lch').colors(600)


/// Hexagon location calculations ///
// Calculate the [x, y] location of each hexagon 
let points = [];
for (var i = 0; i < mapRows; i++) {
  for (var j = 0; j < mapColumns; j++) {
    let x = hexRadius * j * SQRT3
    // Offset each eneven row by half of a hex-width
    if (i%2 === 1) x += (hexRadius * SQRT3) / 2

    let y = hexRadius * i * 1.5
    points.push({x: x, y: y})
  }
};
console.log(points)

//////////////////////////////////////
////////// Draw the Map //////////////
//////////////////////////////////////

/// append group element for whole heatmap ///
const g = svg.append("g")
  .attr("transform", `translate(${hexRadius}, ${hexRadius})`) // this is so that we can see the full top row

/// draw each hexagon ///
const hex = g.selectAll(".hexagon")
  .data(hexbin(points))
  .join("path")
  .attr("class", 'hexagon')
  .style("stroke", 'white')
  .style("fill", (d, i) => color[i])
  .attr("transform", d => `translate(${d.x},${d.y})`)
  .attr("d", d => hexbin.hexagon())
  .on('mouseover', mover)
  .on("mouseout", mout)

/// mouseover events ///
function mover(d) {
  d3.select(this)
    .transition().duration(10)
    .style("fill-opacity", 0.3)
}
function mout(d) { 
  d3.select(this)
     .transition().duration(1000)
     .style("fill-opacity", 1)
}

//For testing, draw the center locations of each [x,y] from the points array
g.selectAll(".hexagon-point")
  .data(points)
  .join("circle")
    .attr("class", "hexagon-point")
    .style("fill", "black")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", d => 0)