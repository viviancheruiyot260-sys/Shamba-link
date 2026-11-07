import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

describe('Navbar Component', () => {
  it('renders Shamba Link brand logo and navigation links', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Navbar />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Shamba Link')).toBeInTheDocument();
    expect(screen.getByText('Marketplace')).toBeInTheDocument();
    expect(screen.getByText('How It Works')).toBeInTheDocument();
    expect(screen.getByText('Why Shamba Link')).toBeInTheDocument();
  });

  it('renders sign in and registration CTAs when unauthenticated', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Navbar />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Log In')).toBeInTheDocument();
    expect(screen.getByText('Start Selling')).toBeInTheDocument();
  });
});
