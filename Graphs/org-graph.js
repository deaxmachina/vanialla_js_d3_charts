/*
Force graph of depth 3 with org tree style data 
Based on Curran Kelleher: DataViz 2020 course ep 56 https://www.youtube.com/watch?v=y7DxbW9nwmo&list=PL9yYRbwpkykuK6LSMLH3bAaPpXaDUXcLV&index=57
*/

import { nodes, links, MANY_BODY_STRENGTH } from "./org-graph-data.js"

const height = 900;
const width = 900;

const svg = d3.select("#org-graph-wrapper")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "#333333")

const centerX = width/2;
const centerY = height/2;

/// lines 
const lines = svg 
  .selectAll("line")
  .data(links)
  .join("line")
  .attr('stroke', "#666666")
  .attr('stroke-width', 1)

/// circles 
const circles = svg
  .selectAll("circle")
  .data(nodes)
  .join('circle')
    .attr("r", d => d.size)
    .attr("fill", 'plum')
    .attr("fill-opacity", 0.99)
    .attr("stroke", 'plum')
    .attr("stroke-width", 5)
    .attr("stroke-opacity", 0.3)
    
/// text on top of the circles 
const text = svg 
  .selectAll('text')
  .data(nodes)
  .join('text')
    .attr("text-anchor", 'middle')
    .attr("alignment-baseline", "middle")
    .style("font-family", 'sans-serif')
    .style('fill', "white")
    .style("pointer-events", "none") // can't click on the text
    .text(d => d.id)


/// Define the simulation ///
const simulation = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links).distance(d => d.distance))
  .force("charge", d3.forceManyBody().strength(MANY_BODY_STRENGTH))
  .force("center", d3.forceCenter(width/2, height/2))
  .on('tick', () => {
    // position the circle's (x, y) after these are computed by the simulation
    circles
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
    
    text 
      .attr("x", d => d.x)
      .attr("y", d => d.y)

    // positon the lines -- remember that the force simulation will mutate the 
    // links array so the source and target are now the whole objects for these 
    lines 
      .attr('x1', d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
  })

/// Drag interaction on the circles ///
const dragInteraction = d3.drag()
  .on('drag', (event, node) => {
    node.fx = event.x;
    node.fy = event.y;
    simulation.alpha(1);
    simulation.restart()
  })
circles.call(dragInteraction)