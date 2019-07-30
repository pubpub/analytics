import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { KeenContext } from '../lib/KeenContext';

const KeenChart = dynamic(() => import('keen-react-charts'), { ssr: false });

class Chart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			type: this.props.type,
			title: this.props.title,
			renderOnVisible: true,
		};
	}

	componentDidMount() {
		this.context.client
			.query({
				event_collection: this.props.eventCollection,
				analysis_type: this.props.analysisType,
				target_property: this.props.targetProperty,
				timeframe: this.context.timeframe,
				filters: this.context.filters,
				groupBy: this.props.groupBy,
				orderBy: this.props.orderBy,
				limit: this.props.limit,
				interval: this.props.interval,
			})
			.then((results) => {
				this.setState({
					results: results,
				});
			});
	}

	render() {
		return (
			<KeenChart
				results={this.state.results}
				type={this.state.type}
				title={this.state.title}
				renderOnVisible={this.state.renderOnVisible}
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
};
Chart.defaultProps = {
	targetProperty: null,
	groupBy: null,
	orderBy: null,
	limit: null,
	interval: null,
};
export default Chart;
