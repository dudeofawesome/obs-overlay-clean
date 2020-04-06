import * as React from 'react';
import { PropsWithChildren } from 'react';

export function Column(props: PropsWithChildren<{}>) {
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
