import React from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Layout from '../components/layout';
import { KeenContext, KeenClient } from '../lib/KeenContext';

const Chart = dynamic(() => import('../components/chart.js'), { ssr: false });

const Home = () => {
	const { query } = useRouter();
	const cid = query.cid ? query.cid : 123;
	console.log(cid);
	const filters = [];
	if (cid !== 'all') {
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
					timeframe: 'this_3_months',
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
						limit={10}
					/>
				</div>
			</KeenContext.Provider>
		</Layout>
	);
};

export default Home;
