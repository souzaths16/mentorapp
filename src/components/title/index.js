import React from 'react';
import './styles.css';

const Title = ({ description, head }) => (
  <div className="box-title">
    <h2 className="box-title-h">{head}</h2>
    {description &&
      <p className="box-title-p">{description}</p>
    }
  </div>
);

export default Title;

