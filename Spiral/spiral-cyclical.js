/* 
///////////// Cyclical Spiral for representing seasonal patterns //////////////
Note that this works in a way where each year is one full circle, and so the time 
doesn't get distorted even if the representation is a spiral. This is because the 
radius, which is based on a value in the data, naturally increases over time. 
if the radius was mostly static, we would just see a many overlapping circles 

Following tutorial by Mike Bostock: https://observablehq.com/@d3/d3-lineradial
*/


// map the months to postions on a circle in radians 
const yearly = d3.scaleLinear()
  .domain([1, 12 + 1]) // 🌶 we add 1, otherwise December is superposed with January
  .range([0, 2 * Math.PI])

const width = 700;
const height = 700;
const svg = d3.select("#spiral-cyclical")
  .append("svg")
  .attr("viewBox", [0, 0, 700, 500])
  .style("max-width", "700px"),
g = svg.append("g").attr("transform", "translate(400,250)");

const dataSrc = "./data/ice-sheets.csv"
async function drawGraph () {
  let data = await d3.csv(dataSrc, d3.autoType);
  data.sort(
    (a, b) => d3.ascending(+a.year, +b.year) || d3.ascending(+a.mo, +b.mo)
  )

  // define the radius from 0 to max extent where extent is a variable in the data
  const scaleRadius = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.extent)])
    .range([0, 270])

  // create the radial path generator; note that it only cares about the mo and extent 
  // properties of the data that will be passed to it, so we can just pass the data array 
  // as is, i.e. we don't need to filter out the properties that we don't need
  const radial = d3.lineRadial()
    .angle(d => yearly(d.mo)) // angle corresponds to the month, which we have mapped to radians on a circle beforehand
    .radius(d => scaleRadius(d.extent)) // radius corresponds to the value of the variable we are interested in 
    .curve(d3.curveCatmullRomOpen) // this makes the curve nice and smooth
    .defined(d => d.extent > 0) // two months have no data, represented by extent=-9999


  // create one spiral for the North and one for the South 
  // note that even if these look like circles they are in fact both one 
  // big spiral 
  const graph = g.selectAll("path")
    .data(["S", "N"])
    .join("path")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", "0.2")
      .attr("d", region => radial(data.filter(d => d.region === region)))

}
drawGraph();