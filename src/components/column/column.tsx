import React, { ComponentProps } from 'react';

import { Row } from '../row/row';

export function Column(props: ComponentProps<'div'>) {
  return (
    <Row {...props} style={{ ...props.style, flexDirection: 'column' }}>
      {props.children}
    </Row>
  );
}
