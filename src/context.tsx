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
