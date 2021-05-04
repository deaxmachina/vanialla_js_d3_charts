/*
///////////////////// Force Directed Graph //////////////////////
Based on Mike Bostock: https://observablehq.com/@d3/force-directed-graph
*/

const width = 700;
const height = 600;

const svg = d3.select("#graph-wrapper")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

const g = svg.append("g")
  //.attr("transform", `translate(${width/2}, ${height/2})`)

const colorScale = d3.scaleOrdinal(d3.schemeCategory10);


const drawGraph = async () => {
  const data = await d3.json("./miserables.json")
  // extract just the links and nodes
  // the links and nodes are both array of objects even if we just select them 
  // as data.links and data.nodes but for some reason we need to convert them to 
  // Object? Not sure why
  const links = data.links.map(d => Object.create(d))
  const nodes = data.nodes.map(d => Object.create(d))
  console.log(links)
  console.log(nodes)



  /// Links ///
  // Create one line for each link in the data
  // don't position them, i.e. no x and y needed as these will be 
  // calculated from the force simulation 
  const link = g.append("g")
    .selectAll("line")
    .data(links)
    .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value))
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)

  /// Nodes ///
  // Create one circle for each node in the data 
  // again don't position them as this will happen with the 
  // force simulation
  const node = g.append("g")
    .selectAll("circle")
    .data(nodes)
    .join("circle")
      .attr("r", 5)
      .attr('fill', d => colorScale(d.group))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)

  // Simulation ///
  // Note how the force simulations is on the nodes, while the 
  // forceLink is on the links. They connect together via the id 
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id))//.distance(d => d.value*10))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));


  // at the end of the simulation, the nodes will have (x, y) postions 
  // and the links will have source and target, each of which has (x, y) positions
  simulation.on("tick", () => {
    // create start and end coords of the link lines where 
    // start is from (x, y) of source and end is (x, y) of target
    link 
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
    // position the nodes in the computed (x, y) positions
    node 
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
  });

  /// Custom drag event ///
  // Define drag event with start, dragging and end of the drag 
  // so that we can drag around the nodes of the graph
  const drag = (simulation) => {
    function dragstarted(event) {
      console.log(event.active)
      console.log(event.subject)
      // the moment we grab a node (e.g. click on it), we get 
      // event.active = 0; if that;s the case set alphaTarget
      if (!event.active) simulation.alphaTarget(0.1).restart();
      // set node's fixed position (fx, fy) to 
      // the node's current position (x, y) - i.e. the position we are dragging it to
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    
    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    
    function dragended(event) {
      // to unfix a node that was previously fixed, set vx and vy to none
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
    
    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
  }

  // call the drag event on the simulation
  node.call(drag(simulation))

};

drawGraph();