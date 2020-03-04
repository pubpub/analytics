import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { KeenContext } from '../lib/KeenContext';

const KeenChart = dynamic(() => import('keen-react-charts'), { ssr: false });

class Chart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		this.context.client
			.query({
				eventCollection: this.props.eventCollection,
				analysisType: this.props.analysisType,
				targetProperty: this.props.targetProperty,
				timeframe: this.context.timeframe,
				filters: this.context.filters,
				groupBy: this.props.groupBy,
				orderBy: this.props.orderBy,
				limit: this.props.limit,
				interval: this.props.interval,
			})
			.then((initialResults) => {
				const results = initialResults;
				if (this.props.targetProperty === 'page.time_on_page') {
					if (typeof results.result === 'number') {
						results.result /= 60;
					} else if (typeof results.result === 'object') {
						results.result = results.result.map((res) => {
							return {
								value: (res.value / 60).toFixed(2),
								timeframe: res.timeframe,
							};
						});
					}
				}
				this.setState({
					results: results,
				});
			});
	}

	render() {
		return (
			<KeenChart
				results={this.state.results}
				type={this.props.type}
				title={this.props.title}
				ui={this.props.ui}
				renderOnVisible={this.state.renderOnVisible}
				table={this.props.table}
				data={this.props.data}
			/>
		);
	}
}

Chart.contextType = KeenContext;
Chart.propTypes = {
	title: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	eventCollection: PropTypes.string.isRequired,
	analysisType: PropTypes.string.isRequired,
	targetProperty: PropTypes.string,
	groupBy: PropTypes.array,
	orderBy: PropTypes.object,
	limit: PropTypes.number,
	interval: PropTypes.string,
	table: PropTypes.object,
	ui: PropTypes.object,
	data: PropTypes.object,
};
Chart.defaultProps = {
	targetProperty: null,
	groupBy: null,
	orderBy: null,
	limit: null,
	interval: null,
	table: null,
	ui: {
		buttons: {
			download: {
				label: 'Download as CSV',
				type: 'csv',
			},
		},
	},
	data: null,
};
export default Chart;
