import React, { useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Layout from '../components/layout';
import { KeenContext, KeenClient } from '../lib/KeenContext';

const Chart = dynamic(() => import('../components/chart.js'), { ssr: false });

const Home = () => {
	const { query } = useRouter();
	const [communityName, setCommunityName] = useState('all');
	const cid = query.cid ? query.cid : 123;
	const filters = [];
	if (cid !== 'all') {
		filters.push({
			propertyName: 'pubpub.communityId',
			operator: 'eq',
			propertyValue: cid,
		});
		KeenClient.query({
			analysisType: 'count',
			eventCollection: 'pageviews',
			timeframe: 'this_7_days',
			groupBy: 'url.info.domain',
			orderBy: { propertyName: 'result', direction: 'DESC' },
			filters: [{ propertyName: 'pubpub.communityId', operator: 'eq', propertyValue: cid }],
		}).then((res) => {
			if (res.result && res.result.length > 0) {
				setCommunityName(res.result[0]['url.info.domain']);
			} else {
				setCommunityName('');
			}
		});
	}
	return (
		<Layout>
			<h2>
				Community:{' '}
				<a href={`https://${communityName}`} target="_blank" rel="noopener noreferrer">
					{communityName}
				</a>
			</h2>
			<h2>Viewing: 90 Days (including today)</h2>
			<KeenContext.Provider
				value={{
					client: KeenClient,
					timeframe: 'this_90_days',
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
							title="Avg. Time on Page (sec)"
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
