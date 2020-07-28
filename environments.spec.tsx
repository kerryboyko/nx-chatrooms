import React from 'react';
import { render } from '@testing-library/react';

import Environments from './environments';

describe(' Environments', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Environments />);
    expect(baseElement).toBeTruthy();
  });
});
