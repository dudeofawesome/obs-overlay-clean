import React, { Component, ComponentProps } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import IconClose from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { FaSpotify, FaCamera, FaTwitch } from 'react-icons/fa';

import { SettingsTabCamera } from './settings-tab-camera';
import { SettingsTabSpotify } from './settings-tab-spotify';
import { SettingsTabTwitch } from './settings-tab-twitch';

import './settings-window.scss';
import '../window/window.scss';

export class SettingsWindow extends Component<
  SettingsWindowProps,
  SettingsWindowState
> {
  readonly tabs: { title: string; icon: any }[] = [
    { title: 'Camera', icon: <FaCamera /> },
    { title: 'Spotify', icon: <FaSpotify /> },
    { title: 'Twitch', icon: <FaTwitch /> },
  ];

  constructor(props: {}) {
    super(props);
    this.state = {
      selected_tab: 0,
    };
  }

  render() {
    return (
      <Box className="window">
        <AppBar position="relative">
          <Toolbar variant="dense">
            <IconButton
              aria-label="close"
              edge="start"
              color="inherit"
              onClick={e => {
                e.stopPropagation();
                this.props?.onClose?.();
              }}
            >
              <IconClose />
            </IconButton>
            <Tabs
              variant="fullWidth"
              value={this.state.selected_tab}
              onChange={(e, v) =>
                this.setState(s => ({ ...s, selected_tab: v }))
              }
            >
              {this.tabs.map((v, i) => (
                <Tab
                  key={i}
                  // label={v.title}
                  icon={v.icon}
                />
              ))}
            </Tabs>
          </Toolbar>
        </AppBar>
        {
          [
            <Box padding="20px 15px">
              <SettingsTabCamera />
            </Box>,
            <Box padding="20px 15px">
              <SettingsTabSpotify />
            </Box>,
            <Box padding="20px 15px">
              <SettingsTabTwitch />
            </Box>,
          ][this.state.selected_tab]
        }
      </Box>
    );
  }
}

interface SettingsWindowProps extends ComponentProps<'div'> {
  onClose?: () => void;
}

interface SettingsWindowState {
  selected_tab: number;
}
