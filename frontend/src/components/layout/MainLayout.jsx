import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ChurchBackground } from '../common/ChurchBackground';
import './MainLayout.css';

export const MainLayout = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow || '';
    };
  }, []);

  return (
    <div className="main-layout">
      <ChurchBackground variant="light" />

      <Sidebar
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      <div className="main-layout__content">
        <Header onOpenMobile={() => setIsMobileNavOpen(true)} />

        <main className="main-layout__body">
          <div className="main-layout__shell">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
                transition={
                  reduceMotion
                    ? { duration: 0.01 }
                    : { duration: 0.32, ease: [0.16, 1, 0.3, 1] }
                }
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};
