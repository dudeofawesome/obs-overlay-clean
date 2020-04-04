import React, { Component } from 'react';
import './window.scss';

interface WindowProps {}

interface WindowState {
  active: boolean;
}

export class Window extends Component<WindowProps, WindowState> {
  // constructor(props: WindowProps) {
  //   super(props);
  // }

  render() {
    console.log(this.state);
    return <div className="window">{this.props.children}</div>;
  }
}
