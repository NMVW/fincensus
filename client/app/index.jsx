import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, Row } from 'react-bootstrap';

// Custom components
import Navbar from './components/Navbar.jsx';
import Banner from './components/Banner.jsx';
import Plot from './components/Plot.jsx';

class Main extends React.Component {
  render() {
    return (
        <Grid fluid={ true }>
          <Row>
            <Navbar />
          </Row>
          <Row>
            <Banner />
          </Row>
          <Row>
            <Plot />
          </Row>
        </Grid>
      ) 
  }
}

ReactDOM.render(<Main />, document.getElementById('main'));
