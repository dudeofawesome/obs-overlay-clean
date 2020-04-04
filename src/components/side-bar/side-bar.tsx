import React from 'react';
import { FaceCam } from '../face-cam/face-cam';
import { Notifications } from '../notifications/notifications';

import './side-bar.scss';

export function SideBar() {
  return (
    <div className="side-bar">
      <Notifications></Notifications>
      <FaceCam></FaceCam>
    </div>
  );
}
