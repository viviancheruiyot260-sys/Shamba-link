import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../components/marketplace/ProductCard';
import { CartProvider } from '../context/CartContext';
import { Product } from '../types';

const mockProduct: Product = {
  id: 'test-1',
  title: 'Fresh Nyandarua Cabbages',
  description: 'Dense green round cabbages freshly harvested from high altitude farms.',
  category: 'Vegetables',
  priceKes: 60,
  quantityAvailable: 300,
  unit: 'piece',
  county: 'Nyandarua',
  farmerId: 'farmer-1',
  farmerName: 'Kiprono Cheruiyot',
  imageUrl: '/test-img.jpg',
  isOrganic: true,
  createdAt: new Date().toISOString(),
};

describe('ProductCard Component', () => {
  it('renders product title, price in KES, county, and organic certified badge', () => {
    render(
      <CartProvider>
        <ProductCard product={mockProduct} />
      </CartProvider>
    );

    expect(screen.getByText('Fresh Nyandarua Cabbages')).toBeInTheDocument();
    expect(screen.getByText(/KES 60/)).toBeInTheDocument();
    expect(screen.getAllByText(/Nyandarua/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Organic Certified')).toBeInTheDocument();
  });

  it('allows clicking Inquire button and toggles state', () => {
    render(
      <CartProvider>
        <ProductCard product={mockProduct} />
      </CartProvider>
    );

    const button = screen.getByRole('button', { name: /Inquire/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.getByText(/Added/i)).toBeInTheDocument();
  });
});
