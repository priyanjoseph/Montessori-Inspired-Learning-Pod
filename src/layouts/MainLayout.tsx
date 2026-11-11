import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { BackToTop } from '../components/BackToTop';
import { ScheduleTourModal } from '../components/ScheduleTourModal';
import { EnrollmentModal } from '../components/EnrollmentModal';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-forest-950 text-forest-900 dark:text-cream transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
      <ScheduleTourModal />
      <EnrollmentModal />
    </div>
  );
};

