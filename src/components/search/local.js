import React from 'react';
import IconCross from '../../assets/svg/crosshairs.svg';
import Checkbox from '../checkbox';
import Field from '../field';

const Local = () => (
  <>
    <div className="popup-section">
      <ul className="inner-checkbox">
        <li>
          <Checkbox checked={false} label="Online" />
        </li>
        <li>
          <Checkbox checked={true} label="Presential" />
        </li>
      </ul>
    </div>
    <div className="popup-section">
      <Field
        icon={IconCross}
        id="where"
        isSelected={false}
        label="Where"
      />
    </div>
  </>
);

export default Local;
