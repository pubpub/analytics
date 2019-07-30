const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
require('dotenv').config({ path: '.env' });

module.exports = withSass(
	withCSS({
		webpack: function(config) {
			config.module.rules.push({
				test: /\.(ttf|eot|svg|woff|woff2)$/,
				use: [
					{
						loader: 'file-loader',
						query: { name: 'fonts/[hash].[ext]' },
					},
				],
			});
			return config;
		},
		/* config options here */
		serverRuntimeConfig: {},
		publicRuntimeConfig: {
			KEEN_PROJECT_ID: process.env.KEEN_PROJECT_ID,
			KEEN_READ_KEY: process.env.KEEN_READ_KEY,
		},
	}),
);
