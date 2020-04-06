import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { DateTime } from 'luxon';

import './spotify-oauth.scss';
import { SpotifyService } from '../../services/spotify.service';

export function SpotifyOAuth() {
  const history = useHistory();
  const [error, setError] = useState('');

  useEffect(() => {
    const hash =
      window.location.hash !== ''
        ? window.location.hash
        : window.location.search;
    const params = hash
      .split(/[?&#]/)
      .filter(i => i !== '')
      .map(i => i.split('='))
      .reduce((cur, v) => cur.set(v[0], v[1]), new Map<string, string>());
    console.log(params);

    if (params.has('access_token') && params.has('expires_in')) {
      const access_token = params.get('access_token') as string;
      const expires_in = parseInt(params.get('expires_in') as string);

      console.log(access_token, expires_in);

      const spotify_service = new SpotifyService();
      spotify_service.auth_token = access_token;
      spotify_service.auth_token_exp = DateTime.local().plus(expires_in * 1000);

      if (window.opener) {
        window.opener.postMessage({
          type: 'Spotify OAuth',
          href: window.location.href,
        });
        window.close();
      } else if (window.parent) {
        window.parent.postMessage(
          {
            type: 'Spotify OAuth',
            href: window.location.href,
          },
          '*',
        );
      } else {
        history.push('/');
      }
    } else {
      setError('Missing params');
    }
  }, [history]);

  return (
    <div>
      <div>Redirecting…</div>
      {error}
    </div>
  );
}
