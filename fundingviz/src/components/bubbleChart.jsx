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

    drawBubbleChart() {
        // create dimensions for the chart
        const margin = { top: 50, right: 20, bottom: 60, left: 70 },
        width = 700 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

        const category = d3.map(this.state.aggregatedData, function(d) { return d.key; }).keys();
    }

    render() {
        return(
            <div></div>
        )
    }
}

export default BubbleChart