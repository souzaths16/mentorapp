import React, { Component } from 'react';
import './styles.css';

class Field extends Component {
  handleClick = (event) => {
    event.preventDefault();
    const { id, onClick } = this.props;
    if (!onClick) {
      return;
    }
    onClick(id);
  }

  render() {
    const { children, icon, isSelected, label } = this.props;
    const fieldClasses = isSelected ? 'active field' : 'field';

    return (
      <div className={fieldClasses}>
        <button className="field-button" onClick={this.handleClick}>
          <img src={icon} alt={label} className="field-bitton-icon" />
          {label}
        </button>
        {children &&
          <div className="field-options">
            <div className="field-options-container">
              {children}
            </div>
          </div>
        }
      </div>
    );
  }
}

export default Field;
