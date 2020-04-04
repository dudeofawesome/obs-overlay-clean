import * as React from 'react';
import { Props } from 'react';

export function Row(props: Props<void>) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      {props.children}
    </div>
  );
}
