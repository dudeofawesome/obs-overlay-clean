import React, { ComponentProps } from 'react';
import { FaceCam } from '../face-cam/face-cam';
import { Notifications } from '../notifications/notifications';

import './side-bar.scss';

export function SideBar(props: ComponentProps<'div'>) {
  return (
    <div {...props} className={[props.className, 'side-bar'].join(' ')}>
      <Notifications></Notifications>
      <FaceCam></FaceCam>
    </div>
  );
}
