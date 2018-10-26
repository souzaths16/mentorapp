import React, { Component } from 'react';
import Checkbox from '../checkbox';

class Button extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: props.isSelected,
    };
  }

  handleClick = (e) => {
    e.preventDefault();
    this.setState((prevState) => ({
      isSelected: !prevState.isSelected,
    }));
  }

  render() {
    const { label } = this.props;
    const { isSelected } = this.state;
    const buttonClass = isSelected ? 'active btn' : 'btn';
    return (
      <button className={buttonClass} onClick={this.handleClick}>{label}</button>
    );
  }
}

class Availability extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mon: true,
      tue: false,
      wed: false,
      thu: true,
      fri: false,
      sat: false,
      sun: false,
    }
  }

  render() {
    return (
      <>
        <div className="popup-section">
          <h4 className="popup-title">Time of the day</h4>
          <ul className="inner-checkbox">
            <li>
              <Checkbox checked={true} label="All Day" />
            </li>
            <li>
              <Checkbox checked={true} label="Morning" />
            </li>
            <li>
              <Checkbox checked={true} label="Afternoon" />
            </li>
            <li>
              <Checkbox checked={true} label="Evening" />
            </li>
          </ul>
        </div>
        <div className="popup-section">
          <h4 className="popup-title">Days of Week</h4>
          <ul className="buttons-list">
            <li><Button label="Mon" isSelected={this.state.mon} /></li>
            <li><Button label="Tue" isSelected={this.state.tue} /></li>
            <li><Button label="Wed" isSelected={this.state.wed} /></li>
            <li><Button label="Thu" isSelected={this.state.thu} /></li>
            <li><Button label="Fri" isSelected={this.state.fri} /></li>
            <li><Button label="Sat" isSelected={this.state.sat} /></li>
            <li><Button label="Sun" isSelected={this.state.sun} /></li>
          </ul>
        </div>
      </>
    );
  }
}

export default Availability;
