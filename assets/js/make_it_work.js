let svgWidth = 800;
let svgHeight = 500;

let margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

let svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(function(censusData) {

    censusData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
      });

    let xLinearScale = d3.scaleLinear()
    .domain([4, d3.max(censusData, d => d.poverty)])
    .range([0, width]);

    let yLinearScale = d3.scaleLinear()
    .domain([8, d3.max(censusData, d => d.poverty)])
    .range([height,0])

    let bottomAxis = d3.axisBottom(xLinearScale)
    let leftAxis = d3.axisLeft(yLinearScale)

    chartGroup.append("g")
    .call(leftAxis)

    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis)

    let circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.healthcare))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", "12")
    .attr("fill", "blue")
    .attr("opacity", ".5")
    
    let textElems = chartGroup.append('g')
    .selectAll('text')
    .data(censusData)
    .enter()
    .append('text')
    .text(d => d.abbr)
    .attr('font-size',10)//font size
    .attr('fill', 'white')
    .attr('dx', d => xLinearScale(d.healthcare) - 7)//positions text towards the left of the center of the circle
    .attr('dy', d => yLinearScale(d.poverty) + 3)

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("text-anchor", "middle")
      .attr("class", "axisText")
      .attr('font-size', 30)
      .text("Lacks Healthcare (%)")
      

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .attr("text-anchor", "middle")
      .attr('font-size', 30)
      .text("In Poverty (%)");
})