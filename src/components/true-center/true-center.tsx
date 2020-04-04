import * as React from 'react';
import { Props } from 'react';

export function TrueCenter(props: Props<void>) {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {props.children}
    </div>
  );
}
