import React from 'react';
import { render } from '@testing-library/react';
import Notifications from './notifications';

test('renders learn react link', () => {
  const { getByText } = render(<Notifications />);
  const linkElement = getByText(/./i);
  expect(linkElement).toBeInTheDocument();
});
