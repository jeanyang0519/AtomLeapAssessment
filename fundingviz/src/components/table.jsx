import React, { Component } from 'react';
class Table extends Component {
    constructor(props) {
        super(props)
    }

    renderTable() {
        return this.props.rows.map((info) => {
            const { id, category, location,
                fundingAmount, announcedDate } = info;
            return (
                <tr key={id}>
                    <td>{id}</td>
                    <td>{category}</td>
                    <td>{location}</td>
                    <td>{fundingAmount.toLocaleString()}</td>
                    <td>{announcedDate}</td>
                </tr>
            )
        })
    }

    renderHeader() {
        let header = Object.keys(this.props.rows[0])
        return header.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    renderInfo() {
        const amount = [];
        let sum = 0;
        this.props.rows.map(info => {
            const { fundingAmount } = info;
            amount.push(fundingAmount);
            sum += fundingAmount;
        })


        return (
            <p className="info">
                Founding amount in total: {sum.toLocaleString()}
                <br />
                Number of funding rounds: {amount.length}
                <br />
                Categories with funding range
                between {Math.min(...amount).toLocaleString()} to {Math.max(...amount).toLocaleString()}
            </p>
        )
    }

    render() {
        return (
            <div>
                <div>{this.renderInfo()}</div>
                <table className="table table-hover">
                    <tbody>
                        <tr className="table-warning">{this.renderHeader()}</tr>
                        {this.renderTable()}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Table;