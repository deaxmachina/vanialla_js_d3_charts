/* 
//////////////////////////// Spiral and Shapes  ////////////////////////////
Drawing a spiral and positioning shapes on top of it
Based on this notebook by Eric Lo https://observablehq.com/@analyzer2004/timespiral
*/

const width = 700;
const height = 700;

svg = d3.select("#spiral-wrapper").append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("background", "#4a4e69")

// wrapper group for the whole spiral
const g = svg.append("g")
  .classed("spiral-wrapper-g", true)
  .attr("transform", `translate(${width/2}, ${height/2})`)

/// some random data ///
const data = Array.from({ length: 2000 }, (_, i) => ({value: i, number: i*2}))
console.log(data)

/// variables ///
// good idea to have the layers depend on the data -> more data, more layers
const innerRadius = 10; // how big the empty space in the middle of spiral should be 
const maxRadius = 300;
const layers = data.length/100; // how many concentric circles that make up the spiral 
const precision = 4; // how many points on the circle 


////////////////////////////////////////////
///////////////// Spiral ///////////////////
////////////////////////////////////////////
// create the spiral path
const spiral = g.append("path")
  .attr("id", 'axis')
  .attr("fill", "none")
  .attr("stroke", "#a01a58") // note: change this to a colour to see the spiral  
  .attr("stroke-width", 2)
  .attr("d", axisSpiral(2 * precision * layers + 1)) // add + 1 to layers for complete layer

function axisSpiral(length) {
  return d3.lineRadial()
    //.curve(d3.curveCatmullRomOpen)
    .angle((d, i) => Math.PI / precision * i)
    .radius((d, i) => i * (maxRadius - innerRadius) / length + innerRadius)({ length })
}

// get length of the spiral path 
const spiralLength = spiral.node().getTotalLength();
console.log(spiralLength)

// use the spiral length to compute the width of the 'bars' each section
const barWidth = spiralLength / data.length / 2 // divide by a small number to have them with some gaps in between
console.log(barWidth)

// this is how to get the x and y coords of a point on the spiral 
// based on its position along the path, expressed in terms of path length
const pointAtLen = spiral.node().getPointAtLength(100);
console.log(pointAtLen.x, pointAtLen.y)

// map each element to position on the path string for spital
const pathScale = d3.scaleLinear()
  .domain([0, data.length])
  .range([0, spiralLength]);


// compute the position of each 'bar' based on the (x, y) coords along the path string
// and also the angle that we want to rotate by if we want to align the bar with the spiral path
const barsData = data.map((d, i) => {
  const value = d.value
  const pointPostion = pathScale(i);
  const p1 = spiral.node().getPointAtLength(pointPostion);
  const p2 = spiral.node().getPointAtLength(pointPostion - barWidth)
  return {
      value: value,
      t: pointPostion,
      x: p1.x,
      y: p1.y,
      y0: p1.y,
      yr: p1.y, // rotate y
      angle: Math.atan2(p2.y, p2.x) * 180 / Math.PI - 90
  };
});
console.log(barsData)

/// Draw the bar chart along the spiral ///
const bars = g.selectAll(".bar")
  .data(barsData)
  .join("rect")
    .attr("class", "bar")
    .attr("fill", '#e5e1d8')   
    //.attr("stroke", '#e6e0d2')      
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    .attr("width", barWidth)
    .attr("height", 2)
    .attr("transform", d => `rotate(${d.angle},${d.x},${d.yr})`)

//Uncomment to see version with circles 
// this is easier because you don't have to rotate them, just need (x, y) for cx and cy
/*
const circles = g.selectAll(".circle")
    .data(barsData)
    .join("circle")
      .attr("class", "circle")
      .attr("fill", '#fff')  
      .attr("opacity", 0.4) 
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 3)
*/


