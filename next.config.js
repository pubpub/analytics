const withCSS = require('@zeit/next-css');
require('dotenv').config({ path: '.env' });

module.exports = withCSS({
	/* config options here */
	serverRuntimeConfig: {},
	publicRuntimeConfig: {
		KEEN_PROJECT_ID: process.env.KEEN_PROJECT_ID,
		KEEN_READ_KEY: process.env.KEEN_READ_KEY,
	},
});
