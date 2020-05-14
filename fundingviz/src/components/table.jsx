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

    render() {
        return (
            <div>
                <table>
                    <tbody>
                        <tr>{this.renderHeader()}</tr>
                        {this.renderTable()}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Table;