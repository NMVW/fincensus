import React from 'react';
import { connect } from 'react-redux';

  //    RED: rgb(215, 18, 9)
  // YELLOW: rgb(255, 255, 0)

class Map extends React.Component {
  constructor(props) {
    super(props);
  }
  
  shouldComponentUpdate(nextProps) {
    // do not re-render if query is empty
    if (nextProps.query === null || nextProps.query.length === 0) {
      return false;
    } else {
      return true;
    }
  }
  
  componentWillUpdate(newProps) {
    // re-style map with new query results!
        
    // DATA API
    const fields = {
      locations: ['CO'],
      z: [100],
      text: ['Colorado'],
      zmin: 0,
      zmax: 10000,
      mapTitle: 'RANK complained about product',
      colorbarTitle: '# of Complaints'
    }

    if (this.props.active === 'STATES') {
      // update fields for rendering
      fields.locations = [newProps.query.state];
      fields.z = [+newProps.query.product.complaints];
      fields.text = ['Complaints in ' + newProps.query.state];
      fields.zmin = 0;
      fields.zmax = 20000;
      fields.mapTitle = '#' + newProps.query.product.rank + ' Product: ' + newProps.query.product.name;
      fields.colorbarTitle = '# of Complaints';
    } else if (this.props.active === 'GROWTH') {
      // update fields for rendering
      fields.locations = [newProps.query.state.name];
      fields.z = [newProps.query.product.complaints];
      fields.text = ['Complaints about ' + newProps.query.product.name];
      fields.zmin = 0;
      fields.zmax = 20000;
      fields.mapTitle = 'Complaints in #' + newProps.query.state.rank + ' Growing State: ' + newProps.query.state.name;
      fields.colorbarTitle = '# of Complaints';
    } else if (this.props.active === 'POPULATION') {
      // update fields for rendering
      fields.locations = this.props.states;
      fields.z = this.props.states.map((s) => newProps.query.births);
      fields.text = this.props.states.map((s) => newProps.query.states + ' states');
      fields.zmin = 0;
      fields.zmax = 5000000;
      fields.mapTitle = 'Births in ' + newProps.query.year + ': ' + newProps.query.bank;
      fields.colorbarTitle = '# of Births';
    }
    
    let data = [{
        type: 'choropleth',
        locationmode: 'USA-states',
        locations: fields.locations,
        z: fields.z,
        text: fields.text,
        zmin: fields.zmin,
        zmax: fields.zmax,
        colorscale: [
            [0, 'rgb(255,255,0)'],
            [0.2, 'rgb(245,218,2)'],
            [0.4, 'rgb(235,165,4)'],
            [0.6, 'rgb(225,110,6)'],
            [0.8, 'rgb(220,73,7)'],
            [1, 'rgb(215,18,9)']
        ],
        colorbar: {
            title: fields.colorbarTitle,
            thickness: 0.2
        },
        marker: {
            line:{
                color: 'rgb(255,255,255)',
                width: 2
            }
        }
    }];

    // LAYOUT API
    // dependent on store active -> output
    let layout = {
        title: fields.mapTitle,
        geo:{
            scope: 'usa',
            showlakes: true,
            lakecolor: 'rgb(255,255,255)'
        }
    };

    Plotly.newPlot('plot', data, layout, {showLink: false});
  }
    
  componentDidMount() {
    // initial default rendering
    Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/2011_us_ag_exports.csv', function(err, rows){
      const unpack = (rows, key) => {
          return rows.map((row) => row[key]);
      }

      let data = [{
          type: 'choropleth',
          locationmode: 'USA-states',
          locations: unpack(rows, 'code'),
          z: unpack(rows, 'total exports'),
          text: unpack(rows, 'state'),
          zmin: 0,
          zmax: 17000,
          colorscale: [
              [0, 'rgb(255,255,0)'],
              [0.2, 'rgb(245,218,2)'],
              [0.4, 'rgb(235,165,4)'],
              [0.6, 'rgb(225,110,6)'],
              [0.8, 'rgb(220,73,7)'],
              [1, 'rgb(215,18,9)']
          ],
          colorbar: {
              title: 'Millions USD',
              thickness: 0.2
          },
          marker: {
              line:{
                  color: 'rgb(255,255,255)',
                  width: 2
              }
          }
      }];


      let layout = {
          title: 'US Financial Consumer Complaints',
          geo:{
              scope: 'usa',
              showlakes: true,
              lakecolor: 'rgb(255,255,255)'
          }
      };

      Plotly.plot('plot', data, layout, {showLink: false});
    });
  }

  render() {
    return <div id="plot"></div>
  }
}

// map the portion of the state tree desired
const mapStateToProps = (store) => {
  return {
    query: store.fincensusReducer.query,
    active: store.fincensusReducer.active,
    states: store.fincensusReducer.states
  };
};

// connect the desired state to the relevant component
export default connect(mapStateToProps)(Map);
