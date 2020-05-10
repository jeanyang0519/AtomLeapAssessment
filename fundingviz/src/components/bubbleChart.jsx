import React, { Component } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

class BubbleChart extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            aggregatedData: []
        }

        this.ref = React.createRef();
    }

    componentDidMount() {
        // aggregate data
        axios.get("http://demo0377384.mockable.io/funding-test")
            .then(res => {
                let data = res.data;
                let aggregatedData = d3.nest()
                    .key(function (d) { return d.category; })
                    .rollup(function (v) { return {
                        rounds: v.length,
                        total: d3.sum(v, function(d) { return d.fundingAmount; })
                    }})
                    .entries(data);

                this.setState({ aggregatedData });
                // console.log(this.state.aggregatedData)
            })
    }

    componentDidUpdate() {
        if (this.state.aggregatedData.length) {
            this.drawBubbleChart();
        }
    }

    drawBubbleChart() {
        // create dimensions for the chart
        const margin = { top: 50, right: 20, bottom: 60, left: 70 },
        width = 700 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

        // to pass category data in x axis
        const category = d3.map(this.state.aggregatedData, function(d) { return d.key; }).keys();

        // create color for the bubble
        const color = d3.scaleOrdinal()
            .domain(category)
            .range(d3.schemePaired)

        // append svg to the page
        const svg = d3.select(this.ref.current)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // create x asix 
        const x = d3.scalePoint()
                .range([0, width])
                .domain(category)
                .padding(1);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

        // create y asix
        const y = d3.scaleLinear()
                .domain([0, 10])
                .range([height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));

        // create the size of bubble
        const z = d3.scaleLinear()
                .domain([0, 80])
                .range([0, 1]);
        
        // create tooltip
        const tooltip = d3.select(this.ref.current)
                .append("div")
                .attr("class", "tooltip")
                .style("background-color", "black")
                .style("border-radius", "10px")
                .style("padding", "15px")
                .style("color", "white")
                .style("opacity", 0)
        
        const showTooltip = function(d) {
            tooltip.transition()
                .duration(100)
            tooltip
                .style("opacity", 1)
                .html("Funding Amount: " + d.value.total)
                .style("left", (d3.mouse(this)[0] + 500) + "px")
                .style("top", (d3.mouse(this)[1] + 100) + "px")
                
        }

        const moveTooltip = function(d) {
            tooltip
                .style("left", (d3.mouse(this)[0] + 470) + "px")
                .style("top", (d3.mouse(this)[1] + 100) + "px")
        }

        const hideTooltip = function(d) {
            tooltip.transition()
                .duration(100)
                .style("opacity", 0)
        }
        

        // create circle
        const circle = svg.selectAll("circle")
                .data(this.state.aggregatedData)

        // bring everything together
        circle.enter()
            .append("circle")
            .transition()
            .duration(1000)
            .attr("cx", function(d) { return x(d.key); })
            .attr("cy", function (d) { return y(d.value.rounds); })
            .attr("r", function (d) { return z(Math.sqrt(d.value.total)); })
            .style("fill", function (d) { return color(Math.sqrt(d.value.total)); })

        // add tooltip on the circle
        svg.selectAll("circle")
            .on("mouseover", showTooltip)
            .on("mousemove", moveTooltip)
            .on("mouseleave", hideTooltip)

        // add label for x axis
        svg.append('text')
            .attr('class', 'label')
            .attr('x', width / 2)
            .attr('y', height + 50)
            .attr('text-anchor', 'middle')
            .text('categories')
            .style('fill', 'gray')

        // add label for y axis
        svg.append('text')
            .attr('class', 'label')
            .attr('x', -(height / 2))
            .attr('y', -50)
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')
            .text('Number of rounds')
            .style('fill', 'gray')

    }

    render() {
        return(
            <div>
                <div ref={this.ref}></div>
            </div>
        )
    }
}

export default BubbleChart