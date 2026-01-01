
import React from 'react';
import type { Preview } from '@storybook/react';
import '../app.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#121212' },
        { name: 'light', value: '#fdfdfd' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="dark font-sans">
        <div className="noise-bg" />
        <Story />
      </div>
    ),
  ],
};

export default preview;
