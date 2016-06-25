import React from 'react';
import { Tabs } from 'react-bootstrap';
import { Tab } from 'react-bootstrap';

export default class Plot extends React.Component {
  constructor(props) {
    super(props);
  }
  
  componentDidMount() {
    let data = [{
      values: [19, 26, 55],
      labels: ['Residential', 'Non-Residential', 'Utility'],
      type: 'pie'
    }];

    let layout = {
      height: 400,
      width: 500
    };

    Plotly.newPlot('plot', data, layout);
  }

  render() {
    
    return <div id="plot"></div>
  }

}
