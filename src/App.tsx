import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { SpotifyOAuth } from './spotify/components/spotify-oauth/spotify-oauth';
import { TwitchOAuth } from './components/twitch-oauth/twitch-oauth';
import { SettingsWindow } from './components/settings-window/settings-window';
import { TrueCenter } from './components/true-center/true-center';
import { Providers } from './context';
import { Overlay } from './components/overlay/overlay';

import './App.scss';

function App() {
  return (
    <Providers>
      <Router>
        <Switch>
          <Route exact path="/">
            <Overlay />
          </Route>
          <Route path="/oauth/spotify">
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
    </Providers>
  );
}

export default App;
