import React, { useState } from 'react';
import { Dialog } from '@material-ui/core';

import { SideBar } from '../side-bar/side-bar';
import { GamePortal } from '../game-portal/game-portal';
import { SettingsWindow } from '../settings-window/settings-window';
import { Row } from '../row/row';

import './overlay.scss';

export function Overlay() {
  const [settings_open, setSettingsOpen] = useState(false);

  return (
    <div className="overlay">
      <Row style={{ height: '100vh', justifyContent: 'space-between' }}>
        <SideBar onClick={() => setSettingsOpen(true)} />
        <GamePortal />
      </Row>
      <Dialog
        open={settings_open}
        onClose={() => setSettingsOpen(false)}
        PaperProps={{
          style: { backgroundColor: 'transparent', borderRadius: 'unset' },
        }}
      >
        <SettingsWindow onClose={() => setSettingsOpen(false)} />
      </Dialog>
    </div>
  );
}
