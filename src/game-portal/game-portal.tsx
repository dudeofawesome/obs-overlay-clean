import React, { useState } from 'react';
import './game-portal.css';
import '../window/window.scss';
import { PortalSize } from '../portal-size/portal-size';

function GamePortal() {
  const [show_size, set_show_size] = useState(false);

  return (
    <div
      className="game-portal window active"
      onClick={() => set_show_size(!show_size)}
    >
      {show_size ? <PortalSize></PortalSize> : null}
    </div>
  );
}

export default GamePortal;
