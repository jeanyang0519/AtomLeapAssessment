import React, { Component } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

class BubbleChart extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            aggregatedData: []
        }

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
        const margin = { top: 10, right: 100, bottom: 100, left: 120 },
            width = 600 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

        // to pass category data in x axis
        const category = d3.map(this.state.aggregatedData, function(d) { return d.key; }).keys();

        // create color for the bubble
        const color = d3.scaleOrdinal()
            .domain(category)
            .range(d3.schemePaired)

        const options = ['funding amount', 'number of rounds']

        // add the options to the dropdown
        d3.select(".dropdown")
            .selectAll('myOptions')
            .data(options)
            .enter()
            .append('option')
            .text(function (d) { return d; }) 
            .attr("value", function (d) { return d; }) 

        const widthSvg = width + margin.left + margin.right;
        const heightSvg = height + margin.top + margin.bottom;
        // append svg to the page
        const svg = d3.select(".bubble")
                .append("svg")
                .attr("viewBox", `0 0 ${heightSvg} ${widthSvg}`)
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
                <div className="dropdownWrapper">
                    Data: <select className="dropdown"></select>
                </div>
                <div className="bubble"></div>
            </div>
        )
    }
}

export default BubbleChart