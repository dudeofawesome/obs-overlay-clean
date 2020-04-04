import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

import { Row } from '../row/row';
import { Column } from '../column/column';
import { TrueCenter } from '../true-center/true-center';
import { TwitchServiceContext } from '../../context';

import './settings-window.scss';

export function SettingsTabTwitch() {
  return (
    <TrueCenter>
      <Row>
        <Card variant="outlined" style={{ marginRight: '15px' }}>
          <CardContent>
            <NotificationSettings />
          </CardContent>
        </Card>
        <Column>
          <Card variant="outlined" style={{ marginRight: '15px' }}>
            <CardContent>
              <APISettings />
            </CardContent>
          </Card>
          <TwitchServiceContext.Consumer>
            {twitch_service => (
              <Column>
                <Button
                  variant="contained"
                  onClick={() => twitch_service.authenticate()}
                >
                  Authenticate
                </Button>
                <Button onClick={() => twitch_service.subscribe()}>
                  Test Twitch
                </Button>
              </Column>
            )}
          </TwitchServiceContext.Consumer>
        </Column>
      </Row>
    </TrueCenter>
  );
}

function NotificationSettings() {
  return (
    <Column>
      <Typography
        style={{ fontSize: '0.8rem' }}
        color="textSecondary"
        gutterBottom
      >
        Notifications
      </Typography>
      <TwitchServiceContext.Consumer unstable_observedBits={0b11111111}>
        {twitch_service =>
          [
            {
              label: 'New followers',
              value: twitch_service.notify_new_followers ?? false,
              onChange: (v: boolean) =>
                (twitch_service.notify_new_followers = v),
            },
            {
              label: 'New subscribers',
              value: twitch_service.notify_new_subscribers ?? false,
              onChange: (v: boolean) =>
                (twitch_service.notify_new_subscribers = v),
            },
            {
              label: 'Donations',
              value: twitch_service.notify_donations ?? false,
              onChange: (v: boolean) => (twitch_service.notify_donations = v),
            },
            {
              label: 'Bit donations',
              value: twitch_service.notify_donations_bits ?? false,
              onChange: (v: boolean) =>
                (twitch_service.notify_donations_bits = v),
            },
            {
              label: 'Raids / hosts',
              value: twitch_service.notify_raids ?? false,
              onChange: (v: boolean) => (twitch_service.notify_raids = v),
            },
          ].map((check, i) => (
            <FormControlLabel
              key={i}
              control={
                <Checkbox
                  // checked={check.value}
                  defaultChecked={check.value}
                  onChange={e => check.onChange(e.target.checked)}
                  name={check.label}
                />
              }
              label={check.label}
            />
          ))
        }
      </TwitchServiceContext.Consumer>
    </Column>
  );
}

function APISettings() {
  return (
    <TwitchServiceContext.Consumer>
      {twitch_service => (
        <Column>
          <TextField
            id="user_id"
            label="Twitch User ID"
            required
            defaultValue={twitch_service.user_id ?? ''}
            onChange={e => (twitch_service.user_id = e.target.value)}
          />
          <TextField
            id="client_id"
            label="Client ID"
            required
            defaultValue={twitch_service.client_id ?? ''}
            onChange={e => (twitch_service.client_id = e.target.value)}
          />
          <TextField
            id="client_secret"
            label="Client Secret"
            type="password"
            required
            defaultValue={twitch_service.client_secret ?? ''}
            onChange={e => (twitch_service.client_secret = e.target.value)}
          />
        </Column>
      )}
    </TwitchServiceContext.Consumer>
  );
}
