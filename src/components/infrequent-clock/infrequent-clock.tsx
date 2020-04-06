import React, { Component } from 'react';
import { Subscription, timer } from 'rxjs';

export class InfrequentClock extends Component<any, { i: number }> {
  private timer?: Subscription;

  componentDidMount() {
    this.timer = timer(60000, 60000).subscribe(i =>
      this.setState(s => ({ ...s, i })),
    );
  }

  componentWillUnmount() {
    this.timer?.unsubscribe();
  }

  render() {
    return (
      <div {...this.props} title={this.state.i.toString()}>
        {this.props.children}
      </div>
    );
  }
}
