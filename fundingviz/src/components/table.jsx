import React, { Component } from 'react';
class Table extends Component {
    constructor(props) {
        super(props)

        this.renderTable = this.renderTable.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.renderInfo = this.renderInfo.bind(this);
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
                    <td>€{fundingAmount.toLocaleString()}</td>
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
        this.props.rows.forEach(info => {
            const { fundingAmount } = info;
            amount.push(fundingAmount);
            sum += fundingAmount;
        })


        return (
            <div className="info">
                <div className="info1">
                    <div className="dataTypeWrapper">
                        <div className="dataType">Funding amount in total</div>
                        <div className="num">€{sum.toLocaleString()}</div>
                    </div>
                    <div className="dataTypeWrapper">
                        <div className="dataType">Number of funding rounds</div>
                        <div className="num">{amount.length}</div>
                    </div>
                </div>
                <div className="dataTypeWrapper">
                    <div className="dataType">Categories with funding range</div>
                    <div className="num"> €{Math.min(...amount).toLocaleString()} - €{Math.max(...amount).toLocaleString()} </div>
                
                </div>
            </div>
        )
    }

    render() {
        return (
            <div>
                <div>{this.renderInfo()}</div>
                <table className="table table-hover">
                    <tbody>
                        <tr className="tableHeader">{this.renderHeader()}</tr>
                        {this.renderTable()}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Table;