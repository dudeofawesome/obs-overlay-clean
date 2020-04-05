import * as React from 'react';
import { Component, PropsWithChildren, ComponentProps } from 'react';
import { Subscription, timer } from 'rxjs';

export class InfrequentClock extends Component<any> {
  private timer?: Subscription;

  componentDidMount() {
    this.timer = timer(60000, 60000).subscribe(() =>
      this.setState(s => ({ ...s })),
    );
  }

  componentWillUnmount() {
    this.timer?.unsubscribe();
  }

  render() {
    return <div {...this.props}>{this.props.children}</div>;
  }
}
