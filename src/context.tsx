import React, { createContext, PropsWithChildren } from 'react';

import { CameraService } from './services/camera.service';
import { SpotifyService } from './spotify/services/spotify.service';
import { TwitchService } from './services/twitch.service';

export const camera_service = new CameraService();
export const CameraServiceContext = createContext(camera_service);
CameraServiceContext.displayName = 'CameraService';

export const spotify_service = new SpotifyService();
export const SpotifyServiceContext = createContext(spotify_service);
SpotifyServiceContext.displayName = 'SpotifyService';

export const twitch_service = new TwitchService();
export const TwitchServiceContext = createContext(twitch_service);
TwitchServiceContext.displayName = 'TwitchService';

export function Providers(props: PropsWithChildren<{}>) {
  return (
    <CameraServiceContext.Provider value={camera_service}>
      <SpotifyServiceContext.Provider value={spotify_service}>
        <TwitchServiceContext.Provider value={twitch_service}>
          {props.children}
        </TwitchServiceContext.Provider>
      </SpotifyServiceContext.Provider>
    </CameraServiceContext.Provider>
  );
}

function _createMask(...args: boolean[]): number {
  let a = 0b0;
  for (let i = 0; i < args.length; i++) {
    a &= (args[i] ? 1 : 0) << i;
  }
  console.log(a);

  const b = args.reduce((acc, curr, i) => (acc &= (curr ? 1 : 0) << i), 0b0);
  console.log(b);

  return a;
}
