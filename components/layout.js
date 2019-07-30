import React from 'react';
import Head from 'next/head';

import '../styles/style.scss';

export default ({ children, title = 'PubPub Analytics' }) => (
	<div>
		<Head>
			<title>{title}</title>
			<meta charSet="utf-8" />
			<meta name="viewport" content="initial-scale=1.0, width=device-width" />
		</Head>
		<div className="container wide">
			<header>
				<h1>PubPub Analytics Dashboard</h1>
				<h2>Viewing: 90 Days (including today)</h2>
			</header>
			<div className="row">{children}</div>
			<footer>
				<a href="https://www.netlify.com">
					<img
						src="https://www.netlify.com/img/global/badges/netlify-light.svg"
						alt="light netlify badge"
					/>
				</a>
			</footer>
		</div>
	</div>
);
