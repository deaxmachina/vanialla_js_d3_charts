// Option with only using the window innerHeight and innerWidth and for the svg 
// use viewBox instead of setting the width and height attributes
// it doesn't work very well because while it does dynamically update with screen size 
// if you start with smaller screen and then expand, it becomes weirdly big too

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


const baseWidth = window.innerWidth-100;
const baseHeight = window.innerHeight-100;
const margin = { top: 50, right: 50, bottom:50, left:50 }

let data = []
_.range(40).forEach(num => {
  data.push({
    "id": num,
    "r": getRandomInt(4, 50),
    "cx": getRandomInt(margin.left, baseWidth-margin.right),
    "cy": getRandomInt(baseHeight-margin.bottom, margin.top)
  })
});


function drawGraph (data, width, height){
  const svg = d3.select("#graph-wrapper-dynamic-layout-3")
    .selectAll("svg").data([null]).join("svg")
    //.attr("width", width)
    //.attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .style("background-color", 'black')

  const circles = svg
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("cx", d => d.cx)
      .attr("cy", d => d.cy)
      .attr("r", d => d.r)
      .attr("fill", 'plum')
      .attr("fill-opacity", 0.8)
}



drawGraph(data, baseWidth, baseHeight)
