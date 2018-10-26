import React, { Component } from 'react';
import './styles.css';

class Checkbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: props.checked || false,
    };
  }

  handleClick = () => {
    this.setState((prevState) => ({
      checked: !prevState.checked,
    }));
  }

  render() {
    const { label } = this.props;
    const { checked } = this.state;
    return (
      <label className="checkbox-container">
        {label}
        <input type="checkbox" checked={checked} onChange={this.handleClick} />
        <span className="checkmark" />
      </label>
    );
  }
}

export default Checkbox;
