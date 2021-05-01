/* 
///////////////////// Hexagonal Shapes ///////////////////
This is not a hexbin plot, but rather just using the d3-hexbin functionality 
to get the path string to the hexagons. We manually compute their coordinates 
and then can change their area based on value and colour based on some other 
property. 
Simple experimental code to achieve that. 
*/

const width = 800;
const height = 600;

const svg = d3.select("#wrapper-hex-experiments").append("svg")
  .attr("width", width)
  .attr("height", height)
const g = svg.append("g");

/// create some random points for the hexbins ///
// the points are required be an array of 2 values (at least)
// you can directly set the x and y values here if you don't want them to 
// be computed by the hexbin automatically, i.e. if you don't want the points to be binned 
// but instead you just want to associate one hexagon to each point
const points = [
  {x: 50, y:60, value: 10, colour: "#ffcdb2"},
  {x: 100, y:160, value: 20, colour: '#ffb4a2'},
  {x: 200, y:100, value: 30, colour: '#e5989b'},
  {x: 300, y:300, value: 40, colour: '#b5838d'},
  {x: 400, y:400, value: 50, colour: '#6d6875'}
]
console.log(points);

/// create the d3 hexbin function with fixed radius /// 
const hexbin = d3.hexbin()
  .radius(10) // need to give it initial radius even if you change it later
  .x(d => d.x) // x and y positions are manually computed here 
  .y(d => d.y)
console.log(hexbin(points))

/// draw the hexes ///
const hexagons = g.append("g")
  .selectAll("path")
    .data(hexbin(points))
    .join("path")
      .attr("class", "hexagon")
      .attr('fill', d => d[0].colour)
      .attr("stroke", 'white')
      .attr("stroke-width", 1)
      .attr("d", d => hexbin.hexagon(d[0].value)) // this is how you can dynamically change the radius even after you have set it once in the constructor 
      .attr("transform", d => `translate(${d.x}, ${d.y})`)

// note that when you call hexbin on the data, it gets transformed.
// you still have access to all the attributes of the original data, but they will all be 
// places in the first element of the new array, and so you can access them via d[0]
// then you can for example scale or fill the hexes as needed