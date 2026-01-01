
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassCardView } from './GlassCard.view';
import { MOCK_PRODUCTS } from '../constants';
import { mapProductFromGraphQL } from '../adapters/shopifyAdapter';
import { Product } from '../types';

const meta: Meta<typeof GlassCardView> = {
  title: 'Components/Cards/GlassCard',
  component: GlassCardView,
  tags: ['autodocs'],
  argTypes: {
    onViewProduct: { action: 'viewed' },
    onToggleSave: { action: 'toggled save' },
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GlassCardView>;

const defaultProduct: Product = mapProductFromGraphQL(MOCK_PRODUCTS[0]);
const upcomingProduct: Product = mapProductFromGraphQL(MOCK_PRODUCTS[1]);

export const Default: Story = {
  args: {
    product: defaultProduct,
    isSaved: false,
  },
};

export const Saved: Story = {
  args: {
    product: defaultProduct,
    isSaved: true,
  },
};

export const LongTitle: Story = {
  args: {
    product: {
      ...defaultProduct,
      title: 'Neon Catalyst Technical Utility Shell Jacket V4',
    },
    isSaved: false,
  },
};

export const NoCategory: Story = {
  args: {
    product: {
      ...upcomingProduct,
      category: '',
    },
    isSaved: false,
  },
};
