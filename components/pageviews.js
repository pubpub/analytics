import React from 'react';
import ReactDOM from 'react-dom';
import KeenAnalysis from 'keen-analysis';
import dynamic from 'next/dynamic';

// eslint-disable-next-line
const Chart = dynamic(() => import('keen-react-charts'), { ssr: false });

import 'keen-dataviz/dist/keen-dataviz.css';

class Pageviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'funnel',
      title: 'Pageviews',
      labelMapping: {
        pageviews: 'Pageviews',
      },
      renderOnVisible: true
    };
  }

  componentDidMount() {
    const client = new KeenAnalysis({
      projectId: '5b57a01ac9e77c0001eef181',
      readKey: '5CF12741FA41DC030D092D2B6D247344B3C25183E9862A598D452F59B346BC5CD667E1C2B2DA03CFDE17339312D3880BC20C1051DAA146CAFF2ABA684FCE5B4B8985FF9C9EEC4406C3D851F0E81D67B33E65431FB39963378B9A8D8925B9C081'
    })
      .query({
        analysis_type: 'count',
        event_collection: 'pageviews',
        timeframe: 'this_3_months'
      })
      .then((results) => {
        this.setState({
          results,
        });
      });
  }


  render() {
    return (
      <Chart {...this.state} />
    );
  }
}

export default Pageviews;
