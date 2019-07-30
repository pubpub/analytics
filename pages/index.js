import React from 'react';
import Layout from '../components/layout';
import Pageviews from '../components/pageviews';
import { KeenContext, KeenClient } from '../lib/KeenContext';

function Home() {
	return (
		<Layout>
			<KeenContext.Provider
				value={{
					client: KeenClient,
					timeframe: 'last_1_months',
					filters: [],
				}}
			>
				<Pageviews />
			</KeenContext.Provider>
		</Layout>
	);
}

export default Home;
