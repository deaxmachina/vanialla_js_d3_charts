function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


const baseWidth = 1200;
const baseHeight = baseWidth/2;
const margin = { top: 50, right: 50, bottom:50, left:50 }

let data = []
_.range(40).forEach(num => {
  data.push({
    "id": num,
    "r_base": getRandomInt(4, 50),
    "cx_base": getRandomInt(margin.left, baseWidth-margin.right),
    "cy_base": getRandomInt(baseHeight-margin.bottom, margin.top),
    "r": getRandomInt(4, 50),
    "cx": getRandomInt(margin.left, baseWidth-margin.right),
    "cy": getRandomInt(baseHeight-margin.bottom, margin.top)
  })
});


function drawGraph (data, width, height){
  const svg = d3.select("#graph-wrapper-dynamic-layout-2")
    .selectAll("svg").data([null]).join("svg")
    .attr("width", width)
    .attr("height", height)
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


function onResize() {
  let width = document.getElementById("graph-wrapper-dynamic-layout-2").clientWidth
  let scale_factor = Math.min(1, width / baseWidth)
  let height = width/2

  data.forEach(d => {
    d.r = d.r_base * scale_factor,
    d.cx = d.cx_base * scale_factor,
    d.cy = d.cy_base * scale_factor
  })

  drawGraph(data, width, height)

}

onResize()
window.addEventListener('resize', onResize);

