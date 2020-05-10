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
                console.log(this.state.aggregatedData)
            })

            
    }

    render() {
        return(
            <div></div>
        )
    }
}

export default BubbleChart