const datasetURL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

const tooltip = d3.select('#tooltip');

const svgWidth = 800;
const svgHeight = 400;
const margin = { top: 20, right: 30, bottom: 50, left: 60 };
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

const svg = d3.select('#chart')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

const xScale = d3.scaleLinear()
  .range([0, chartWidth]);

const yScale = d3.scaleTime()
  .range([chartHeight, 0]);

const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));

d3.json(datasetURL)
  .then(data => {
    data.forEach(d => {
      d.Year = +d.Year;
      const parsedTime = d.Time.split(':');
      d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
    });

    xScale.domain([d3.min(data, d => d.Year - 1), d3.max(data, d => d.Year + 1)]);
    yScale.domain([d3.max(data, d => d.Time), d3.min(data, d => d.Time)]);

    svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(${margin.left}, ${chartHeight + margin.top})`)
      .call(xAxis);

    svg.append('g')
      .attr('id', 'y-axis')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(yAxis);

    svg.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('data-xvalue', d => d.Year)
      .attr('data-yvalue', d => d.Time.toISOString())
      .attr('cx', d => xScale(d.Year) + margin.left)
      .attr('cy', d => yScale(d.Time) + margin.top)
      .attr('r', 5)
      .on('mouseover', (event, d) => {
        tooltip.style('display', 'block')
          .attr('data-year', d.Year)
          .html(`${d.Name}: ${d.Nationality}<br>Year: ${d.Year}<br>Time: ${d.Time.toISOString().substr(14, 5)}`);
      })
      .on('mousemove', (event) => {
        tooltip.style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY}px`);
      })
      .on('mouseout', () => {
        tooltip.style('display', 'none');
      });
  })
  .catch(error => console.error('Error loading data:', error));
