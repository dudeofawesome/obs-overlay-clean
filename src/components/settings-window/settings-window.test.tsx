import React from 'react';
import { render } from '@testing-library/react';
import { SettingsWindow } from './settings-window';

test('renders learn react link', () => {
  const { getByText } = render(<SettingsWindow />);
  const linkElement = getByText(/./i);
  expect(linkElement).toBeInTheDocument();
});
