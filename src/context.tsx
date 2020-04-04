import { createContext } from 'react';

import { SpotifyService } from './spotify/services/spotify.service';
import { TwitchService } from './services/twitch.service';

export const spotify_service = new SpotifyService();
export const SpotifyServiceContext = createContext(spotify_service);
SpotifyServiceContext.displayName = 'SpotifyService';
export const twitch_service = new TwitchService();
export const TwitchServiceContext = createContext(
  twitch_service,
  (prev, next) =>
    _createMask(
      prev.access_token === next.access_token,
      prev.client_id === next.client_id,
    ),
  //  (prev, next) =>
  //    ((next.access_token === prev.access_token) << 0) /* &
  //    ((next.access_token === prev.access_token) << 1) &
  //    (next.access_token === prev.access_token ? 1 << 2 : 0) &
  //    (next.access_token === prev.access_token ? 1 << 3 : 0) &
  //    (next.access_token === prev.access_token ? 1 << 4 : 0) &
  //    (next.access_token === prev.access_token ? 1 << 5 : 0) &
  //    (next.access_token === prev.access_token ? 1 << 6 : 0) &
  //    (next.client_id === prev.client_id ? 1 << 7 : 0) */,
);
TwitchServiceContext.displayName = 'TwitchService';

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
