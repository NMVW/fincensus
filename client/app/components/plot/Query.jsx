import React from 'react';
import { FormGroup } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
import { ControlLabel } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

export default class Query extends React.Component {
  constructor(props) {
    super(props);
  }
  
  componentWillMount() {
    this.props.param
  }

  render() {
    
    return <form>
      <FormGroup controlId="formControlsSelect">
        <ControlLabel>{ this.props.param }</ControlLabel>
        <FormControl componentClass="select" placeholder="select">
          <option value="select">select { this.props.param }</option>
          <option value="other">...</option>
        </FormControl>
      </FormGroup>
      <Button type="submit">
        Submit
      </Button>
    </form>
  }

}
