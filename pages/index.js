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
	const startDate = query.startDate ? query.startDate : null;
	const endDate = query.endDate ? query.endDate : null;
	const limit = query.limit ? parseInt(query.limit, 10) : 25;
	let timeframe = 'this_90_days';
	let viewing = '90 Days (including today)';
	if (startDate && endDate) {
		timeframe = `{"start":"${startDate}","end":"${endDate}"}`;
		viewing = `From ${startDate} to ${endDate}`;
	}
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
			<h2>Viewing: {viewing}</h2>
			<KeenContext.Provider
				value={{
					client: KeenClient,
					timeframe: timeframe,
					filters: filters,
				}}
			>
				<div className="row">
					<div className="col-4">
						<Chart
							title="Total Views"
							type="metric"
							eventCollection="pageviews"
							analysisType="count"
							ui={null}
						/>
					</div>
					<div className="col-4">
						<Chart
							title="Users"
							type="metric"
							eventCollection="pageviews"
							analysisType="count_unique"
							targetProperty="user.uuid"
							ui={null}
						/>
					</div>
					<div className="col-4">
						<Chart
							title="Avg. Time on Page (Mins)"
							type="metric"
							eventCollection="pageviews"
							analysisType="average"
							targetProperty="page.time_on_page"
							ui={null}
						/>
					</div>
				</div>
				<div className="row">
					<Chart
						title="Monthly Views"
						type="line"
						eventCollection="pageviews"
						analysisType="count"
						interval="monthly"
						data={{ labels: true }}
					/>
				</div>
				<div className="row">
					<Chart
						title="Monthly Time on Page (Mins)"
						type="line"
						eventCollection="pageviews"
						analysisType="average"
						targetProperty="page.time_on_page"
						interval="monthly"
						data={{ labels: true }}
					/>
				</div>
				<div className="row">
					<Chart
						title={`Top ${limit} Pages`}
						type="table"
						table={{
							columns: ['Page', 'Pageviews'],
							pagination: { limit: 10 },
						}}
						eventCollection="pageviews"
						analysisType="count"
						groupBy={['page.title', 'url.full']}
						orderBy={{ property_name: 'result', direction: 'DESC' }}
						limit={limit}
					/>
				</div>
				<div className="row">
					<Chart
						title={`Top ${limit} Referrers`}
						type="table"
						table={{
							columns: ['Referrer', 'Pageviews'],
							pagination: { limit: 10 },
						}}
						eventCollection="pageviews"
						analysisType="count"
						groupBy={['referrer.initial']}
						orderBy={{ property_name: 'result', direction: 'DESC' }}
						limit={limit}
					/>
				</div>
				<div className="row">
					<Chart
						title={`Top ${limit} Campaigns (Campaign/Medium)`}
						type="table"
						table={{
							columns: ['Campaign/Medium', 'Pageviews'],
							pagination: { limit: 10 },
						}}
						eventCollection="pageviews"
						analysisType="count"
						groupBy={[
							'url.info.query_string.utm_campaign',
							'url.info.query_string.utm_medium',
						]}
						orderBy={{ property_name: 'result', direction: 'DESC' }}
						limit={limit}
					/>
				</div>
				<div className="row">
					<Chart
						title={`Top ${limit} Campaigns (Source/Content)`}
						type="table"
						table={{
							columns: ['Source/Content', 'Pageviews'],
							pagination: { limit: 10 },
						}}
						eventCollection="pageviews"
						analysisType="count"
						groupBy={[
							'url.info.query_string.utm_source',
							'url.info.query_string.utm_content',
						]}
						orderBy={{ property_name: 'result', direction: 'DESC' }}
						limit={limit}
					/>
				</div>
				<div className="row">
					<Chart
						title={`Top ${limit} Campaigns (Content/Term)`}
						type="table"
						table={{
							columns: ['Content/Term', 'Pageviews'],
							pagination: { limit: 10 },
						}}
						eventCollection="pageviews"
						analysisType="count"
						groupBy={[
							'url.info.query_string.utm_content',
							'url.info.query_string.utm_term',
						]}
						orderBy={{ property_name: 'result', direction: 'DESC' }}
						limit={limit}
					/>
				</div>
			</KeenContext.Provider>
		</Layout>
	);
};

export default Home;
