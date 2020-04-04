import * as React from 'react';
import { Props } from 'react';

export function Column(props: Props<void>) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {props.children}
    </div>
  );
}
