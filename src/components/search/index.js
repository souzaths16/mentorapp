import React, { Component } from 'react';
import Availability from './availability';
import Field from '../field';
import IconSkill from '../../assets/svg/skill.svg';
import IconAvailability from '../../assets/svg/availability.svg';
import IconRate from '../../assets/svg/rate.svg';
import IconLocal from '../../assets/svg/local.svg';
import Local from './local';
import Rate from './rate';
import Skills from './skills';
import './styles.css';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeField: '',
    };
  }

  handleMouseOutside = (event) => {
    if (this.node.contains(event.target)) {
      return;
    }
    this.setState({
      activeField: '',
    });
  }

  isFieldSelected = (field) => {
    return field === this.state.activeField;
  }

  removeListener = () => {
    document.removeEventListener('mousedown', this.handleMouseOutside, false);
  }

  selectField = (field) => {
    if (field !== this.state.activeField) {
      document.addEventListener('mousedown', this.handleMouseOutside, false);
      this.setState({
        activeField: field,
      });
    } else {
      this.removeListener();
      this.setState({
        activeField: '',
      });
    }
  }

  componentWillUnmount() {
    this.removeListener();
  }

  render() {
    return (
      <div className="search">
        <div className="search-box">
          <h2 className="search-title">Learn and succeed faster</h2>
          <h3 className="search-subtitle">Book unique 1-on-1 mentoring from an expert.</h3>
          <form className="search-form" ref={node => this.node = node}>
            <Field
              icon={IconSkill}
              id="skill"
              isSelected={this.isFieldSelected('skill')}
              label="Search Mentor Skill"
              onClick={this.selectField}
            >
              <Skills />
            </Field>
            <Field
              icon={IconAvailability}
              id="availability"
              isSelected={this.isFieldSelected('availability')}
              label="Availability"
              onClick={this.selectField}
            >
              <Availability />
            </Field>
            <Field
              icon={IconRate}
              id="rate"
              isSelected={this.isFieldSelected('rate')}
              label="Hourly Rate"
              onClick={this.selectField}
            >
              <Rate />
            </Field>
            <Field
              icon={IconLocal}
              id="local"
              isSelected={this.isFieldSelected('local')}
              label="Presential / Online"
              onClick={this.selectField}
            >
              <Local />
            </Field>
            <button type="submit" className="submit-button">Search</button>
          </form>
        </div>
      </div>
    );
  }
}

export default Search;
