import React, { ComponentProps } from 'react';

export function Row(props: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      style={{
        ...props.style,
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      {props.children}
    </div>
  );
}
