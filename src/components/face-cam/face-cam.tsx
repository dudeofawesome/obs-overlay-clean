import React, { Component, createRef, RefObject } from 'react';
import {
  Window,
  TitleBar,
  SegmentedControl,
  SegmentedControlItem,
  Button,
} from 'react-desktop/macOs';
import Modal from 'react-modal';

import './face-cam.scss';
import '../window/window.scss';

export class FaceCam extends Component<{}, FaceCamState> {
  private video_ref: RefObject<HTMLVideoElement>;

  constructor(props: {}) {
    super(props);
    this.video_ref = createRef();
    this.state = {
      device_select_modal_open: false,
    };
  }

  async componentDidMount() {
    const media_devices: MediaDeviceInfo[] | null = (
      await navigator.mediaDevices?.enumerateDevices()
    )?.filter(dev => dev.kind === 'videoinput');
    if (media_devices?.length === 0) {
      this.setState({
        ...this.state,
        error_msg: 'No video devices found',
      });
    } else if (media_devices?.length === 1) {
      const selected_device_id = media_devices?.[0].deviceId;
      console.log(selected_device_id);
      this.setState({
        ...this.state,
        media_stream: await navigator.mediaDevices.getUserMedia({
          video: { deviceId: selected_device_id },
        }),
      });
    } else if (media_devices?.length > 0) {
      // TODO: change 0 to 1
      this.setState({
        ...this.state,
        device_select_modal_open: true,
        media_devices,
      });
    }
  }

  async selectMediaDevice(media_device_id: string) {
    const media_stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: media_device_id },
    });

    this.setState(state => ({
      ...state,
      media_stream,
    }));
  }

  componentDidUpdate() {
    if (
      this.state.media_stream != null &&
      this.video_ref.current != null &&
      this.video_ref.current?.srcObject !== this.state.media_stream
    ) {
      this.video_ref.current.srcObject = this.state.media_stream;
      this.video_ref.current.onloadeddata = () =>
        this.video_ref.current?.play();
    }
  }

  render() {
    return (
      <div className="face-cam window">
        {this.state?.error_msg}
        <video
          ref={this.video_ref}
          onClick={() =>
            this.setState({ ...this.state, device_select_modal_open: true })
          }
        ></video>
        <Modal
          isOpen={this.state?.device_select_modal_open}
          overlayClassName="modal"
          style={{ overlay: {}, content: { padding: 0 } }}
          className="camera-modal"
          onAfterOpen={() =>
            this.setState(state => ({ ...state, selected_segment: 0 }))
          }
        >
          <Window width="500px" height="auto" chrome>
            <TitleBar
              title="Select Camera"
              controls
              disableClose
              disableMinimize
              disableResize
            ></TitleBar>
            {/* <div className="content"> */}
            <SegmentedControl box style={{ flexGrow: 1 }}>
              {this.state?.media_devices?.map((device, i) => (
                <SegmentedControlItem
                  key={i}
                  title={device.label ?? device.deviceId}
                  selected={this.state.selected_segment === i}
                  onSelect={async () => {
                    this.selectMediaDevice(device.deviceId);
                    this.setState(state => ({
                      ...state,
                      selected_segment: i,
                    }));
                  }}
                >
                  {i} {device.label ?? device.deviceId}
                  <video autoPlay></video>
                </SegmentedControlItem>
              ))}
            </SegmentedControl>
            <div className="button-row">
              <Button
                color="blue"
                onClick={() => {
                  const selected_media_device_id = this.state.media_devices?.[
                    this.state.selected_segment ?? 0
                  ].deviceId;
                  if (selected_media_device_id == null) {
                    throw new Error('media device not found');
                  }
                  this.selectMediaDevice(selected_media_device_id);
                  this.setState(state => ({
                    ...state,
                    selected_media_device_id,
                    device_select_modal_open: false,
                  }));
                }}
              >
                Select Camera
              </Button>
            </div>
          </Window>
        </Modal>
      </div>
    );
  }
}

interface FaceCamState {
  media_stream?: MediaStream;
  device_select_modal_open: boolean;
  media_devices?: MediaDeviceInfo[];
  selected_media_device_id?: string;
  error_msg?: string;
  selected_segment?: number;
}
