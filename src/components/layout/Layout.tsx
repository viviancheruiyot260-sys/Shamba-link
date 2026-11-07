import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { InquiryDrawer } from '../cart/InquiryDrawer';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-stone-900 selection:bg-emerald-800 selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <InquiryDrawer />
    </div>
  );
};
