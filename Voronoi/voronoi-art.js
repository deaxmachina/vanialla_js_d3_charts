/*
//////////////// Voroi Art /////////////////

Generating voronoi digrams without a purpose just because they are pretty
Code based on Tyler Wolf: https://observablehq.com/@thetylerwolf/day-22-delaunay-voronoi#data
*/

const width = 1400;
const height = 467;

/// Create the svg ///
const svg = d3.select("#wrapper-voronoi-art").append("svg")
  .attr("width", width)
  .attr("height", height)
  .style('background-color', '#1a1a1a')


/// Colour scale ///
/*
const color = d3.scaleLinear()
  .domain([ -1, 1 ])
  .range([ '#1AC0B6', '#964C5B' ])
*/

// twitter colours '#965563', '#35646C' with saturate 1 and darken 1

const color = chroma.scale(['#FF7155', '#35646C', '#07AEA4' ].map(col => chroma(col).saturate(0).darken(0.6)))
  .mode('lrgb')
  .domain([-1, 0.8]);


/// Generate the data using Peril Noise ///
// m number of points with (x, y) and value 
const m = 160; 
const n = (new Noise(Math.random()));
const noiseFactor = 0.4;
const data = d3.range(m).map(() => { 
  const x = Math.floor(Math.random() * width),
        y = Math.floor(Math.random() * height),
        value = n.perlin2( x/(width * noiseFactor ) , y/(height * noiseFactor ))
        return { x, y, value }
    })
console.log(data)


// Generate the delaunay triangulation of our data - takes data, x accessor and y accessor as arguments
const delaunay = d3.Delaunay.from(data, d => d.x, d => d.y);
// Generate the voronoi diagram from our delaunay triangulation 
// Takes the bounds of our diagram area as arguments [x0, y0, x1, y1]
const voronoi = delaunay.voronoi([0, 0, width, height])

/// Draw voronoi diagram ///
const voronoiGraph = svg.selectAll("path")
  .data(data.map((d, i) => voronoi.renderCell(i))) // Construct a data object from each cell of our voronoi diagram
  .join("path")
    .attr('d', d => d)
    .style('fill', (d, i) => color( data[i].value ))
    .style("opacity", 0.99)
    .style('stroke', 'white')
    //.style('stroke', (d, i) => color( data[i].value ))
    .style('stroke-opacity', 0.2)
    .style("stroke-width", 1)

// append all of our points so that we can see how they line up with the voronoi
/*
svg.selectAll('circle')
  .data( data )
  .join('circle')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', 1.5)
    .style('fill', 'white')
*/