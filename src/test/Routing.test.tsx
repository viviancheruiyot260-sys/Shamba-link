import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { NotFoundPage } from '../pages/NotFoundPage';
import { HomePage } from '../pages/HomePage';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

describe('Application Routing', () => {
  it('renders 404 Not Found page for invalid route paths', () => {
    render(
      <MemoryRouter initialEntries={['/some-nonexistent-path']}>
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('This field has no harvest')).toBeInTheDocument();
    expect(screen.getByText('Back to Marketplace')).toBeInTheDocument();
  });

  it('renders HomePage hero headline on root path', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthProvider>
          <CartProvider>
            <HomePage />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Connecting Kenyan Farmers Directly to Markets/i)
    ).toBeInTheDocument();
  });
});
