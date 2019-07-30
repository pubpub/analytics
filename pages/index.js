import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../components/layout';
import Pages from '../components/pages';
import PageviewCount from '../components/pageviewCount';
import Chart from '../components/chart';
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
					timeframe: 'this_1_months',
					filters: filters,
				}}
			>
				<div className="row">
					<div className="col-4">
						<Chart
							title="Views"
							type="metric"
							eventCollection="pageviews"
							analysisType="count"
						/>
					</div>
					<div className="col-4">
						<Chart
							title="Users"
							type="metric"
							eventCollection="pageviews"
							analysisType="count_unique"
							targetProperty="user.uuid"
						/>
					</div>
					<div className="col-4">
						<Chart
							title="Avg. Time on Page (s)"
							type="metric"
							eventCollection="pageviews"
							analysisType="average"
							targetProperty="page.time_on_page"
						/>
					</div>
				</div>
				<div className="row">
					<Chart
						title="Top 25 Pages"
						type="table"
						eventCollection="pageviews"
						analysisType="count_unique"
						targetProperty="user.uuid"
						groupBy={['page.title', 'url.full']}
						orderBy={{ property_name: 'result', direction: 'DESC' }}
						limit={25}
					/>
				</div>
				<div className="row">
					<Chart
						title="Top 25 Referrers"
						type="table"
						eventCollection="pageviews"
						analysisType="count"
						groupBy={['referrer.initial']}
						orderBy={{ property_name: 'result', direction: 'DESC' }}
						limit={25}
					/>
				</div>
				<div className="row">
					<Chart
						title="Top 10 Campaigns"
						type="table"
						eventCollection="pageviews"
						analysisType="count"
						groupBy={[
							'url.info.query_string.utm_campaign',
							'url.info.query_string.utm_medium',
							'url.info.query_string.utm_source',
						]}
						orderBy={{ property_name: 'result', direction: 'DESC' }}
						limit={25}
					/>
				</div>
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
