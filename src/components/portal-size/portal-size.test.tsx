import React from 'react';
import { render } from '@testing-library/react';
import { PortalSize } from './portal-size';

test('renders learn react link', () => {
  const { getByText } = render(<PortalSize />);
  const linkElement = getByText(/./i);
  expect(linkElement).toBeInTheDocument();
});
