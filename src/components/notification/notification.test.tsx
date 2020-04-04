import React from 'react';
import { render } from '@testing-library/react';
import { Notification } from './notification';

test('renders learn react link', () => {
  const { getByText } = render(<Notification name="Test Notification" />);
  const linkElement = getByText(/Test Notification/i);
  expect(linkElement).toBeInTheDocument();
});
