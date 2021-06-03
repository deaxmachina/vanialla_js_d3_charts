// We want the graph to dynamically scale up to some point and then switch to being a different graph 
// (which in reality would be a different layout of the same graph)

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


const baseWidth = 1700;
const baseHeight = baseWidth/2;
const margin = { top: 50, right: 50, bottom:50, left:50 }
const largeDisplayWidth = 700; 

// dummy data 
let data = []
_.range(40).forEach(num => {
  data.push({
    "id": num,
    "r": getRandomInt(4, 50),
    "cx": getRandomInt(margin.left, baseWidth-margin.right),
    "cy": getRandomInt(baseHeight-margin.bottom, margin.top)
  })
});

// first option for graph - this one is for large displays 
const drawCircles = (selector, data, scaleFactor) => {
  const circles = selector
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("cx", d => d.cx*scaleFactor)
      .attr("cy", d => d.cy*scaleFactor)
      .attr("r", d => d.r*scaleFactor)
      .attr("fill", 'plum')
      .attr("fill-opacity", 0.8)
}

// second option for graph - this one is for smaller display 
const drawRects = (selector, data, scaleFactor) => {
  const rects = selector
    .selectAll("rect")
    .data(data)
    .join("rect")
      .attr("x", d => d.cx*scaleFactor)
      .attr("y", d => d.cy*scaleFactor)
      .attr("width", d => d.r*scaleFactor)
      .attr("height", d => d.r*scaleFactor)
      .attr("fill", 'plum')
      .attr("fill-opacity", 0.8)
}


// whole graph drawing function that gets called initially and then on resize 
const drawGraph = (data, width) => {

  const widthNew = document.getElementById("graph-wrapper-dynamic-layout-4").clientWidth
  const scale_factor = Math.min(1, widthNew / baseWidth)
  const heightNew = widthNew/2

  // remove anything that has been previously drawn 
  d3.selectAll(".svg-wrapper").remove() // is this how it should be done? 

  // draw or re-draw the svg, whose with and height depend on the window size
  const svg = d3.select("#graph-wrapper-dynamic-layout-4")
    .selectAll("svg").data([null]).join("svg")
      .classed("svg-wrapper", true)
      .attr("width", widthNew)
      .attr("height", heightNew)
      .style("background-color", "black")

  // draw a different graph based on the inner width which we pass in 
  // as arg from a resize event listener
  if (width >= largeDisplayWidth) {
    svg.call(drawCircles, data, scale_factor)
  } else {
    svg.call(drawRects, data, scale_factor)
  }
  
}


// draw initial graph
drawGraph(data, window.innerWidth)

// redraw graph dynamically based on the windown inner width 
window.addEventListener('resize', () => {
    drawGraph(data, window.innerWidth)
});





