import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import './twitch-oauth.scss';

export function TwitchOAuth() {
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

    if (params.has('code')) {
      const auth_code = params.get('code') as string;

      console.log(auth_code);

      if (window.opener) {
        window.opener.postMessage({
          type: 'Twitch OAuth',
          auth_code,
        });
        window.close();
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
