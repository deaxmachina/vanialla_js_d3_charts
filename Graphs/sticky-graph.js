/*
////////////////////// Sticky Force Layout ///////////////////////

Based on Fil: https://observablehq.com/@d3/sticky-force-layout?collection=@d3/d3-drag
In a force simulation, we set d.fx = x and d.fy = y while dragging, 
to fix the nodes in the ⟨x,y⟩ position after they have been repositioned by the user.

Click on a node to release it from its fixed position. 
Note that the force layout resumes automatically on drag. 
This ensures that other nodes in the graph respond naturally to the dragged node’s movement.
*/

const width = 700;
const height = 600;

const svg = d3.select("#sticky-graph-wrapper")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

const g = svg.append("g")
  //.attr("transform", `translate(${width/2}, ${height/2})`)

// some made-up data 
const graph = ({
  nodes: Array.from({length:13}, () => ({})),
  links: [
    { source: 0, target: 1, value: 1 },
    { source: 1, target: 2, value: 3 },
    { source: 2, target: 0, value: 3 },
    { source: 1, target: 3, value: 1 },
    { source: 3, target: 2, value: 2 },
    { source: 3, target: 4, value: 1 },
    { source: 4, target: 5, value: 2 },
    { source: 5, target: 6, value: 5 },
    { source: 5, target: 7, value: 2 },
    { source: 6, target: 7, value: 2 },
    { source: 6, target: 8, value: 1 },
    { source: 7, target: 8, value: 1 },
    { source: 9, target: 4, value: 3 },
    { source: 9, target: 11, value: 1 },
    { source: 9, target: 10, value: 1 },
    { source: 10, target: 11, value: 2 },
    { source: 11, target: 12, value: 1 },
    { source: 12, target: 10, value: 3 }
  ]
});

console.log(graph)

function clamp(x, lo, hi) {
  return x < lo ? lo : x > hi ? hi : x;
}

const link = svg
  .selectAll(".link")
  .data(graph.links)
  .join("line")
    .classed("link", true)
    .style("stroke", "#000")
    .style("stroke-width", d => `${d.value}px`)

const node = svg
  .selectAll(".node")
  .data(graph.nodes)
  .join("circle")
    .classed("node", true)
    .attr("r", 12)
    .style("cursor", "move")
    .style("fill", "#ccc")
    .style("stroke", "#000")
    .attr("stroke-width", '1.5px')
    // if the fixed x position of the circle is not undefined, add the fixed class (see style)
    .classed("fixed", d => d.fx !== undefined);

const simulation = d3.forceSimulation(graph.nodes)
  .force("link", d3.forceLink(graph.links))
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter(width/2, height/2))
  .on('tick', tick)

function tick() {
  link 
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y)
  node 
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
}


//////////////////////////////////
/////////// dragging /////////////
//////////////////////////////////

// when dragging start, make the circle have class fixed
function dragstart() {
  d3.select(this)
  .classed("fixed", true)
}

// while dragging set the fixed x position to the x positon, or to 0 or width 
// if it starts to exceed the boundaries of the drawing space of the svg; 
// do the same thing to the y position
function dragged(event, datum) {
  datum.fx = clamp(event.x, 15, width-15)
  datum.fy = clamp(event.y, 15, height-15)
  // the alphs is so that the nodes keep moving together
  simulation.alpha(1).restart();
}

// create d3 drag with the defined and start and drag function 
const drag = d3.drag()
  .on("start", dragstart)
  .on("drag", dragged);

// clicking on node makes it retract to original position and style
function click(event, d) {
  delete d.fx;
  delete d.fy;
  d3.select(this).classed("fixed", false);
  simulation.alpha(1).restart();
}

// call the drag on the nodes and the click
node.call(drag).on('click', click)

    