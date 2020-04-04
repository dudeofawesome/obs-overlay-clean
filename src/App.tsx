import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { SideBar } from './components/side-bar/side-bar';
import { GamePortal } from './components/game-portal/game-portal';
import { SpotifyOAuth } from './spotify/components/spotify-oauth/spotify-oauth';
import { TwitchOAuth } from './components/twitch-oauth/twitch-oauth';
import { SettingsWindow } from './components/settings-window/settings-window';
import { TrueCenter } from './components/true-center/true-center';
import {
  SpotifyServiceContext,
  TwitchServiceContext,
  spotify_service,
  twitch_service,
} from './context';

import './App.scss';

function App() {
  return (
    <SpotifyServiceContext.Provider value={spotify_service}>
      <TwitchServiceContext.Provider value={twitch_service}>
        <Router>
          <Switch>
            <Route exact path="/">
              <div className="App">
                <SideBar></SideBar>
                <GamePortal></GamePortal>
              </div>
            </Route>
            <Route path="/spotify-oauth">
              <SpotifyOAuth />
            </Route>
            <Route path="/oauth/twitch">
              <TwitchOAuth />
            </Route>
            <Route path="/settings">
              <TrueCenter>
                <SettingsWindow />
              </TrueCenter>
            </Route>
          </Switch>
        </Router>
      </TwitchServiceContext.Provider>
    </SpotifyServiceContext.Provider>
  );
}

export default App;
