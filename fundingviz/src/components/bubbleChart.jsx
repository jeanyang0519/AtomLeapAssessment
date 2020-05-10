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

    drawBubbleChart() {
        // create dimensions for the chart
        const margin = { top: 50, right: 20, bottom: 60, left: 70 },
        width = 700 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

        // to pass category data in x axis
        const category = d3.map(this.state.aggregatedData, function(d) { return d.key; }).keys();

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