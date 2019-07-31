import React, { useState } from 'react';
import Layout from '../components/layout';
import { KeenClient } from '../lib/KeenContext';

function Communities() {
	const [communities, setCommunities] = useState([]);
	KeenClient.query('saved', 'communities-by-id-and-domain')
		.then((res) => {
			// Handle response
			setCommunities(res.result);
		})
		.catch((err) => {
			// Handle error
		});
	const communityList = communities.map((community) => {
		return (
			<li key={community.result + '-' + community['url.info.domain']}>
				<a href={`/?cid=${community.result}`}>{community['url.info.domain']}</a>
			</li>
		);
	});
	return (
		<Layout>
			<h2>Communities</h2>
			<ul>{communityList}</ul>
		</Layout>
	);
}

export default Communities;
