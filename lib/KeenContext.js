import React from 'react';
import getConfig from 'next/config';
import KeenAnalysis from 'keen-analysis';

const { publicRuntimeConfig } = getConfig();
const { KEEN_PROJECT_ID, KEEN_READ_KEY } = publicRuntimeConfig;

const client = new KeenAnalysis({
	projectId: KEEN_PROJECT_ID,
	readKey: KEEN_READ_KEY,
});

export const KeenContext = React.createContext({
	client: client,
});
