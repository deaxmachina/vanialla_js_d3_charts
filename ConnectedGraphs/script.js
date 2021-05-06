/* Connecting graphs with dependent data

Architecture: 
1. Menu - list of items that can be clicked to select one data point 
  This can be just a list of words, but it can also be other shapes, etc 
  Data point that is clicked should propagate to the graphs and be used to filter
  the whole data 
2. Main graph - needs to go inside the graph drawing function 
3. Secondary graph dependent on the main graph 
  This graph should be dependent on the main graph. When one element of the 
  main graph is clicked, it should update or create the secondary graph, which 
  uses data that the clicked part of the main graph uses
  
*/

const width = 1000;
const height = 600;

const svg = d3.select("#wrapper").append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("font-family", "sans-serif")


//////////////////////////////
/////////// Data  ////////////
//////////////////////////////

// list the things which are in the menu and are also used to filter data
const listData = ['cat', 'dog', 'red panda']
const dataMainGraph = [
  { id: 'cat1', category: 'cat', value: 10 },
  { id: 'cat2', category: 'cat', value: 20 },
  { id: 'cat3', category: 'cat', value: 30 },
  { id: 'dog1', category: 'dog', value: 40 },
  { id: 'dog2', category: 'dog', value: 50 },
  { id: 'redPanda1', category: 'red panda', value: 10 },
  { id: 'redPanda2', category: 'red panda', value: 35 },
  { id: 'redPanda3', category: 'red panda', value: 45 },
  { id: 'redPanda4', category: 'red panda', value: 20 },
];
const dataSecondaryGraph = [
  { id: 'cat1', category: 'cat', value: 10, properties: ['cute', 'fluffy', 'adorable'] },
  { id: 'cat2', category: 'cat', value: 20, properties: ['cute', 'fluffy', 'playful'] },
  { id: 'cat3', category: 'cat', value: 30, properties: ['lazy', 'playful', 'adorable']},
  { id: 'dog1', category: 'dog', value: 40, properties: ['playful', 'messy', 'friendly'] },
  { id: 'dog2', category: 'dog', value: 50, properties: ['messy', 'friendly']  },
  { id: 'redPanda1', category: 'red panda', value: 10, properties: ['cute', 'slow', 'adorable']},
  { id: 'redPanda2', category: 'red panda', value: 35, properties: ['cute', 'adorable']},
  { id: 'redPanda3', category: 'red panda', value: 45, properties: ['fluffy', 'adorable'] },
  { id: 'redPanda4', category: 'red panda', value: 20, properties: ['cute', 'fluffy', 'adorable', 'slow', 'lazy']},
];
const selectedElement = 'cat'


//////////////////////////////
///////// Wrappers ///////////
//////////////////////////////

/// 1. Wrapper for the menu ///
const gMenu = svg.append("g")
  .classed("menu-wrapper-g", true)
/// 2. Wrapper for the main graph ///
const gMainGraph = svg.append("g")
  .classed("main-graph-wrapper-g", true)
/// 3. Wrapper for the secondary graph ///
const gSecondaryGraph = svg.append("g")
  .classed("secondary-graph-wrapper-g", true)


//////////////////////////////
/////////// Menu /////////////
//////////////////////////////
const menu = gMenu.selectAll(".menu-item")
  .data(listData)
  .join("g")
  .classed("menu-item", true)
    .attr("transform", `translate(${400}, ${200})`)
const menuBackground = menu.append("rect")
  .attr("width", 100)
  .attr("height", 30)
  .attr("fill", "#ffbe0b")
  .attr("y", (d, i) => i*50)
  .attr("stroke", d => d == selectedElement ? "maroon" : "none")
const menuText = menu.append("text")
  .attr("x", 10)
  .attr("y", (d, i) => i*50 + 15)
  .attr("dy", "0.35em")
  .text(d => d)
  .attr("pointer-events", "none")

menu.on("click", function(event, datum){
  // 1. Stroke only the selected element
  menuBackground.attr("stroke", d => d == datum ? "maroon" : "none")
  // 2. Call the main graph with filter element being the datum i.e. the selected animal
  graph(dataMainGraph, dataSecondaryGraph, datum);
})


////////////////////////////////////////////////////////////
////////////////// Secondary Graph /////////////////////////
////////////////////////////////////////////////////////////
function secondaryGraph (selection, data, selectedElementSecondary = 0) {
  const colourScale = d3.scaleOrdinal()
    .domain(data.map(d => d.properties).reduce((prevEl, currentEl) => prevEl.concat(currentEl)))
    .range(["#240046", "#3c096c", "#5a189a", "#7b2cbf", "#9d4edd", "#c77dff", "#e0aaff"])

  // default no selected element as we don't want to display the graph until we have selected an element
  if (selectedElementSecondary) {
    const [filteredData] = data.filter(d => d.id == selectedElementSecondary);
    const secondaryGraph = selection.selectAll(".secondary-graph-rect")
      .data(filteredData.properties)
      .join("rect")
      .classed("secondary-graph-rect", true)
        .attr("width", 50)
        .attr("height", 50)
        .attr("x", (d, i) => 50 + 50*i)
        .attr("y", 300)
        .attr("fill", d => colourScale(d))
  } else {
    // if we call the secondary graph in no selected element, remove anything that we've already 
    // drawn previously
    selection.selectAll(".secondary-graph-rect").remove()
  }
}


////////////////////////////////////////////////////////////
////////////////////// Whole Graph /////////////////////////
////////////////////////////////////////////////////////////
async function graph(dataMainGraph, dataSecondaryGraph, selectedElement) {
  /// 1. Call the main graph ///
  gMainGraph.call(mainGraph, dataMainGraph, selectedElement)
  /// 2. Call the secondary graph ///
  // filter the selected elements before passing in the data
  let dataSecondaryGraphFiltered = dataSecondaryGraph.filter(d => d.category === selectedElement)
  // call with last argument 0 as by default when we call the secondary graph we don't want to show anything 
  // until a secondary element has been selected 
  gSecondaryGraph.call(secondaryGraph, dataSecondaryGraphFiltered, 0)

  
  ////////////////////////////////////////////////////////////
  ////////////////////// Main Graph //////////////////////////
  ////////////////////////////////////////////////////////////
  // Note that the graph definition can be outside the main draw graph function
  // if you give it the selection as an argument and then pass that in 
  // it will just insert (i.e. append) the graph into that selection 
  // But here we need to re-draw the secondary graph inside a click of the main graph, so we either need 
  // to pass all the same arguments to the secondary graph as the main, including the data for the secondary graph 
  // or we need to put it here, so that we have access to these arguments from above
  function mainGraph (selection, data, selectedElement) {
    const dataFiltered = data.filter(d => d.category === selectedElement)
    const colourScale = d3.scaleOrdinal()
      .domain(data.map(d => d.category))
      .range(['#3a86ff', '#8338ec', '#ff006e', '#fb5607'])

    const mainGraph = selection
      .selectAll("ellipse")
      .data(dataFiltered)
      .join("ellipse")
          .attr("rx", 25)
          .attr("ry", d => d.value)
          .attr("cx", (d, i) => i*60 + 50)
          .attr("cy", (d, i) => 200)
          .attr("fill", d => colourScale(d.category))

    mainGraph.on("click", function(event, datum) {
      // call the secondary graph with data filtered by the selected datum
      gSecondaryGraph.call(secondaryGraph, dataSecondaryGraphFiltered, datum.id)
    })
  }

};


graph(dataMainGraph, dataSecondaryGraph, selectedElement);