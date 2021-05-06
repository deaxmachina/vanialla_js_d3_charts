/*
Exercise in the General Update Pattern in D3
*/

const updateBtn = document.querySelector('.update-btn')
const returnBtn = document.querySelector('.return-btn')


const width = 500;
const height = 600;

const svg = d3.select("#wrapper-updates")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

/// Data ///
const initialData = [
  { id: 1, value: 20, category: 'cat'},
  { id: 2, value: 30, category: 'panda'},
  { id: 3, value: 40, category: 'cat'},
  { id: 4, value: 20, category: 'cat'},
  { id: 5, value: 45, category: 'panda'},
  { id: 6, value: 25, category: 'dog'}
]
const changedData = [
  { id: 1, value: 10, category: 'cat'}, // changed value
  { id: 2, value: 50, category: 'panda'}, // changed value
  //{ id: 3, value: 40, category: 'cat'}, //exited
  { id: 4, value: 20, category: 'cat'},
  { id: 5, value: 25, category: 'panda'}, // changed value
  //{ id: 6, value: 25, category: 'dog'}, //exited 
  //{ id: 7, value: 55, category: 'dog'} // entered
]

const colourScale = {
  'cat': 'hotpink',
  'panda': 'rebeccapurple',
  'dog': 'lightseagreen'
}

const drawGraph = (data) => {

  const rects = svg
    .selectAll("circle")
    .data(data, d => d.id)
    .join(
      enter => {
        return enter.append("circle")
          .attr("cx", 0) // enter from 0 on the left
          .attr("cy", (d, i) => 100 + i*80) // enter from final positions vertically
          .attr("stroke", 'black')
          .attr("stroke-width", 0)
      },
      update => {
        return update
          .attr("cx", 200) // don't move horizontally on update
          /*
          - if we don't specify anything for y in the update selection, d3 will
          move the element from current to next position; rather than from 0 to next
           */
          //.attr("cy", 0)
          .attr("stroke-width", 3) // we transition back to 0, giving the effect of flashing a stroke on the updating elements just for a brief moment
      },
      exit => {
        exit.transition().duration(1000)
          .attr("r", 0)  
          .attr("fill", 'black')
          .attr("cx", 400)
      }
    ) 
      //.attr("r", 0) // if you want radius to *always* (both enter and update) grow from 0

      // try commenting the fill out - i.e. then we go from default to the desired fill, after the transition
      // what happens is that d3 will transition the fill from previous to current value; because we exited the exit selection 
      // elements with a fill to black, when they come back up they will transition their fill from black to the final value
      // but if we do specify the fill here, there will be no fill transition
      .attr("fill", d => colourScale[d.category])
      /*
      - everything we exit with a transition, also transition it here; 
      else if you update before the exit transition has *finished* you get weird properites; 
      however if you update *after* the exit transition has finished it will work ok
       */
      .transition().duration(1000)  
        .attr("cx", 200)
        .attr("cy", (d, i) => 100 + i*80)
        .attr("r", d => d.value)
        .attr("fill", d => colourScale[d.category]) // put exiting props here as well! 
        .attr("stroke-width", 0)


    // add text so we can see the elements
    const text = svg
      .selectAll("text")
      .data(data, d => d.id)
      .join('text')
        .attr("x", (d, i) => 260)
        //.attr("y", (d, i) => 100 + i*80)
        .attr("dy", "0.35em")
        .text(d => d.category)
        .transition().duration(1000)
          .attr("y", (d, i) => 100 + i*80) // default to 0 when enter and then current to next i.e. move up and down smoothly
          .attr("opacity", 1) // default 0 when enter and then current to next i.e. stays 1 
};

drawGraph(initialData);


updateBtn.addEventListener('click', () => {
  drawGraph(changedData);
})
returnBtn.addEventListener('click', () => {
  drawGraph(initialData);
})

