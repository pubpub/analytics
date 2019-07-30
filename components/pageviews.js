import React from 'react';
import dynamic from 'next/dynamic';
import getConfig from 'next/config';
import KeenAnalysis from 'keen-analysis';

import 'keen-dataviz/dist/keen-dataviz.css';

// eslint-disable-next-line
const Chart = dynamic(() => import('keen-react-charts'), { ssr: false });
const { publicRuntimeConfig } = getConfig();
const { KEEN_PROJECT_ID, KEEN_READ_KEY } = publicRuntimeConfig;

class Pageviews extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			type: 'funnel',
			title: 'Pageviews',
			labelMapping: {
				pageviews: 'Pageviews',
			},
			renderOnVisible: true,
		};
	}

	componentDidMount() {
		const client = new KeenAnalysis({
			projectId: KEEN_PROJECT_ID || process.env.KEEN_PROJECT_ID,
			readKey: KEEN_READ_KEY || process.env.KEEN_READ_KEY,
		})
			.query({
				analysis_type: 'count',
				event_collection: 'pageviews',
				timeframe: 'this_3_months',
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

export default Pageviews;
