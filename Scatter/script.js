/*
 Scatterplot based on Get it Right in Black and White by Curran Kelleher
 Episode 8 : https://www.youtube.com/watch?v=dz6KLhurKMI
 */

const csvUrl = "https://gist.githubusercontent.com/curran/a08a1080b88344b0c8a7/raw/0e7a9b0a5d22642a06d3d5b9bcbad9890c8ee534/iris.csv";

// take a row and return some object that will replace the row
const parseRow = (d) => {
  d.sepal_width = +d.sepal_width
  d.sepal_length = +d.sepal_length
  d.petal_width = +d.petal_width
  d.petal_length = +d.petal_length
  return d; 
}

/// Accessors ///
const xValue = d => d.petal_length;
const yValue = d => d.sepal_length;

/// Dimensions ///
const margin = { top: 20, right: 50, bottom: 200, left: 50 }
const width = window.innerWidth;
const height = window.innerHeight;
const radius = 5;
const fillColour = 'plum';

/// Draw the svg ///
const svg = d3.select("#wrapper").append("svg")
  .attr("width", width)
  .attr("height", height)

/// Main function with data and drawing all the elements that 
// depend on the data /// 
const main = async () => {
  const data = await d3.csv(csvUrl, parseRow);

  /// Scales ///
  // X Scale 
  const x = d3.scaleLinear()
    .domain(d3.extent(data, xValue))
    .range([margin.left, width - margin.right])
  // Y Scale
  const y = d3.scaleLinear()
    .domain(d3.extent(data, yValue))
    .range([height - margin.bottom, margin.top])

  // create new data array with the marks locations and other properties
  const marks = data.map(d => ({
    x : x(xValue(d)),
    y: y(yValue(d))
  }));

  /// Rendering step ///
  const circles = svg
    .selectAll("circle")
    .data(marks)
    .join("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", radius)
      .attr("fill", fillColour)

  /// Axes ///
  const xAxis = svg.append('g')
    .attr("transform", `translate(${0}, ${height - margin.bottom})`)
    .call(d3.axisBottom(x))
  const yAxis = svg.append('g')
    .attr("transform", `translate(${margin.left}, ${0})`)
    .call(d3.axisLeft(y))
};

main();
