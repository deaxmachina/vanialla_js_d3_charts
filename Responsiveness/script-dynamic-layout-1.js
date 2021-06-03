// Nadieh Bremer: https://www.visualcinnamon.com/2019/04/mobile-vs-desktop-dataviz/
// Position is arbitrary section 
// V1 - Simple one shape graph 
// how to dymanically resize the graph with a resize event and update on the go; 
// while making the chart turn from horizontal to vertical layout


// define a base width and height for the graph
// these are your 'preferred dims' e.g. where the graphs looks best 
const base_width = 1000;
const base_height = 500;

// place all graph drawing code in a function which depends on width and height 
// as we will update these on a resize event
function draw_graph(width, height) {
  // make sure you're joining the svg and not appending; else it won't update properly on resize
  const svg = d3.select("#graph-wrapper-dynamic-layout-1")
    .selectAll("svg").data([null]).join("svg")
      .attr("width", width)
      .attr("height", height)

  const rect = svg
    .selectAll("rect").data([null]).join("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "maroon")
}

/// function for what happens on resize ///
// we call this each time that a resize event has happened and possibly also initally 
function onResize () {
  // this is the width of the graph-wrapper; if we don't modify it it's assumed to be 100% of the screen 
  // and calling .clientWidth will automatically give us that back in pixels; if it is modified (e.g. see the css here)
  // - the width is 90% of the screen; then it will get that value
  let width = document.getElementById("graph-wrapper-dynamic-layout-1").clientWidth
  let height = base_width*base_height / width
  //console.log(`resized the window. new dimensions are: width: ${window.innerWidth}, height: ${window.innerHeight}`)
  //console.log(`new dims for the graph are: width: ${width}, height: ${height}`)
  draw_graph(width, height)
}

// draw what you want the user to see initially 
// this version is independent of the screen size, so initial graph will always be that size; 
// if it's got dims meant for big screen it will draw it like that on small screen too 
//draw_graph(base_width, base_height)

// if you don't want to draw with the initial dims, but want to base on screen size, use this: 
onResize()

// call the onResize function on each resize - this will scale the graph on the go - no need to refresh the window
window.addEventListener('resize', onResize);


// you can console log this to see that even if we haven't yet defined any width for the graph container
// this will return the width in pixels of the assumed 100% of the viewport size
console.log(document.getElementById("graph-wrapper-dynamic-layout-1").clientWidth)