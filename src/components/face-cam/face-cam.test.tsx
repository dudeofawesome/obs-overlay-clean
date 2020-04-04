import React from 'react';
import { render } from '@testing-library/react';
import { FaceCam } from './face-cam';

test('renders learn react link', () => {
  const { getByText } = render(<FaceCam />);
  const linkElement = getByText(/./i);
  expect(linkElement).toBeInTheDocument();
});
