import React from 'react';
import dynamic from 'next/dynamic';
import { KeenContext } from '../lib/KeenContext';

import 'keen-dataviz/dist/keen-dataviz.css';

// eslint-disable-next-line
const Chart = dynamic(() => import('keen-react-charts'), { ssr: false });

class Pageviews extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			type: 'table',
			title: 'Top 25 Pages',
			renderOnVisible: true,
		};
	}

	componentDidMount() {
		this.context.client
			.query({
				analysis_type: 'count',
				event_collection: 'pageviews',
				filters: this.context.filters,
				groupBy: ['page.title', 'url.full'],
				orderBy: { property_name: 'result', direction: 'DESC' },
				limit: 25,
				timeframe: this.context.timeframe,
			})
			.then((results) => {
				this.setState({
					results: results,
				});
			});
	}

	render() {
		return <Chart {...this.state} />;
	}
}

Pageviews.contextType = KeenContext;
export default Pageviews;
