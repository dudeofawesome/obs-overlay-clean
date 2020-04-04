import React, { Component, ClassAttributes } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import { SpotifyServiceContext } from '../../context';
import { SpotifyService } from '../../spotify/services/spotify.service';
import { Row } from '../row/row';
import { Column } from '../column/column';
import { TrueCenter } from '../true-center/true-center';

import './settings-window.scss';

export class SettingsTabSpotify extends Component<
  ClassAttributes<void>,
  SettingsTabSpotifyState
> {
  static contextType = SpotifyServiceContext;
  private spotify_service?: SpotifyService;

  constructor(props: ClassAttributes<void>) {
    super(props);
    this.state = {
      enabled: false,
      client_id: '90f61a9875dc44a28faf437b70e8b01b',
    };
  }

  componentDidMount() {
    this.spotify_service = this.context;

    this.setState(s => ({
      ...s,
      enabled: this.spotify_service?.enabled ?? false,
      client_id:
        this.spotify_service?.spotify_client_id ??
        '90f61a9875dc44a28faf437b70e8b01b',
    }));
  }

  async testSpotifyAPI() {
    this.setState(state => ({ ...state, test_successful: undefined }));
    try {
      const res = await this.spotify_service?.getSpotifyStatus();
      this.setState(state => ({
        ...state,
        test_successful: true,
        test_res: res?.item?.name,
      }));
    } catch (e) {
      this.setState(state => ({
        ...state,
        test_successful: false,
        test_res: e.message,
      }));
    }
  }

  setEnabled(enabled: boolean) {
    this.setState(s => ({ ...s, enabled }));
    if (this.spotify_service != null) {
      this.spotify_service.enabled = enabled;
    }
  }

  setClientId(client_id: string) {
    this.setState(s => ({ ...s, client_id }));
    if (this.spotify_service != null) {
      this.spotify_service.spotify_client_id = client_id;
    }
  }

  render() {
    return (
      <TrueCenter>
        <Row>
          <Card variant="outlined" style={{ marginRight: '15px' }}>
            <CardContent>
              <Column>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.spotify_service?.enabled ?? false}
                      onChange={e => this.setEnabled(e.target.checked)}
                      name="Spotify Enabled"
                    />
                  }
                  label="Show Spotify Status"
                />
                <TextField
                  id="client_id"
                  label="Spotify Client ID"
                  value={this.spotify_service?.spotify_client_id ?? ''}
                  required
                  onChange={e => this.setClientId(e.target.value)}
                />
              </Column>
            </CardContent>
          </Card>
          <Column>
            <Button
              variant="contained"
              onClick={() => this.spotify_service?.launchSpotifyOAuth()}
            >
              Authenticate
            </Button>
            <Button onClick={() => this.testSpotifyAPI()}>Test Spotify</Button>
            {
              {
                true: <div>{this.state.test_res}</div>,
                false: <div>{this.state.test_error}</div>,
              }['true']
            }
          </Column>
        </Row>
      </TrueCenter>
    );
  }
}

interface SettingsTabSpotifyState {
  enabled: boolean;
  client_id: string;
  test_successful?: boolean;
  test_res?: string;
  test_error?: string;
}
