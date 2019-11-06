import React from 'react';

import { Card, ControlGroup, Label, Icon, Elevation } from "@blueprintjs/core";

import './instrument.css';

export default ({ children, title, onClose }) => {
  return (
    <Card id='div7' className='instruments2' elevation={Elevation.TWO}>
      <div className="columns is-gapless" style={{ marginTop: -12 }}>
        <div className="column is-narrow">
          <ControlGroup className='instruments2-header' >
            <Icon className='instruments2-title-btn' icon="cross" onClick={onClose} />
            <Label className='instruments2-title'>{title}</Label>
          </ControlGroup>
        </div>
        {children}
      </div>
    </Card>
  );
}