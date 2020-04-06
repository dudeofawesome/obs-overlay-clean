import React, { Component, ClassAttributes, RefObject, createRef } from 'react';
import {
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Card,
  CardContent,
} from '@material-ui/core';

import { CameraServiceContext } from '../../context';
import { CameraService } from '../../services/camera.service';
import { Row } from '../row/row';
import { Column } from '../column/column';
import { TrueCenter } from '../true-center/true-center';

import './settings-window.scss';

export class SettingsTabCamera extends Component<
  ClassAttributes<void>,
  SettingsTabSpotifyState
> {
  static contextType = CameraServiceContext;
  private camera_service?: CameraService;
  private video_ref: RefObject<HTMLVideoElement> = createRef();

  constructor(props: ClassAttributes<void>) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    this.camera_service = this.context;

    try {
      const devices = await this.camera_service?.getMediaDevices();
      this.setState(s => ({
        ...s,
        devices,
      }));
    } catch (e) {
      this.setState(s => ({
        ...s,
        test_successful: false,
        test_error: e.toString(),
      }));
    } finally {
      // we can access media devices
      if (
        this.camera_service?.media_device_id != null &&
        this.camera_service?.media_device_id !== ''
      ) {
        this.selectDeviceForPreview(this.camera_service.media_device_id);
      }
    }
  }

  async selectDeviceForPreview(device_id: string) {
    if (
      (this.state.devices?.length ?? 0) > 0 &&
      this.video_ref.current != null
    ) {
      try {
        const media_stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: device_id },
        });
        this.video_ref.current.srcObject = media_stream;
      } catch (e) {
        console.error(e);
      }
      this.video_ref.current.addEventListener('loadeddata', () => {
        this.video_ref.current?.play();
      });
    }
  }

  render() {
    return (
      <TrueCenter>
        <CameraServiceContext.Consumer>
          {camera_service => (
            <Row>
              <Card variant="outlined" style={{ marginRight: '15px' }}>
                <CardContent>
                  <Column>
                    <FormControlLabel
                      control={
                        <Checkbox
                          defaultChecked={camera_service.enabled ?? false}
                          onChange={e =>
                            (camera_service.enabled = e.target.checked)
                          }
                          name="Spotify Enabled"
                        />
                      }
                      label="Enable Camera"
                    />
                    <FormControl
                      disabled={
                        this.state.devices == null ||
                        this.state.devices.length === 0
                      }
                    >
                      <InputLabel htmlFor="device-select">Camera</InputLabel>
                      <Select
                        id="device-select"
                        defaultValue={camera_service.media_device_id ?? ''}
                        onChange={e => {
                          camera_service.media_device_id = e.target
                            .value as string;
                          this.selectDeviceForPreview(e.target.value as string);
                        }}
                      >
                        {this.state.devices?.map((dev, i) => (
                          <MenuItem key={i} value={dev.deviceId}>
                            {dev.label.replace(
                              / \([a-z0-9]{4,4}:[a-z0-9]{4,4}\)$/,
                              '',
                            )}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <video
                      ref={this.video_ref}
                      style={{ maxWidth: '100%' }}
                    ></video>
                  </Column>
                </CardContent>
              </Card>
              <Column>
                {
                  {
                    true: <div>{this.state.test_res}</div>,
                    false: <div>{this.state.test_error}</div>,
                  }['true']
                }
              </Column>
            </Row>
          )}
        </CameraServiceContext.Consumer>
      </TrueCenter>
    );
  }
}

interface SettingsTabSpotifyState {
  devices?: MediaDeviceInfo[];

  test_successful?: boolean;
  test_res?: string;
  test_error?: string;
}
