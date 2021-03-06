import React, { Component } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import Table from './table';

class BubbleChart extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            aggregatedData: [],
            selectedCategory: null
        }
    }

    componentDidMount() {
        // aggregate data
        axios.get("http://demo0377384.mockable.io/funding-test")
            .then(res => {
                let data = res.data;
                let aggregatedData = d3.nest()
                    .key(function (d) { return d.category; })
                    .rollup(function (v) { 
                        return {
                            "number of rounds": v.length,
                            "funding amount": d3.sum(v, function (d) { return d.fundingAmount; }),
                            table: v
                        }
                    })
                    .entries(data);

                this.setState({ aggregatedData });
            })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.aggregatedData.length === 0 && this.state.aggregatedData.length > 0) {
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

        // create x axis 
        const x = d3.scalePoint()
            .domain(category)
            .range([0, width * 1.3])
            .padding(0.5);
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // create y axis
        let y = d3.scaleLinear()
            .domain([0, 10])
            .range([height, 0]);
        let yAxis = svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y));

        // create the size of bubble
        let z = d3.scaleSqrt()
            .domain([0, 6400])
            .range([0, 1]);

        // Add circle
        const circle = svg.selectAll("circle")
                .data(this.state.aggregatedData)
        circle.enter()
            .append("circle")
            .attr("class", "bubble")
            .merge(circle)
            .on("click", (d) => {
                this.setState({ selectedCategory: d.value.table })
            })
            .transition()
            .duration(1000)
            .attr("cx", function (d) { return x(d.key); })
            .attr("cy", function (d) { return y(d.value["number of rounds"]); })
            .attr("r", function (d) { return z(d.value["funding amount"]); })
            .style("fill", function (d) { return color(d.value["funding amount"]); })
            .style("cursor", "pointer");        

        // X Label
        svg.append('text')
            .attr('class', 'label')
            .attr('x', width / 2 + 50)
            .attr('y', height + 60)
            .attr('text-anchor', 'middle')
            .text('categories')

        // Y Label
        const yLabel = svg.append('text')
            .classed("option", true)
            .attr('class', 'label')
            .attr('x', -(height / 2))
            .attr('y', -70)
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')
            .text("number of rounds")

        // update the y scale and the size of the circle when changing the data type
        const update = (option) => {
            const option2 = option === "funding amount" ? "number of rounds" : "funding amount"

            if (option === "funding amount") {
                y = d3.scaleLinear()
                    .domain([0, 10])
                    .range([height, 0]);
                yAxis
                    .transition()
                    .duration(1000)
                    .call(d3.axisLeft(y))

                z = d3.scaleSqrt()
                    .domain([0, 6400])
                    .range([0, 1]);

            } else {
                z = d3.scaleLinear()
                    .domain([0, 10])
                    .range([0, 50]);

                y = d3.scaleSqrt()
                    .domain([0, 60000000])
                    .range([height, 0])

                yAxis
                    .transition()
                    .duration(1000)
                    .call(d3.axisLeft(y))
            }

            const circle = svg.selectAll("circle")
            circle.enter()
                .append("circle")
                .merge(circle)
                .transition()
                .duration(1000)
                .attr("cx", function (d) { return x(d.key); })
                .attr("cy", function (d) { return y(d.value[option2]); })
                .attr("r", function (d) { return z(d.value[option]); })
                .style("fill", function (d) { return color(d.value["funding amount"]); })
        }

        // update the Y Label
        const updateLabel = (option) => {
            const option2 = option === "funding amount" ? "number of rounds" : "funding amount"
            yLabel
                .transition()
                .duration(1000)
                .attr('class', 'label')
                .attr('x', -(height / 2))
                .attr('y', -50)
                .style("opacity", 0)
                .transition()
                .duration(500)
                .attr('y', -95)
                .style("opacity", 1)
                .text(option2)
        }

        // set selectedCategory to null to clear the table when selecting different data type
        const resetSelectedCategory = () => {
            this.setState({ selectedCategory: null })
        }


        // when users select different options, run the update function
        d3.select(".dropdown").on("change", function (d) {
            const selectedOption = d3.select(this).property("value")

            update(selectedOption)
            updateLabel(selectedOption)
            resetSelectedCategory()
        })
    }

    render() {
        const table = this.state.selectedCategory ? (
            <Table rows={this.state.selectedCategory} />
        ) : <div className="msg">Click a circle to see detailed information here!</div>;

        return(
            <div className="all">
                <div className="chart">
                    <div className="dropdownWrapper">
                        Data: <select className="dropdown"></select>
                    </div>
                    <div className="bubble"></div>
                </div>
                <div className="tableWrapper">
                    <div className="table">{table}</div>
                </div>
            </div>
        )
    }
}

export default BubbleChart