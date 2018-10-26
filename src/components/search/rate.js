import React, { Component } from 'react';
import Slider from 'react-rangeslider';
import './slider.css';

class Rate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rate: 100,
    };
  }

  handleChange = (value) => {
    this.setState({
      rate: value,
    });
  }

  render() {
    const { rate } = this.state;
    return (
      <>
        ${this.state.rate}
        <div className="range">
          <Slider
            labels = {{ 10: '$10', 100: '$100', 200: '$200' }}
            max={200}
            min={10}
            onChange={this.handleChange}
            orientation="horizontal"
            step={10}
            tooltip={false}
            value={rate}
          />
        </div>
      </>
    );
  }
}

export default Rate;
