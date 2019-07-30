import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../components/layout';
import Pageviews from '../components/pageviews';
import { KeenContext, KeenClient } from '../lib/KeenContext';

const Home = (props) => {
	const { cid } = props.query;
	const filters = [];
	if (cid) {
		filters.push({
			propertyName: 'pubpub.communityId',
			operator: 'eq',
			propertyValue: cid,
		});
	}
	return (
		<Layout>
			<KeenContext.Provider
				value={{
					client: KeenClient,
					timeframe: 'last_1_months',
					filters: filters,
				}}
			>
				<Pageviews />
			</KeenContext.Provider>
		</Layout>
	);
};

Home.getInitialProps = async ({ query }) => {
	return { query: query };
};

Home.propTypes = {
	query: PropTypes.object.isRequired,
	cid: PropTypes.string,
};

Home.defaultProps = {
	cid: null,
};

export default Home;
