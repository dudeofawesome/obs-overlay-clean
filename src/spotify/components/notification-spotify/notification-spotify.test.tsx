import React from 'react';
import { render } from '@testing-library/react';
import { NotificationSpotify } from './notification-spotify';

test('renders learn react link', () => {
  const { getByText } = render(<NotificationSpotify api_key={''} />);
  const linkElement = getByText(/./i);
  expect(linkElement).toBeInTheDocument();
});
