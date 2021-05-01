/* 
/////// Code to gnerate haxagon shape + put it in a force layout //////////
Code for the hexagon shape by Luc Iyer https://observablehq.com/@luciyer/hexgen
We can use the hex path-generation only for the shape and then 
with d3-force position them close to each other
*/

const height = 500;
const width = 500;

const svg = d3.select("#wrapper-hex-force").append("svg")
  .attr("width", width)
  .attr("height", height)

/////////////////////////////////////////
///////////Draw Hexagon//////////////////
/////////////////////////////////////////
// given radius and orientation either flat or pointy
const hex = function (radius, flat) {
 
  const rotate = flat === true ? (Math.PI / 6) : 0;
  const angles = d3.range(0, 6).map((_,i) => rotate + i * (Math.PI/3));
    
  const points = function (radius) {
      let x0 = 0, y0 = 0;
      return angles.map(function(angle) {
        let x1 = Math.sin(angle) * radius,
            y1 = -Math.cos(angle) * radius,
            dx = x1 - x0,
            dy = y1 - y0;
        x0 = x1, y0 = y1;
        return [dx, dy];
      });
    }
    return "m" + points(radius).join("l") + "z";
}

const radius = 200;
const center = {x: width/2, y: height/2}
const hexplot = svg.append("g")
  .append("path")
    .attr("transform", `translate(${center.x}, ${center.y})`)
    .attr("d", d => hex(radius))
    .style("fill", "#293241")
    .style("fill-opacity", 1)


// create data
const n = 40;
//const center = [width / 2, height / 2];
const nodes = Array.from({length: n}, (_, i) => ({
  r: 3 * (4 + 9 * Math.random() ** 2),
  //r: 25,
  color: '#ee6c4d'
})).sort((a, b) => b.r - a.r)

const circlesG = svg.append("g")
  .attr("transform", `translate(${width/2}, ${height/2})`)
const circles  = circlesG
  .selectAll(".hex-path")
  .data(nodes)
  .join("path")
  .classed('hex-path', true)
    .attr("d", d => hex(d.r))
    .attr("fill", d => d.color)
    .attr("fill-opacity", 1)
    .attr("stroke", 'white')
    .attr("stroke-width", 0)

const simulation = d3.forceSimulation(nodes)
  .on("tick", tick)
  .force("collide", d3.forceCollide().radius(d => d.r))
function tick() {
  circles.attr("transform", d => `translate(${d.x}, ${d.y})`)
}

tick();