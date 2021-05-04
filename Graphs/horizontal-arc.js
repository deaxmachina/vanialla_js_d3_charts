// Horizontal arch charts 
// Code from https://observablehq.com/@analyzer2004/arc-diagram Eric Lo 


const width = 800;
const height = 500;
const radius = ({min: 20, max: 40});
const margin = radius.max * 2 + 20; 

const svg = d3.select("#horizontal-arc-graph-wrapper")
  .append("svg")
  .attr("width", width)
  .attr("height", height)


const drawGraph = async () => {

  //////////////////////////////////////
  /////////////// Data ////////////////
  ////////////////////////////////////

  const data = await d3.csv("./profit4yr.csv", d3.autoType);

  const chartData = data.map(d => {
    return {
      territory: d['territory'],
      values: data.columns.slice(1).map(y => d[y])
    }
  });

  const territories = chartData.map(d => ({
    name: d.territory,
    total: d.values.reduce((a, b) => a + b)
  }));

  const years = data.columns.slice(1).map((d, i) => ({
    name: d,
    total: chartData.reduce((a, b) => a + b.values[i], 0)
  }));

  const nodes = years.concat(territories)
  console.log(nodes)

  const links = [];
  years.forEach((y, i) => {
    territories.forEach((t, j) => {
      links.push({
        source: y,
        target: t,
        value: chartData[j].values[i]
      })
    });
  });
  console.log(links)

  const linkedNodes = n => {
    return Array.from(new Set(
      links
        .flatMap(d => d.source === n || d.target === n ? [d.source, d.target] : null)
        .filter(d => d !== null)
      ));
  }

  const toCurrency = (num) => Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(num);

  ///////////////////////////////////////////
  ////////////// Arc path ///////////////////
  ///////////////////////////////////////////
  const arc = (d) => {
    const x1 = x(d.source.name),
          x2 = x(d.target.name);
    const r = Math.abs(x2 - x1) / 2;  
    return `M${x1} ${height - margin} A ${r},${r} 0 0,${x1 < x2 ? 1 : 0} ${x2},${height - margin}`;
  }

  ///////////////////////////////////////////
  /////////////// Scales  ///////////////////
  ///////////////////////////////////////////
  color = d3.scaleOrdinal()
    .domain(nodes.map(d => d.name))
    .range([
      "#bcb8b1","#bcb8b1","#bcb8b1","#bcb8b1",
      "#005f73","#0a9396","#ee9b00","#bb3e03","#9b2226","#e9d8a6"
    ]);

  const w = d3.scaleLinear()
    .domain(d3.extent(links.map(d => d.value)))
    .range([1, 10])
  
  const r = d3.scaleSqrt()  
    .domain(d3.extent(nodes.map(d => d.total)))
    .range([radius.min, radius.max])

  const x = d3.scalePoint() 
    .domain(nodes.map(d => d.name))
    .range([radius.max * 2, width - radius.max * 2])


  ///////////////////////////////////////////
  /////////////// Graph  ////////////////////
  ///////////////////////////////////////////

  const arcs = svg
    .selectAll("path")
    .data(links)
    .join("path")
      .attr("fill", 'none')
      .attr("stroke", "#ccc")
      .attr("stroke-width", d => w(d.value))
      .attr("d", d => arc(d))
      .call(g => g.append("title").text(d => `${d.source.name} - ${d.target.name}\n${toCurrency(d.value)}`))

  const circles = svg
    .selectAll(".node")
    .data(nodes)
    .join("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${x(d.name)}, ${height-margin})`)

  circles.append("circle")
    .attr("r", d => r(d.total))
    .attr("fill", d => color(d.name))

 

};

drawGraph();