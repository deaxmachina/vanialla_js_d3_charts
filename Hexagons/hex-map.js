
/* 
///////////// Hexagonal Bin Map with colour and size /////////////
Code from Mike Bostock: https://observablehq.com/@d3/hexbin-map
This map shows approximately 3,000 locations of Walmart stores. 
The hexagon area represents the number of stores in the vicinity, 
while the color represents the median age of these stores. 
Older stores are red, and newer stores are blue.
*/

const width = 975;
const height = 610;

const svg = d3.select("#wrapper-hex-map").append("svg")
  .attr("width", width)
  .attr("height", height)

const g = svg.append("g");

const projection = d3.geoAlbersUsa().scale(1300).translate([487.5, 305]);
const parseDate = d3.utcParse("%m/%d/%Y"); 
// hexbin will automatically look at the first 2 elements in the data array of each element 
// and will use them to compute the bins; it will ignore the rest of the properties in the array
const hexbin = d3.hexbin()
  .extent([[0, 0], [width, height]])
  .radius(10)

async function drawChart() {

  /// 1. Calculate the data ///
  const dataPrep = await d3.tsv("./data/walmart.tsv", d => {
    const p = projection(d);
    // p is an array of 2 elements - the lat and long 
    // we can add a property to the array like below - we added a named property called date
    p.date = parseDate(d.date);
    return p;
  });
  console.log(dataPrep)
  console.log(hexbin(dataPrep))
  const data = Object.assign(
    hexbin(dataPrep)
      .map(d => (d.date = new Date(d3.median(d, d => d.date)), d)) // to calc the median year for the points that fall in that bin
      .sort((a, b) => b.length - a.length), //sort by length of the bin, since the bigger that is the more elements there are in that bin - these correspond to number of locations
    {title: "Median opening year"}
  );
  console.log(data)

  /// 2. Scales ///
  const radius = d3.scaleSqrt()
    .domain([0, d3.max(data, d => d.length)]) // 0 to length of the data array in each hexbin 
    .range([0, hexbin.radius() * Math.SQRT2]) // to square root of the radius of the hexbin?

  const color = d3.scaleSequential(
    d3.extent(data, d => d.date), d3.interpolateSpectral
    )

  // load in the map data
  const us = await d3.json("./data/states-albers-10m.json");
  console.log(us)
  /// 3. Draw the map of the USA ///
  const map = svg.append("path")
    .datum(topojson.mesh(us, us.objects.states))
      .attr("fill", "none")
      .attr("stroke", "#777")
      .attr("stroke-width", 0.5)
      .attr("stroke-linejoin", "round")
      .attr("d", d3.geoPath());

  /// 4. Draw the hexbins ///
  const hexmap = svg.append("g")
    .selectAll("path")
    .data(data)
    .join("path")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .attr("d", d => hexbin.hexagon(radius(d.length)))
      .attr("fill", d => color(d.date))
      .attr("stroke", d => d3.lab(color(d.date)).darker())

}

drawChart();